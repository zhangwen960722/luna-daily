#!/usr/bin/env node
/**
 * 原型 HTML 静态检查工具
 *
 * 用途：员工端/货主端单文件 Vue 原型（unpkg CDN + Vue 3 Options API）的改后自检。
 * 背景：`node --check` 只能查语法错误，查不出**未定义变量**、**computed 当函数调用**、
 *       **computed 带参数** 这三类运行时错误 —— 这三类都会让页面白屏或点开弹窗就报错。
 *
 * 用法：
 *   node .agent/scripts/check-prototype.js <页面.html> [更多页面...]
 *
 * 检查项：
 *   1. 标签闭合平衡（el-dialog / el-table-column / div / el-select / el-form-item / template）
 *   2. <script> 语法（等价 node --check）
 *   3. 运行时引用：调用 data() / 求值全部 computed / 包裹全部 methods —— 抓未定义变量与误用
 *   4. 交互探针：对每条 mock 行走 openEdit，走一遍新增/删除/校验路径（若存在对应方法）
 */
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const TAGS = ['el-dialog', 'el-table-column', 'div', 'el-select', 'el-form-item', 'template', 'el-table', 'el-form'];

function balance(html, tag) {
  const open = (html.match(new RegExp('<' + tag + '(?=[\\s>])', 'g')) || []).length;
  const close = (html.match(new RegExp('</' + tag + '>', 'g')) || []).length;
  return { open, close, ok: open === close };
}

/** 构建一个最小 Vue 运行时，捕获 createApp 的 options 并实例化 */
function bootstrap(script) {
  let captured = null;
  const noop = () => {};
  const chain = { then() { return chain; }, catch() { return chain; } };
  global.ElementPlus = {
    ElMessage: new Proxy({}, { get: () => noop }),
    ElMessageBox: new Proxy({}, { get: () => () => chain }),
  };
  global.Vue = {
    createApp: (o) => { captured = o; return { use() { return this; }, mount() {}, component() {}, directive() {} }; },
  };
  global.window = global;
  global.document = { addEventListener: noop, querySelector: () => null, querySelectorAll: () => [] };
  global.localStorage = { getItem: () => null, setItem: noop, removeItem: noop };
  global.navigator = { userAgent: 'node' };
  global.alert = noop;
  vm.runInThisContext(script, { filename: 'prototype.js' });
  return captured;
}

function instantiate(opts) {
  const errors = [];
  let dataObj = {};
  try { dataObj = opts.data.call({}) || {}; } catch (e) { errors.push('data(): ' + e.message); }
  const inst = Object.assign({}, dataObj);
  // 注意：method 包装必须**继续抛出**，否则探针无法发现 method 内部失败
  for (const k of Object.keys(opts.methods || {})) {
    inst[k] = function () { return opts.methods[k].apply(inst, arguments); };
  }
  for (const k of Object.keys(opts.computed || {})) {
    const def = opts.computed[k];
    const fn = typeof def === 'function' ? def : def && def.get;
    if (!fn) { errors.push('computed ' + k + ': 无 getter'); continue; }
    Object.defineProperty(inst, k, {
      get() { try { return fn.call(inst); } catch (e) { errors.push('computed ' + k + ': ' + e.message); return undefined; } },
      configurable: true,
    });
  }
  for (const k of Object.keys(opts.computed || {})) { void inst[k]; }
  return { inst, errors };
}

function probes(inst) {
  const out = [];
  // 表单对象命名不一：附加费规则页用 f，服务组合页用 form
  const F = () => (inst.f !== undefined ? inst.f : inst.form);
  const P = (name, fn) => {
    try { const r = fn(); out.push('[OK]   ' + name + (r !== undefined ? '  => ' + String(r).slice(0, 72) : '')); }
    catch (e) { out.push('[ERR]  ' + name + '  => ' + e.message); }
  };
  const allRules = Array.isArray(inst.rules) ? inst.rules : (Array.isArray(inst.combos) ? inst.combos : null);
  if (allRules && typeof inst.openEdit === 'function') {
    allRules.slice(0, 8).forEach((r, i) => P('openEdit: ' + (r.name || r.code), () => {
      inst.openEdit(r, i);
      const f = F() || {};
      const bits = [];
      if (f.pricingUnit !== undefined) bits.push('计价单位=' + (f.pricingUnit || '-'));
      if (Array.isArray(f.pricingRows)) bits.push('明细' + f.pricingRows.length + '行');
      if (Array.isArray(f.discountRules)) bits.push('优惠' + f.discountRules.length + '条');
      if (Array.isArray(f.densityRules)) bits.push('泡比' + f.densityRules.length + '条');
      return bits.join(' ') || 'ok';
    }));
  }
  if (typeof inst.openAdd === 'function') P('openAdd', () => { inst.openAdd(); return 'ok'; });
  if (typeof inst.addPricingRow === 'function') {
    P('addPricingRow ×2', () => { inst.addPricingRow(); inst.addPricingRow(); return '行数=' + ((F() || {}).pricingRows || []).length; });
  }
  if (typeof inst.addDiscountRow === 'function') P('addDiscountRow', () => { inst.addDiscountRow(); return '优惠' + (((F() || {}).discountRules) || []).length + '条'; });
  if (typeof inst.addDensityRow === 'function') P('addDensityRow', () => { inst.addDensityRow(); return '泡比' + (((F() || {}).densityRules) || []).length + '条'; });
  if (inst.filteredRules !== undefined) P('filteredRules', () => '共 ' + inst.filteredRules.length + ' 条');
  if (inst.filteredCombos !== undefined) P('filteredCombos', () => '共 ' + inst.filteredCombos.length + ' 条');
  return out;
}

let failed = 0;
for (const file of process.argv.slice(2)) {
  console.log('\n=== ' + path.basename(file) + ' ===');
  const html = fs.readFileSync(file, 'utf8');

  // 1. 标签平衡
  for (const tag of TAGS) {
    const b = balance(html, tag);
    if (!b.ok) { console.log('  [ERR]  ' + tag + ' 标签不平衡: ' + b.open + ' / ' + b.close); failed++; }
  }

  // 2. 语法
  const m = html.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) { console.log('  [ERR]  未找到 <script> 块'); failed++; continue; }
  try { new vm.Script(m[1]); console.log('  [OK]   语法检查通过'); }
  catch (e) { console.log('  [ERR]  语法: ' + e.message); failed++; continue; }

  // 3. 运行时引用
  let opts = null;
  try { opts = bootstrap(m[1]); } catch (e) { console.log('  [ERR]  执行脚本: ' + e.message); failed++; continue; }
  if (!opts) { console.log('  [ERR]  未捕获到 createApp options'); failed++; continue; }
  const { inst, errors } = instantiate(opts);
  if (errors.length) { errors.forEach((e) => console.log('  [ERR]  ' + e)); failed++; }
  else console.log('  [OK]   运行时引用检查通过（data ' + Object.keys(opts.data.call({})).length + ' 项 / methods ' + Object.keys(opts.methods || {}).length + ' / computed ' + Object.keys(opts.computed || {}).length + '）');

  // 4. 交互探针
  const ps = probes(inst);
  ps.forEach((p) => { console.log('  ' + p); if (p.startsWith('[ERR]')) failed++; });
}

console.log('\n' + (failed === 0 ? '全部通过 ✅' : '存在 ' + failed + ' 项问题 ❌'));
process.exit(failed === 0 ? 0 : 1);
