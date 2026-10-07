// 仅构建Amazon文档预览并提供本地静态服务；不运行oss-site全量构建或部署。
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const base = path.resolve(__dirname, '../..');
const preview = path.join(base, 'demo/Amazon管理/.local-preview');
const slug = text => text.replace(/[^\w一-鿿]+/g, '-').replace(/^-|-$/g, '');
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

async function renderDocuments() {
  const { marked, Renderer } = await import('marked');
  fs.mkdirSync(preview, { recursive: true });
  const files = ['Amazon管理产品方案.md', '2026-10-07-产品文档.md', '2026-10-07-数据设计.md'];
  for (const file of files) {
    const raw = fs.readFileSync(path.join(base, file === 'Amazon管理产品方案.md' ? 'drafts/Amazon管理' : 'drafts/头程管理', file), 'utf8');
    const renderer = new Renderer();
    const headings = [];
    renderer.heading = function(token) {
      const text = this.parser.parseInline(token.tokens), id = slug(token.text);
      if (token.depth === 2 || token.depth === 3) headings.push({ id, text, depth: token.depth });
      return `<h${token.depth} id="${id}">${text}</h${token.depth}>`;
    };
    renderer.code = token => token.lang === 'mermaid'
      ? `<pre class="mermaid">${escape(token.text)}</pre>`
      : `<pre><code>${escape(token.text)}</code></pre>`;
    renderer.link = function(token) {
      let href = token.href;
      if (href.startsWith('../Amazon管理/Amazon管理产品方案.md')) href = '/amazon-docs/' + href.split('/').pop().replace('.md', '.html');
      if (/^(Amazon管理产品方案|2026-10-07-(产品文档|数据设计))\.md/.test(href)) href = href.replace('.md', '.html');
      else if (href.startsWith('../../demo/')) href = href.replace('../../demo/', '/demo/');
      return `<a href="${escape(href)}">${this.parser.parseInline(token.tokens)}</a>`;
    };
    const body = marked.parse(raw, { renderer, gfm: true });
    const toc = headings.map(h => `<a class="level-${h.depth}" href="#${h.id}">${h.text}</a>`).join('');
    const html = `<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${file}</title><style>
      body{margin:0;font:15px/1.8 'Microsoft YaHei',sans-serif;color:#263449;background:#f7f9fc}header{padding:12px 24px;background:white;border-bottom:1px solid #ddd}header a{margin-right:20px}nav{width:270px;flex-shrink:0;position:sticky;top:16px;max-height:94vh;overflow:auto}nav a{display:block;padding:3px 6px;font-size:13px}.level-3{margin-left:12px}.layout{display:flex;gap:28px;max-width:1500px;margin:24px auto;padding:0 24px}main{min-width:0;flex:1;background:white;padding:24px}a{color:#16894a}h2,h3{scroll-margin-top:16px}table{border-collapse:collapse;width:100%;font-size:13px;display:block;overflow:auto}td,th{border:1px solid #ddd;padding:8px;min-width:100px}th{background:#f0f5f3}pre{overflow:auto;background:#eef2f7;padding:12px}.mermaid{background:white}code{font-size:13px}blockquote{border-left:4px solid #27ad60;padding-left:16px}@media(max-width:800px){nav{display:none}.layout{padding:8px}main{padding:12px}}
      </style></head><body><header><a href="/demo/员工端-demo/index.html">员工端原型</a><a href="/amazon-docs/Amazon管理产品方案.html">Amazon唯一方案</a><a href="/amazon-docs/2026-10-07-产品文档.html">产品入口</a><a href="/amazon-docs/2026-10-07-数据设计.html">数据引用</a></header><div class="layout"><nav>${toc}</nav><main>${body}</main></div><script src="/oss-site/mermaid.min.js"></script><script>mermaid.initialize({startOnLoad:true,theme:'default',securityLevel:'strict'});</script></body></html>`;
    fs.writeFileSync(path.join(preview, file.replace('.md', '.html')), html);
  }
  console.log('Amazon本地文档预览已生成，完整保留10张Mermaid图。');
}

async function main() {
  await renderDocuments();
  if (process.argv.includes('--docs-only')) return;
  const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json', '.md': 'text/plain; charset=utf-8', '.png': 'image/png', '.woff2': 'font/woff2' };
  const server = http.createServer((req, res) => {
    try {
      let route = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
      if (route === '/') { res.writeHead(302, { Location: '/demo/员工端-demo/index.html' }); return res.end(); }
      const modules = path.join(base, 'demo/Amazon管理/amazon-dw-prototype/node_modules');
      const vendor = {
        '/amazon-vendor/vue.js': 'vue/dist/vue.global.js',
        '/amazon-vendor/element.js': 'element-plus/dist/index.full.js',
        '/amazon-vendor/element.css': 'element-plus/dist/index.css',
        '/amazon-vendor/icons.js': '@element-plus/icons-vue/dist/index.iife.min.js',
      };
      if (vendor[route]) {
        const target = path.join(modules, vendor[route]);
        if (!fs.existsSync(target)) { res.writeHead(404); return res.end('请先安装Amazon本地依赖。'); }
        res.writeHead(200, { 'Content-Type': mime[path.extname(route)] });
        return fs.createReadStream(target).pipe(res);
      }
      const folder = route.startsWith('/amazon-docs/') ? preview : base;
      if (folder === preview) route = route.slice('/amazon-docs'.length);
      const target = path.resolve(folder, '.' + route);
      if (!target.startsWith(folder + path.sep) || route.split('/').some(s => s.startsWith('.'))) { res.writeHead(403); return res.end('Forbidden'); }
      if (!fs.existsSync(target) || !fs.statSync(target).isFile()) { res.writeHead(404); return res.end('Not found. 请先在Amazon源码目录运行 npm run build。'); }
      res.writeHead(200, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      if (route === '/demo/员工端-demo/index.html') {
        // 只在本地返回首页时复用同款依赖，源文件及其他模块均保持原样。
        const html = fs.readFileSync(target, 'utf8')
          .replaceAll('https://unpkg.com/vue@3/dist/vue.global.prod.js', '/amazon-vendor/vue.js')
          .replaceAll('https://unpkg.com/vue@3/dist/vue.global.js', '/amazon-vendor/vue.js')
          .replaceAll('https://unpkg.com/element-plus/dist/index.css', '/amazon-vendor/element.css')
          .replaceAll('https://unpkg.com/element-plus"', '/amazon-vendor/element.js"')
          .replaceAll('https://unpkg.com/@element-plus/icons-vue"', '/amazon-vendor/icons.js"');
        return res.end(html);
      }
      fs.createReadStream(target).pipe(res);
    } catch { res.writeHead(400); res.end('Bad request'); }
  });
  server.on('error', error => { console.error('本地服务启动失败：', error.message); process.exitCode = 1; });
  server.listen(5180, '127.0.0.1', () => {
    console.log('员工端：http://127.0.0.1:5180/demo/员工端-demo/index.html');
    console.log('唯一方案：http://127.0.0.1:5180/amazon-docs/Amazon管理产品方案.html');
    console.log('按 Ctrl+C 停止；仅监听本机，不部署或连接业务服务。');
  });
}
main().catch(error => { console.error(error); process.exitCode = 1; });
