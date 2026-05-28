const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/17683/Desktop/luna/0-产品经理使用IDE/demo/员工端-demo';

['超级运价_工作台.html', '运价维护_主列表.html', '超级运价_运价表.html'].forEach(f => {
    const p = path.join(dir, f);
    if (!fs.existsSync(p)) return;
    
    let content = fs.readFileSync(p, 'utf8');
    
    let changed = false;
    
    if (content.includes('top-nav')) {
        content = content.replace(/\.top-nav\s*\{.*?\}/, '.top-nav{display:none}');
        content = content.replace(/body\s*\{.*?\}/, 'body{margin:0;padding:16px;background:var(--bg);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;color:var(--text);font-size:14px;line-height:1.5}');
        content = content.replace(/<div class="page">/, '<div class="page" style="padding: 0; margin: 0; max-width: none;">');
        content = content.replace(/<div class="card">/, '<div class="card" style="margin-bottom: 0;">');
        
        const hdRegex = /<div class="page-hd">[\s\S]*?<\/div>\s*<\/div>/;
        if (hdRegex.test(content)) {
            let titleMatch = content.match(/<h2>(.*?)<\/h2>/);
            let title = titleMatch ? titleMatch[1] : '';
            
            let rightMatch = content.match(/<div class="page-hd-right">([\s\S]*?)<\/div>\s*<\/div>/);
            let rightContent = rightMatch ? rightMatch[1].trim() : '';
            
            content = content.replace(hdRegex, '');
            
            let newHeader = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <h3 style="margin:0;font-size:15px;font-weight:600">${title}</h3>
        <div style="display:flex;align-items:center;gap:8px;">
          ${rightContent}
        </div>
      </div>`;
            
            content = content.replace(/<div class="card" style="margin-bottom: 0;">/, `<div class="card" style="margin-bottom: 0;">\n${newHeader}`);
        }
        changed = true;
    }
    
    if (changed) {
        fs.writeFileSync(p, content, 'utf8');
        console.log('Processed:', f);
    } else {
        console.log('No top-nav found in:', f);
    }
});
