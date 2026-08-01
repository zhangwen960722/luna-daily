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

// Build file map: "Module/Type" → latest HTML filename (for cross-references)
var fileMap={};
fs.readdirSync(base+'/drafts').forEach(mod=>{
  var md=base+'/drafts/'+mod;if(!fs.statSync(md).isDirectory())return;
  fs.readdirSync(md).filter(f=>f.endsWith('.md')).forEach(f=>{
    var dp=f.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);if(!dp)return;
    var type=dp[2];var key=mod+'/'+type;
    var existing=fileMap[key];
    if(!existing||dp[1]>existing.date){fileMap[key]={date:dp[1],file:f.replace('.md','.html')}};
  });
});

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
console.log('oss-site rebuilt: '+Object.keys(fileMap).length+' doc types across all modules');
