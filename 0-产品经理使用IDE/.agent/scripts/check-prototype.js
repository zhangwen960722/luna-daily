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

/**
 * 取「只看 HTML 模板」的文本：剥掉 <script> / <style> / <!-- --> 三类块。
 * 为什么必须剥：原型里大量用 JS 字符串拼 HTML（例如费用明细 `var h='<div ...>'`），
 * 不剥会把字符串里的标签算进计数，产生「标签不平衡」的**假报**（2026-09-12 修复）。
 */
function templateOnly(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '');
}

/** 取出所有**内联** <script> 块（排除带 src 的外链标签） */
function inlineScripts(html) {
  const out = [];
  const re = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) out.push(m[1]);
  return out;
}

function balance(html, tag) {
  const ALL = 'g';
  const open = (html.match(new RegExp('<' + tag + '(?=[\\s>])', ALL)) || []).length;
  const selfClose = (html.match(new RegExp('<' + tag + '(?=[\\s>])[^>]*/>', ALL)) || []).length;
  const close = (html.match(new RegExp('</' + tag + '>', ALL)) || []).length;
  // 自闭标签（<el-table-column ... />）不需要闭合标签，必须从「待闭合」里扣掉
  const ok = open - selfClose === close;
  return { open, close, selfClose, ok };
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
    createApp: (o) => { captured = o; return { use() { return this; }, mount() {}, component() {}, directive() {}, config: {}, provide() {}, mixin() {} }; },
  };
  global.window = global;
  global.document = { addEventListener: noop, querySelector: () => null, querySelectorAll: () => [] };
  global.localStorage = { getItem: () => null, setItem: noop, removeItem: noop };
  global.navigator = { userAgent: 'node' };
  global.alert = noop;
  // 原型通过 CDN 引入的已知全局（页面里用到但非本文件定义）——**只白名单补这几个**，
  // 不做通配 Proxy，否则会掩盖「未定义变量」这类真 bug（工具的核心价值）。
  global.ElementPlusIconsVue = new Proxy({}, { get: () => ({}) });
  global.VueRouter = { createRouter: () => ({ beforeEach: noop }), createWebHashHistory: () => ({}) };
  global.dayjs = () => ({ format: () => '' });
  // 用 IIFE 包住：把顶层 const/let 关进函数作用域。
  // 否则多页面在同一进程里顺序检查时，各页顶层的 `const { createApp } = Vue`
  // 会在**共享的全局上下文**里互相冲突，报出假的「Identifier 'createApp' has already been declared」。
  vm.runInThisContext('(function(){' + script + '\n})();', { filename: 'prototype.js' });
  return captured;
}

function instantiate(opts) {
  const errors = [];
  let dataObj = {};
  if (typeof opts.data !== 'function') {
    // Composition API（setup）页面：无 data/computed/methods 可探，交由调用方跳过
    return { inst: {}, errors, optionsApi: false };
  }
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
  // 优惠已从编辑弹窗拆到**独立优惠弹窗**：附加费页状态在 d.rules，
  // 服务组合页状态在 dform.discountRules / dform.densityRules
  const D = () => (inst.d !== undefined ? inst.d : (inst.dform !== undefined ? inst.dform : null));
  const DR = () => { const d = D() || {}; if (Array.isArray(d.rules)) return d.rules; if (Array.isArray(d.discountRules)) return d.discountRules; return null; };
  const DDen = () => { const d = D() || {}; return Array.isArray(d.densityRules) ? d.densityRules : null; };
  const host = allRules ? (allRules.find(r => ((r._raw || {}).action === 'charge')) || allRules[0]) : null;
  if (host && typeof inst.openDiscount === 'function') {
    P('openDiscount: ' + (host.name || host.code), () => {
      inst.openDiscount(host);
      const bits = [];
      const r = DR(); if (r) bits.push('优惠' + r.length + '条');
      const de = DDen(); if (de) bits.push('泡比' + de.length + '条');
      if (inst.d && inst.d.basePrice !== undefined) bits.push('应收单价=' + (inst.d.basePrice === null ? '-' : inst.d.basePrice));
      bits.push('弹窗=' + (inst.showDiscountDialog ? '已打开' : '未打开'));
      return bits.join(' ');
    });
  }
  if (typeof inst.addDiscountRow === 'function' && DR()) {
    P('addDiscountRow', () => { const b = DR().length; inst.addDiscountRow(); return '优惠 ' + b + '→' + DR().length + ' 条'; });
  }
  if (typeof inst.addDensityRow === 'function' && DDen()) {
    P('addDensityRow', () => { const b = DDen().length; inst.addDensityRow(); return '泡比 ' + b + '→' + DDen().length + ' 条'; });
  }
  if (typeof inst.validateDiscountUniqueness === 'function' && DR()) {
    P('validateDiscountUniqueness', () => { const r = inst.validateDiscountUniqueness(); return (r && r.conflict) ? ('冲突 行' + r.row1 + '/' + r.row2) : '无冲突'; });
  }
  if (typeof inst.checkSpecialWorse === 'function' && DR()) {
    P('checkSpecialWorse', () => { const w = inst.checkSpecialWorse(); return Array.isArray(w) ? ('告警 ' + w.length + ' 条') : 'ok'; });
  }
  if (inst.filteredRules !== undefined) P('filteredRules', () => '共 ' + inst.filteredRules.length + ' 条');
  if (inst.filteredCombos !== undefined) P('filteredCombos', () => '共 ' + inst.filteredCombos.length + ' 条');
  return out;
}

let failed = 0;
for (const file of process.argv.slice(2)) {
  console.log('\n=== ' + path.basename(file) + ' ===');
  const html = fs.readFileSync(file, 'utf8');

  // 1. 标签平衡（只看 HTML 模板，剥掉 script/style/注释，避免 JS 字符串里的标签造成假报）
  const tpl = templateOnly(html);
  for (const tag of TAGS) {
    const b = balance(tpl, tag);
    if (!b.ok) { console.log('  [ERR]  ' + tag + ' 标签不平衡: 开 ' + b.open + '（其中自闭 ' + b.selfClose + '） / 闭 ' + b.close); failed++; }
  }

  // 2. 语法：检查**每一个**内联 <script> 块（原先只取第一个，多块页面会漏检/误检）
  const blocks = inlineScripts(html);
  if (!blocks.length) { console.log('  [ERR]  未找到内联 <script> 块'); failed++; continue; }
  let synErr = false;
  for (let i = 0; i < blocks.length; i++) {
    try { new vm.Script(blocks[i]); }
    catch (e) { console.log('  [ERR]  语法(第 ' + (i + 1) + ' 个 script 块): ' + e.message); failed++; synErr = true; }
  }
  if (synErr) continue;
  console.log('  [OK]   语法检查通过（' + blocks.length + ' 个内联 script 块）');

  // 3. 运行时引用：用**含 createApp 的那个块**（原先固定取第一个，可能取错块）
  const mainIdx = blocks.findIndex((b) => /createApp\s*\(/.test(b));
  if (mainIdx < 0) {
    // 非 Vue 页面（例如纯 CSS/原生 JS 的排版页、打印页），无组件可探 → 跳过而非报错
    console.log('  [SKIP] 运行时引用检查 —— 该页非 Vue 页面（无 createApp）；标签与语法检查已通过');
    continue;
  }
  let opts = null;
  try { opts = bootstrap(blocks[mainIdx]); } catch (e) { console.log('  [ERR]  执行脚本: ' + e.message); failed++; continue; }
  if (!opts) { console.log('  [ERR]  未捕获到 createApp options'); failed++; continue; }
  const { inst, errors, optionsApi } = instantiate(opts);
  if (errors.length) { errors.forEach((e) => console.log('  [ERR]  ' + e)); failed++; }
  else if (optionsApi === false) {
    console.log('  [SKIP] 运行时引用检查 —— 该页使用 **Composition API（setup）**，无 data/computed/methods 可探；标签与语法检查已通过');
    continue;
  } else {
    console.log('  [OK]   运行时引用检查通过（data ' + Object.keys(opts.data.call({})).length + ' 项 / methods ' + Object.keys(opts.methods || {}).length + ' / computed ' + Object.keys(opts.computed || {}).length + '）');
  }

  // 4. 交互探针
  const ps = probes(inst);
  ps.forEach((p) => { console.log('  ' + p); if (p.startsWith('[ERR]')) failed++; });
}

console.log('\n' + (failed === 0 ? '全部通过 ✅' : '存在 ' + failed + ' 项问题 ❌'));
process.exit(failed === 0 ? 0 : 1);
