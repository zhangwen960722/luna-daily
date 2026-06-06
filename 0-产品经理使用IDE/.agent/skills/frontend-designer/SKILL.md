---
name: frontend-designer
description: 原型设计师，基于项目沉淀的组件库、交互模式和设计规范生成可运行的单文件HTML原型
---

# Frontend Designer Skill

你现在是**熟悉本项目前端规范的前端架构师**。你的任务不是写一个通用页面，而是**严格遵循项目已沉淀的设计模式**生成可直接运行的原型。

---

## 🎯 When to use this skill

### 系统触发
| 触发方 | 步骤 |
|--------|------|
| `3-generate-specs.md` | Step 4 |

### 关键词触发
| 关键词 | 示例 |
|--------|------|
| "画页面"、"做页面"、"生成页面"、"Demo" | "帮我把这个列表页画出来" |
| "原型"、"HTML"、"前端" | "生成一个运价查询的原型" |
| "界面"、"长什么样"、"交互"、"弹窗" | "这个新增弹窗长什么样" |
| "注册"、"index"、"菜单"、"导航" | "把这个新页面注册到菜单里" |
| "改样式"、"调整布局"、"换颜色"、"加按钮" | "帮我把表格的表头改成灰色" |

### 场景触发
| 场景 |
|------|
| PRD 中的页面规格需要可视化，生成可运行的单文件 HTML |
| 用户直接要求做一个原型页面来验证交互 |
| 需要修改现有原型页面的字段、布局或交互 |

## 📥 输入

### 1. 对话上下文（已加载，直接提取）

- 用户在本轮对话中描述的修改/新增内容：改什么字段、加什么按钮、调整什么布局等
- 若涉及多个改动点，逐一列出，不遗漏

### 2. 必读文件（生成/修改前先加载）

#### 上游文档
| 文档 | 路径模式 | 本次对象 |
|------|---------|---------|
| 用户需求(RDD) | `drafts/[模块名]/YYYY-MM-DD-用户需求.md` | 从对话中确定模块名，取最新日期 |
| 数据设计 | `drafts/[模块名]/YYYY-MM-DD-数据设计.md` | 同上 |
| PRD | `drafts/[模块名]/YYYY-MM-DD-PRD.md` | 同上（如已产出） |

> 重点关注：页面对应的字段列表、字段类型、交互行为、关联接口

#### 端侧参考（必读）
| 文件 | 路径 | 说明 |
|------|------|------|
| 员工端首页 | `demo/员工端-demo/index.html` | 菜单结构、注册方式 |
| 货主端首页 | `demo/货主端-demo/index.html` | 同上 |
| 同端已有页面 | `demo/[对应端]-demo/` 下至少 2-3 个 `.html` | 确保样式和交互模式一致 |

#### 项目参考
| 文件 | 路径 |
|------|------|
| 项目规则 | `.agent/rules/project-rule.md` |

### 3. 冲突处理（生成前必执行）

若读取的上游文档之间存在不一致（如用户需求(RDD)字段表 vs PRD 字段定义 vs 数据设计 Schema）：

1. **以 PRD 为准**（PRD 是面向研发的最终规格，通常为最新版本）
2. **主动提醒用户**："检测到 [文档A] 与 [文档B] 中 [字段名] 的定义不一致（A: X / B: Y），已以 PRD 为准生成。是否需要同步更新？"
3. 不得跳过提醒、不得自行决定忽略

### 4. 操作目标

- 若新增页面：页面名称 + 归属端（员工端/货主端）+ 归属菜单
- 若修改已有页面：对应的 HTML 文件路径（从对话上下文或文件列表中确认）

---

## 🧱 技术栈（不可替换）

```
Vue 3 CDN   → <script src="https://unpkg.com/vue@3/dist/vue.global.js">
Element Plus → <link rel="stylesheet" href="https://unpkg.com/element-plus/dist/index.css" />
               <script src="https://unpkg.com/element-plus">
Icons       → <script src="https://unpkg.com/@element-plus/icons-vue">
```

- **单文件 HTML**，无构建工具、无 npm、无 TypeScript 编译
- **Mock 数据内联**在 `<script>` 的 `setup()` 中，用 `reactive` / `ref` 数组
- **不引入额外 CDN**，不换组件库

---

## 🎨 样式系统

### 主题色

```css
:root {
    --el-color-primary: #2DA44E;      /* 绿色主色 */
    --el-bg-color: #F5F7FA;
    --el-text-color-primary: #303133;
    --el-text-color-regular: #606266;
    --el-border-color: #DCDFE6;
    --el-border-radius-base: 4px;
}
```

### 字体层级

- 页面标题：`24px` 加粗 | 区块标题：`16px` 加粗 | 正文：`14px` | 辅助：`12px`

### 间距系统（8px 网格）

- `4px` 元素内部 | `8px` 相关元素间 | `16px` 区块内部 | `24px` 区块间 | `32px` 页面分区

### 组件尺寸速查

| 组件 | 高度 | 圆角 |
|------|------|------|
| 按钮 | 32px | 6px |
| 输入框 | 32px | 6px |
| 表格行 | 40px | — |
| 分页 | 32px | 6px |

### PC 端基础样式

```css
body {
    margin: 0;
    padding: 16px;
    background-color: var(--el-bg-color);
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-size: 14px;
    color: var(--el-text-color-primary);
}

/* 列表页卡片 */
.content-card {
    background-color: #FFFFFF;
    border-radius: var(--el-border-radius-base);
    padding: 16px;
    height: calc(100vh - 32px);
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

/* 搜索筛选区（flex 流式，非灰底块） */
.search-area {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
    margin-bottom: 16px;
}

.search-item {
    display: flex;
    align-items: center;
}

.search-item label {
    margin-right: 8px;
    color: var(--el-text-color-regular);
    font-size: 14px;
}

/* 表格容器 */
.table-container {
    flex: 1;
    overflow: hidden;
}

/* 表头 */
.el-table th.el-table__cell {
    background-color: #FAFAFA;
    color: #303133;
    font-weight: 500;
}

/* 行悬停 */
.wb-row { cursor: pointer; }
.wb-row:hover { background: #f0faf2; }

/* 分页 */
.pagination-area {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
}

/* 搜索按钮 */
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

/* 弹窗分区标题 */
.section-title {
    font-size: 14px;
    font-weight: bold;
    color: #303133;
    margin-top: 24px;
    margin-bottom: 16px;
    padding-left: 8px;
    border-left: 4px solid #2DA44E;
}
.section-title:first-child {
    margin-top: 0;
}
```


> **运价模块变体**：超级运价系列页面使用压缩 CSS + `.card` 类（`border-radius:8px; box-shadow:...; padding:20px`）替代 `.content-card`，背景色 `--bg:#F0F2F5`。其余模块统一使用上述标准模式。

### PDA 端基础样式

PDA 是手机模拟器，固定尺寸：
```css
.pda { width:390px; height:844px; background:var(--bg); border-radius:40px; border:12px solid #2c3e50; box-shadow:0 20px 40px rgba(0,0,0,0.2); overflow:hidden; display:flex; flex-direction:column; position:relative; }
.notch { position:absolute; top:0; left:50%; transform:translateX(-50%); width:150px; height:28px; background:#2c3e50; border-radius:0 0 18px 18px; z-index:10; }
```

PDA 头部：
```css
.bar { background:var(--p); color:#fff; padding:44px 12px 10px; display:flex; align-items:center; }
.bar .t { position:absolute; left:50%; transform:translateX(-50%); font-size:16px; font-weight:600; }
```

---

## 📐 PC 端页面架构

### 整体结构（固定模式）

```
el-card.page-card
  └── el-tabs (v-model="activeTab", 每个Tab带数字角标)
       ├── el-tab-pane (name="xxx")  ← 状态Tab
       │    ├── .search-area > el-form :inline  ← 搜索区（灰底）
       │    │    ├── el-form-item × N
       │    │    └── [搜索] [重置]
       │    └── el-table (border) ← 数据表格
       └── el-tab-pane (name="yyy")
            └── ...

el-drawer (v-model, size="55%") ← 详情抽屉（在 el-card 外层）
```

### Tab 状态模式

每个 Tab 对应一个业务状态，Tab 标签带数字角标：
```html
<el-tab-pane :label="'待收货 ('+pendingCount+')'" name="pending">
<el-tab-pane :label="'已收货 ('+receivedCount+')'" name="received">
```

### 搜索区模式

- 不同 Tab 的搜索条件**独立**（各自 `reactive` 对象）
- 已完成类 Tab 的搜索时间字段标签与列表列名一致（"完成时间"→"完成时间"）
- 搜索字段描述写在 `placeholder` 内，不外部放 label。模式选择：2-4 字段用 `.search-area` flex 流式；5+ 字段或含高级筛选用 `el-card` 包裹 `el-form :inline`

### 表格列宽规范

| 列类型 | 写法 | 说明 |
|--------|------|------|
| 固定窄列（状态/序号） | `width="80"` | 内容宽度固定 |
| 操作列 | `width="160"`、`fixed="right"` | 固定在右侧，不被横向滚动带走 |
| 常规列 | `min-width="120"` | 禁止写死 `width`，让列自适应 |
| 长文本列 | `min-width="250"` + `show-overflow-tooltip` | 地址、描述等超长字段 |

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

### 弹窗模板（el-dialog）

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
- 表单双列布局：`el-row :gutter="24"` + `el-col :span="12"`
- 分区标题：`.section-title`（绿色左边框 4px + 加粗）
- 弹窗宽度：简单表单 600px，复杂表单 800px
- **不使用 `append-to-body`**（file:// 协议下跨 iframe 安全限制）

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
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(() => {
        row.status = row.status === '正常' ? '已冻结' : '正常';
        ElMessage.success(`${action}成功`);
    }).catch(() => {});
};
```

---

## 📱 PDA 端页面架构

### 整体结构

```
.pda > .notch
       > .bar (头部：返回按钮 + 居中标题 + 用户胶囊)
       > .body > .body-in (内容区)
```

### 页面导航

- **不使用 Vue Router**，用 `v-if` 状态机切换视图
- `v` 变量控制当前页面：`'login'` → `'menu'` → `'inbound'` → ...
- `navStack` 数组维护返回栈

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

### 登录页

- 用户名 + 密码 + 仓储中心下拉 → 登录按钮
- 三个字段都填了才启用按钮 `:disabled="!user||!pwd||!center"`

### 首页菜单

4列网格 `.grid { grid-template-columns:1fr 1fr; gap:10px; }`
菜单项 `.mi`：图标 + 标题 + 副标题，点击跳转

### 操作页模式

- **表单式，非相机式**：输入框 + [扫] 按钮，扫码自动填充，不模拟相机界面
- **操作留页**：完成后清空表单留在当前页，不退回首页
- **不重复展示**：扫描后输入框已有值，不再弹一行重复信息
- **复选框精简**：标签即说明，不加括号解释
- **连续快速**：连续扫码自动累计

---

## 🔴 必须遵守的约束

| # | 约束 | 原因 |
|:---|:---|:---|
| 1 | **禁用 `append-to-body`** | file:// 协议下跨 iframe 安全限制，el-drawer/el-dialog 都不加此属性 |
| 2 | **详情/表单均用 `el-dialog` 居中弹窗** | 全项目统一弹窗交互，不用 `el-drawer` 右侧抽屉 |
| 3 | **`el-table-column` 必须完整闭合** | CDN 模式下自闭合 `<el-table-column .../>` 会导致渲染白屏 |
| 4 | **弹窗须加 `destroy-on-close`** | 关闭弹窗后再打开时残留上次表单数据 |
| 5 | **`el-form-item` 须带 `prop` 属性** | 校验规则通过 `prop` 匹配，省略则 `required` 等校验失效 |
| 6 | **Tab 搜索条件独立** | 不同 Tab 用各自 reactive 对象，切换 Tab 时不清空其他 Tab 的搜索状态 |
| 7 | **Mock 数据真实合理** | 运单号用 FD{日期}{序号}，任务号用 IB-/TR- 前缀，时间用合理范围 |
| 8 | **文件命名：模块前缀 + 功能描述** | 下划线分隔，如 `超级运价_工作台.html`、`查价订舱.html` |
| 9 | **新页面要注册到 index.html** | 每个新原型页面都要在 index.html 的导航中加菜单项 |
| 10 | **一个页面一个 HTML 文件** | 不拆组件文件，全部写在一个 HTML 里 |

---

## 📝 文件命名与位置

- **路径**: `demo/员工端-demo/[英文名].html` 或 `demo/货主端-demo/[英文名].html`（按角色分端）
- **命名规则**: 小写 + 下划线，描述功能
  - 员工端页面：`超级运价_工作台.html`, `超级运价_运价查询.html`, `仓库列表_主列表.html`
  - 货主端页面：`查价订舱.html`, `商品管理.html`, `收货地址管理.html`
- **首页**: `index.html`（Shell + 菜单路由 + iframe/组件加载）

---

## ↔️ 与 workflow 3 的对接

> 若目标文件已存在则在原文件上修改，不新建。详见 project-rule §修改前判断。

当 `/3-generate-specs` 的步骤4触发时：

1. 读取本 skill 文件（样式规范、CSS 变量、组件尺寸均已内嵌）
2. 读取对应的 PRD 或 数据设计文档（获取字段列表和交互流程）
3. 按本 skill 的模式生成 HTML
4. 确保 `demo/员工端-demo/index.html` 和 `demo/货主端-demo/index.html` 都注册新页面
5. 输出时说明：新文件路径 + 两个 index.html 的变更

> 执行完成后，若修改了任何设计文件（原型 / index.html），自动执行 project-rule §文件联动规则，确保 PRD 与原型一致性。
