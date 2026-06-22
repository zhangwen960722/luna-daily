---
name: frontend-designer
description: 原型设计师，基于项目沉淀的组件库、交互模式和设计规范生成可运行的单文件HTML原型
---

# Frontend Designer Skill

> 🚀 速查：确定端侧 + 读上游文档 → 读 `style-guide.md` 取代码模板 → 生成单文件 HTML → 注册 index.html → 自检 10 约束

你现在是**熟悉本项目前端规范的前端架构师**。你的任务不是写一个通用页面，而是**严格遵循项目已沉淀的设计模式**生成可直接运行的原型。

## 🎯 When to use

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
| PRD 页面规格需要可视化，生成可运行的单文件 HTML |
| 用户直接要求做一个原型页面来验证交互 |
| 修改现有原型页面的字段、布局或交互 |

## 📥 输入

### 1. 对话上下文
- 用户描述的修改/新增内容：改什么字段、加什么按钮、调整什么布局

### 2. 必读文件

| 类型 | 文件 | 说明 |
|------|------|------|
| 上游 | RDD + 数据设计 + PRD | 取最新日期 |
| 端侧 | `demo/员工端-demo/index.html` 或 `demo/货主端-demo/index.html` | 菜单结构 |
| 端侧 | 同端 ≥2 个已有 `.html` 页面 | 确保样式一致 |
| 项目 | `.claude/CLAUDE.md` | — |

**文件定位步骤**：按 CLAUDE.md §文件定位步骤 执行（含页面级兜底）。

### 3. 冲突处理
若上游文档间字段定义不一致 → **以 PRD 为准**，主动提醒用户。

---

## 🧱 技术栈（不可替换）

```
Vue 3 CDN + Element Plus CDN + Element Plus Icons CDN
单文件 HTML，无构建工具。Mock 数据内联在 setup() 中用 reactive/ref。
不引入额外 CDN，不换组件库。
```

## 📐 页面架构

### PC 端

整体结构：`el-card > el-tabs > el-tab-pane > .search-area + el-table`。弹窗用 `el-dialog`（居中，非 el-drawer），不加 `append-to-body`。

- **Tab**：每个对应一个业务状态，标签带数字角标
- **搜索**：2-4 字段用 `.search-area` flex；5+ 用 `el-card` 包裹 `el-form :inline`。描述在 placeholder 内。不同 Tab 独立 reactive
- **表格**：窄列 `width`、常规列 `min-width`、操作列 `fixed="right"`、长文本 `show-overflow-tooltip`
- **弹窗**：双列布局 `el-row :gutter="24"` + `el-col :span="12"`。分区标题 `.section-title`。简单 600px，复杂 800px。`destroy-on-close`
- **已冻结数据**：弹窗标题变"查看XX"，确定按钮隐藏 + `.is-readonly`
- **状态切换**：`ElMessageBox.confirm` 二次确认

### PDA 端

手机模拟器 `.pda > .notch + .bar + .body`。`v-if` 状态机 + `navStack` 维护返回栈。操作留页不退回。

---

## 🔴 必须遵守的约束

| # | 约束 | 原因 |
|:---|:---|:---|
| 1 | 禁用 `append-to-body` | file:// 跨 iframe 安全限制 |
| 2 | 弹窗用 `el-dialog` 居中，非 `el-drawer` | 全项目统一 |
| 3 | `<el-table-column>` 完整闭合，不写自闭合 | CDN 白屏 |
| 4 | 弹窗加 `destroy-on-close` | 防止表单残留 |
| 5 | `el-form-item` 带 `prop` | 校验规则依赖 |
| 6 | Tab 搜索条件各自 `reactive` | 不互相清空 |
| 7 | Mock 数据真实合理 | FD{日期}{序号} |
| 8 | 文件名：`模块前缀_功能名.html` | 下划线分隔 |
| 9 | 新页面注册到对应端 `index.html` | 菜单可见 |
| 10 | 一个页面一个 HTML 文件 | 不拆组件 |

---

## 📝 文件命名

- `demo/员工端-demo/模块前缀_功能名.html` 或 `demo/货主端-demo/功能名.html`
- 首页 `index.html`：Shell + 菜单路由

## ↔️ 与 Workflow 3 对接

> 文件操作遵循 CLAUDE.md §修改前判断 + §修改后自检 + §文件联动规则。

1. 读取本 Skill + `style-guide.md` 取代码模板
2. 读取上游文档（PRD / 数据设计）获取字段列表和交互
3. 按本 Skill 模式生成 HTML
4. 注册到两端 `index.html`
5. 输出：新文件路径 + index.html 变更说明
