// oss-site 构建脚本 — 从 drafts/*.md 生成文档站点 HTML
// 用法: node oss-site/build.js
const fs=require('fs');const crypto=require('crypto');const base=__dirname+'/..';const oss=__dirname;
function slugify(t){return t.replace(/[^\w一-鿿]+/g,'-').replace(/^-|-$/g,'')||crypto.randomBytes(3).toString('hex')}
function toc(md){const h=[];md.replace(/\r/g,'').split('\n').forEach(l=>{const a=l.match(/^## (.+)$/),b=l.match(/^### (.+)$/);if(a){const t=a[1];if(!t.match(/^0\./))h.push({lv:2,t,id:slugify(t)})}if(b){const t=b[1];if(!t.match(/^0\./))h.push({lv:3,t,id:slugify(t)})}});return h}
function md2h(md,mod,fileMap){let h=md.replace(/\r/g,'');h=h.replace(/^### (.+)$/gm,(_,t)=>'<h3 id="'+slugify(t)+'">'+t+'</h3>');h=h.replace(/^## (.+)$/gm,(_,t)=>'<h2 id="'+slugify(t)+'">'+t+'</h2>');h=h.replace(/^# (.+)$/gm,(_,t)=>'<h1 id="'+slugify(t)+'">'+t+'</h1>');h=h.replace(/^#### (.+)$/gm,(_,t)=>'<h4 id="'+slugify(t)+'">'+t+'</h4>');h=h.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');h=h.replace(/`([^`]+)`/g,'<code>$1</code>');h=h.replace(/^> (.+)$/gm,'<blockquote>$1</blockquote>');h=h.replace(/<\/blockquote>\n<blockquote>/g,'\n');h=h.replace(/^- (.+)$/gm,'<li>$1</li>');h=h.replace(/((?:<li>.*?<\/li>\n?)+)/g,'<ul>$1</ul>');h=h.replace(/^---$/gm,'<hr>');h=h.replace(/^\|(.+)$/gm,function(l){if(l.match(/^\|[\s\-:]+\|?$/))return'';var c=l.split('|').filter(x=>x.trim());return'<tr>'+c.map(x=>'<td>'+x.trim()+'</td>').join('')+'</tr>'});h=h.replace(/((?:<tr>.*?<\/tr>\n?)+)/g,'<div class="table-wrapper"><table>$1</table></div>');h=h.replace(/\n\n+/g,'</p><p>');h='<p>'+h+'</p>';h=h.replace(/<p>\s*<\/p>/g,'');
  h=h.replace(/drafts\/([^\/]+)\/(\d{4}-\d{2}-\d{2})-([^\.\s<\)]+)\.md/g,function(m,draftMod,date,type){
    var key=draftMod+'/'+type;var t=fileMap[key];if(t)return'<a href="'+t.file+'">'+type+'</a>';return m});return h}
const CSS='*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;line-height:1.8;color:#1e293b;background:#f8fafc}.nav-bar{position:sticky;top:0;z-index:100;background:#fff;border-bottom:1px solid #e2e8f0;padding:0 24px;height:56px;display:flex;align-items:center;gap:12px;box-shadow:0 1px 3px rgba(0,0,0,0.05)}.nav-bar a{color:#64748b;text-decoration:none;font-size:14px;display:flex;align-items:center;gap:6px}.nav-bar a:hover{color:#7c3aed}.nav-bar .sep{color:#cbd5e1;font-size:14px}.nav-bar .module-tag{display:inline-flex;align-items:center;gap:4px;padding:2px 10px;border-radius:12px;background:#7c3aed15;color:#7c3aed;font-size:13px;font-weight:500}.layout{display:flex;max-width:1300px;margin:0 auto;padding:32px 24px 80px;gap:40px}.toc{width:220px;flex-shrink:0;position:sticky;top:72px;align-self:flex-start;max-height:calc(100vh - 100px);overflow-y:auto;background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px}.toc-title{font-size:13px;font-weight:600;color:#1e293b;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #e2e8f0}.toc ul{list-style:none}.toc li{margin:0}.toc a{display:block;padding:4px 0;color:#64748b;text-decoration:none;font-size:13px;line-height:1.5;transition:color 0.15s}.toc a:hover{color:#7c3aed}.toc .toc-lv2 a{font-weight:500;color:#334155}.toc .toc-lv3 a{padding-left:16px;font-size:12px;color:#64748b}.content{flex:1;min-width:0}.doc-content h1{font-size:22px;margin:32px 0 16px;color:#0f172a;border-bottom:1px solid #e2e8f0;padding-bottom:8px}.doc-content h2{font-size:18px;margin:28px 0 12px;color:#1e293b;scroll-margin-top:72px}.doc-content h3{font-size:16px;margin:24px 0 10px;color:#334155;scroll-margin-top:72px}.doc-content p{margin:12px 0}.doc-content ul,.doc-content ol{margin:8px 0 8px 24px}.doc-content li{margin:4px 0}.doc-content blockquote{border-left:4px solid #7c3aed;background:#f1f5f9;padding:12px 16px;margin:16px 0;border-radius:0 8px 8px 0;color:#475569}.doc-content code{background:#f1f5f9;padding:2px 6px;border-radius:4px;font-family:"JetBrains Mono","Fira Code",Consolas,monospace;font-size:0.88em;color:#dc2626}.doc-content pre{background:#0f172a;color:#e2e8f0;padding:16px 20px;border-radius:8px;overflow-x:auto;margin:16px 0;font-size:13px;line-height:1.6}.doc-content pre code{background:none;color:inherit;padding:0;font-size:inherit}.table-wrapper{overflow-x:auto;margin:16px 0;border:1px solid #e2e8f0;border-radius:8px}.doc-content table{width:100%;border-collapse:collapse;font-size:14px}.doc-content th{background:#f1f5f9;font-weight:600;text-align:left;padding:10px 12px;border-bottom:2px solid #e2e8f0;white-space:nowrap}.doc-content td{padding:8px 12px;border-bottom:1px solid #f1f5f9}.doc-content tr:last-child td{border-bottom:none}@media(max-width:900px){.layout{flex-direction:column}.toc{width:100%;position:static;max-height:none;margin-bottom:24px}}';
function buildTOC(h){if(h.length===0)return'';return'<nav class="toc"><div class="toc-title">本页目录</div><ul>'+h.map(x=>'<li class="toc-lv'+x.lv+'"><a href="#'+x.id+'">'+x.t+'</a></li>').join('')+'</ul></nav>'}

// ====== Module metadata (static) ======
var MODULES=[
  {dir:'超级运价', name:'超级运价', icon:'📊', color:'#2563eb'},
  {dir:'港口仓库', name:'港口仓库', icon:'🏗️', color:'#0891b2'},
  {dir:'货主端', name:'货主端', icon:'👤', color:'#ca8a04'},
  {dir:'基础资料', name:'基础资料', icon:'📋', color:'#059669'},
  {dir:'客商中心', name:'客商中心', icon:'🤝', color:'#7c3aed'},
  {dir:'头程管理', name:'头程管理', icon:'🚢', color:'#d97706'},
  {dir:'系统设置', name:'系统设置', icon:'⚙️', color:'#dc2626'},
  {dir:'邀请入驻', name:'邀请入驻', icon:'📨', color:'#db2777'},
  {dir:'财务', name:'财务', icon:'💰', color:'#0d9488'}
];

// ====== Step 1: Build file map ======
var fileMap={};  // "Module/Type" → {date, file}
fs.readdirSync(base+'/drafts').forEach(mod=>{
  var md=base+'/drafts/'+mod;if(!fs.statSync(md).isDirectory())return;
  fs.readdirSync(md).filter(f=>f.endsWith('.md')).forEach(f=>{
    var dp=f.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);if(!dp)return;
    var type=dp[2];var key=mod+'/'+type;
    var existing=fileMap[key];
    if(!existing||dp[1]>existing.date){fileMap[key]={date:dp[1],file:f.replace('.md','.html')}};
  });
});

// ====== Step 2: Build individual doc pages ======
fs.readdirSync(base+'/drafts').forEach(mod=>{
  var md=base+'/drafts/'+mod;if(!fs.statSync(md).isDirectory())return;
  var od=oss+'/'+mod;if(!fs.existsSync(od))fs.mkdirSync(od);
  fs.readdirSync(md).filter(f=>f.endsWith('.md')).forEach(f=>{
    var dp=f.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);var dt=dp?dp[2]:f.replace('.md','');
    var raw=fs.readFileSync(md+'/'+f,'utf-8').replace(/^﻿/,'');
    var hds=toc(raw);var bd=md2h(raw,mod,fileMap);var ti=buildTOC(hds);
    var title=dt+' - '+mod+' - Luna 文档';
    var html='<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>'+title+'</title>\n<style>\n'+CSS+'\n</style>\n</head>\n<body>\n<div class="nav-bar">\n<a href="../index.html">Luna 文档</a>\n<span class="sep">/</span>\n<span class="module-tag">'+mod+'</span>\n<span class="sep">/</span>\n<span>'+dt+'</span>\n</div>\n<div class="layout">\n'+ti+'\n<div class="content"><div class="doc-content">'+bd+'</div></div>\n</div>\n</body>\n</html>';
    fs.writeFileSync(od+'/'+f.replace('.md','.html'),html,'utf-8')});
});

// ====== Step 3: Collect non-dated files per module ======
var nonDated={}; // mod → [{file, label}]
fs.readdirSync(base+'/drafts').forEach(mod=>{
  var md=base+'/drafts/'+mod;if(!fs.statSync(md).isDirectory())return;
  var list=[];
  fs.readdirSync(md).filter(f=>f.endsWith('.md')).forEach(f=>{
    var dp=f.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);if(dp)return; // skip dated
    list.push({file:f.replace('.md','.html'), label:f.replace('.md','')});
  });
  if(list.length) nonDated[mod]=list;
});

// ====== Step 4: Generate index.html ======
var today=new Date().toISOString().slice(0,10);
var totalDocs=0;

var modCards='';
MODULES.forEach(function(m){
  var enc=encodeURIComponent(m.dir);
  var links='';
  // Dated docs from fileMap
  var modEntries=Object.keys(fileMap).filter(function(k){return k.startsWith(m.dir+'/')});
  // Sort: PRD first, then 数据设计, then RDD(用户需求), then rest by date desc
  var order={PRD:1,数据设计:2,用户需求:3};
  modEntries.sort(function(a,b){
    var ta=a.split('/')[1], tb=b.split('/')[1];
    var oa=order[ta]||99, ob=order[tb]||99;
    if(oa!==ob)return oa-ob;
    return (fileMap[b].date||'').localeCompare(fileMap[a].date||'');
  });
  modEntries.forEach(function(k){
    var e=fileMap[k];
    var type=k.split('/')[1];
    var tagLabel=type==='用户需求'?'RDD':type;
    var href=enc+'/'+e.file;
    links+='\n      <a class="doc-link" href="'+href+'">\n        <span class="doc-tag" style="background:'+m.color+'22;color:'+m.color+'">'+tagLabel+'</span>\n        <span class="doc-name">'+tagLabel+'</span>\n      </a>\n';
  });
  // Non-dated files
  var nd=nonDated[m.dir]||[];
  nd.forEach(function(n){
    var href=enc+'/'+n.file;
    links+='\n      <a class="doc-link" href="'+href+'">\n        <span class="doc-tag" style="background:'+m.color+'22;color:'+m.color+'">'+n.label+'</span>\n        <span class="doc-name">'+n.label+'</span>\n      </a>\n';
  });
  var docCount=modEntries.length+nd.length;
  totalDocs+=docCount;
  modCards+='\n  <div class="mod-card">\n    <div class="mod-header" style="background:'+m.color+'">\n      <span class="mod-icon">'+m.icon+'</span>\n      <span class="mod-name">'+m.name+'</span>\n      <span class="mod-count">'+docCount+' 个文档</span>\n    </div>\n    <div class="mod-body">'+links+'\n    </div>\n  </div>\n';
});

var indexHTML='<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Luna 文档中心</title>\n<style>\n*{margin:0;padding:0;box-sizing:border-box}\nbody{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif;background:#f1f5f9;color:#1e293b;min-height:100vh}\n.hero{background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);color:#fff;padding:48px 24px 40px;text-align:center}\n.hero h1{font-size:28px;font-weight:700;margin-bottom:6px;display:flex;align-items:center;justify-content:center;gap:10px}\n.hero h1 span{background:linear-gradient(135deg,#60a5fa,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}\n.hero p{font-size:14px;color:#94a3b8;margin-top:8px}\n.hero .stats{margin-top:16px;display:flex;gap:24px;justify-content:center;font-size:13px;color:#64748b}\n.hero .stats strong{color:#e2e8f0;font-size:15px}\n.grid{max-width:1200px;margin:0 auto;padding:28px 24px 60px;display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:20px}\n.mod-card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);transition:transform 0.15s,box-shadow 0.15s}\n.mod-card:hover{transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.1)}\n.mod-header{padding:16px 20px;display:flex;align-items:center;gap:8px}\n.mod-icon{font-size:20px}\n.mod-name{font-weight:600;color:#fff;font-size:15px;flex:1}\n.mod-count{font-size:11px;color:rgba(255,255,255,0.7);background:rgba(255,255,255,0.15);padding:2px 8px;border-radius:10px}\n.mod-body{padding:8px 12px 12px}\n.doc-link{display:flex;align-items:center;gap:8px;padding:8px 8px;text-decoration:none;color:#334155;border-radius:6px;transition:background 0.12s}\n.doc-link:hover{background:#f1f5f9}\n.doc-tag{font-size:11px;font-weight:600;padding:1px 6px;border-radius:4px;white-space:nowrap;flex-shrink:0;min-width:48px;text-align:center}\n.doc-name{font-size:13px;color:#475569;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n.footer{text-align:center;padding:24px;font-size:12px;color:#94a3b8}\n@media(max-width:640px){.hero{padding:32px 16px 28px}.hero h1{font-size:22px}.grid{padding:20px 12px 40px;grid-template-columns:1fr}}\n</style>\n</head>\n<body>\n<div class="hero">\n  <h1>🌙 <span>Luna 文档中心</span></h1>\n  <p>产品需求文档 · 数据设计 · 用户需求 · 变更记录</p>\n  <div class="stats">\n    <span>模块 <strong>'+MODULES.length+'</strong></span>\n    <span>文档 <strong>'+totalDocs+'</strong></span>\n    <span>更新 <strong>'+today+'</strong></span>\n  </div>\n</div>\n<div class="grid">'+modCards+'\n</div>\n<div class="footer">Luna 文档站点 · 由 Markdown 自动生成</div>\n</body>\n</html>\n';
fs.writeFileSync(oss+'/index.html',indexHTML,'utf-8');

// ====== Step 5: Clean up old HTML files ======
var activeFiles={}; // "Module/file.html" → true
Object.keys(fileMap).forEach(function(k){
  activeFiles[k.split('/')[0]+'/'+fileMap[k].file]=true;
});
Object.keys(nonDated).forEach(function(mod){
  nonDated[mod].forEach(function(n){activeFiles[mod+'/'+n.file]=true});
});

fs.readdirSync(base+'/drafts').forEach(mod=>{
  var od=oss+'/'+mod;if(!fs.existsSync(od))return;
  fs.readdirSync(od).filter(f=>f.endsWith('.html')).forEach(f=>{
    if(f==='index.html')return;
    if(!activeFiles[mod+'/'+f]){
      fs.unlinkSync(od+'/'+f);
      console.log('  deleted old: '+mod+'/'+f);
    }
  });
});

var latestDate='';Object.keys(fileMap).forEach(function(k){if(fileMap[k].date>latestDate)latestDate=fileMap[k].date});
console.log('oss-site rebuilt: '+Object.keys(fileMap).length+' doc types across '+MODULES.length+' modules | index updated to '+today);
