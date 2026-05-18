# React 系统学习教程目录

这套教程是给“会一点前端 / 会 Vue，想系统学 React”的人看的。它不是一篇散乱笔记，而是按学习顺序拆成多个文件。

## 学习顺序

建议按下面顺序读，不要跳太快：

| 顺序 | 文件 | 你会学到什么 |
|---:|---|---|
| 1 | [01-react-knowledge-map.md](./01-react-knowledge-map.md) | React 知识体系、先学什么、后学什么 |
| 2 | [02-jsx-components-props.md](./02-jsx-components-props.md) | JSX、组件、props、children |
| 3 | [03-state-events-forms.md](./03-state-events-forms.md) | state、事件、条件渲染、列表、表单 |
| 4 | [04-effects-data-fetching.md](./04-effects-data-fetching.md) | useEffect、副作用、接口请求、loading/error |
| 5 | [05-component-architecture-hooks.md](./05-component-architecture-hooks.md) | 组件拆分、父子通信、Context、自定义 Hook |
| 6 | [06-practice-and-next-steps.md](./06-practice-and-next-steps.md) | 练习路线、常见项目、什么时候学 Next.js |

## React 学习大图

React 可以分成 6 层：

```text
第 1 层：页面怎么写
  JSX、组件、props、children

第 2 层：页面怎么变
  useState、事件、条件渲染、列表渲染、表单

第 3 层：数据怎么来
  useEffect、fetch、loading、error、异步状态

第 4 层：代码怎么组织
  组件拆分、父子通信、Context、自定义 Hook

第 5 层：项目怎么变大
  路由、状态管理、数据缓存、测试、性能优化

第 6 层：框架和工程化
  Vite、Next.js、SSR、SEO、API、部署
```

## 你应该先达到什么水平

先不要追求“React 精通”。第一阶段目标是：

```text
能看懂 React 组件
能写静态页面
能用 useState 做交互
能写表单
能渲染列表
能用 useEffect 请求数据
能拆几个简单组件
```

到了这个水平，再学 Next.js 就顺很多。

## 如果你会 Vue，怎么对应 React

| Vue | React |
|---|---|
| `.vue` 单文件组件 | `.tsx` 函数组件 |
| `template` | `return JSX` |
| `props` / `defineProps` | 函数组件参数 props |
| `ref` / `reactive` | `useState` |
| `computed` | 普通计算 / `useMemo` |
| `watch` / `watchEffect` | `useEffect` |
| `onMounted` | `useEffect(..., [])` |
| `v-if` | `{condition ? A : B}` |
| `v-for` | `{array.map(...)}` |
| `@click` | `onClick` |
| `v-model` | `value + onChange` |
| `emit` | 父组件传回调函数 |

## 推荐节奏

### 第 1 天

读：

- `01-react-knowledge-map.md`
- `02-jsx-components-props.md`

练：

- 写一个个人资料卡片组件
- 写一个商品卡片组件
- 父组件传 props 给子组件

### 第 2 天

读：

- `03-state-events-forms.md`

练：

- 计数器
- Tab 切换
- 商品列表
- 登录表单
- 简单购物车

### 第 3 天

读：

- `04-effects-data-fetching.md`

练：

- 请求一个接口
- 做 loading
- 做 error
- 做搜索过滤

### 第 4 天

读：

- `05-component-architecture-hooks.md`
- `06-practice-and-next-steps.md`

练：

- 拆组件
- 父子通信
- 写一个自定义 Hook
- 做一个完整小页面

## 一句话总结

React 的核心不是“记 API”，而是理解：

```text
UI = f(state, props)
```

也就是说：

```text
页面 = 根据状态和传入数据计算出来的结果
```

状态变了，组件重新执行，页面自然更新。

