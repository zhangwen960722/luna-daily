const fs = require('fs');
const file = 'c:/Users/17683/Desktop/luna/0-产品经理使用IDE/demo/员工端-demo/客户管理.html';
let html = fs.readFileSync(file, 'utf-8');
html = html.replace(/<div id="error-log"[\s\S]*?<\/script>/, '');
html = html.replace(/app\.config\.errorHandler = [\s\S]*?app\.use\(ElementPlus\);/, 'app.use(ElementPlus);');
fs.writeFileSync(file, html);
console.log('cleaned');