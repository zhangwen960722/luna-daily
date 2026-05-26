# 前端 Demo 样式规范 — LUNA

> **版本**：V1.0  
> **适用范围**：飞点跨境供应链 TMS 系统 — 员工端所有前端 Demo  
> **最后更新**：2026-05-26  
> **基于**：`1-demo/产品原型/员工端-demo/` 下 34 个 HTML 原型提炼

---

## 1. 技术栈

| 层级 | 选型 | 引入方式 |
|------|------|---------|
| 框架 | Vue 3 | CDN `unpkg.com/vue@3/dist/vue.global.js` |
| 组件库 | Element Plus | CDN `unpkg.com/element-plus` |
| 图标 | @element-plus/icons-vue | CDN |
| 图表 | ECharts 5 | CDN（仅首页 Dashboard 使用） |

```html
<!-- 标准头部引用 -->
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css" />
<script src="https://unpkg.com/element-plus"></script>
<script src="https://unpkg.com/@element-plus/icons-vue"></script>
```

---

## 2. 主题色系

### 2.1 主色（绿色系）

LUNA 使用 **绿色** 作为品牌主色，区别于传统 ERP 的蓝色/紫色。

| Token | 色值 | 用途 |
|-------|------|------|
| `--el-color-primary` | `#2DA44E` | 主按钮、链接、选中态、Tab 激活下划线 |
| `--el-color-primary-light-3` | `#6bc083` / `#2C974B` | 浅色变体 |
| `--el-color-primary-light-5` | `#95cfa4` | |
| `--el-color-primary-light-7` | `#bee5c6` | |
| `--el-color-primary-light-9` | `#e9f7ea` | 极浅背景 |
| `--el-color-primary-dark-2` | `#24833e` | 深色悬停 |

### 2.2 CSS 变量定义

```css
:root {
    --el-color-primary: #2DA44E;
    --el-color-primary-light-3: #2C974B;
    --el-color-danger: #F53F3F;
    --el-border-color: #DCDFE6;
    --el-bg-color: #F5F7FA;
    --el-text-color-primary: #303133;
    --el-text-color-regular: #606266;
    --el-border-radius-base: 4px;
}
```

### 2.3 状态色

| 状态 | 色值 | 用途 |
|------|------|------|
| 成功 | `#67C23A` | 成功标签、正向趋势 |
| 危险/错误 | `#F56C6C` / `#F53F3F` | 删除按钮、异常标签、负向趋势 |
| 警告 | `#E6A23C` | 警告提示 |
| 信息 | `#909399` | 辅助信息、次要文字 |

### 2.4 中性色

| Token | 色值 | 用途 |
|-------|------|------|
| 页面背景 | `#F5F7FA` / `#f0f2f5` | body 背景 |
| 卡片背景 | `#FFFFFF` | 内容卡片 |
| 主文字 | `#303133` | 标题、正文 |
| 常规文字 | `#606266` | 表单标签、表格文字 |
| 辅助文字 | `#909399` | 提示、占位符 |
| 边框 | `#DCDFE6` | 表格边框、卡片边框 |
| 浅灰背景 | `#FAFAFA` | 表格表头、弹窗标题栏 |

---

## 3. 字体排版

### 3.1 字体族

```css
font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", 
             "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
```

### 3.2 字号层级

| 层级 | 字号 | 粗细 | 用途 |
|------|------|------|------|
| 页面标题 | `20px` | `bold` | 页面主标题 |
| 弹窗标题 | `18px` | `600` | Dialog 标题 |
| 模块标题 | `16px` | `500` / `bold` | 卡片标题、表格标题 |
| 区块标题 | `15px` | `bold` | section-title |
| 正文 | `14px` | `normal` | 表格、表单、文字 |
| 辅助文字 | `12px` | `normal` | 趋势文字、备注 |

### 3.3 圆角

| 元素 | 圆角值 |
|------|--------|
| 卡片、表格、输入框 | `4px` |
| 表单模块卡片 | `6px` |
| 菜单项 | `8px` |

---

## 4. 布局系统

### 4.1 整体框架

```
┌──────────────────────────────────────────────┐
│ 侧边栏 (#304156)  │  顶部标签栏 + 工具栏       │
│   Logo           │───────────────────────────│
│   菜单项          │  内容区 (padding: 16px)    │
│                  │  ┌─────────────────────┐  │
│                  │  │  搜索筛选区          │  │
│                  │  ├─────────────────────┤  │
│                  │  │  操作按钮栏          │  │
│                  │  ├─────────────────────┤  │
│                  │  │  数据表格            │  │
│                  │  ├─────────────────────┤  │
│                  │  │  分页               │  │
│                  │  └─────────────────────┘  │
└──────────────────────────────────────────────┘
```

### 4.2 侧边栏

```css
/* 侧边栏 */
.el-aside {
    background-color: #304156;
    color: #fff;
    box-shadow: 2px 0 6px rgba(0,21,41,.35);
}

/* Logo 区域 */
.sidebar-logo-container {
    height: 60px;
    background-color: #2b3643;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
}

/* 折叠按钮 */
.sidebar-toggle-container {
    height: 40px;
    background-color: #2b3643;
    color: #bfcbd9;
    border-top: 1px solid #1f2d3d;
}
```

### 4.3 内容卡片

```css
.content-card {
    background-color: #FFFFFF;
    border-radius: 4px;
    padding: 16px;           /* 列表页 */
    /* padding: 24px; */     /* 表单页 */
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    box-sizing: border-box;
}
```

### 4.4 搜索区域

```css
.search-area {
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
}

.search-item {
    display: flex;
    align-items: center;
}
.search-item label {
    margin-right: 8px;
    color: #606266;
    font-size: 14px;
}
```

---

## 5. 页面类型模板

### 5.1 主列表页 (Main List)

**结构**：搜索卡片 → Tab 页签 → 表格卡片（操作栏 + 表格 + 分页）

```html
<div id="app">
    <!-- 搜索区域卡片 -->
    <div class="content-card" style="height: auto; margin-bottom: 16px;">
        <div class="search-area">
            <el-input v-model="searchForm.keyword" placeholder="关键词" clearable style="width: 200px;" />
            <el-select v-model="searchForm.type" placeholder="类型" clearable style="width: 200px;" />
            <el-button class="btn-search-primary" @click="handleSearch">
                <el-icon><Search /></el-icon>查询
            </el-button>
            <el-button class="btn-search-reset" @click="resetSearch">
                <el-icon><RefreshRight /></el-icon>重置
            </el-button>
            <el-button type="success" style="margin-left: auto;" @click="handleAdd">新增</el-button>
        </div>
    </div>

    <!-- 表格卡片 -->
    <div class="content-card" style="flex: 1;">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="Tab1" name="tab1" />
        </el-tabs>
        <el-table :data="tableData" border height="100%">
            <!-- columns -->
        </el-table>
        <el-pagination background layout="total, prev, pager, next" :total="total" />
    </div>
</div>
```

### 5.2 表单页 (Form — 新增/编辑)

**结构**：弹窗容器 → 标题栏 → 表单区（分模块卡片）→ 底部操作栏

```html
<div class="demo-container">
    <!-- 标题栏 -->
    <div class="dialog-header">
        <span class="dialog-title">{{ pageTitle }}</span>
    </div>

    <!-- 表单区 -->
    <div class="dialog-body">
        <el-form label-position="top" :model="formData" :rules="rules">
            <!-- 模块标题 -->
            <div class="section-title">模块名称</div>
            <el-row :gutter="24">
                <el-col :span="8"> ... </el-col>
            </el-row>
        </el-form>
    </div>

    <!-- 底部操作栏 -->
    <div class="footer-actions">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
        <el-button type="success" @click="handleSaveAndMore">保存并生成组合</el-button>
    </div>
</div>
```

**关键 CSS**：

```css
.demo-container {
    width: 1000px;                  /* 固定宽度，居中 */
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.08);
}

.dialog-header {
    padding: 16px 24px;
    border-bottom: 1px solid #DCDFE6;
}

.section-title {
    font-size: 15px;
    font-weight: bold;
    margin: 24px 0 16px;
    padding-left: 8px;
    border-left: 4px solid #2DA44E;
}

.footer-actions {
    padding: 12px 24px;
    border-top: 1px solid #DCDFE6;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}
```

### 5.3 详情页 (Detail / 档案)

**结构**：弹窗容器 → 标题栏 → 内容区（模块化卡片 + 分区标题）→ 底部操作栏

```html
<div class="demo-container">
    <div class="dialog-title">
        <span>标题</span>
        <el-button text @click="close">X</el-button>
    </div>
    <div class="form-content">
        <div class="form-card">
            <div class="section-title">模块一</div>
            <el-descriptions :column="3" border />
        </div>
    </div>
    <div class="form-actions">
        <el-button @click="close">关闭</el-button>
    </div>
</div>
```

**表单模块卡片**：

```css
.form-card {
    background-color: #fff;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}
.form-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    border-color: #dcdfe6;
}
```

### 5.4 弹窗配置 (Dialog Config)

用于在列表页内嵌的配置弹窗（如运输服务 → 配置时效）。

```html
<el-dialog v-model="dialogVisible" :title="'配置时效 - ' + currentName" width="800px">
    <el-tabs v-model="activeTab">
        <el-tab-pane label="Tab1" name="tab1">
            <!-- 表单或内嵌表格 -->
        </el-tab-pane>
        <el-tab-pane label="Tab2" name="tab2" :disabled="condition">
            <!-- 条件禁用的 Tab -->
        </el-tab-pane>
    </el-tabs>
    <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
    </template>
</el-dialog>
```

---

## 6. 组件样式规范

### 6.1 按钮

| 类型 | 类名 / 用法 | 样式 |
|------|------------|------|
| 主按钮 | `type="primary"` | 绿底白字 `#2DA44E` |
| 成功按钮 | `type="success"` | 绿底白字 |
| 搜索按钮 | `.btn-search-primary` | 绿底白字 `#2DA44E !important`，高 32px |
| 重置按钮 | `.btn-search-reset` | 白底黑字，边框 `#DCDFE6`，高 32px |
| 文字按钮 | `link type="primary"` | 无边框，用于表格操作列 |
| 危险文字按钮 | `link type="danger"` | 红色文字，用于冻结/删除 |

```css
.btn-search-primary {
    background-color: #2DA44E !important;
    border-color: #2DA44E !important;
    color: #FFFFFF !important;
}
.btn-search-reset {
    background-color: #FFFFFF !important;
    border-color: #DCDFE6 !important;
    color: #000000 !important;
}
```

### 6.2 表格

```css
/* 表头 */
.el-table th.el-table__cell {
    background-color: #FAFAFA;
    color: #303133;
    font-weight: 500;
}
```

| 属性 | 值 |
|------|-----|
| border | `true` |
| height | `100%`（填满容器） |
| 操作列宽度 | `120-180px`，fixed="right" |
| 空状态 | 默认 |

### 6.3 状态标签 (Tag)

| 场景 | type | effect |
|------|------|--------|
| 正常/启用 | `success` | `plain` （浅绿底） |
| 已冻结/禁用 | `danger` | `plain` （浅红底） |
| 标准信息标签 | `primary` | `light` |

```html
<el-tag :type="row.status === '正常' ? 'success' : 'danger'" effect="plain">
    {{ row.status }}
</el-tag>
```

### 6.4 表单

- **label-position**：新增/编辑页用 `"top"`（标签在输入框上方）；搜索筛选区用默认（左侧）
- **require-asterisk-position**：`"left"`（红色星号在标签左侧）
- **输入框/选择框宽度**：`width: 100%`（表单内）；`style="width: 200px"`（搜索区）
- **多选下拉**：`collapse-tags` 折叠标签

### 6.5 分页

```html
<el-pagination background layout="total, prev, pager, next" :total="total" />
```

分页区域靠右：
```css
.pagination-area {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
}
```

---

## 7. 弹窗规范

### 7.1 新增/编辑弹窗

```html
<el-dialog v-model="visible" :title="title" width="400px" destroy-on-close>
    <el-form :model="form" label-width="100px">
        <!-- form items -->
    </el-form>
    <template #footer>
        <el-button @click="visible = false">返回</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
    </template>
</el-dialog>
```

### 7.2 确认弹窗

```html
ElMessageBox.confirm('确定要执行此操作吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    dangerouslyUseHTMLString: true   // 如需在消息中嵌入 HTML
})
```

### 7.3 消息提示

```javascript
ElMessage.success('操作成功');
ElMessage.warning('请检查必填项');
ElMessage.error('操作失败');
```

---

## 8. 图标使用

### 8.1 注册方式

```javascript
// 全局注册所有图标（推荐）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
```

### 8.2 常用图标

| 图标 | 组件名 | 场景 |
|------|--------|------|
| 搜索 | `<Search />` | 查询按钮 |
| 重置 | `<RefreshRight />` | 重置按钮 |
| 关闭 | `<Close />` | 弹窗关闭 |
| 警告 | `<WarningFilled />` | 提示信息 |

---

## 9. 图表规范（首页 Dashboard）

### 9.1 ECharts 容器

```css
.chart-container {
    height: 350px;
    width: 100%;
    background: #fff;
}
```

### 9.2 统计卡片

```css
.stat-card { border: none; }
.stat-title { font-size: 14px; color: #909399; }
.stat-value { font-size: 28px; font-weight: bold; color: #303133; }
.stat-trend { font-size: 12px; border-top: 1px solid #EBEEF5; padding-top: 10px; }
.trend-up { color: #67C23A; font-weight: bold; }
.trend-down { color: #F56C6C; font-weight: bold; }
```

---

## 10. 响应式与间距

### 10.1 栅格

```html
<el-row :gutter="24">
    <el-col :span="8">  <!-- 三列 --> </el-col>
    <el-col :span="12"> <!-- 两列 --> </el-col>
    <el-col :span="24"> <!-- 单列 --> </el-col>
</el-row>
```

### 10.2 通用间距

| 场景 | 值 |
|------|-----|
| 页面 padding | `16px` / `20px` |
| 卡片 padding | `16px`（列表）/ `24px`（表单） |
| 卡片间距 | `16px` / `20px` |
| 搜索区 gap | `16px` |
| 表单行间距 | 由 `el-row :gutter` 控制 |
| 模块标题 margin | `24px 0 16px` |

---

## 11. 数据模拟规范

### 11.1 Mock 数据

```javascript
// 使用 Vue 3 Composition API
const { createApp, ref, reactive, computed } = Vue;
const { ElMessage, ElMessageBox } = ElementPlus;

const tableData = ref([
    { id: 1, name: '示例', status: '正常' },
]);
```

### 11.2 页面间数据传递

```javascript
// 写入
sessionStorage.setItem('key', JSON.stringify(data));
// 读取
const data = JSON.parse(sessionStorage.getItem('key') || '{}');
```

---

## 12. 命名约定

| 元素 | 命名规则 | 示例 |
|------|---------|------|
| CSS 类名 | kebab-case | `.content-card`, `.search-area`, `.section-title` |
| Vue data | camelCase | `tableData`, `dialogVisible`, `activeTab` |
| Vue methods | camelCase | `handleSearch`, `resetSearch`, `handleAdd` |
| 文件命名 | 中文\_页面类型 | `仓库列表_主列表.html`, `干线运输服务新增.html` |

---

## 13. 代码检查清单

生成前端 Demo 前，确认：

- [ ] 引用 Vue 3 + Element Plus CDN
- [ ] `:root` 中设置了 `--el-color-primary: #2DA44E`
- [ ] body 背景色为 `#F5F7FA` / `#f0f2f5`
- [ ] 表格表头背景 `#FAFAFA`
- [ ] 搜索按钮使用 `.btn-search-primary` / `.btn-search-reset`
- [ ] 操作列 fixed="right" 且宽度合适
- [ ] 弹窗 `destroy-on-close`
- [ ] 表单必填字段有 `required` 校验
- [ ] 状态标签使用 `effect="plain"`
- [ ] 注册了所有 Element Plus Icons
