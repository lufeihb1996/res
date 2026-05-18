# 03. State、事件、条件渲染、列表、表单

## 本章目标

读完这一章，你应该能：

- 用 `useState` 保存组件状态。
- 响应用户点击、输入。
- 根据条件显示不同 UI。
- 用 `map` 渲染列表。
- 写受控表单。
- 正确更新对象和数组状态。

## 1. State 是什么

State 是组件自己的状态。

例如：

- 当前计数是多少。
- 弹窗是否打开。
- 输入框里的文字。
- 当前选中的 Tab。
- 购物车里有哪些商品。

React 用 `useState` 创建状态：

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return <button>{count}</button>;
}
```

这行代码：

```tsx
const [count, setCount] = useState(0);
```

意思是：

- `count`：当前状态值。
- `setCount`：修改状态的函数。
- `0`：初始值。

## 2. 为什么不能直接改 state

不要这样：

```tsx
count = count + 1;
```

要这样：

```tsx
setCount(count + 1);
```

原因：

```text
React 只有在你调用 setState 函数时，才知道状态变了，需要重新渲染页面。
```

## 3. 事件

React 事件使用驼峰命名。

按钮点击：

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  function add() {
    setCount(count + 1);
  }

  return <button onClick={add}>{count}</button>;
}
```

也可以写内联函数：

```tsx
<button onClick={() => setCount(count + 1)}>{count}</button>
```

传参数时必须包一层函数：

```tsx
<button onClick={() => addProduct(product.id)}>加入购物车</button>
```

不要：

```tsx
<button onClick={addProduct(product.id)}>加入购物车</button>
```

这会在渲染时立刻执行。

## 4. 条件渲染

### 三元表达式

```tsx
function LoginStatus({ isLogin }: { isLogin: boolean }) {
  return <div>{isLogin ? "已登录" : "未登录"}</div>;
}
```

### 条件成立才显示

```tsx
{isLogin && <button>退出登录</button>}
```

### 提前 return

```tsx
function UserPanel({ user }: { user: User | null }) {
  if (!user) {
    return <div>请先登录</div>;
  }

  return <div>你好，{user.name}</div>;
}
```

## 5. 列表渲染

React 用 `map` 渲染数组：

```tsx
const users = [
  { id: 1, name: "张三" },
  { id: 2, name: "李四" },
];

function UserList() {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

`key` 很重要。

`key` 的作用：

```text
帮助 React 判断列表里的哪一项新增、删除、移动或更新了。
```

推荐用稳定 id：

```tsx
key={user.id}
```

不要随便用：

```tsx
key={Math.random()}
```

这会导致每次渲染 key 都变，React 会以为所有元素都是新的。

## 6. 表单：受控组件

React 里常用“受控组件”写表单。

```tsx
function NameInput() {
  const [name, setName] = useState("");

  return (
    <input
      value={name}
      onChange={(event) => setName(event.target.value)}
    />
  );
}
```

流程：

```text
用户输入
  ↓
触发 onChange
  ↓
调用 setName
  ↓
React 重新渲染
  ↓
input value 变成新 name
```

Vue 的 `v-model` 帮你封装了这件事。React 需要你明确写出来。

## 7. 表单提交

```tsx
function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();

    console.log({
      username,
      password,
    });
  }

  return (
    <form onSubmit={submit}>
      <input
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        placeholder="用户名"
      />
      <input
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="密码"
        type="password"
      />
      <button type="submit">登录</button>
    </form>
  );
}
```

`event.preventDefault()` 用来阻止浏览器默认刷新页面。

## 8. 对象状态

如果表单字段多，可以用一个对象：

```tsx
const [form, setForm] = useState({
  username: "",
  password: "",
});
```

更新某个字段：

```tsx
setForm({
  ...form,
  username: "张三",
});
```

`...form` 的意思是复制旧对象的所有字段。

如果不写：

```tsx
setForm({
  username: "张三",
});
```

那 `password` 字段就丢了。

## 9. 数组状态

### 新增

```tsx
setItems([...items, newItem]);
```

### 删除

```tsx
setItems(items.filter((item) => item.id !== id));
```

### 修改

```tsx
setItems(
  items.map((item) =>
    item.id === id ? { ...item, name: "新名字" } : item,
  ),
);
```

核心原则：

```text
不要直接改原数组，创建一个新数组。
```

不要：

```tsx
items.push(newItem);
setItems(items);
```

## 10. 函数式更新

如果新状态依赖旧状态，推荐函数式更新：

```tsx
setCount((current) => current + 1);
```

数组也可以：

```tsx
setItems((current) => [...current, newItem]);
```

好处：

```text
current 一定是最新状态。
```

## 11. 完整例子：Tab 切换

```tsx
function Tabs() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div>
      <button onClick={() => setActiveTab("home")}>首页</button>
      <button onClick={() => setActiveTab("profile")}>资料</button>

      {activeTab === "home" ? <div>首页内容</div> : null}
      {activeTab === "profile" ? <div>资料内容</div> : null}
    </div>
  );
}
```

## 12. 完整例子：简单购物车

```tsx
interface Product {
  id: number;
  name: string;
  price: number;
}

interface CartItem {
  productId: number;
  quantity: number;
}

const products: Product[] = [
  { id: 1, name: "苹果", price: 5 },
  { id: 2, name: "香蕉", price: 3 },
];

function Shop() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function addToCart(productId: number) {
    setCartItems((current) => {
      const existing = current.find((item) => item.productId === productId);

      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { productId, quantity: 1 }];
    });
  }

  const total = cartItems.reduce((sum, cartItem) => {
    const product = products.find((item) => item.id === cartItem.productId);
    return sum + (product?.price ?? 0) * cartItem.quantity;
  }, 0);

  return (
    <div>
      <h1>商品</h1>

      {products.map((product) => (
        <div key={product.id}>
          <span>{product.name}</span>
          <span>¥{product.price}</span>
          <button onClick={() => addToCart(product.id)}>加入购物车</button>
        </div>
      ))}

      <h2>购物车</h2>
      <p>合计：¥{total}</p>
    </div>
  );
}
```

## 13. 常见错误

### 错误 1：直接改对象

不要：

```tsx
form.username = "张三";
setForm(form);
```

要：

```tsx
setForm({ ...form, username: "张三" });
```

### 错误 2：直接改数组

不要：

```tsx
items.push(newItem);
setItems(items);
```

要：

```tsx
setItems([...items, newItem]);
```

### 错误 3：输入框只有 value 没有 onChange

不要：

```tsx
<input value={name} />
```

这会变成只读输入框。

要：

```tsx
<input value={name} onChange={(e) => setName(e.target.value)} />
```

## 14. 本章练习

练习 1：计数器

- 显示数字。
- 有 +1 按钮。
- 有 -1 按钮。
- 有重置按钮。

练习 2：登录表单

- 用户名输入框。
- 密码输入框。
- 点击提交时，如果为空显示错误。

练习 3：商品列表

- 渲染商品数组。
- 点击按钮加入购物车。
- 显示购物车数量。

