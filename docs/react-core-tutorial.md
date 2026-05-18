# React 核心知识教程

这份教程不结合具体项目，专门讲 React 本身。目标是让你从“知道一点前端”过渡到“能看懂并写 React 组件”。

---

## 1. React 是什么

React 是一个用于构建用户界面的 JavaScript 库。

它主要解决的问题是：

```text
数据变化后，页面应该怎么更新
```

传统写法可能是：

```js
document.querySelector("#count").innerText = count;
```

React 的思路是：

```text
你只描述当前数据对应的 UI 长什么样
React 负责把变化更新到真实 DOM
```

也就是说，你写的是：

```tsx
function Counter() {
  return <button>1</button>;
}
```

React 帮你渲染到浏览器。

---

## 2. React 的核心思想

React 最重要的几个概念：

| 概念 | 作用 |
|---|---|
| Component 组件 | 把页面拆成一个个小模块 |
| JSX | 在 JavaScript 里写类似 HTML 的结构 |
| Props | 父组件传给子组件的数据 |
| State | 组件自己的状态 |
| Hooks | React 提供的一组函数，比如 `useState`、`useEffect` |
| Render | 根据数据生成界面 |

React 的核心流程：

```text
state / props 改变
  ↓
组件函数重新执行
  ↓
生成新的 JSX
  ↓
React 对比新旧 UI
  ↓
更新浏览器页面
```

---

## 3. JSX

JSX 是 React 里最常见的写法。

它看起来像 HTML：

```tsx
const element = <h1>Hello React</h1>;
```

但它本质上是 JavaScript。

JSX 里可以用 `{}` 插入 JavaScript 表达式：

```tsx
const name = "张三";

function App() {
  return <h1>你好，{name}</h1>;
}
```

结果是：

```text
你好，张三
```

### JSX 只能返回一个根节点

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

如果不想多包一层 `div`，可以用 Fragment：

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

### JSX 属性写法

HTML：

```html
<div class="box"></div>
```

React：

```tsx
<div className="box"></div>
```

因为 `class` 是 JavaScript 关键字，所以 React 用 `className`。

HTML：

```html
<label for="name"></label>
```

React：

```tsx
<label htmlFor="name"></label>
```

---

## 4. 组件

React 组件就是一个函数。

```tsx
function Hello() {
  return <h1>Hello</h1>;
}
```

使用组件：

```tsx
function App() {
  return (
    <div>
      <Hello />
      <Hello />
    </div>
  );
}
```

组件名必须大写开头。

正确：

```tsx
function UserCard() {}
```

不推荐：

```tsx
function userCard() {}
```

因为小写开头会被 React 当作普通 HTML 标签。

---

## 5. Props

Props 是父组件传给子组件的数据。

```tsx
function UserCard(props: { name: string }) {
  return <h2>{props.name}</h2>;
}

function App() {
  return <UserCard name="张三" />;
}
```

更常见写法是解构：

```tsx
function UserCard({ name }: { name: string }) {
  return <h2>{name}</h2>;
}
```

多个 props：

```tsx
function UserCard({
  name,
  age,
}: {
  name: string;
  age: number;
}) {
  return (
    <div>
      <h2>{name}</h2>
      <p>{age} 岁</p>
    </div>
  );
}
```

使用：

```tsx
<UserCard name="张三" age={18} />
```

注意：

```tsx
age={18}
```

数字要放 `{}`，字符串可以直接写：

```tsx
name="张三"
```

---

## 6. State

State 是组件自己的状态。

使用 `useState`：

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

这行最重要：

```tsx
const [count, setCount] = useState(0);
```

意思是：

- `count` 是当前值
- `setCount` 是修改值的方法
- `0` 是初始值

不要直接修改 state：

```tsx
count = count + 1;
```

必须：

```tsx
setCount(count + 1);
```

因为只有调用 `setCount`，React 才知道要重新渲染。

---

## 7. 事件

React 事件使用驼峰命名。

HTML：

```html
<button onclick="add()">+</button>
```

React：

```tsx
<button onClick={add}>+</button>
```

传参数：

```tsx
<button onClick={() => add(1)}>+1</button>
```

不要写：

```tsx
<button onClick={add(1)}>+1</button>
```

因为这样会在渲染时立刻执行。

---

## 8. 条件渲染

使用三元表达式：

```tsx
function LoginStatus({ isLogin }: { isLogin: boolean }) {
  return (
    <div>
      {isLogin ? <span>已登录</span> : <span>未登录</span>}
    </div>
  );
}
```

只在条件成立时显示：

```tsx
{isLogin && <button>退出登录</button>}
```

如果 `isLogin` 是 `true`，显示按钮。  
如果是 `false`，不显示。

---

## 9. 列表渲染

React 用 `map` 渲染列表。

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

重点是 `key`：

```tsx
key={user.id}
```

`key` 帮 React 判断列表里哪个元素变了。

不要轻易用数组下标：

```tsx
key={index}
```

如果列表会新增、删除、排序，用 index 容易出问题。

---

## 10. 表单

React 表单通常是“受控组件”。

```tsx
function NameForm() {
  const [name, setName] = useState("");

  return (
    <input
      value={name}
      onChange={(event) => setName(event.target.value)}
    />
  );
}
```

意思是：

- 输入框显示 `name`
- 用户输入时触发 `onChange`
- `setName` 更新 state
- React 重新渲染
- 输入框显示新值

提交表单：

```tsx
function LoginForm() {
  const [username, setUsername] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    console.log(username);
  }

  return (
    <form onSubmit={submit}>
      <input
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />
      <button type="submit">提交</button>
    </form>
  );
}
```

`event.preventDefault()` 是为了阻止浏览器默认刷新页面。

---

## 11. 对象状态

比如表单有多个字段：

```tsx
const [form, setForm] = useState({
  username: "",
  password: "",
});
```

修改其中一个字段：

```tsx
setForm({
  ...form,
  username: "张三",
});
```

`...form` 是保留原来的其他字段。

输入框写法：

```tsx
<input
  value={form.username}
  onChange={(event) =>
    setForm({
      ...form,
      username: event.target.value,
    })
  }
/>
```

如果多个输入框，可以写一个通用函数：

```tsx
function updateField(field: string, value: string) {
  setForm({
    ...form,
    [field]: value,
  });
}
```

使用：

```tsx
<input
  value={form.username}
  onChange={(event) => updateField("username", event.target.value)}
/>
```

---

## 12. 数组状态

新增：

```tsx
setItems([...items, newItem]);
```

删除：

```tsx
setItems(items.filter((item) => item.id !== id));
```

修改：

```tsx
setItems(
  items.map((item) =>
    item.id === id ? { ...item, name: "新名字" } : item,
  ),
);
```

核心原则：

```text
不要直接改旧数组
创建新数组
```

不要：

```tsx
items.push(newItem);
setItems(items);
```

推荐：

```tsx
setItems([...items, newItem]);
```

---

## 13. useEffect

`useEffect` 用来处理副作用。

副作用包括：

- 请求接口
- 操作 localStorage
- 设置定时器
- 订阅事件
- 手动操作 DOM

基本写法：

```tsx
useEffect(() => {
  console.log("组件渲染后执行");
});
```

每次渲染后都执行。

只执行一次：

```tsx
useEffect(() => {
  console.log("组件第一次出现时执行");
}, []);
```

监听某个值变化：

```tsx
useEffect(() => {
  console.log("count 变了", count);
}, [count]);
```

清理副作用：

```tsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log("tick");
  }, 1000);

  return () => {
    clearInterval(timer);
  };
}, []);
```

`return` 里的函数会在组件卸载时执行。

---

## 14. useMemo

`useMemo` 用来缓存计算结果。

```tsx
const total = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);
```

意思是：

- 如果 `items` 没变，直接复用上次结果。
- 如果 `items` 变了，重新计算。

不要滥用 `useMemo`。

简单计算直接写：

```tsx
const total = price * count;
```

复杂计算或大列表筛选再考虑 `useMemo`。

---

## 15. useCallback

`useCallback` 用来缓存函数。

```tsx
const add = useCallback(() => {
  setCount((value) => value + 1);
}, []);
```

普通项目一开始不必太早学它。

什么时候用？

- 子组件用 `React.memo`
- 函数作为依赖传给 `useEffect`
- 性能优化时

初学阶段先记住：大多数时候不用 `useCallback` 也没问题。

---

## 16. 组件拆分

不要把所有 UI 都写在一个组件里。

比如：

```tsx
function App() {
  return (
    <div>
      <Header />
      <ProductList />
      <Cart />
    </div>
  );
}
```

拆分组件的好处：

- 文件更短
- 逻辑更清楚
- 更容易复用
- 更容易测试

一个简单子组件：

```tsx
function ProductCard({
  name,
  price,
}: {
  name: string;
  price: number;
}) {
  return (
    <div>
      <h3>{name}</h3>
      <p>¥{price}</p>
    </div>
  );
}
```

父组件使用：

```tsx
<ProductCard name="苹果" price={5} />
```

---

## 17. 子组件通知父组件

React 里通常通过回调函数实现。

父组件：

```tsx
function App() {
  function handleBuy(id: number) {
    console.log("购买", id);
  }

  return <ProductCard id={1} name="苹果" onBuy={handleBuy} />;
}
```

子组件：

```tsx
function ProductCard({
  id,
  name,
  onBuy,
}: {
  id: number;
  name: string;
  onBuy: (id: number) => void;
}) {
  return (
    <button onClick={() => onBuy(id)}>
      购买 {name}
    </button>
  );
}
```

这类似 Vue 里的 emit。

Vue：

```ts
emit("buy", id)
```

React：

```tsx
onBuy(id)
```

---

## 18. 数据请求

最简单的请求：

```tsx
function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

更完整一点：

```tsx
function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const response = await fetch("/api/users");

        if (!response.ok) {
          throw new Error("请求失败");
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError("加载失败");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>{error}</div>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## 19. React 里的样式

常见几种方式：

### 普通 CSS

```tsx
<div className="card">内容</div>
```

```css
.card {
  padding: 16px;
  border: 1px solid #ddd;
}
```

### 行内样式

```tsx
<div style={{ color: "red", fontSize: 20 }}>
  内容
</div>
```

注意：

```tsx
fontSize
```

不是：

```css
font-size
```

React 行内样式属性用驼峰。

### CSS Modules

```tsx
import styles from "./Card.module.css";

function Card() {
  return <div className={styles.card}>内容</div>;
}
```

### Tailwind CSS

```tsx
<div className="rounded border p-4 text-sm">
  内容
</div>
```

---

## 20. React Router 简单概念

React 自己不自带路由。

常用：

- React Router
- Next.js 文件路由

React Router 大概这样：

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

但如果后面迁移到 Next.js，路由会变成文件夹：

```text
app/page.tsx        /
app/admin/page.tsx  /admin
```

---

## 21. 受控组件和非受控组件

受控组件：

```tsx
const [name, setName] = useState("");

<input value={name} onChange={(e) => setName(e.target.value)} />
```

输入框的值由 React state 控制。

非受控组件：

```tsx
const inputRef = useRef<HTMLInputElement>(null);

function submit() {
  console.log(inputRef.current?.value);
}

<input ref={inputRef} />
```

初学阶段优先用受控组件。

---

## 22. useRef

`useRef` 可以保存一个不会触发重新渲染的值，也可以拿 DOM。

拿 DOM：

```tsx
function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);

  function focusInput() {
    inputRef.current?.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={focusInput}>聚焦</button>
    </>
  );
}
```

保存普通值：

```tsx
const countRef = useRef(0);
countRef.current += 1;
```

改 `ref.current` 不会触发页面更新。

---

## 23. React.memo

`React.memo` 可以减少不必要的子组件渲染。

```tsx
const UserCard = React.memo(function UserCard({ name }: { name: string }) {
  return <div>{name}</div>;
});
```

如果 props 没变，组件可以不重新渲染。

初学阶段不要过早使用。

先把代码写清楚，再考虑性能优化。

---

## 24. Context

Context 用来跨组件传数据。

比如主题、登录用户。

```tsx
const ThemeContext = createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Page />
    </ThemeContext.Provider>
  );
}
```

子组件读取：

```tsx
function Page() {
  const theme = useContext(ThemeContext);
  return <div>{theme}</div>;
}
```

不要什么都放 Context。

适合放：

- 当前用户
- 主题
- 语言
- 全局配置

不适合放：

- 每个输入框的值
- 很局部的弹窗开关
- 单个组件内部状态

---

## 25. 自定义 Hook

Hook 是以 `use` 开头的函数。

比如多个组件都需要窗口宽度：

```tsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function onResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return width;
}
```

使用：

```tsx
function Page() {
  const width = useWindowWidth();
  return <div>{width}</div>;
}
```

自定义 Hook 用来复用逻辑，不是复用 UI。

复用 UI 用组件。

---

## 26. React 的几个规则

### 规则 1：Hook 只能在组件顶层调用

不要：

```tsx
if (show) {
  const [count, setCount] = useState(0);
}
```

要：

```tsx
const [count, setCount] = useState(0);

if (!show) {
  return null;
}
```

### 规则 2：Hook 只能在 React 函数组件或自定义 Hook 里调用

不要在普通函数里乱调用：

```tsx
function normalFunction() {
  const [count, setCount] = useState(0);
}
```

### 规则 3：state 更新是异步感知的

```tsx
setCount(count + 1);
console.log(count);
```

这里 `console.log` 可能还是旧值。

如果依赖旧值更新，推荐：

```tsx
setCount((current) => current + 1);
```

---

## 27. 常见错误

### 直接修改对象

错误：

```tsx
user.name = "李四";
setUser(user);
```

正确：

```tsx
setUser({
  ...user,
  name: "李四",
});
```

### 直接修改数组

错误：

```tsx
items.push(newItem);
setItems(items);
```

正确：

```tsx
setItems([...items, newItem]);
```

### 忘记 key

错误：

```tsx
{items.map((item) => <div>{item.name}</div>)}
```

正确：

```tsx
{items.map((item) => <div key={item.id}>{item.name}</div>)}
```

### useEffect 依赖乱写

错误：

```tsx
useEffect(() => {
  loadData(userId);
}, []);
```

如果 `userId` 变化，效果不会重新执行。

应该：

```tsx
useEffect(() => {
  loadData(userId);
}, [userId]);
```

---

## 28. 一个完整小例子

```tsx
import { useMemo, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: "苹果", price: 5 },
  { id: 2, name: "香蕉", price: 3 },
  { id: 3, name: "橙子", price: 4 },
];

export function Shop() {
  const [cart, setCart] = useState<Product[]>([]);

  const total = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price, 0);
  }, [cart]);

  function addToCart(product: Product) {
    setCart((current) => [...current, product]);
  }

  function removeFromCart(id: number) {
    setCart((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div>
      <h1>水果店</h1>

      <h2>商品</h2>
      {products.map((product) => (
        <div key={product.id}>
          <span>{product.name}</span>
          <span> ¥{product.price}</span>
          <button onClick={() => addToCart(product)}>加入购物车</button>
        </div>
      ))}

      <h2>购物车</h2>
      {cart.length === 0 ? (
        <p>购物车为空</p>
      ) : (
        cart.map((item) => (
          <div key={`${item.id}-${Math.random()}`}>
            <span>{item.name}</span>
            <button onClick={() => removeFromCart(item.id)}>删除</button>
          </div>
        ))
      )}

      <strong>合计：¥{total}</strong>
    </div>
  );
}
```

上面例子里有一个故意不推荐的地方：

```tsx
key={`${item.id}-${Math.random()}`}
```

不要这样写，因为每次渲染 key 都变了。

更好的购物车数据应该有独立的 `cartItemId`。

例如：

```tsx
interface CartItem {
  cartItemId: string;
  productId: number;
  name: string;
  price: number;
}
```

然后：

```tsx
key={item.cartItemId}
```

这个例子提醒你：React 列表的 `key` 要稳定。

---

## 29. 学习顺序建议

第一阶段：能写基础组件

1. JSX
2. 组件
3. props
4. useState
5. 事件
6. 条件渲染
7. 列表渲染
8. 表单

第二阶段：能写真实页面

1. useEffect
2. 数据请求
3. 加载状态
4. 错误状态
5. 组件拆分
6. 对象/数组状态管理

第三阶段：能维护项目

1. TypeScript props 类型
2. 自定义 Hook
3. Context
4. 路由
5. 性能优化
6. 测试

第四阶段：进阶框架

1. Next.js
2. Server Components
3. Server Actions
4. API Routes
5. SSR/SSG
6. SEO

---

## 30. 你现在最该掌握的 10 行代码

```tsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

如果你能真正理解这 10 行，就理解了 React 的核心：

```text
state 改变 → 组件重新执行 → UI 更新
```

React 不是你手动操作 DOM。

React 是你维护数据，然后 React 根据数据渲染页面。

