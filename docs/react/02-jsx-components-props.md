# 02. JSX、组件、Props、Children

## 本章目标

读完这一章，你应该能：

- 看懂 JSX。
- 写一个 React 函数组件。
- 用 props 传数据。
- 用 children 做插槽类效果。
- 知道 React 组件为什么要大写开头。

## 1. JSX 是什么

JSX 是 React 里描述 UI 的语法。

它看起来像 HTML：

```tsx
const title = <h1>Hello React</h1>;
```

但它不是普通 HTML，而是 JavaScript 里的语法扩展。

你可以在 JSX 中用 `{}` 写 JavaScript 表达式：

```tsx
const name = "张三";

function App() {
  return <h1>你好，{name}</h1>;
}
```

渲染结果：

```text
你好，张三
```

## 2. JSX 中可以写什么

JSX 的 `{}` 里可以写表达式。

可以：

```tsx
<p>{1 + 1}</p>
<p>{user.name}</p>
<p>{formatPrice(price)}</p>
<p>{isLogin ? "已登录" : "未登录"}</p>
```

不可以直接写语句：

```tsx
<p>{if (isLogin) { return "已登录" }}</p>
```

因为 `if` 是语句，不是表达式。

可以先在外面算好：

```tsx
let text = "未登录";

if (isLogin) {
  text = "已登录";
}

return <p>{text}</p>;
```

## 3. JSX 必须有一个根节点

错误：

```tsx
function App() {
  return (
    <h1>标题</h1>
    <p>内容</p>
  );
}
```

正确：

```tsx
function App() {
  return (
    <div>
      <h1>标题</h1>
      <p>内容</p>
    </div>
  );
}
```

如果不想多一层 `div`，用 Fragment：

```tsx
function App() {
  return (
    <>
      <h1>标题</h1>
      <p>内容</p>
    </>
  );
}
```

`<>...</>` 不会生成真实 DOM 节点。

## 4. JSX 属性和 HTML 的区别

### class 要写 className

HTML：

```html
<div class="card"></div>
```

React：

```tsx
<div className="card"></div>
```

### for 要写 htmlFor

HTML：

```html
<label for="email">邮箱</label>
```

React：

```tsx
<label htmlFor="email">邮箱</label>
```

### style 用对象

HTML：

```html
<div style="color: red; font-size: 20px"></div>
```

React：

```tsx
<div style={{ color: "red", fontSize: 20 }}></div>
```

注意：

- 外层 `{}` 表示进入 JavaScript。
- 内层 `{}` 是对象。
- `font-size` 变成 `fontSize`。

## 5. 组件是什么

React 组件就是一个返回 JSX 的函数。

```tsx
function Button() {
  return <button>点击</button>;
}
```

使用组件：

```tsx
function App() {
  return (
    <div>
      <Button />
      <Button />
    </div>
  );
}
```

## 6. 组件必须大写开头

正确：

```tsx
function UserCard() {
  return <div>用户卡片</div>;
}
```

错误或不推荐：

```tsx
function userCard() {
  return <div>用户卡片</div>;
}
```

原因：

```tsx
<div />
```

小写会被 React 当成原生 HTML 标签。

```tsx
<UserCard />
```

大写会被 React 当成自定义组件。

## 7. Props 是什么

Props 是父组件传给子组件的数据。

子组件：

```tsx
function UserCard(props: { name: string; age: number }) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>{props.age} 岁</p>
    </div>
  );
}
```

父组件：

```tsx
function App() {
  return <UserCard name="张三" age={18} />;
}
```

更常见写法是解构：

```tsx
function UserCard({ name, age }: { name: string; age: number }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age} 岁</p>
    </div>
  );
}
```

## 8. 用 interface 写 props 类型

当 props 多了，建议单独定义接口：

```tsx
interface UserCardProps {
  name: string;
  age: number;
  avatarUrl?: string;
}

function UserCard({ name, age, avatarUrl }: UserCardProps) {
  return (
    <div>
      {avatarUrl ? <img src={avatarUrl} alt={name} /> : null}
      <h2>{name}</h2>
      <p>{age} 岁</p>
    </div>
  );
}
```

`avatarUrl?: string` 的 `?` 表示可选。

## 9. Props 是只读的

不要在子组件里修改 props：

```tsx
function UserCard({ user }: { user: User }) {
  user.name = "李四";
  return <div>{user.name}</div>;
}
```

这会让数据流混乱。

正确思路是：

```text
父组件拥有数据
父组件把数据通过 props 传给子组件
子组件需要修改时，调用父组件传来的回调函数
```

## 10. Children：React 里的插槽

Vue 有 slot：

```vue
<Card>
  <p>内容</p>
</Card>
```

React 用 `children`：

```tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <section className="card">
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
```

使用：

```tsx
<Card title="订单信息">
  <p>订单号：1001</p>
  <button>确认</button>
</Card>
```

`children` 就是组件标签中间的内容。

## 11. 什么时候拆组件

建议拆组件的情况：

- 一段 JSX 太长。
- 某块 UI 会重复出现。
- 某块 UI 有独立逻辑。
- 父组件已经很难读。
- 你想给某块 UI 单独命名。

例如商品卡片：

```tsx
function ProductCard({ name, price }: { name: string; price: number }) {
  return (
    <article>
      <h3>{name}</h3>
      <strong>¥{price}</strong>
    </article>
  );
}
```

列表页面：

```tsx
function ProductList({ products }: { products: Product[] }) {
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} name={product.name} price={product.price} />
      ))}
    </div>
  );
}
```

## 12. 常见错误

### 错误 1：组件小写开头

不要：

```tsx
function userCard() {}
```

要：

```tsx
function UserCard() {}
```

### 错误 2：JSX 里写 if 语句

不要：

```tsx
return <div>{if (show) "显示"}</div>;
```

要：

```tsx
return <div>{show ? "显示" : null}</div>;
```

### 错误 3：忘记 return

不要：

```tsx
function App() {
  <div>Hello</div>;
}
```

要：

```tsx
function App() {
  return <div>Hello</div>;
}
```

### 错误 4：把 props 当 state 改

不要修改 props。需要变化的数据应该放在父组件 state 里。

## 13. 本章练习

练习 1：写一个 `UserCard`

要求：

- props：`name`、`age`、`city`
- 显示姓名、年龄、城市

练习 2：写一个 `ProductCard`

要求：

- props：`name`、`price`、`description`
- 价格显示成 `¥xxx`

练习 3：写一个 `Card` 组件

要求：

- props：`title`
- 使用 `children`
- 能包住任意内容

