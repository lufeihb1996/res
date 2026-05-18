# 01. React 知识体系和学习路线

## 本章目标

读完这一章，你应该知道：

- React 到底解决什么问题。
- React 的知识体系有哪些层。
- 先学什么，后学什么。
- 会 Vue 的人学 React 应该重点补哪里。
- 学到什么程度可以开始做项目。

## 1. React 是什么

React 是一个构建用户界面的 JavaScript 库。

它主要解决的问题是：

```text
数据变化以后，页面应该怎样更新
```

以前写页面，常见方式是手动操作 DOM：

```js
const count = 1;
document.querySelector("#count").innerText = count;
```

如果 `count` 变成 2，你还要继续手动改 DOM。

React 的方式是：

```tsx
function Counter({ count }: { count: number }) {
  return <span>{count}</span>;
}
```

你只描述“当前数据对应的页面长什么样”，React 负责把真实页面更新好。

## 2. React 的核心公式

React 最核心的理解是：

```text
UI = f(state, props)
```

意思是：

```text
页面 = 根据 state 和 props 计算出来的结果
```

`props` 是外部传进来的数据。  
`state` 是组件自己维护的状态。

只要 `state` 或 `props` 变了，React 就重新执行组件函数，生成新的 UI。

## 3. React 的 6 层知识体系

### 第 1 层：页面怎么写

关键词：

- JSX
- 组件
- props
- children

你要学会：

```tsx
function UserCard({ name }: { name: string }) {
  return <div>{name}</div>;
}
```

这一层解决“页面怎么用 React 表达”。

### 第 2 层：页面怎么变

关键词：

- `useState`
- 事件
- 条件渲染
- 列表渲染
- 表单

你要学会：

```tsx
const [count, setCount] = useState(0);

return <button onClick={() => setCount(count + 1)}>{count}</button>;
```

这一层解决“用户点击、输入后页面怎么变化”。

### 第 3 层：数据怎么来

关键词：

- `useEffect`
- `fetch`
- loading
- error
- 异步请求

你要学会：

```tsx
useEffect(() => {
  fetch("/api/users")
    .then((res) => res.json())
    .then((data) => setUsers(data));
}, []);
```

这一层解决“页面怎么和接口、数据库、浏览器 API 交互”。

### 第 4 层：代码怎么组织

关键词：

- 组件拆分
- 父子通信
- Context
- 自定义 Hook

你要学会：

```tsx
<ProductList products={products} onAdd={addToCart} />
```

这一层解决“项目变大后怎么不乱”。

### 第 5 层：项目怎么变大

关键词：

- 路由
- 全局状态
- 数据缓存
- 测试
- 性能优化

这时你会遇到：

- 多页面怎么做？
- 登录状态放哪里？
- 接口数据怎么缓存？
- 表单怎么校验？
- 页面慢了怎么优化？

### 第 6 层：框架和工程化

关键词：

- Vite
- Next.js
- SSR
- SSG
- SEO
- API Routes
- Vercel

React 只负责 UI。真实产品还需要框架和工程能力。

Next.js 就是在 React 上加了：

- 文件路由
- 服务端渲染
- 静态生成
- SEO
- 后端 API
- 部署优化

## 4. 先学 React 还是 Next.js

建议：

```text
先学 React 基础，再学 Next.js
```

原因很简单：

```text
Next.js = React + 路由 + 服务端渲染 + 后端 API + 部署能力
```

如果 React 的组件、state、props、表单都没懂，直接学 Next.js 会很乱。

但也不用把 React 学到特别深再学 Next.js。

你只要能独立写：

- 商品列表
- 表单
- 弹窗
- 购物车
- 请求接口
- 组件拆分

就可以开始 Next.js。

## 5. 会 Vue 的人学 React，要重点补什么

你已经会一点 Vue，所以概念上不陌生。

重点补这些差异：

### Vue 有模板，React 用 JSX

Vue：

```vue
<template>
  <h1>{{ title }}</h1>
</template>
```

React：

```tsx
function App() {
  return <h1>{title}</h1>;
}
```

### Vue 有 ref/reactive，React 用 useState

Vue：

```ts
const count = ref(0);
count.value++;
```

React：

```tsx
const [count, setCount] = useState(0);
setCount(count + 1);
```

### Vue 有 emit，React 用回调函数

Vue：

```ts
emit("submit", data);
```

React：

```tsx
onSubmit(data);
```

父组件把 `onSubmit` 函数传给子组件，子组件调用它。

### Vue 有 v-model，React 用 value + onChange

Vue：

```vue
<input v-model="name" />
```

React：

```tsx
<input value={name} onChange={(e) => setName(e.target.value)} />
```

## 6. 学习阶段目标

### 初级：能写组件

你需要掌握：

- JSX
- props
- useState
- 事件
- 条件渲染
- 列表渲染
- 表单

达标项目：

```text
做一个商品列表 + 加入购物车 + 表单提交
```

### 中级：能写真实页面

你需要掌握：

- useEffect
- 数据请求
- loading/error
- 组件拆分
- 父子通信
- 自定义 Hook

达标项目：

```text
做一个带接口请求的后台列表页
```

### 进阶：能做完整应用

你需要掌握：

- 路由
- 全局状态
- 权限
- 表单校验
- 数据缓存
- Next.js

达标项目：

```text
做一个带登录、列表、详情、创建、编辑的管理后台
```

## 7. 学习建议

不要一开始学：

- Redux
- React Query
- Next.js Server Components
- 性能优化
- Fiber 原理
- 大型架构

先学：

```text
组件
props
state
事件
列表
表单
useEffect
组件拆分
```

这几个才是 React 的日常核心。

