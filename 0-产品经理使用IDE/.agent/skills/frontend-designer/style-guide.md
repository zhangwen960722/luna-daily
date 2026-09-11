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
- 按钮组（查询 / 重置 / 导出 / 更多）**必须与条件同一行不换行**：条件区 `flex: 1; flex-wrap: wrap`，按钮组 `flex-shrink: 0`

```html
<div class="search-area" style="flex-wrap: nowrap;">
    <div style="display: flex; flex-wrap: wrap; gap: 16px; flex: 1;">
        <!-- 前 3 个条件 -->
        <el-input …></el-input>
        <el-select …></el-select>
        <el-input …></el-input>
        <template v-if="searchExpanded"><!-- 第 4 个及以后 --></template>
    </div>
    <div style="display: flex; gap: 16px; flex-shrink: 0;">
        <el-button class="btn-search-primary" @click="handleSearch">…查询</el-button>
        <el-button class="btn-search-reset" @click="resetSearch">…重置</el-button>
        <el-button v-if="hasMoreCondition" @click="searchExpanded = !searchExpanded">
            <el-icon style="margin-right: 4px;"><component :is="searchExpanded ? 'ArrowUp' : 'ArrowDown'" /></el-icon>{{ searchExpanded ? '收起' : '更多' }}
        </el-button>
        <el-button @click="handleExport">…导出</el-button>
    </div>
</div>
```

### 列表页标准按钮顺序

查询 → 重置 → 更多（有则）→ 导出（有则）→ 右侧主操作按钮（新增/生成等，`margin-left: auto`）

### 导出入口（Phase 1 占位）

- 财务等模块的导出能力**需求已登记但一期不实现**：列表页统一保留「导出」按钮，点击提示「导出功能开发中，导出范围待确认」，不写真实导出逻辑
- 参考先例：`财务_财务流水.html` 的「支付供应商」空态 Tab（`el-empty`）同为占位做法

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
