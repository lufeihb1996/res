# 数据模型：餐厅 Web 应用

## RestaurantProfile 餐厅信息

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 单餐厅标识 |
| name | string | 是 | 餐厅名称 |
| cuisine | string | 是 | 餐饮定位 |
| tagline | string | 否 | 首页展示短句 |
| phone | string | 是 | 联系电话 |
| address | string | 是 | 地址 |
| hours | string[] | 是 | 营业时间说明 |
| contactNotes | string | 否 | 到店或联系说明 |

## MenuCategory 菜单分类

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 分类标识 |
| name | string | 是 | 分类名称 |
| description | string | 否 | 分类说明 |
| sortOrder | number | 是 | 展示顺序 |

**验证规则**：名称不能为空；排序值必须为非负数。

## DietaryTag 饮食标签

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 标签标识 |
| label | string | 是 | 展示文本 |
| description | string | 否 | 标签说明 |

## MenuItem 菜品

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 菜品标识 |
| categoryId | string | 是 | 所属分类 |
| name | string | 是 | 菜品名称 |
| description | string | 是 | 菜品描述 |
| price | number | 是 | 菜品价格 |
| imageUrl | string | 否 | 展示图片 |
| tagIds | string[] | 否 | 饮食标签 |
| available | boolean | 是 | 是否可售 |
| featured | boolean | 否 | 是否推荐 |

**验证规则**：名称和描述不能为空；价格必须大于等于 0；categoryId 必须指向已存在分类；不可售菜品不能加入购物车。

## CartItem 购物车项

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| menuItemId | string | 是 | 菜品标识 |
| quantity | number | 是 | 数量 |

**验证规则**：数量必须大于 0；菜品必须存在且可售。

## ReservationRequest 预订请求

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 请求标识 |
| customerName | string | 是 | 顾客姓名 |
| contact | string | 是 | 手机号或邮箱 |
| date | string | 是 | 预订日期 |
| time | string | 是 | 预订时间 |
| partySize | number | 是 | 人数 |
| notes | string | 否 | 备注 |
| status | ReservationStatus | 是 | 请求状态 |
| createdAt | string | 是 | 创建时间 |

**状态**：`pending`、`accepted`、`declined`、`completed`  
**状态转换**：新请求进入 `pending`；后台可从 `pending` 改为 `accepted` 或 `declined`；已接受请求可改为 `completed`。

## OrderRequest 订单请求

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string | 是 | 请求标识 |
| customerName | string | 是 | 顾客姓名 |
| contact | string | 是 | 手机号或邮箱 |
| fulfillment | string | 是 | 取餐方式 |
| items | OrderLineItem[] | 是 | 菜品明细 |
| subtotal | number | 是 | 小计 |
| total | number | 是 | 总计 |
| notes | string | 否 | 备注 |
| status | OrderStatus | 是 | 订单状态 |
| createdAt | string | 是 | 创建时间 |

**状态**：`pending`、`accepted`、`preparing`、`ready`、`declined`、`completed`  
**状态转换**：新请求进入 `pending`；后台可接受或拒绝；已接受后可进入制作中、可取餐和已完成。

## OrderLineItem 订单明细

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| menuItemId | string | 是 | 菜品标识 |
| nameSnapshot | string | 是 | 提交时菜品名称 |
| priceSnapshot | number | 是 | 提交时价格 |
| quantity | number | 是 | 数量 |
| lineTotal | number | 是 | 行小计 |

**验证规则**：数量必须大于 0；价格快照不能为负；lineTotal 等于 priceSnapshot 与 quantity 的乘积。
