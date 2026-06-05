const fs = require('fs');

const filePath = 'c:\\Users\\17683\\Desktop\\luna\\0-产品经理使用IDE\\demo\\员工端-demo\\客户管理.html';
const content = fs.readFileSync(filePath, 'utf-8');

const scriptMatch = content.match(/<script>\s*const \{[\s\S]*?mount\('#app'\);/);
if (scriptMatch) {
    // console.log(scriptMatch[0].substring(scriptMatch[0].length - 1000));
    console.log("Script block found.");
} else {
    console.log("Could not find script block.");
}
