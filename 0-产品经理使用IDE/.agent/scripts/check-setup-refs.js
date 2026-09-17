/**
 * 模板引用 × setup 返回 交叉校验（防「模板用了、setup 没返回」这类静默失效）
 * 用法：node check-setup-refs.js <page.html> [...]
 *
 * 为什么需要它：这类缺陷的表现是「点了没反应 / 整块区域不渲染」，而
 *   ① JS 语法检查过（代码本身合法）；② 模板作用域检查过（只查槽变量越界）；
 *   ③ 渲染检查也容易漏（按钮在、弹窗没打开）。
 * 本仓已踩过 3 次：`sendCustomerOptions`、`voidGuard`、`openBatchSend`（都不是拼写错误，而是漏写进 return）。
 */
const fs = require('fs');
const path = require('path');

const KEYWORDS = new Set(['true', 'false', 'null', 'undefined', 'new', 'typeof', 'in', 'of', 'instanceof', 'return', 'void', 'delete', 'function', 'if', 'else', 'this']);
const GLOBALS = new Set(['Math', 'Number', 'String', 'Boolean', 'Object', 'Array', 'JSON', 'Date', 'RegExp', 'Error', 'parseInt', 'parseFloat', 'isNaN', 'isFinite', 'console', 'window', 'document', 'NaN', 'Infinity', 'encodeURIComponent', 'decodeURIComponent']);

function extractTemplate(html) {
  const i = html.indexOf('id="app"');
  if (i < 0) return '';
  const j = html.lastIndexOf('<script');
  return html.slice(i, j > i ? j : html.length).replace(/<!--[\s\S]*?-->/g, '');
}
/** 匹配花括号，返回闭合位置 */
function matchBrace(src, openIdx) {
  let depth = 0;
  for (let k = openIdx; k < src.length; k++) {
    const ch = src[k];
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) return k; }
  }
  return -1;
}
/** 取 setup() 函数体里**最外层**的 `return { … }` 的键集合；含展开运算符则返回 null（静态判不了） */
function extractReturnKeys(js) {
  const si = js.search(/setup\s*\(\s*\)\s*\{/);
  if (si < 0) return null;
  const bodyOpen = js.indexOf('{', js.indexOf('setup', si));
  const bodyEnd = matchBrace(js, bodyOpen);
  if (bodyEnd < 0) return null;
  const body = js.slice(bodyOpen + 1, bodyEnd);
  let depth = 0, retOpen = -1;
  for (let k = 0; k < body.length; k++) {
    const ch = body[k];
    if (ch === '{') depth++;
    else if (ch === '}') depth--;
    else if (depth === 0 && body.startsWith('return', k) && /\s*\{/.test(body.slice(k + 6, k + 9))) {
      retOpen = body.indexOf('{', k + 6);
      break;
    }
  }
  if (retOpen < 0) return null;
  const retEnd = matchBrace(body, retOpen);
  if (retEnd < 0) return null;
  const inner = body.slice(retOpen + 1, retEnd).replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  if (inner.includes('...')) return null;                       // 有展开 → 静态判不了，交给运行时
  const keys = new Set();
  let depth2 = 0, cur = '';
  const push = (seg) => {
    const m = seg.trim().replace(/\s+/g, ' ').match(/^([A-Za-z_$][\w$]*)\s*(?::|$)/);
    if (m) keys.add(m[1]);
  };
  for (const ch of inner) {
    if ('([{'.includes(ch)) depth2++;
    if (')]}'.includes(ch)) depth2--;
    if (ch === ',' && depth2 === 0) { push(cur); cur = ''; continue; }
    cur += ch;
  }
  push(cur);
  return keys;
}
function templateIdentifiers(tpl) {
  const used = new Map();
  const aliases = new Set(['scope', '$index', '$event', 'row', 'index', 'item', 'true', 'false', 'required', 'message', 'trigger', 'type', 'min', 'max', 'pattern']);
  for (const m of tpl.matchAll(/v-for\s*=\s*"([^"]*)"/g)) {
    const mm = m[1].match(/\(?([^)]*?)\)?\s+in\s+/);
    if (mm) mm[1].split(',').forEach(a => aliases.add(a.trim().replace(/[{}]/g, '')));
  }
  for (const m of tpl.matchAll(/(?:#|v-slot:)[\w-]*\s*=\s*"([^"]*)"/g)) {
    m[1].replace(/[{}]/g, '').split(',').forEach(a => aliases.add(a.trim()));
  }
  const add = (expr) => {
    let e = expr
      .replace(/'[^']*'/g, "''").replace(/"[^"]*"/g, '""').replace(/`[^`]*`/g, '``')
      .replace(/\\[A-Za-z]/g, '')                                   // 正则转义 \d \w 不是标识符
      .replace(/\/[^/\n]+\/[gimsuy]*/g, '')                          // 正则字面量
      .replace(/\$[A-Za-z_$][\w$]*/g, '$event')                     // $event / $index / $slots 等 Vue 内置
      .replace(/\.\s*[A-Za-z_$][\w$]*/g, '')
      .replace(/([{(,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1');
    // 行内箭头函数的形参：@change="val => fn(val)" / :filter-method="kw => f(kw)"
    for (const m of e.matchAll(/(?:\(([^()]*)\)|([A-Za-z_$][\w$]*))\s*=>/g)) {
      if (m[1]) m[1].split(',').forEach(a => aliases.add(a.trim()));
      if (m[2]) aliases.add(m[2]);
    }
    for (const m of e.matchAll(/(?<![\w$])[A-Za-z_$][\w$]*/g)) {   // 前置不能是 $ 或词字符 —— 否则 $event 会被切成 event
      const n = m[0];
      if (KEYWORDS.has(n) || GLOBALS.has(n) || aliases.has(n)) continue;
      if (!used.has(n)) used.set(n, true);
    }
  };
  for (const m of tpl.matchAll(/\{\{([\s\S]*?)\}\}/g)) add(m[1]);
  for (const m of tpl.matchAll(/(?::|v-bind:|@|v-on:|v-if|v-else-if|v-show|v-model(?::[\w-]+)?|v-html|v-text)\s*[\w:.-]*\s*=\s*"([^"]*)"/g)) {
    if (/^v-for/.test(m[0])) continue;
    add(m[1]);
  }
  return used;
}

const files = process.argv.slice(2);
let bad = 0, skip = 0;
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n');
  const tpl = extractTemplate(html);
  const js = (() => { const i = html.indexOf('<script>', html.indexOf('id="app"')); const j = html.lastIndexOf('</script>'); return i < 0 ? '' : html.slice(i, j); })();
  const keys = extractReturnKeys(js);
  if (!tpl || !keys) { skip++; console.log('  [SKIP] ' + path.basename(f) + '（无 #app 模板 / 找不到 setup 顶层 return / 含展开运算符）'); continue; }
  const used = templateIdentifiers(tpl);
  const missing = [...used.keys()].filter(n => !keys.has(n) && !/^\$/.test(n));
  if (missing.length) { bad++; console.log('  [ERR]  ' + path.basename(f) + '：模板用到但 setup 未返回 → ' + missing.join(', ')); }
  else console.log('  [OK]   ' + path.basename(f) + '（' + used.size + ' 个模板标识符全部命中 setup 返回）');
}
console.log('\n合计：' + files.length + ' 页 ｜ 通过 ' + (files.length - bad - skip) + ' ｜ 问题 ' + bad + ' ｜ 跳过 ' + skip);
process.exit(bad ? 1 : 0);
