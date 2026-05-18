# 餐厅项目技术与 Supabase 接入分析

本文说明当前餐厅 Web 项目使用的技术、前端数据流、Supabase 数据库结构、安全策略，以及为什么本地和 Vercel 发布环境需要分别配置环境变量。

## 1. 项目总体技术栈

当前项目是一个纯前端 React 单页应用，后端数据使用 Supabase。

主要技术如下：

| 类型 | 使用内容 | 作用 |
|---|---|---|
| 前端框架 | React 18 | 负责页面组件、状态变化、交互渲染 |
| 构建工具 | Vite 5 | 本地开发服务、生产构建、读取 `VITE_` 环境变量 |
| 语言 | TypeScript | 给菜单、订单、预订等数据加类型约束 |
| 数据库/后端 | Supabase Postgres + Data API | 存菜单、订单、预订、餐厅资料 |
| 部署目标 | Vercel | 从 GitHub 拉代码构建并发布网页 |
| 本地状态兜底 | localStorage | Supabase 未配置或请求失败时，页面仍能用假数据运行 |

项目不是传统“前端 + 自己写 Node 后端”的结构。现在是：

```text
React/Vite 前端
   ↓ fetch 请求
Supabase REST API
   ↓
Postgres 数据库
```

## 2. 关键目录和文件

| 文件 | 作用 |
|---|---|
| `src/app/App.tsx` | 应用入口，把 repository 的数据传给点餐页面 |
| `src/components/orders/OrderingStorePage.tsx` | 当前主要点餐页面，类似外卖/美团点餐布局 |
| `src/data/repository.ts` | 数据仓库层，负责读取 Supabase、提交订单、提交预订，并保留本地兜底 |
| `src/data/supabaseClient.ts` | Supabase REST 请求封装 |
| `src/data/seed.ts` | 本地默认餐厅、分类、标签、菜品数据 |
| `src/domain/*.ts` | 菜品、订单、预订、餐厅资料的 TypeScript 类型 |
| `supabase/restaurant_backend.sql` | 建表、RLS、权限、初始数据 SQL |
| `.env` | 本地真实 Supabase 配置，不上传 GitHub |
| `.env.example` | 环境变量模板，会上传 GitHub |

## 3. 为什么不用上传 `.env`

本地 `.env` 里放的是：

```env
VITE_SUPABASE_URL=https://gouakbpzpvhuazwscqsl.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

`.env` 不上传 GitHub，因为它属于环境配置，不属于代码。

发布到 Vercel 后，Vercel 不会读取你电脑里的 `.env`。所以必须在 Vercel 项目后台配置同样的环境变量：

```env
VITE_SUPABASE_URL=https://gouakbpzpvhuazwscqsl.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
```

位置：

```text
Vercel 项目 → Settings → Environment Variables
```

配置完以后要重新部署。否则发布页拿不到 Supabase 地址和 key，会退回本地假数据，所以你在 Supabase 改数据，发布页看起来不会变。

## 4. 前端怎么连接 Supabase

连接逻辑在：

```text
src/data/supabaseClient.ts
```

核心逻辑是：

```ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

Vite 只会把 `VITE_` 开头的环境变量暴露给前端，所以变量名必须叫：

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

请求 Supabase 时，代码会拼出 REST API 地址：

```text
${VITE_SUPABASE_URL}/rest/v1/表名
```

例如读取菜单：

```text
https://gouakbpzpvhuazwscqsl.supabase.co/rest/v1/menu_items?select=*&order=name.asc
```

请求头里会带：

```http
apikey: sb_publishable_...
Content-Type: application/json
```

当前项目没有使用 `@supabase/supabase-js` SDK，而是直接使用浏览器原生 `fetch` 调 Supabase REST API。

这么做的原因是：你当前 Supabase 新版 `sb_publishable_...` key 在直接 REST 请求里，只带 `apikey` 能正常插入订单；之前用 SDK/Authorization 方式测试时，订单写入被 RLS 拦截。所以现在项目采用更直接、更可控的 REST 请求方式。

## 5. 数据读取流程

页面启动时：

```text
App.tsx
  ↓
repository.getState()
  ↓
先返回本地 seed/localStorage 数据
  ↓
repository.subscribe()
  ↓
startSupabaseLoad()
  ↓
loadSupabaseState()
  ↓
从 Supabase 拉餐厅、分类、标签、菜单
  ↓
save()
  ↓
通知 React 更新页面
```

读取的表包括：

```text
restaurants
menu_categories
dietary_tags
menu_items
```

当前前台点餐页主要展示菜单数据，不展示后台订单列表。

所以如果你在 Supabase 里改 `orders.status`，前台页面不会明显变化。要让餐厅工作人员确认订单，需要继续做后台订单管理页面。

## 6. 下单写入流程

用户在页面里操作：

```text
选择菜品 → 填姓名/联系方式 → 点“去结算”
```

代码流程：

```text
OrderingStorePage.submitOrder()
  ↓
onCreateOrder(input)
  ↓
repository.createOrder(input)
  ↓
生成订单对象，状态 status = pending
  ↓
先保存到本地 state/localStorage
  ↓
调用 persistOrder(order)
  ↓
POST 到 Supabase /rest/v1/orders
```

订单写入的表是：

```text
orders
```

写入的数据大概是：

```json
{
  "id": "order-...",
  "customer_name": "顾客姓名",
  "contact": "手机号或邮箱",
  "fulfillment": "到店自取",
  "items": [
    {
      "menuItemId": "lotus-root",
      "nameSnapshot": "桂花糯米藕",
      "priceSnapshot": 28,
      "quantity": 1,
      "lineTotal": 28
    }
  ],
  "subtotal": 28,
  "total": 28,
  "notes": "网页点餐提交",
  "status": "pending",
  "created_at": "提交时间"
}
```

页面提示：

```text
订单请求已提交，等待餐厅确认
```

这表示订单已经进入“待确认”状态。餐厅确认目前可以先去 Supabase 的 `orders` 表里手动修改 `status`。

## 7. Supabase 数据库表

SQL 文件在：

```text
supabase/restaurant_backend.sql
```

它创建了这些表：

| 表名 | 作用 |
|---|---|
| `restaurants` | 餐厅基础资料：名字、电话、地址、营业时间 |
| `menu_categories` | 菜品分类：前菜、主菜、面饭、饮品、甜点 |
| `dietary_tags` | 饮食标签：招牌、素食、辣味等 |
| `menu_items` | 菜品数据：名称、价格、图片、上下架 |
| `orders` | 顾客订单请求 |
| `reservations` | 顾客预订请求 |
| `admin_profiles` | 后续后台管理员权限用 |

## 8. RLS 和权限是什么意思

Supabase 表默认可能会暴露给前端 API，所以必须开启 RLS。

RLS 是 Row Level Security，行级安全策略。你可以理解成数据库里的门禁规则。

项目 SQL 中做了两件事：

1. `grant`：允许某类用户访问某张表的某类操作。
2. `policy`：限制具体能看哪些数据、能写哪些数据。

例如：

```sql
grant select on public.menu_items to anon, authenticated;
```

意思是：允许匿名顾客和登录用户读取菜单表。

```sql
create policy "public can read available menu items" on public.menu_items
for select to anon, authenticated
using (available = true);
```

意思是：顾客只能看到 `available = true` 的菜品。

所以如果你在 Supabase 把某个菜品改成：

```text
available = false
```

它可能不会在前台显示。

订单策略：

```sql
create policy "public can create pending orders" on public.orders
for insert to anon, authenticated
with check (status = 'pending');
```

意思是：顾客只能新增 `pending` 状态的订单，不能自己创建 `accepted`、`completed` 这种已经确认/完成的订单。

## 9. 为什么 Supabase 改了数据，发布页没变

常见原因有四个：

### 9.1 Vercel 没配置环境变量

这是最常见原因。

本地 `.env` 不会上传 GitHub，也不会自动进入 Vercel。

如果 Vercel 没有配置：

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

发布页就不会连 Supabase，而是使用本地 seed/localStorage 兜底数据。

### 9.2 配完环境变量后没有重新部署

Vite 的环境变量是在构建时写进前端包里的。

所以 Vercel 配完变量后必须 Redeploy。

### 9.3 页面不是实时监听

当前页面是打开时拉一次 Supabase 数据，不是实时同步。

如果你在 Supabase 后台改了菜单，需要刷新网页。

如果要做到 Supabase 一改，页面自动变化，需要增加 Supabase Realtime 或轮询。

### 9.4 改的是订单状态，不是菜单展示数据

当前顾客点餐页不会展示订单确认状态。

如果你改 `orders.status`，前台菜单页不会变化。这个变化以后应该在“后台订单管理页”或“订单详情页”里展示。

## 10. 本地数据兜底机制

`repository.ts` 里有两套数据来源：

1. Supabase 数据：真实后端。
2. seed/localStorage：本地兜底。

这样做的好处：

- 没配 Supabase 时，页面仍能打开。
- Supabase 请求失败时，用户不至于看到空白页。
- 本地开发更方便。

坏处是：

- 如果发布环境变量没配好，页面看起来还是“能用”，但其实没连真后端。
- 所以部署后必须检查 Network 请求或 Supabase 表数据是否变化。

## 11. 当前已经验证过的后端能力

已经验证：

| 能力 | 结果 |
|---|---|
| 从 Supabase 读取 `menu_items` | 成功，HTTP 200 |
| 往 Supabase 写入 `orders` | 成功，HTTP 201 |
| TypeScript 类型检查 | 通过 |
| Vite 生产构建 | 通过 |
| GitHub 推送 | 已推送 |

## 12. 现在还缺什么

当前“顾客下单 → Supabase 收到订单”已经通了。

还缺正式后台能力：

1. 后台登录。
2. 后台订单列表。
3. 接受订单、拒绝订单、制作中、已完成。
4. 菜单后台管理真正走 Supabase 权限。
5. 顾客查看自己订单状态。
6. Supabase Realtime 或定时刷新，让状态变化自动出现在页面。

## 13. 推荐下一步

建议下一步做“后台订单管理页”：

```text
/admin
```

页面功能：

- 读取 `orders` 表。
- 展示顾客姓名、联系方式、菜品、总价、状态。
- 按钮：接受、拒绝、制作中、完成。
- 点击按钮后更新 Supabase 的 `orders.status`。

这样餐厅工作人员就不用去 Supabase 后台手动改订单了。
