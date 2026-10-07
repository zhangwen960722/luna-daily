// 仅构建并打包 Amazon 静态文件，不重建文档站点、不上传、不启动浏览器。
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { spawnSync } = require('node:child_process');
const base = path.resolve(__dirname, '../..');
const prototype = path.join(base, 'demo/Amazon管理/amazon-dw-prototype');
const output = path.join(base, 'amazon-release');
const entries = [
  ['Amazon_DW货件列表.html', 'dw'],
  ['Amazon_DW提单列表.html', 'bols'],
  ['Amazon_Amazon任务中心.html', 'tasks'],
  ['Amazon_Smart Reroute.html', 'smart'],
];

function filesIn(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(dir, entry.name);
    return entry.isDirectory() ? filesIn(target) : [target];
  });
}

function portableHtml() {
  const dist = path.join(prototype, 'dist-local');
  let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
  html = html.replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*><\/script>/g, (_, src) => {
    const js = fs.readFileSync(path.resolve(dist, src), 'utf8');
    // 确认当前产物无需 import/export 或 import.meta，可直接内联为普通脚本。
    // 后续引入代码拆分时在打包阶段阻断，不能交付 file:// 下失效的模块脚本。
    new vm.Script(js, { filename: src });
    if (/\bimport\s*\(|\bimport\.meta/.test(js)) throw new Error('离线入口不支持动态模块依赖：' + src);
    return '<script>' + js.replace(/<\/script/gi, '<\\/script') + '</script>';
  });
  html = html.replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/g, (_, href) => {
    const css = fs.readFileSync(path.resolve(dist, href), 'utf8');
    return '<style>' + css.replace(/<\/style/gi, '<\\/style') + '</style>';
  });
  // 脚本必须在 root 创建之后执行；普通内联脚本没有模块的自动 defer 行为。
  const scripts = [];
  html = html.replace(/<script>[\s\S]*?<\/script>/g, script => { scripts.push(script); return ''; });
  return html.replace('</body>', () => scripts.join('') + '</body>');
}

function entryHtml(name, view) {
  const title = name.replace(/^Amazon_/, '').replace(/\.html$/, '');
  const boot = `<aside id="amazon-loading" role="status" style="position:fixed;inset:0;z-index:99999;display:grid;place-content:center;padding:24px;text-align:center;background:#f5f7fa;font:14px/1.8 Microsoft YaHei,sans-serif">正在加载 ${title}…</aside><script>
window.amazonInitialView=${JSON.stringify(view)};
window.amazonEmbedded=true;
let amazonLoaded=false;
const amazonNotice=document.getElementById('amazon-loading');
const amazonTimeout=setTimeout(()=>{if(!amazonLoaded)amazonNotice.textContent='Amazon原型未能启动，请确认当前HTML文件完整，或查看浏览器控制台中的错误。';},15000);
window.addEventListener('amazon:ready',()=>{amazonLoaded=true;clearTimeout(amazonTimeout);amazonNotice.remove();},{once:true});
window.addEventListener('error',event=>{if(!amazonLoaded)amazonNotice.textContent='Amazon原型启动失败：'+event.message;});
</script>`;
  return portableHtml()
    .replace(/<title>[^<]*<\/title>/, () => '<title>' + title + '</title>')
    .replace('<div id="root"></div>', () => boot + '<div id="root"></div>');
}

function verify() {
  const files = filesIn(output);
  const keys = new Set(files.map(file => path.relative(output, file).split(path.sep).join('/')));
  let references = 0;
  function check(ref, file) {
    if (!ref || /^(data:|blob:|#)/.test(ref)) return;
    const key = path.relative(output, file).split(path.sep).join('/');
    const resolved = new URL(ref, 'https://static.example/' + key);
    if (resolved.origin !== 'https://static.example') throw new Error('发布资源依赖外部地址：' + ref);
    const target = decodeURIComponent(resolved.pathname.slice(1));
    if (!keys.has(target)) throw new Error('资源缺失或大小写不一致：' + key + ' → ' + target);
    references++;
  }
  for (const [name, view] of entries) {
    const file = path.join(output, 'staff', name);
    const text = fs.readFileSync(file, 'utf8');
    if (/<iframe\b|<script[^>]+(?:type=["']module|src=)/.test(text)) throw new Error('入口仍有嵌套iframe或模块依赖：' + name);
    if (!text.includes('window.amazonInitialView=' + JSON.stringify(view))) throw new Error('菜单映射不一致：' + name);
    if (!text.includes("addEventListener('amazon:ready'") || !text.includes('15000')) throw new Error('缺少就绪/超时处理：' + name);
    for (const match of text.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(match[1], { filename: name });
    if (text !== entryHtml(name, view)) throw new Error('单文件入口未同步：' + name);
    if (text !== fs.readFileSync(path.join(base, 'demo/员工端-demo', name), 'utf8')) throw new Error('发布与本地入口不一致：' + name);
  }
  for (const file of files.filter(file => /\.(html|js|css)$/.test(file))) {
    const text = fs.readFileSync(file, 'utf8');
    if (/https?:\/\/(?:localhost|127\.0\.0\.1)(?=[:/])/.test(text)) throw new Error('静态产物仍依赖本机：' + file);
    if (file.endsWith('.html')) {
      const markup = text.replace(/<script>[\s\S]*?<\/script>/g, '');
      for (const match of markup.matchAll(/(?:src|href)=["']([^"']+)["']/g)) check(match[1], file);
    }
    if (file.endsWith('.css')) for (const match of text.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) check(match[1], file);
    if (file.endsWith('.js')) {
      for (const match of text.matchAll(/(?:\bfrom\s+|\bimport\s*\(|new URL\(\s*)["']([^"']+)["']/g)) check(match[1], file);
    }
  }
  console.log('静态核对通过：四个独立业务HTML、' + references + ' 个资源引用；脚本语法及本地发布副本一致。');
  console.log('发布目录：' + output);
  console.log('只需上传 amazon-release/staff/ 下四个Amazon HTML至阿里云 /staff/。');
  console.log('四个Amazon入口均为独立业务HTML，双击员工端index.html无需本地服务或嵌套iframe。');
}

if (!process.argv.includes('--check-only')) {
  // 只执行产物生成必需的 Vite 构建；不调用 typecheck 或回归脚本。
  if (!process.argv.includes('--package-only')) {
    const build = spawnSync(process.execPath, [path.join(prototype, 'node_modules/vite/bin/vite.js'), 'build', '--config', 'vite.local.config.ts'], { cwd: prototype, stdio: 'inherit', windowsHide: true });
    if (build.error) throw build.error;
    if (build.status !== 0) process.exit(build.status || 1);
  }
  fs.mkdirSync(path.join(output, 'staff'), { recursive: true });
  for (const [name, view] of entries) {
    const html = entryHtml(name, view);
    fs.writeFileSync(path.join(base, 'demo/员工端-demo', name), html);
    fs.writeFileSync(path.join(output, 'staff', name), html);
  }

}
verify();
