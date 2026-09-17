# 前端样式规范与代码模板

> 由 `frontend-designer` Skill 引用。生成原型时严格遵循。

## 主题色

```css
:root {
    --el-color-primary: #2DA44E;
    --el-bg-color: #F5F7FA;
    --el-text-color-primary: #303133;
    --el-text-color-regular: #606266;
    --el-border-color: #DCDFE6;
    --el-border-radius-base: 4px;
}
```

## 字体层级

页面标题 `24px` 加粗 | 区块标题 `16px` 加粗 | 正文 `14px` | 辅助 `12px`

## 间距系统（8px 网格）

`4px` 元素内部 | `8px` 相关元素间 | `16px` 区块内部 | `24px` 区块间 | `32px` 页面分区

## 组件尺寸

| 组件 | 高度 | 圆角 |
|------|------|------|
| 按钮 | 32px | 6px |
| 输入框 | 32px | 6px |
| 表格行 | 40px | — |
| 分页 | 32px | 6px |

## PC 端基础样式

```css
body {
    margin: 0; padding: 16px;
    background-color: var(--el-bg-color);
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-size: 14px; color: var(--el-text-color-primary);
}

.content-card {
    background-color: #FFFFFF; border-radius: var(--el-border-radius-base);
    padding: 16px; height: calc(100vh - 32px);
    display: flex; flex-direction: column; box-sizing: border-box;
}

.search-area { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; margin-bottom: 16px; }
.search-item { display: flex; align-items: center; }
.search-item label { margin-right: 8px; color: var(--el-text-color-regular); font-size: 14px; }

.table-container { flex: 1; overflow: hidden; }
.el-table th.el-table__cell { background-color: #FAFAFA; color: #303133; font-weight: 500; }
.wb-row { cursor: pointer; }
.wb-row:hover { background: #f0faf2; }
.pagination-area { margin-top: 16px; display: flex; justify-content: flex-end; }

.btn-search-primary { background-color: #2DA44E !important; border-color: #2DA44E !important; color: #FFFFFF !important; }
.btn-search-reset { background-color: #FFFFFF !important; border-color: #DCDFE6 !important; color: #000000 !important; }

.section-title {
    font-size: 14px; font-weight: bold; color: #303133;
    margin-top: 24px; margin-bottom: 16px; padding-left: 8px;
    border-left: 4px solid #2DA44E;
}
.section-title:first-child { margin-top: 0; }
```

> **运价模块变体**：使用压缩 CSS + `.card` 类（`border-radius:8px; box-shadow:...; padding:20px`）替代 `.content-card`，背景色 `--bg:#F0F2F5`。

## PDA 端基础样式

```css
.pda { width:390px; height:844px; background:var(--bg); border-radius:40px; border:12px solid #2c3e50; box-shadow:0 20px 40px rgba(0,0,0,0.2); overflow:hidden; display:flex; flex-direction:column; position:relative; }
.notch { position:absolute; top:0; left:50%; transform:translateX(-50%); width:150px; height:28px; background:#2c3e50; border-radius:0 0 18px 18px; z-index:10; }
.bar { background:var(--p); color:#fff; padding:44px 12px 10px; display:flex; align-items:center; }
.bar .t { position:absolute; left:50%; transform:translateX(-50%); font-size:16px; font-weight:600; }
```

## PC 端代码模板

### 整体结构

```
el-card.page-card
  └── el-tabs (v-model="activeTab")
       ├── el-tab-pane (name="xxx")  ← 状态Tab，标签带数字角标
       │    ├── .search-area > el-form :inline  ← 搜索区
       │    └── el-table (border)
el-dialog (v-model, width="55%", destroy-on-close) ← 弹窗，不 append-to-body
```

### Tab 状态

```html
<el-tab-pane :label="'待收货 ('+pendingCount+')'" name="pending">
```

### 表格列宽

| 列类型 | 写法 | 说明 |
|--------|------|------|
| 固定窄列 | `width="80"` | 状态/序号 |
| 操作列 | `width="160"` `fixed="right"` | 固定右侧 |
| 常规列 | `min-width="120"` | 不写死 width |
| 长文本 | `min-width="250"` + `show-overflow-tooltip` | 地址/描述 |

### 操作列按钮

```html
<el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
<el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
```

### 状态标签色值

| 业务状态 | `el-tag` type |
|---------|---------------|
| 正常、启用、生效 | `success`（绿） |
| 已冻结、禁用、已取消 | `danger`（红）或 `info`（灰） |
| 预告、待处理 | `warning`（橙） |
| 草稿、待审核 | `info`（灰） |

### 弹窗模板

```html
<el-dialog v-model="dialogVisible" :title="isReadonly ? '查看XX' : '编辑XX'" width="800px" destroy-on-close>
    <div :class="{'is-readonly': isReadonly}">
        <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top">
            <div class="section-title">基本信息</div>
            <el-row :gutter="24">
                <el-col :span="12">
                    <el-form-item label="字段名" prop="field">
                        <el-input v-model="formData.field" placeholder="请输入"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
    <template #footer>
        <el-button @click="dialogVisible = false">{{ isReadonly ? '关闭' : '取消' }}</el-button>
        <el-button v-if="!isReadonly" type="primary" @click="confirmSave">确 定</el-button>
    </template>
</el-dialog>
```

- 表单双列：`el-row :gutter="24"` + `el-col :span="12"`
- 弹窗宽度：简单 600px，复杂 800px

### 冻结数据弹窗只读

```css
.is-readonly { pointer-events: none; opacity: 0.7; }
```

```javascript
const isReadonly = ref(false);
const openDialog = (type, row = null) => {
    if (type === 'edit' && row && row.status !== '正常') {
        isReadonly.value = true;
    } else {
        isReadonly.value = false;
    }
};
```

### 状态切换二次确认

```javascript
const toggleStatus = (row) => {
    const action = row.status === '正常' ? '冻结' : '启用';
    ElMessageBox.confirm(`确定要${action}该XX吗？`, '提示', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning',
    }).then(() => {
        row.status = row.status === '正常' ? '已冻结' : '正常';
        ElMessage.success(`${action}成功`);
    }).catch(() => {});
};
```

### 搜索区模式

- 2-4 字段用 `.search-area` flex 流式；5+ 字段用 `el-card` 包裹 `el-form :inline`
- 搜索字段描述写在 `placeholder` 内，不外部放 label
- 不同 Tab 搜索条件独立（各自 `reactive` 对象）

### 多 Tab 页面查询区规范 ★（统一标准，参考 `收货地址管理_主列表.html`）

**位置：查询区永远在 Tab 上方，不放进 `el-tab-pane` 内。**

两种等价写法，按页面是否需要表格撑满高度选择：

- **两层卡片（推荐，表格需撑满可视高度时）**：上层 `height: auto; margin-bottom: 16px;` 放查询区，下层 `height: calc(100vh - 106px);` 放 Tab + 表格（参考 `收货地址管理_主列表.html`）
- **同一卡片内**：查询行直接写在 `<el-tabs>` 之前（参考 `财务_账单管理.html`：查询条件 + 查询/重置/导出在左，页面级主操作按钮 `margin-left: auto` 在右）

```html
<!-- 两层卡片写法 -->
<div class="content-card" style="height: auto; margin-bottom: 16px;">
    <div class="search-area">
        <template v-if="mainTab === 'a'"> …Tab A 条件 + 查询/重置 </template>
        <template v-else-if="mainTab === 'b'"> …Tab B 条件 + 查询/重置 </template>
    </div>
</div>
<div class="content-card" style="height: calc(100vh - 106px);">
    <el-tabs v-model="mainTab"> … </el-tabs>
</div>
```

- 条件按当前 Tab 用 `v-if` / `v-else-if` 分组切换（**不同 Tab 用各自的 `reactive` 对象**，互不清空）
- 当前 Tab **没有任何查询条件时，整个查询区不渲染**（`v-if` 包住外层卡片）
- Tab 内的「新增/生成/代充」等**操作按钮**与说明文字留在 Tab 内（它们不是查询条件）；**「查询/重置/导出」按钮随查询区放在上方**
- 只有**单 Tab（无 `el-tabs`）**页面，查询区才直接放在内容卡片顶部

### 查询条件数量与「更多」收起规范 ★

- **≤ 3 个条件**：全部平铺展示，不出现「更多」
- **> 3 个条件**：默认只显示**前 3 个**，其余收进「更多」；点击「更多」展开（图标切 `ArrowUp`），再点收起（`ArrowDown`）
- 收起状态默认收起（`searchExpanded = false`）
- 按钮组（查询 / 重置 / 导出 / 更多）**必须与条件同一行不换行**：条件区 `flex: 1`，按钮组 `flex-shrink: 0`
  - **★ 条件控件必须用「弹性宽度」，否则窄屏会折成「一行一个」**：控件统一给
    ```css
    .search-control { width: 240px; flex: 1 1 150px; min-width: 140px; max-width: 240px; }
    ```
    —— **空间够时是 240px（宽度统一）**；**空间不够时等比收窄到 140px**（仍在一行、仍然等宽），而不是整块折行。**只写 `width:240px` + 容器 `flex:1` 是不够的**：那样窄屏会让每个控件吃到 240px 的 flex-basis，条件会被折成「一行一个」，比按钮错行更难看。
  - **例外 · 日期区间**（daterange 要同时显示两个日期，不允许压窄）：`.search-area .el-date-editor--daterange { flex: 0 0 240px; min-width: 240px; max-width: 240px; width: 240px !important; }`，挤不下时由它自己把整行顶下去。
  - **真实可用宽度要按「页面在 index 的 iframe 里」算**：`index.html` **侧边栏固定 240px**、页面 body + 卡片 padding 共 64px →
    ```
    查询区可用宽 = window.innerWidth − 240（侧边栏） − 64（padding）
    1366 笔记本 → ≈ 1022px      1280 → ≈ 936px      1920 → ≈ 1576px
    ```
    **自检必须按这个宽度测**（别在浏览器直接打开 `财务_*.html` 量 —— 那样少了 240px 的侧边栏，会量出偏宽的假结果）。
  - **写操作按钮（生成 / 新增 / 代充 / 导入）不进查询按钮组**：它们不是查询动作，按 §多 Tab 页面查询区规范「操作按钮留在 Tab 内」。**查询区只留 查询 / 重置 / 更多 / 导出**。
  - **★ 位置只有两种，取决于这个按钮管几个 Tab**：
    | 按钮的归属 | 放哪 | 例 |
    |:---|:---|:---|
    | **只管某一个 Tab 的内容** | **放进该 `el-tab-pane` 内部**（Tab 下方、表格上方、独立一行右对齐） | 账单管理的「生成账单」只服务「草稿池」→ 放草稿池 pane 内 |
    | **管整页多个 Tab** | 表格卡片内、Tab **上方**、独立一行右对齐（卡片高度 `−40px` 抵掉这行） | 运单审计的「审计 / 反审计 / 费用管理」 |
    ```css
    .bill-toolbar { display: flex; justify-content: flex-end; margin-bottom: 8px; }
    ```
  - **★ 三个坑（都实测踩过）**：
    ① **不能塞进「Tab 行」**：`.tab-row`（`el-tabs` 与按钮同一 flex 行）会让 `el-tabs` 只拿到「卡片宽 − 按钮宽 − 间距」，**表格被切窄 118px、列表铺不满卡片**，按钮还吊在最右；
    ② **不能只做「条件隐藏」而不换位置**：把按钮 `v-if` 掉、行还留在 Tab 上方的话，切 Tab 时 **Tab 行会上下跳 40px**；放进所属 pane 内部则 Tab 行位置恒定（实测 5 个 Tab 的 `el-tabs__header` y 恒为 128）；
    ③ **记得把卡片高度补回去**：放在 Tab 上方时 `calc(100vh - 128px)` → `- 168px`，给这 40px 的工具栏腾位置，**表格可用高度才不变**。
  - **自检（表格铺满 + 不跳动）**：逐个 Tab 量 ① `卡片内容右边界 − Tab 右边界`、`− 表格右边界`、`− 操作按钮右边界` **三个差值都必须为 0**；② 切 Tab 时 `el-tabs__header` 的 y **不得变化**；③ 操作按钮**只在它所属的 Tab 可见**（其它 Tab 量到 `display:none`）。
  - 结构（统一样式，别各页各写内联）：
    - 外层 `.search-area`：`display: flex; gap: 16px; align-items: flex-start; flex-wrap: nowrap;`
    - 条件区 `.search-conditions`：`display: flex; flex-wrap: wrap; gap: 16px; align-items: center; flex: 1 1 auto; min-width: 0;`（折行只发生在「更多」展开、条件变多时）
    - 按钮组 `.search-actions`：`display: flex; align-items: center; gap: 8px; flex-shrink: 0; flex-wrap: nowrap; white-space: nowrap;`
    - 查询区里非条件的右侧内容（如账龄台账的口径说明）保留 `margin-left: auto`，可让它单独折到第二行
  - **自检**：在 index 里打开、窗口拉到 **1366**（查询区 ≈1022px），要求 ① 按钮组与第一行条件同排；② 默认 3 个条件**全部在第一行**且**等宽**；③ 点开「更多」后按钮仍在第一行，条件在其下方折行；④ 页面不出现横向滚动。

```html
<div class="search-area">
    <div class="search-conditions">
        <!-- 前 3 个条件 -->
        <el-input …></el-input>
        <el-select …></el-select>
        <el-input …></el-input>
        <template v-if="searchExpanded"><!-- 第 4 个及以后 --></template>
    </div>
    <div class="search-actions">
        <el-button class="btn-search-primary" @click="handleSearch">…查询</el-button>
        <el-button class="btn-search-reset" @click="resetSearch">…重置</el-button>
        <el-button v-if="hasMoreCondition" @click="searchExpanded = !searchExpanded">
            <el-icon style="margin-right: 4px;"><component :is="searchExpanded ? 'ArrowUp' : 'ArrowDown'" /></el-icon>{{ searchExpanded ? '收起' : '更多' }}
        </el-button>
        <el-button @click="handleExport">…导出</el-button>
    </div>
</div>
```

### ★ 模板里禁止「与 HTML 元素同名」的自闭合组件标签（2026-09-15 血案立规）

原型是**浏览器内联模板**：HTML 解析器**先于 Vue** 工作，它不认识 Vue 组件。所以 `<Select />` 会被当成**真实的 `<select>` 元素**，
而 `select / table / tr / td / textarea / title / style / script / li / p / a …` 会让解析器进入**特殊插入模式**，
**把它后面的全部内容直接丢掉**。

- **实际症状**（2026-09-15 踩过）：在「已发送」Tab 的按钮里写了 `<Select />` → **该 Tab 及之后的所有内容（表格数据、后续 Tab、所有弹窗抽屉）全部消失**，控制台还伴随 `Failed to resolve component: arrowdown/arrowup` 之类的**误导性告警**（真因是文档结构被解析器吃坏了，不是组件没注册）。
- **规则**：
  1. **不要用与 HTML 元素同名的图标**。Element Plus 图标里踩雷的名字：`Select`(→select)、`Link`(→link)、`Menu`、`Map`、`Picture`、`Search`(→search)、`Video`、`Time`、`Data`、`Slot`…
  2. **与 HTML 元素同名的组件一律用「显式闭合标签」**：`<Select></Select>`，**绝不写 `<Select />`**。
  3. 其余自闭合组件（`<Plus />`、`<Check />`）只在自己是父元素**最后一个子节点**时才安全（写在中间会把后面的兄弟吞成自己的子节点）。**统一建议：图标一律写 `<X></X>`。**
- **自检**：`node 0-产品经理使用IDE/.agent/scripts/check-prototype.js <页面.html>` —— 该脚本已内置这条检测：
  - 与「特殊插入模式元素」同名 → **ERR（必须修）**；
  - 与其他 HTML 元素同名 → **WARN（建议改成显式闭合）**。

### 列表页标准按钮顺序

查询 → 重置 → 更多（有则）→ 导出（有则）→ 右侧主操作按钮（新增/生成等，`margin-left: auto`）

### 导出入口（2026-09-16 改写）

**「导出」按钮放哪里 = 看它的导出对象是不是当前列表**，两个位置二选一，**不许同一动作两处入口**：

| 情况 | 放哪 | 先例 |
|:---|:---|:---|
| 导出对象 = **当前 Tab 的列表**（只对某一个 Tab 成立） | **该 Tab 内部的工具栏**，与其它 Tab 级动作同排（**次要动作靠左、主操作靠右**） | `财务_账单管理.html`：「已发送」Tab 工具栏 `导出 → 批量核销` |
| 导出对象 = **整页数据**（所有 Tab 通用） | 查询区按钮组（查询 → 重置 → 更多 → 导出） | 其余财务列表页（占位） |

**为什么不能"两边都放"**：查询区是**多 Tab 共用**的，在一个多 Tab 页面把只对某个 Tab 成立的按钮放进去，等于在其它 Tab 上摆一个点了没意义的假入口（账单管理有 5 个 Tab，其中草稿池是流水、待发送尚未形成对客承诺、已作废不该交付、核销记录是另一张表）。

**导出动作本身的长流程（异步任务）**：导出量大时不要在页面直出 —— 走「提交任务 → **后台任务**页看进度 → 下载结果文件」（先例：账单导出，见财务 PRD R71 / 后台任务 PRD §5.2）：① 页面只负责提交 + 给一句"到哪看"的 Toast，**不阻塞、不跳转**；② 结果文件在后台任务**一个下载入口**，不在业务列表里堆 N 个下载按钮。

**仍属占位的情况**：尚未定范围的老按钮保留「导出」但点击提示「导出功能开发中，导出范围待确认」（参考先例：`财务_财务流水.html` 的「支付供应商」空态 Tab `el-empty`）。

**列表勾选前置（2026-09-16 补）**：当产品要求「导出不能点一下就把全量导出去」时 —— 给列表加**最左勾选列（46px）**、表头可全选**当前页**，按钮准入 = **已勾选 ≥ 1**，置灰时**必须有悬浮 tooltip 说明原因**，**按钮文案不带张数**（恒为「导出」—— 勾了几张由列表勾选态体现，不在按钮上重复）。**勾选仅对当前列表有效**：翻页 / 切 Tab / 改查询条件后**已不在结果里的行不计入**（提交前取交集），从而回避「全选 = 全选本页还是全选结果」的歧义。
> 判据仍是「能不能一键撤回」：**只读动作**（导出）可以用勾选这种最省事的交互；**写动作**（核销 / 作废 / 发送）按 §危险操作（写操作）的默认值规范，范围必须由人主动锁定。同页同时存在两类动作时的先例：`财务_账单管理.html`「已发送」Tab —— 导出走**列表勾选**，批量核销走**从钱包进**。

## ★ 危险操作（写操作）的默认值规范（2026-09-15 立规）

> 起因：「批量核销」弹窗一打开就**预选好列表第一本钱包 + 默认全选它的全部账单** —— 手快点两下就执行了一笔**没人明确决定过**的扣款。

**判断标准：这个动作能不能一键撤回？**

| 动作性质 | 默认值规则 |
|:---|:---|
| **可撤回 / 只读**（查询、筛选、切 Tab、导出） | 给**最省事的默认**（预填、预选、全选都行），目标是少点几下 |
| **不可撤回 / 会改钱、改状态、发出去**（核销、作废、发送、反核销） | **范围必须由人主动选定** —— 系统不预选「要动哪一条」；对象只能来自**用户自己的输入**（他点的那一行 / 他填的那个条件），**不许取"列表第一个"** |

**具体做法**

1. **不预选对象**：弹窗打开即空态（占位符 + 空态引导 + 主按钮置灰），掐掉「默认值 → 直接点确认」这条最短路径
2. **空态不空**：空态里写清**本次可操作范围**（`4 本钱包 · 6 张可核销账单`）和「要先做什么」，别只放一句"请选择"
3. **上级改动 → 无条件清空所有下级**：即使下级只剩一个选项也**不代填** —— 用户会把它读成"条件没清空"（换客户后主体 / 币种还是老样子，因为两家的值恰好同名），比多点一下更糟；**"唯一候选"不构成代填的理由**
4. **主按钮带后果**：把**金额 / 数量**写进确认按钮文案（`确认批量核销 ¥800.00`），手指落在按钮上就看到钱数
5. **置灰必有原因**：按钮禁用时给 tooltip 说明为什么（`请先锁定一本钱包 —— 批量核销不预选钱包`），不许"点不动且不说为什么"
6. **不记忆上次选择**：上次选的那本同样是任意默认值 → 每次打开都回到空态
7. **候选范围按「有业务事实」反推，不按主数据状态过滤**：如批量核销的候选客户 / 钱包**从"有可核销账单"的账单反推**，**不看客户启用状态** —— 客户被禁用、合同过期解约，钱还是得收；按"启用中的客户"过滤会让存量欠款直接收不回来
8. **长下拉要能按标识搜**：客户这类主数据，财务手上拿到的可能是**名称 / 昵称 / 编号**任一 → `filterable` + `filter-method` 三字段模糊匹配，下拉项右侧灰字补 `{昵称} · {编号}` 便于核对

---

## PDA 端代码模板

### 页面导航

```javascript
const v = ref('login');
const navStack = ref([]);
function goTo(page) { navStack.value.push(v.value); v.value = page; }
function goBack() { if (navStack.value.length > 0) { v.value = navStack.value.pop(); } }
```

### 头部栏

```html
<div class="bar">
    <div class="l">
        <div v-if="navStack.length>0" class="back" @click="goBack"><span>‹</span></div>
    </div>
    <div class="t">{{ pageTitle }}</div>
    <div class="r">
        <div class="bar-user" @click="showSwitcher=!showSwitcher">
            <span class="bar-av">李</span><span>{{ userCenterShort }}</span><span>▼</span>
        </div>
    </div>
</div>
```

### 操作页模式

- 表单式，非相机式。输入框 + [扫] 按钮，扫码自动填充
- 操作留页：完成后清空表单留在当前页
- 连续快速：连续扫码自动累计

---

## ★ 原型图标写法（2026-09-16 立规 · 全仓踩过 3 类坑）

> **前提**：原型是**浏览器内联模板** —— HTML 解析器**先于 Vue** 工作：标签名会被**小写化**、自闭合会被**忽略**、非法标签名会被**降级成纯文本**。所以"图标标签怎么写"不是风格问题，是**能不能显示**的问题。

**四条硬规则**

| # | 规则 | 写错会怎样（真实症状） |
|:--:|:---|:---|
| 1 | **一律 kebab-case + 显式闭合**：`<zoom-in></zoom-in>`、`<refresh-right></refresh-right>` | 写成 PascalCase 多词名（`<RefreshRight />`）→ 解析器小写化成 `refreshright` → Vue 按 camelize / capitalize 找不到 `RefreshRight` 组件 → **图标静默丢失**（控制台只留一条 resolve 警告） |
| 2 | **禁止自闭合图标标签** | `<Select />` → 原生 `<select>` 元素，进入**特殊插入模式、吞掉后续全部内容**（本仓库真踩过：某个 Tab 的数据整块消失）；`<Link />` / `<Picture />` / `<Search />` 同理（轻则丢图标，重则吞内容） |
| 3 | **禁止数字 / 占位标签**：不许出现 `<1122></1122>` 这类标签 | 以数字开头的标签名是**非法 HTML**，解析器把 `<` 降级为纯文本、把 `</1122>` 当注释 → **按钮上直接显示 `<1122>` 这几个字符**（2026-09-16 全仓扫出 **38 处**，均为早期批量脚本替换自闭合标签时留下的占位符） |
| 4 | **避开与 HTML / SVG 元素同名的图标** | `Search`（原生 `<search>`）、`Filter` / `View`（SVG）、`Link` / `Picture` / `Select` / `Menu` / `Summary` —— 撞名后要么被当原生元素、要么触发规则 1~2 的连锁问题 |

**★ `el-checkbox` 的取值坑（2026-09-16 立规 · 已踩）**：本仓 CDN 版 Element Plus 的 `el-checkbox` **以 `label` 为值** —— `<el-checkbox label="应收" value="ar">` 勾选后 `v-model` 拿到的是 **`"应收"`**（`value="ar"` 不生效）。因此：① 判断方向 / 类型时**必须归一化**（中文标签与英文码都认），不要只判英文码，否则会**走错分支**（本仓真踩过：勾「应收」却把「应付」审掉了）；② 需要"默认选中某项"时，`v-model` 里要写**中文标签**（写 `"ar"` 看不出选中态）。

**查询区图标的固定搭配**（本仓约定）

| 按钮 | 图标写法 |
|:---|:---|
| 查询 / 搜索 | `<el-icon style="margin-right: 4px;"><zoom-in></zoom-in></el-icon>查询` |
| 重置 | `<el-icon style="margin-right: 4px;"><refresh-right></refresh-right></el-icon>重置` |
| 更多查询条件 | `<arrow-down></arrow-down>` / `<arrow-up></arrow-up>` |
| 导出 | `<download></download>` |

> **为什么查询不用 `Search`**：原生 `<search>` 元素与它撞名，而放大镜语义最接近的**不撞名**图标就是 `ZoomIn`（放大镜带 +）。
> **自查**：改完跑 `node .agent/scripts/check-prototype.js <页面.html>` —— 它的「HTML 元素同名冲突检查」现在抓**规则 2 与规则 4**：① PascalCase **自闭合**撞原生（`<Select />` / `<Picture v-if="…" />`，会吞内容或丢图标）；② PascalCase **显式闭合**但撞原生元素名（`<Picture></Picture>` —— 不吞内容，但 Vue 把它当普通元素、**组件静默不渲染**）。**规则 1 / 3 它抓不到**，需人工扫 PascalCase 多词名与 `<数字>` 占位标签
>
> **另跑一条**：`node .agent/scripts/check-setup-refs.js <页面.html>` —— 交叉校验**模板用到的标识符 vs `setup()` 返回的键**，专抓「`@click` 绑的函数没写进 return / `v-model` 绑的 ref 没导出」这类**静默失效**（症状：按钮点了没反应、整块区域不渲染，而语法检查与作用域检查**都过**）。本仓已踩过 4 次：`sendCustomerOptions`、`voidGuard`、`openBatchSend`（账单管理）、`handleTypeChange`（港口管理）、`doSearch` / `doReset`（货主端运单）。**注意**：`setup` 里用 `...spread` 返回的页面会 `[SKIP]`（静态判不了），这类页面仍需点一遍关键按钮（数字占位符）两种写法。
