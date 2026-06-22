const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const MODULES = [
  { dir: '超级运价', name: '超级运价', icon: '📊', color: '#2563eb' },
  { dir: '基础资料', name: '基础资料', icon: '📋', color: '#059669' },
  { dir: '头程管理', name: '头程管理', icon: '🚢', color: '#d97706' },
  { dir: '客商中心', name: '客商中心', icon: '🤝', color: '#7c3aed' },
  { dir: '港口仓库', name: '港口仓库', icon: '🏗️', color: '#0891b2' },
  { dir: '系统设置', name: '系统设置', icon: '⚙️', color: '#dc2626' },
  { dir: '货主端', name: '货主端', icon: '👤', color: '#ca8a04' },
  { dir: '邀请入驻', name: '邀请入驻', icon: '📨', color: '#db2777' },
];

const DOC_TYPES = [
  { suffix: '用户需求', label: '用户需求 (RDD)', short: 'RDD' },
  { suffix: '数据设计', label: '数据设计', short: '数据设计' },
  { suffix: 'PRD', label: '产品需求文档 (PRD)', short: 'PRD' },
  { suffix: '变更记录', label: '变更记录', short: '变更记录' },
];

const DRAFTS_DIR = path.resolve(__dirname, '0-产品经理使用IDE/drafts');
const OUT_DIR = path.resolve(__dirname, '0-产品经理使用IDE', 'oss-site');

marked.setOptions({ gfm: true, breaks: true });

function collectMdFiles() {
  const files = [];
  for (const mod of MODULES) {
    const modDir = path.join(DRAFTS_DIR, mod.dir);
    if (!fs.existsSync(modDir)) continue;
    const items = fs.readdirSync(modDir);
    const mdFiles = items.filter(f => f.endsWith('.md')).sort();
    for (const f of mdFiles) {
      const label = DOC_TYPES.find(d => f.includes(d.suffix));
      files.push({
        module: mod, file: f,
        label: label || { label: f.replace('.md',''), short: f.replace('.md','') },
        srcPath: path.join(modDir, f),
      });
    }
  }
  return files;
}

function convertMd(filePath) {
  const raw = fs.readFileSync(filePath, 'utf-8');
  let html = marked.parse(raw);
  html = html.replace(/<table>/g, '<div class="table-wrapper"><table>');
  html = html.replace(/<\/table>/g, '</table></div>');
  return { raw, html };
}

function escapeHtml(text) {
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function pageTemplate(title, moduleName, moduleColor, contentHtml) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)} - Luna 文档</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;line-height:1.8;color:#1e293b;background:#f8fafc}
.nav-bar{position:sticky;top:0;z-index:100;background:#fff;border-bottom:1px solid #e2e8f0;padding:0 24px;height:56px;display:flex;align-items:center;gap:12px;box-shadow:0 1px 3px rgba(0,0,0,0.05)}
.nav-bar a{color:#64748b;text-decoration:none;font-size:14px;display:flex;align-items:center;gap:6px}
.nav-bar a:hover{color:${moduleColor}}
.nav-bar .sep{color:#cbd5e1;font-size:14px}
.nav-bar .module-tag{display:inline-flex;align-items:center;gap:4px;padding:2px 10px;border-radius:12px;background:${moduleColor}15;color:${moduleColor};font-size:13px;font-weight:500}
.container{max-width:960px;margin:0 auto;padding:32px 24px 80px}
.doc-content h1{font-size:22px;margin:32px 0 16px;color:#0f172a;border-bottom:1px solid #e2e8f0;padding-bottom:8px}
.doc-content h2{font-size:18px;margin:28px 0 12px;color:#1e293b}
.doc-content h3{font-size:16px;margin:24px 0 10px;color:#334155}
.doc-content p{margin:12px 0}
.doc-content ul,.doc-content ol{margin:8px 0 8px 24px}
.doc-content li{margin:4px 0}
.doc-content blockquote{border-left:4px solid ${moduleColor};background:#f1f5f9;padding:12px 16px;margin:16px 0;border-radius:0 8px 8px 0;color:#475569}
.doc-content code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-family:"JetBrains Mono","Fira Code",Consolas,monospace;font-size:0.88em;color:#dc2626}
.doc-content pre{background:#0f172a;color:#e2e8f0;padding:16px 20px;border-radius:8px;overflow-x:auto;margin:16px 0;font-size:13px;line-height:1.6}
.doc-content pre code{background:none;color:inherit;padding:0;font-size:inherit}
.table-wrapper{overflow-x:auto;margin:16px 0;border:1px solid #e2e8f0;border-radius:8px}
.doc-content table{width:100%;border-collapse:collapse;font-size:14px}
.doc-content th{background:#f1f5f9;font-weight:600;text-align:left;padding:10px 12px;border-bottom:2px solid #e2e8f0;white-space:nowrap}
.doc-content td{padding:8px 12px;border-bottom:1px solid #f1f5f9}
.doc-content tr:last-child td{border-bottom:none}
.doc-content tr:hover td{background:#f8fafc}
.doc-content img{max-width:100%;border-radius:8px;margin:16px 0}
.doc-content a{color:${moduleColor};text-decoration:none}
.doc-content a:hover{text-decoration:underline}
.doc-content hr{border:none;border-top:1px solid #e2e8f0;margin:32px 0}
@media(max-width:640px){.container{padding:20px 16px 60px}.nav-bar{padding:0 16px}}
</style>
</head>
<body>
<nav class="nav-bar">
  <a href="../index.html">🏠 首页</a>
  <span class="sep">/</span>
  <span class="module-tag">${escapeHtml(moduleName)}</span>
  <span class="sep">/</span>
  <span style="font-size:13px;color:#64748b">${escapeHtml(title)}</span>
</nav>
<div class="container">
  <div class="doc-content">
    ${contentHtml}
  </div>
</div>
</body>
</html>`;
}

function indexPageTemplate(fileGroups) {
  const moduleCards = fileGroups.map(g => `
  <div class="mod-card">
    <div class="mod-header" style="background:${g.module.color}">
      <span class="mod-icon">${g.module.icon}</span>
      <span class="mod-name">${g.module.name}</span>
      <span class="mod-count">${g.files.length} 个文档</span>
    </div>
    <div class="mod-body">
      ${g.files.map(f => `
      <a class="doc-link" href="${encodeURIComponent(g.module.dir)}/${encodeURIComponent(f.outFile)}">
        <span class="doc-tag" style="background:${g.module.color}22;color:${g.module.color}">${f.label.short}</span>
        <span class="doc-name">${f.displayName}</span>
      </a>
      `).join('')}
    </div>
  </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Luna 文档中心</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;background:#f1f5f9;color:#1e293b;min-height:100vh}
.hero{background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);color:#fff;padding:48px 24px 40px;text-align:center}
.hero h1{font-size:28px;font-weight:700;margin-bottom:6px;display:flex;align-items:center;justify-content:center;gap:10px}
.hero h1 span{background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{font-size:14px;color:#94a3b8;margin-top:8px}
.hero .stats{margin-top:16px;display:flex;gap:24px;justify-content:center;font-size:13px;color:#64748b}
.hero .stats strong{color:#e2e8f0;font-size:15px}
.grid{max-width:1200px;margin:0 auto;padding:28px 24px 60px;display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px}
.mod-card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);transition:transform 0.15s,box-shadow 0.15s}
.mod-card:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.1)}
.mod-header{padding:16px 20px;display:flex;align-items:center;gap:8px}
.mod-icon{font-size:20px}
.mod-name{font-weight:600;color:#fff;font-size:15px;flex:1}
.mod-count{font-size:11px;color:rgba(255,255,255,0.7);background:rgba(255,255,255,0.15);padding:2px 8px;border-radius:10px}
.mod-body{padding:8px 12px 12px}
.doc-link{display:flex;align-items:center;gap:8px;padding:8px 8px;text-decoration:none;color:#334155;border-radius:6px;transition:background 0.12s}
.doc-link:hover{background:#f1f5f9}
.doc-tag{font-size:11px;font-weight:600;padding:1px 6px;border-radius:4px;white-space:nowrap;flex-shrink:0;min-width:48px;text-align:center}
.doc-name{font-size:13px;color:#475569;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.footer{text-align:center;padding:24px;font-size:12px;color:#94a3b8}
@media(max-width:640px){.hero{padding:32px 16px 28px}.hero h1{font-size:22px}.grid{padding:20px 12px 40px;grid-template-columns:1fr}}
</style>
</head>
<body>
<div class="hero">
  <h1>🌙 <span>Luna 文档中心</span></h1>
  <p>产品需求文档 · 数据设计 · 用户需求 · 变更记录</p>
  <div class="stats">
    <span>模块 <strong>${fileGroups.filter(g => g.files.length>0).length}</strong></span>
    <span>文档 <strong>${fileGroups.reduce((s,g) => s+g.files.length, 0)}</strong></span>
    <span>更新 <strong>2026-06-09</strong></span>
  </div>
</div>
<div class="grid">
  ${moduleCards}
</div>
<div class="footer">Luna 文档站点 · 由 Markdown 自动生成</div>
</body>
</html>`;
}

function main() {
  if (fs.existsSync(OUT_DIR)) {
    fs.rmSync(OUT_DIR, { recursive: true, force: true });
  }
  const allFiles = collectMdFiles();
  if (allFiles.length === 0) { console.log('未找到 Markdown 文件'); return; }
  console.log('找到 ' + allFiles.length + ' 个 Markdown 文件');
  const grouped = {};
  for (const f of allFiles) {
    if (!grouped[f.module.dir]) grouped[f.module.dir] = [];
    grouped[f.module.dir].push(f);
  }
  let totalPages = 0;
  for (const mod of MODULES) {
    const files = grouped[mod.dir];
    if (!files || files.length === 0) continue;
    const modDir = path.join(OUT_DIR, mod.dir);
    fs.mkdirSync(modDir, { recursive: true });
    for (const f of files) {
      const { html } = convertMd(f.srcPath);
      const outFile = f.file.replace('.md', '.html');
      const pageHtml = pageTemplate(f.label.short, mod.name, mod.color, html);
      fs.writeFileSync(path.join(modDir, outFile), pageHtml, 'utf-8');
      f.outFile = outFile;
      f.displayName = f.label.short;
      totalPages++;
      console.log('  ✓ ' + mod.dir + '/' + outFile);
    }
  }
  const fileGroups = MODULES
    .filter(mod => grouped[mod.dir] && grouped[mod.dir].length > 0)
    .map(mod => ({ module: mod, files: grouped[mod.dir] }));
  fileGroups.sort((a,b) => {
    if (a.module.dir === '超级运价') return -1;
    if (b.module.dir === '超级运价') return 1;
    return a.module.dir.localeCompare(b.module.dir, 'zh');
  });
  const indexHtml = indexPageTemplate(fileGroups);
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), indexHtml, 'utf-8');
  console.log('\n✅ 生成完成！总共 ' + totalPages + ' 个页面');
  console.log('📁 输出目录: ' + OUT_DIR);
}
main();
