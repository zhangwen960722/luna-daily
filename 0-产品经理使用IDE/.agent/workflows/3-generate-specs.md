---
description: 阶段3：原型生成 - 将产品文档可视化为前端 Demo
---

# Workflow: Phase 3 - 原型生成 (Make Prototype)

此工作流是 **Phase 3**，产品文档（Phase 1）和数据设计（Phase 2）已完成，现在是「生成原型」。完成后进入 Phase 4（验证与迭代）。

> **模块聚焦**：文件加载默认限定当前模块。原型涉及跨模块数据时，按 AGENTS.md §工作模式判断 确定扩展范围。

## 步骤 1: 确认输入就绪 (Input Check)

- [ ] Phase 1 的 产品文档 已就绪
- [ ] Phase 2 的 数据设计 已就绪

## 步骤 2: 生成前端 Demo

1. 调用 **Skill: `frontend-designer`**：读取 `.agent/skills/frontend-designer/SKILL.md`，按其指引执行（样式规范、CSS 变量、组件尺寸均已内嵌，Skill 内部已含读取数据设计的步骤）。
2. 生成单文件 HTML 原型（Vue 3 + Element Plus CDN），一个页面一个文件。
3. 确保 `demo/` 下各端 `index.html`（`员工端-demo/`、`货主端-demo/`）注册新页面菜单项。

## 步骤 3: 交付与归档 (Delivery)

1. Demo 代码按端放入 `demo/员工端-demo/`、`demo/货主端-demo/` 对应模块目录。
2. 变更记录追加遵循 AGENTS.md §修改后自检。

**Done**: 任务完成！
