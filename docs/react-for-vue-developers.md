# 给 Vue 使用者的 React 入门教程：结合餐厅项目学习

这份教程不是泛泛讲 React，而是围绕当前餐厅项目来学。你已经会一点 Vue，所以我会尽量用 Vue 的概念对照 React。

当前项目技术栈是：

```text
React + Vite + TypeScript + Supabase
```

你最应该先看的文件是：

```text
src/components/orders/OrderingStorePage.tsx
```

这个文件就是当前点餐页面，里面包含了 React 入门最核心的东西：

- 组件
- props
- useState
- useMemo
- 表单输入
- 点击事件
- 列表渲染
- 条件渲染
- 购物车状态
- 提交订单

---

## 1. 先建立一个核心认知

Vue 的感觉是：

```text
模板 template + 响应式变量 ref/reactive/computed
```

React 的感觉是：

```text
函数组件 + state + JSX
```

React 里页面变化的核心流程是：

```text
用户操作
  ↓
调用 setState
  ↓
React 重新执行组件函数
  ↓
生成新的 JSX
  ↓
页面更新
```

所以 React 组件不是“只执行一次”。只要 state 变了，组件函数会重新执行。

例如：

```tsx
const [cartItems, setCartItems] = useState<CartItem[]>([]);
```

当调用：

```tsx
setCartItems([...cartItems, newItem]);
```

React 会重新执行当前组件，然后页面里的购物车数量、总价都会重新计算和显示。

---

## 2. React 组件是什么

Vue 单文件组件一般是：

```vue
<template>
  <h1>{{ title }}</h1>
</template>

<script setup lang="ts">
const title = '餐厅'
</script>
```

React 组件是一个函数：

```tsx
function Page() {
  const title = "餐厅";

  return <h1>{title}</h1>;
}
```

重点：

- React 组件名字一般大写开头。
- 组件返回 JSX。
- JSX 看起来像 HTML，但其实是 JavaScript 表达式。

当前项目入口：

```text
src/app/App.tsx
```

里面有：

```tsx
export function App() {
  const [state, setState] = useState<RestaurantState>(() => repository.getState());

  useEffect(() => repository.subscribe(setState), []);

  return (
    <OrderingStorePage
      categories={state.categories}
      menuItems={state.menuItems}
      profile={state.profile}
      tags={state.tags}
      onCreateOrder={(input) => repository.createOrder(input)}
    />
  );
}
```

这就是一个 React 组件。

它做了三件事：

1. 从 `repository` 拿初始数据。
2. 订阅数据变化。
3. 把数据传给 `OrderingStorePage`。

---

## 3. JSX 是什么

React 里写页面用 JSX：

```tsx
return (
  <div>
    <h1>{profile.name}</h1>
    <p>{profile.address}</p>
  </div>
);
```

Vue 模板里写变量：

```vue
<h1>{{ profile.name }}</h1>
```

React JSX 里写变量：

```tsx
<h1>{profile.name}</h1>
```

大括号 `{}` 里面可以放 JavaScript 表达式：

```tsx
<strong>{formatPrice(subtotal)}</strong>
```

这个意思是：调用 `formatPrice` 函数，把总价格式化成人民币。

---

## 4. Props：父组件给子组件传数据

Vue 里子组件接 props：

```ts
defineProps<{
  title: string
}>()
```

React 里通常这样写：

```tsx
interface DishCardProps {
  title: string;
}

function DishCard({ title }: DishCardProps) {
  return <h3>{title}</h3>;
}
```

当前项目里的 `OrderingStorePage` props：

```tsx
interface OrderingStorePageProps {
  profile: RestaurantProfile;
  categories: MenuCategory[];
  tags: DietaryTag[];
  menuItems: MenuItem[];
  onCreateOrder: (input: OrderInput) => void;
}
```

这表示这个页面需要父组件传进来：

- 餐厅资料 `profile`
- 菜品分类 `categories`
- 标签 `tags`
- 菜品列表 `menuItems`
- 下单函数 `onCreateOrder`

组件函数接收 props：

```tsx
export function OrderingStorePage({
  profile,
  categories,
  tags,
  menuItems,
  onCreateOrder,
}: OrderingStorePageProps) {
  // ...
}
```

这个写法叫“解构”。

等价于：

```tsx
function OrderingStorePage(props: OrderingStorePageProps) {
  const profile = props.profile;
  const categories = props.categories;
}
```

---

## 5. useState：React 的本地状态

Vue 里：

```ts
const count = ref(0)
count.value++
```

React 里：

```tsx
const [count, setCount] = useState(0);
setCount(count + 1);
```

你不能直接这样写：

```tsx
count = count + 1;
```

因为 React 不会知道你改了。

必须调用 `setCount`。

当前项目里：

```tsx
const [cartItems, setCartItems] = useState<CartItem[]>([]);
```

意思是：

- `cartItems` 是购物车数组。
- `setCartItems` 是修改购物车的方法。
- 初始值是空数组 `[]`。

再看：

```tsx
const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
```

意思是：

- `selectedItem` 表示当前点开的菜品详情。
- 一开始没有选中菜品，所以是 `null`。
- 点击菜品图片时，调用 `setSelectedItem(item)`，弹出详情弹窗。
- 关闭弹窗时，调用 `setSelectedItem(null)`。

---

## 6. 修改数组状态

React 修改数组时，不要直接改原数组。

不要这样：

```tsx
cartItems.push(newItem);
setCartItems(cartItems);
```

推荐创建新数组：

```tsx
setCartItems([...cartItems, newItem]);
```

当前项目里的加菜逻辑：

```tsx
setCartItems((current) => {
  const existing = current.find((cartItem) => cartItem.menuItemId === item.id);

  if (existing) {
    return current.map((cartItem) =>
      cartItem.menuItemId === item.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem,
    );
  }

  return [...current, { menuItemId: item.id, quantity: 1 }];
});
```

这段逻辑是：

1. 看购物车里有没有这个菜。
2. 如果有，数量 +1。
3. 如果没有，新增一行。

这里用了函数式更新：

```tsx
setCartItems((current) => {
  return next;
});
```

这样写的好处是：`current` 永远是最新的状态。

---

## 7. 列表渲染 map

Vue：

```vue
<div v-for="item in menuItems" :key="item.id">
  {{ item.name }}
</div>
```

React：

```tsx
{menuItems.map((item) => (
  <div key={item.id}>{item.name}</div>
))}
```

当前项目菜品列表：

```tsx
{(activeCategory === "featured" ? featuredItems : visibleItems).map((item) => (
  <article className="dish-row" key={item.id}>
    <button className="dish-image-button" type="button" onClick={() => setSelectedItem(item)}>
      <img alt={item.name} src={item.imageUrl} />
    </button>
    <div className="dish-info">
      <h3>{item.name}</h3>
      <p>{item.description}</p>
    </div>
  </article>
))}
```

重点：

- React 列表必须加 `key`。
- `key` 要稳定，通常用数据库 id。
- 不能随便用数组 index，除非列表不会变化。

---

## 8. 条件渲染

Vue：

```vue
<div v-if="notice">{{ notice }}</div>
```

React：

```tsx
{notice ? <div>{notice}</div> : null}
```

或者：

```tsx
{notice && <div>{notice}</div>}
```

当前项目提示消息：

```tsx
{notice ? <div className="toast">{notice}</div> : null}
```

当前项目弹窗：

```tsx
{selectedItem ? (
  <div className="dish-modal-backdrop">
    ...
  </div>
) : null}
```

意思是：

- 如果 `selectedItem` 有值，显示菜品详情弹窗。
- 如果是 `null`，不显示。

---

## 9. 事件绑定

Vue：

```vue
<button @click="addItem">+</button>
```

React：

```tsx
<button onClick={addItem}>+</button>
```

如果要传参数：

Vue：

```vue
<button @click="addItem(item)">+</button>
```

React：

```tsx
<button onClick={() => addItem(item)}>+</button>
```

当前项目：

```tsx
<button className="add-button" type="button" onClick={() => addItem(item)}>
  +
</button>
```

注意：不要写成：

```tsx
onClick={addItem(item)}
```

这会在渲染时立刻执行，不是点击时执行。

---

## 10. 表单输入 value + onChange

Vue 里常用：

```vue
<input v-model="name" />
```

React 没有 `v-model`，通常写成：

```tsx
<input
  value={name}
  onChange={(event) => setName(event.target.value)}
/>
```

当前项目里：

```tsx
<input
  placeholder="姓名"
  value={checkout.customerName}
  onChange={(event) => setCheckout({ ...checkout, customerName: event.target.value })}
/>
```

这段等价于 Vue 的：

```vue
<input v-model="checkout.customerName" />
```

但 React 需要你手动写更新逻辑：

```tsx
setCheckout({
  ...checkout,
  customerName: event.target.value,
});
```

`...checkout` 的意思是保留原对象的其他字段。

如果不写 `...checkout`，你会把 `contact`、`fulfillment` 等字段弄丢。

---

## 11. useMemo：类似 computed

Vue：

```ts
const subtotal = computed(() => {
  return cartItems.value.reduce(...)
})
```

React：

```tsx
const subtotal = useMemo(() => {
  return cartItems.reduce(...);
}, [cartItems]);
```

当前项目里有：

```tsx
const visibleItems = useMemo(
  () => menuItems.filter((item) => item.categoryId === activeCategory),
  [activeCategory, menuItems],
);
```

意思是：

- 根据当前分类筛选菜品。
- 只有 `activeCategory` 或 `menuItems` 变化时，才重新计算。

不是所有计算都必须用 `useMemo`。

简单计算可以直接写：

```tsx
const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
```

---

## 12. useEffect：类似 onMounted/watchEffect

Vue：

```ts
onMounted(() => {
  loadData()
})
```

React：

```tsx
useEffect(() => {
  loadData();
}, []);
```

`[]` 表示只执行一次，类似 `onMounted`。

当前项目入口：

```tsx
useEffect(() => repository.subscribe(setState), []);
```

意思是：

1. 页面加载后订阅 repository。
2. repository 数据变化时调用 `setState`。
3. 组件卸载时取消订阅。

`repository.subscribe(setState)` 返回一个取消订阅函数，React 会在组件卸载时自动调用。

---

## 13. TypeScript 类型怎么读

React + TypeScript 经常写：

```tsx
interface CheckoutForm {
  customerName: string;
  contact: string;
  fulfillment: string;
}
```

这不是运行时代码，而是类型说明。

意思是 `checkout` 这个对象应该长这样：

```ts
{
  customerName: string;
  contact: string;
  fulfillment: string;
}
```

项目里的菜品类型：

```text
src/domain/menu.ts
```

里面有：

```ts
export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  tagIds: string[];
  available: boolean;
  featured?: boolean;
}
```

注意：

```ts
imageUrl?: string
```

问号 `?` 表示可有可无。

---

## 14. 当前项目的数据流

你可以这样理解整个项目：

```text
Supabase / seed 数据
  ↓
repository.ts
  ↓
App.tsx
  ↓
OrderingStorePage.tsx
  ↓
用户点击、输入、下单
  ↓
repository.createOrder()
  ↓
Supabase orders 表
```

`repository.ts` 是数据中转站。

页面组件不直接知道 Supabase 细节，它只调用：

```tsx
onCreateOrder(input)
```

真正写数据库的逻辑在：

```text
src/data/repository.ts
```

---

## 15. 你应该怎么读 OrderingStorePage.tsx

建议按这个顺序读：

### 第一步：看 props

```tsx
interface OrderingStorePageProps {
  profile: RestaurantProfile;
  categories: MenuCategory[];
  tags: DietaryTag[];
  menuItems: MenuItem[];
  onCreateOrder: (input: OrderInput) => void;
}
```

先知道这个组件需要哪些数据。

### 第二步：看 useState

```tsx
const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "all");
const [cartItems, setCartItems] = useState<CartItem[]>([]);
const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
const [checkout, setCheckout] = useState(initialCheckout);
const [notice, setNotice] = useState("");
```

这些就是页面自己的状态。

### 第三步：看派生数据

```tsx
const featuredItems = menuItems.filter((item) => item.featured);
const visibleItems = useMemo(...);
const cartLines = cartItems.map(...);
const subtotal = cartLines.reduce(...);
const cartCount = cartItems.reduce(...);
```

这些不是用户直接改的状态，而是根据状态计算出来的数据。

### 第四步：看函数

```tsx
function addItem(item: MenuItem): void {}
function updateQuantity(menuItemId: string, quantity: number): void {}
function submitOrder(): void {}
```

这些函数就是页面行为。

### 第五步：看 return

`return (...)` 里面就是页面结构。

---

## 16. React 初学最容易犯的错

### 错误 1：直接改 state

不要：

```tsx
cartItems.push(item);
```

要：

```tsx
setCartItems([...cartItems, item]);
```

### 错误 2：事件函数写错

不要：

```tsx
onClick={addItem(item)}
```

要：

```tsx
onClick={() => addItem(item)}
```

### 错误 3：表单忘记 onChange

如果写：

```tsx
<input value={checkout.customerName} />
```

这个输入框会变成只读。

要写：

```tsx
<input
  value={checkout.customerName}
  onChange={(event) => setCheckout({ ...checkout, customerName: event.target.value })}
/>
```

### 错误 4：列表不写 key

不要：

```tsx
{items.map((item) => <div>{item.name}</div>)}
```

要：

```tsx
{items.map((item) => <div key={item.id}>{item.name}</div>)}
```

### 错误 5：把所有东西都放 useEffect

能直接计算的，不要放 `useEffect`。

比如总价：

```tsx
const subtotal = cartLines.reduce(...);
```

不要写成：

```tsx
useEffect(() => {
  setSubtotal(...)
}, [cartLines]);
```

---

## 17. 用 Vue 思维理解 React

| Vue | React |
|---|---|
| `.vue` 单文件组件 | `.tsx` 函数组件 |
| `template` | `return JSX` |
| `props` / `defineProps` | 函数参数 props |
| `ref` | `useState` |
| `computed` | 普通变量或 `useMemo` |
| `onMounted` | `useEffect(..., [])` |
| `v-if` | `{condition ? ... : null}` |
| `v-for` | `array.map(...)` |
| `@click` | `onClick` |
| `v-model` | `value + onChange` |
| `emit` | 父组件传回调函数 |

React 里没有 `emit` 这个概念。

Vue 子组件通知父组件：

```ts
emit('submit', data)
```

React 通常是父组件传函数给子组件：

```tsx
<Child onSubmit={(data) => save(data)} />
```

子组件里调用：

```tsx
onSubmit(data);
```

当前项目里：

```tsx
<OrderingStorePage
  onCreateOrder={(input) => repository.createOrder(input)}
/>
```

子组件里：

```tsx
onCreateOrder({ ...checkout, notes: "网页点餐提交", cartItems });
```

这就是 React 版的“子组件通知父组件”。

---

## 18. 练习：你可以这样改代码

### 练习 1：改按钮文字

找到：

```tsx
<button className="checkout-button" type="button" onClick={submitOrder}>
  去结算
</button>
```

改成：

```tsx
提交订单
```

观察页面变化。

### 练习 2：增加一个取餐方式

找到：

```tsx
<select value={checkout.fulfillment}>
  <option>到店自取</option>
  <option>到店堂食</option>
</select>
```

加：

```tsx
<option>外卖配送</option>
```

### 练习 3：添加提示文案

找到购物车标题：

```tsx
<h2>购物车</h2>
```

下面加一行：

```tsx
<p className="cart-hint">提交后餐厅会确认订单</p>
```

然后去 CSS 里写样式。

---

## 19. 学 React 的推荐路线

不要一上来学太多生态。

按这个顺序：

1. JSX
2. 组件
3. props
4. useState
5. 列表渲染
6. 条件渲染
7. 表单
8. useEffect
9. 组件拆分
10. 数据请求
11. 路由
12. Next.js

你现在先不要急着学：

- Redux
- Zustand
- React Query
- Next.js
- 支付宝对接
- SSR

先把这个文件看懂：

```text
src/components/orders/OrderingStorePage.tsx
```

再看：

```text
src/app/App.tsx
src/data/repository.ts
```

---

## 20. 这项目里 React 的一句话总结

当前项目的 React 页面，本质就是：

```text
用 useState 保存页面状态
用 props 接收后端数据
用 map 渲染菜单列表
用 onClick / onChange 响应用户操作
用 repository 把订单写到 Supabase
```

你把这几个点吃透，就能开始改这个项目了。
