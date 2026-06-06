---
description: 阶段3：规格生成 - 组装完整PRD和前端Demo
---

# Workflow: Phase 3 - 规格生成 (Make Specs)

此工作流是**Phase 3**，前两个 Phase 的思考和设计已经完成，现在是"组装"和"输出"。完成后进入 Phase 4（验证与迭代）进行质量检查。

## 步骤 1: 关键事实提取 (Fact Extraction)

> **Goal**: 在写 PRD 之前，先从 用户需求(RDD) 中提取一份"不能犯错的关键事实清单"。PRD 写完后逐条核对，零遗漏。

**输入**: Phase 1 的 用户需求(RDD)

**执行**: 从用户需求(RDD)中提取所有跨实体的联动逻辑和容易理解偏差的设计决策（核心计算规则、数据生命周期、实体间联动、匹配与过滤、边界条件、继承与覆盖等）。具体维度见 prd-writer Skill 的 用户需求(RDD) 一致性校验清单。

**输出**: 关键事实清单 → 作为 Step 3 的 PRD 校验基准。

---

## 步骤 2: 确认输入就绪 (Input Check)

> **Goal**: 确认 Step 3 所需的全部输入已准备完毕。

- [ ] Phase 1 的 用户需求(RDD)(RDD) 已就绪
- [ ] Phase 2 的 流程设计（数据模型 + 流程图 + IA + 外部接口清单）已就绪
- [ ] Step 1 的 关键事实清单 已提取

> 输入就绪后直接进入 Step 3。PRD 模板的章节描述本身已隐含内容来源指引（如"枚举字典"→ 来自数据设计、"业务规则"→ 来自用户需求(RDD)的 Epic 场景），无需额外映射表。

## 步骤 3: 生成PRD (PRD Generation)

1. 调用 **Skill: `prd-writer`**：读取 `.agent/skills/prd-writer/SKILL.md`，按照其指引执行。
2. 输入：用户需求(RDD)+ 数据设计（Phase 2 产出）+ Step 1 的关键事实清单。
3. Skill 内部已完成质量检查和 用户需求(RDD) 一致性校验，Workflow 层不再重复。

## 步骤 4: 生成前端Demo (Optional)

> **Goal**: 将PRD转化为可视化的代码。

如果需要前端Demo：

1. 调用 **Skill: `frontend-designer`**：读取 `.agent/skills/frontend-designer/SKILL.md`，按照其指引执行（样式规范、CSS 变量、组件尺寸均已内嵌在 Skill 中，Skill 内部已包含读取数据设计文档的步骤）。
2. 生成单文件 HTML 原型（Vue 3 + Element Plus CDN），一个页面一个文件。
3. 确保 `demo/` 下各端的 `index.html`（`员工端-demo/`、`货主端-demo/`）均注册新页面菜单项。

## 步骤 5: 交付与归档 (Delivery)

1. 将最终PRD保存到`drafts/[模块名]/YYYY-MM-DD-PRD.md`（步骤3产出）。
2. 将Demo代码按端分别放入 `demo/员工端-demo/` 和 `demo/货主端-demo/` 对应模块目录下。
3. 输出一份 AC List 供测试使用。
4. 在对应模块的 `变更记录.md` 追加：`| YYYY-MM-DD | PRD 定稿 | — |`（新模块无此文件则先创建）

**Done**: 任务完成！