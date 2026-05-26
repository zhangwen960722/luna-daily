---
description: 阶段3：规格生成 - 组装完整PRD和前端Demo
---

# Workflow: Phase 3 - 规格生成 (Make Specs)

此工作流是**最后一步**。前两步的思考和设计已经完成，现在是"组装"和"输出"。

## 步骤 1: 内容映射 (Content Mapping)

> **Goal**: 明确 RDD 和 Architecture 中哪些内容进 PRD 的哪些章节，避免遗漏或重复。

**输入**:
- Phase 1 的 RDD（需求定义卡片）
- Phase 2 的 Architecture（数据模型 + 流程图 + IA 设计）

**映射关系**:

| 来源 | 内容 | → PRD 章节 |
|------|------|-----------|
| RDD Section 1 | 核心洞察、痛点、JTBD | → 1. 需求定义 |
| RDD Section 2 | 角色、典型场景 | → 2. 用户与场景 |
| RDD Section 5 | 功能清单 + 优先级 | → 3. 功能清单与本期范围 |
| RDD Section 2 + 4 | 业务规则、Epic 场景 | → 4. 流程与规则 |
| Architecture IA 设计 | 菜单结构、页面清单 | → 5. 信息架构 |
| Architecture 数据模型 | 字段字典 | → 6. 页面与字段 |
| RDD + Architecture | 权限角色、配置项 | → 7. 权限与配置 |
| Architecture | 接口定义 | → 8. 接口与数据 |
| RDD Section 3 | 验收标准 | → 9. 验收与上线 |

> **原则**：RDD 提供"做什么、为什么"，Architecture 提供"怎么做、什么结构"，PRD = 两者合并 + 给开发看的落地细节。

## 步骤 2: 生成PRD (PRD Generation)

1. 按映射关系，将 RDD 和 Architecture 内容填入 `templates/prd-template.md`。
2. 确保所有业务规则都有编号 (R01, R02...)。
3. 章节标注 `【条件必填】` 的，如不适用写"无/不涉及"，**不可直接删除章节**。
4. 检查 PRD 是否自包含——开发不需要翻阅 RDD 就能理解全部内容。

**质量检查**:

- [ ] 是否有文档基础信息（版本/状态/评审人）？
- [ ] 业务规则是否编号？
- [ ] 验收标准是否可测试？
- [ ] 条件必填章节是否已填写或标注"无"？
- [ ] 是否包含权限说明？
- [ ] 是否包含异常处理？

## 步骤 3: 生成前端Demo (Optional)

> **Goal**: 将PRD转化为可视化的代码。

如果需要前端Demo：

1. 调用 **Skill: `frontend-designer`** (如有) 或基于Design System规范。
2. 为PRD中的关键页面生成 React/Tailwind 代码。
3. 确保生成的代码包含 `interface` 定义和 `mock` 数据。

## 步骤 4: 交付与归档 (Delivery)

1. 将最终PRD保存到`prds/[模块名]/PRD`
- **文件示例**:
  - `prds/超级运价/PRD.md` (产品需求文档)
2. 将Demo代码保存到 `demo/[模块名称]/demo`.
- **文件示例**:
  - `demo/超级运价/demo.md` (前端demo代码)
3. 输出一份《验收标准清单(AC List)》供测试使用。

**Done**: 任务完成！