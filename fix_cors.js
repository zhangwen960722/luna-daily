const fs = require('fs');
const file = 'c:/Users/17683/Desktop/luna/0-产品经理使用IDE/demo/员工端-demo/客户管理.html';
let html = fs.readFileSync(file, 'utf-8');
html = html.replace(/<script src=/g, '<script crossorigin="anonymous" src=');
fs.writeFileSync(file, html);
console.log('done');
