# 实施计划：餐厅 Web 应用

**分支**：`001-restaurant-web-app` | **日期**：2026-05-15 | **规格**：[spec.md](./spec.md)  
**输入**：来自 `/specs/001-restaurant-web-app/spec.md` 的功能规格

## 摘要

构建一个单餐厅 Web 应用，覆盖顾客首页、菜单浏览、饮食标签筛选、预订请求、点单/购物车请求、联系信息，以及基础后台管理。技术实现采用前端单页应用优先的 MVP：用结构化本地数据和可替换的数据访问层支撑完整用户流程，避免在第一版引入支付、配送、第三方预订或生产级认证复杂度。

## 技术上下文

**语言/版本**：TypeScript，运行时使用当前可用 Node.js 20+ 环境  
**主要依赖**：React、Vite、基础表单与状态管理使用框架内能力，图标使用 lucide-react（如安装可用）  
**存储**：第一版使用本地/mock 数据访问层；预订、订单和菜单修改可先持久化到浏览器本地存储或内存状态  
**测试**：使用可用的 lint/typecheck/build；核心流程优先补充组件/交互测试，若测试栈未建立则以 `quickstart.md` 的手动验证作为临时门禁  
**目标平台**：现代桌面与移动浏览器  
**项目类型**：Web 应用，单项目结构  
**性能目标**：首页、菜单筛选、购物车调整等常用交互在 1 秒内给出可见反馈；首屏在普通本地开发环境中应快速可用  
**约束**：第一版不包含在线支付、配送调度、真实桌位库存、生产认证或外部平台集成；后台必须标注为开发占位能力  
**规模/范围**：单餐厅、约 5 个主要顾客流程、1 个基础后台、几十条示例菜品数据以内

## 宪章检查

*门禁：Phase 0 研究前必须通过；Phase 1 设计后再次检查。*

- **代码质量**：通过领域模型、数据访问层、页面/组件分层来明确模块边界；仅引入必要抽象，例如菜单、预订、订单、后台状态管理。
- **测试与验证**：每个用户故事都有独立验证路径；计划包含自动化优先策略和手动验证兜底。
- **用户体验一致性**：顾客侧与后台侧共享导航、表单反馈、空状态、状态标签和响应式布局原则。
- **性能**：菜单筛选、购物车调整和表单反馈必须在 1 秒内可见；避免昂贵渲染和不必要全局刷新。
- **可维护性**：本地/mock 持久化通过数据访问层隔离，后续可替换为真实后端；菜单、预订、订单状态机集中定义。

结论：当前设计符合宪章，无需记录例外。

## 项目结构

### 文档（当前功能）

```text
specs/001-restaurant-web-app/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-workflows.md
├── checklists/
│   └── requirements.md
└── tasks.md
```

### 源代码（仓库根目录）

```text
src/
├── app/
│   ├── App.tsx
│   └── routes.ts
├── components/
│   ├── layout/
│   ├── menu/
│   ├── reservations/
│   ├── orders/
│   └── admin/
├── data/
│   ├── seed.ts
│   └── repository.ts
├── domain/
│   ├── restaurant.ts
│   ├── menu.ts
│   ├── reservations.ts
│   └── orders.ts
├── styles/
│   └── app.css
└── main.tsx

tests/
├── unit/
├── integration/
└── manual/
```

**结构决策**：采用单项目 Web 应用结构。`domain/` 定义业务类型和状态，`data/` 隔离 mock/本地持久化，`components/` 按业务流程分组，`app/` 负责路由和页面组合。该结构足够支撑 MVP，同时保留后续替换后端和增加认证的空间。

## Phase 0：研究结果

研究记录见 [research.md](./research.md)。所有技术上下文中的不确定项已处理，无 `NEEDS CLARIFICATION` 残留。

## Phase 1：设计产物

- 数据模型：[data-model.md](./data-model.md)
- UI/工作流契约：[contracts/ui-workflows.md](./contracts/ui-workflows.md)
- 快速验证指南：[quickstart.md](./quickstart.md)

## 设计后宪章复查

- **代码质量**：数据模型和源代码结构已定义清晰边界。
- **测试与验证**：quickstart 覆盖首页、菜单筛选、预订、点单、后台管理和响应式检查；后续 tasks 必须拆出自动化或手动验证任务。
- **用户体验一致性**：契约文件明确导航、表单、空状态、状态标签和后台占位提示。
- **性能**：性能目标已写入计划与 quickstart 验证项。
- **可维护性**：repository 层隔离本地/mock 数据，支持未来后端替换。

结论：Phase 1 设计继续符合宪章。

## 复杂度跟踪

无宪章违规项。
