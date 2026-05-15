# 任务清单：餐厅 Web 应用

**输入**：`/specs/001-restaurant-web-app/` 下的设计文档  
**前置文档**：`plan.md`、`spec.md`、`research.md`、`data-model.md`、`contracts/ui-workflows.md`、`quickstart.md`

**测试策略**：优先建立可运行的 lint、typecheck、build 和核心交互测试；如果某项自动化测试暂不可用，必须在 `tests/manual/restaurant-web-app.md` 记录手动验证步骤和预期结果。

**组织方式**：任务按用户故事分组，确保每个故事都能独立实现、独立测试、独立演示。

## Phase 1: Setup（项目初始化）

**目的**：创建 React + Vite + TypeScript 项目基础和目录结构。

- [X] T001 在 `package.json` 中初始化 Web 应用依赖和脚本，包括 dev、build、typecheck、lint
- [X] T002 [P] 创建应用入口文件 `src/main.tsx`、`src/app/App.tsx` 和 `src/app/routes.ts`
- [X] T003 [P] 创建目录结构 `src/components/layout/`、`src/components/menu/`、`src/components/reservations/`、`src/components/orders/`、`src/components/admin/`
- [X] T004 [P] 创建领域和数据目录 `src/domain/`、`src/data/`、`src/styles/`、`tests/manual/`
- [X] T005 创建全局样式文件 `src/styles/app.css` 并接入 `src/main.tsx`

---

## Phase 2: Foundational（阻塞性基础）

**目的**：完成所有用户故事共享的领域模型、数据访问层、导航和基础状态。

**关键要求**：本阶段完成前，不开始任何用户故事页面实现。

- [X] T006 [P] 在 `src/domain/restaurant.ts` 定义 `RestaurantProfile` 类型
- [X] T007 [P] 在 `src/domain/menu.ts` 定义 `MenuCategory`、`DietaryTag`、`MenuItem`、`CartItem` 类型和可售校验函数
- [X] T008 [P] 在 `src/domain/reservations.ts` 定义 `ReservationRequest`、`ReservationStatus` 和预订状态转换规则
- [X] T009 [P] 在 `src/domain/orders.ts` 定义 `OrderRequest`、`OrderLineItem`、`OrderStatus` 和订单状态转换规则
- [X] T010 在 `src/data/seed.ts` 添加餐厅信息、菜单分类、饮食标签和示例菜品数据
- [X] T011 在 `src/data/repository.ts` 实现菜单、预订、订单和后台修改的本地/mock 数据访问函数
- [X] T012 在 `src/components/layout/AppShell.tsx` 实现共享页面框架、响应式导航和后台入口
- [X] T013 在 `tests/manual/restaurant-web-app.md` 创建手动验证清单框架，覆盖 quickstart 中的主要流程

**检查点**：领域类型、示例数据、repository 和应用框架可被后续故事复用。

---

## Phase 3: User Story 1 - 顾客了解餐厅并进入核心流程（P1）MVP

**目标**：顾客打开首页即可了解餐厅信息，并进入菜单、预订或点单流程。

**独立测试**：访问首页，确认餐厅名称、定位、营业时间、地址、电话和主要入口均可见；移动端布局无遮挡。

### Tests for User Story 1

- [X] T014 [P] [US1] 在 `tests/manual/restaurant-web-app.md` 补充首页桌面端和移动端手动验证步骤

### Implementation for User Story 1

- [X] T015 [P] [US1] 在 `src/components/layout/HomePage.tsx` 实现首页餐厅信息展示
- [X] T016 [US1] 在 `src/app/App.tsx` 接入首页路由和主要行动入口
- [X] T017 [US1] 在 `src/styles/app.css` 添加首页、导航和响应式基础样式
- [X] T018 [US1] 验证 `src/components/layout/HomePage.tsx` 中菜单、预订、点单入口可达并记录结果到 `tests/manual/restaurant-web-app.md`

**检查点**：首页可独立演示，是第一版 MVP 起点。

---

## Phase 4: User Story 2 - 顾客浏览菜单并筛选菜品（P1）

**目标**：顾客可以按分类和饮食标签浏览菜单，查看菜品详情与可售状态。

**独立测试**：打开菜单页，切换分类和标签筛选，确认结果、空状态、不可售状态和加入购物车限制正确。

### Tests for User Story 2

- [X] T019 [P] [US2] 在 `tests/manual/restaurant-web-app.md` 补充菜单分类、标签筛选、空状态和不可售菜品验证步骤

### Implementation for User Story 2

- [X] T020 [P] [US2] 在 `src/components/menu/MenuFilters.tsx` 实现分类和饮食标签筛选控件
- [X] T021 [P] [US2] 在 `src/components/menu/MenuItemCard.tsx` 实现菜品卡片、标签、价格和可售状态展示
- [X] T022 [US2] 在 `src/components/menu/MenuPage.tsx` 实现菜单列表、筛选逻辑和无结果空状态
- [X] T023 [US2] 在 `src/app/App.tsx` 接入菜单页面路由
- [X] T024 [US2] 在 `src/styles/app.css` 添加菜单网格、筛选控件、状态标签和移动端样式
- [X] T025 [US2] 验证菜单筛选和不可售菜品限制，并记录结果到 `tests/manual/restaurant-web-app.md`

**检查点**：菜单浏览流程可独立演示，并为点单故事提供菜品来源。

---

## Phase 5: User Story 3 - 顾客提交预订请求（P2）

**目标**：顾客可以提交待确认预订请求，并看到清晰表单校验与成功反馈。

**独立测试**：提交有效预订可创建待确认请求；缺失联系方式、过去日期、无效人数会阻止提交。

### Tests for User Story 3

- [X] T026 [P] [US3] 在 `tests/manual/restaurant-web-app.md` 补充预订表单校验和成功提交验证步骤

### Implementation for User Story 3

- [X] T027 [P] [US3] 在 `src/components/reservations/ReservationForm.tsx` 实现预订表单字段和校验提示
- [X] T028 [US3] 在 `src/components/reservations/ReservationPage.tsx` 实现预订提交、待确认反馈和错误状态
- [X] T029 [US3] 在 `src/data/repository.ts` 接入创建预订请求和读取预订列表的函数
- [X] T030 [US3] 在 `src/app/App.tsx` 接入预订页面路由
- [X] T031 [US3] 在 `src/styles/app.css` 添加表单、错误提示和成功反馈样式
- [X] T032 [US3] 验证预订请求状态为 `pending` 并记录结果到 `tests/manual/restaurant-web-app.md`

**检查点**：预订请求可以作为独立业务流程演示。

---

## Phase 6: User Story 4 - 顾客创建点单/购物车请求（P2）

**目标**：顾客可以把可售菜品加入购物车，调整数量，提交待确认点单请求。

**独立测试**：购物车数量、总计、空购物车阻止、缺失联系信息阻止、成功提交待确认订单都可验证。

### Tests for User Story 4

- [X] T033 [P] [US4] 在 `tests/manual/restaurant-web-app.md` 补充购物车、订单校验和成功提交验证步骤

### Implementation for User Story 4

- [X] T034 [P] [US4] 在 `src/components/orders/CartPanel.tsx` 实现购物车项、数量调整、移除、小计和总计展示
- [X] T035 [P] [US4] 在 `src/components/orders/OrderForm.tsx` 实现顾客姓名、联系方式、取餐方式和备注字段
- [X] T036 [US4] 在 `src/components/orders/OrderPage.tsx` 实现从菜单添加菜品、购物车校验和订单提交反馈
- [X] T037 [US4] 在 `src/data/repository.ts` 接入创建订单请求和读取订单列表的函数
- [X] T038 [US4] 在 `src/app/App.tsx` 接入点单页面路由
- [X] T039 [US4] 在 `src/styles/app.css` 添加购物车、订单表单和总计区域样式
- [X] T040 [US4] 验证不可售菜品、空购物车和缺失联系方式不能提交，并记录结果到 `tests/manual/restaurant-web-app.md`

**检查点**：点单请求可以独立演示，并复用菜单可售状态。

---

## Phase 7: User Story 5 - 管理员维护菜单、预订和订单（P3）

**目标**：工作人员可以查看后台摘要，管理菜品，更新预订和订单状态。

**独立测试**：后台新增/编辑/下架菜品后，顾客菜单反映变化；预订和订单状态更新后后台列表同步显示。

### Tests for User Story 5

- [X] T041 [P] [US5] 在 `tests/manual/restaurant-web-app.md` 补充后台占位提示、菜单管理、预订状态和订单状态验证步骤

### Implementation for User Story 5

- [X] T042 [P] [US5] 在 `src/components/admin/AdminSummary.tsx` 实现待处理预订、待处理订单和不可售菜品统计
- [X] T043 [P] [US5] 在 `src/components/admin/MenuManager.tsx` 实现菜品新增、编辑、删除和下架操作
- [X] T044 [P] [US5] 在 `src/components/admin/ReservationManager.tsx` 实现预订列表和状态更新
- [X] T045 [P] [US5] 在 `src/components/admin/OrderManager.tsx` 实现订单列表、明细查看和状态更新
- [X] T046 [US5] 在 `src/components/admin/AdminPage.tsx` 组合后台摘要、菜单管理、预订管理和订单管理，并显示未认证占位提示
- [X] T047 [US5] 在 `src/data/repository.ts` 接入菜单修改、预订状态更新和订单状态更新函数
- [X] T048 [US5] 在 `src/app/App.tsx` 接入后台页面路由
- [X] T049 [US5] 在 `src/styles/app.css` 添加后台表格、状态选择、表单和警示提示样式
- [X] T050 [US5] 验证后台修改会反映到顾客侧菜单和后台列表，并记录结果到 `tests/manual/restaurant-web-app.md`

**检查点**：后台基础管理闭环完成，但仍明确标注为开发占位能力。

---

## Phase 8: Polish & Cross-Cutting Concerns（收尾与横切关注点）

**目的**：完成质量、性能、可访问性和文档验证。

- [X] T051 [P] 在 `tests/manual/restaurant-web-app.md` 补充移动端和桌面端响应式完整检查结果
- [X] T052 [P] 在 `tests/manual/restaurant-web-app.md` 补充键盘可达性、表单标签和状态文字验证结果
- [X] T053 在 `src/styles/app.css` 优化全局间距、按钮状态、焦点状态、错误状态和空状态视觉一致性
- [X] T054 运行 `npm run typecheck` 并修复发现的问题
- [X] T055 运行 `npm run lint` 并修复发现的问题
- [X] T056 运行 `npm run build` 并修复发现的问题
- [X] T057 按 `specs/001-restaurant-web-app/quickstart.md` 完整验证所有流程并更新 `tests/manual/restaurant-web-app.md`

---

## 依赖关系与执行顺序

### Phase 依赖

- **Setup（Phase 1）**：无依赖，可立即开始。
- **Foundational（Phase 2）**：依赖 Setup 完成，阻塞所有用户故事。
- **US1 首页（Phase 3）**：依赖 Foundational，是 MVP 起点。
- **US2 菜单（Phase 4）**：依赖 Foundational，可与 US1 部分并行，但演示入口依赖 US1。
- **US3 预订（Phase 5）**：依赖 Foundational 和导航接入。
- **US4 点单（Phase 6）**：依赖菜单数据和可售校验，建议在 US2 后执行。
- **US5 后台（Phase 7）**：依赖 repository 和预订/订单数据结构，建议在 US3/US4 后执行。
- **Polish（Phase 8）**：依赖计划内目标故事完成。

### 用户故事依赖

- **US1**：可在基础设施完成后独立实现。
- **US2**：可在基础设施完成后独立实现，点单故事会复用其菜单展示和可售校验。
- **US3**：可独立提交预订请求，不依赖点单。
- **US4**：依赖菜单和购物车相关基础能力。
- **US5**：整合菜单、预订和订单管理，适合作为最后一个功能故事。

### 并行机会

- T002、T003、T004 可并行。
- T006、T007、T008、T009 可并行。
- 各用户故事中的 `[P]` 组件任务可并行，但同一文件 `src/app/App.tsx` 和 `src/data/repository.ts` 的修改需要串行整合。
- US3 和 US4 的表单组件可并行开发，只要 repository 接口先约定完成。
- US5 的四个后台子组件 T042、T043、T044、T045 可并行。

## 并行执行示例

```text
并行任务组 A（基础类型）：
- T006 src/domain/restaurant.ts
- T007 src/domain/menu.ts
- T008 src/domain/reservations.ts
- T009 src/domain/orders.ts

并行任务组 B（菜单故事）：
- T020 src/components/menu/MenuFilters.tsx
- T021 src/components/menu/MenuItemCard.tsx

并行任务组 C（后台故事）：
- T042 src/components/admin/AdminSummary.tsx
- T043 src/components/admin/MenuManager.tsx
- T044 src/components/admin/ReservationManager.tsx
- T045 src/components/admin/OrderManager.tsx
```

## 实施策略

### MVP 优先

1. 完成 Phase 1 和 Phase 2。
2. 完成 US1 首页和 US2 菜单。
3. 停下验证：首页入口、菜单分类、标签筛选、不可售状态和响应式布局。
4. 之后再加入预订、点单和后台。

### 增量交付

1. 首页 + 菜单形成可展示 MVP。
2. 加入预订请求，形成到店转化流程。
3. 加入点单/购物车请求，形成订单转化流程。
4. 加入后台管理，形成运营闭环。
5. 最后统一做响应式、可访问性、性能和构建验证。

## 格式验证

- 所有任务均使用 `- [ ] T###` 复选框格式。
- 用户故事阶段任务均包含 `[US#]` 标签。
- 可并行任务使用 `[P]` 标记。
- 每个实现任务都包含明确文件路径。

