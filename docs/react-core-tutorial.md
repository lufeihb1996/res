# React 核心知识教程

这份单文件教程已经拆成了更好读的多文件版本。

请从这里开始：

[React 系统学习教程目录](./react/README.md)

## 为什么拆成多个文件

原来一个长文件不适合学习，因为：

- 没有清晰目录。
- 每个知识点挤在一起。
- 不方便按阶段学。
- 不方便以后补充 Next.js、项目练习、面试题。

现在拆成：

| 顺序 | 文件 | 内容 |
|---:|---|---|
| 1 | [01-react-knowledge-map.md](./react/01-react-knowledge-map.md) | React 知识体系和学习路线 |
| 2 | [02-jsx-components-props.md](./react/02-jsx-components-props.md) | JSX、组件、props、children |
| 3 | [03-state-events-forms.md](./react/03-state-events-forms.md) | state、事件、列表、条件渲染、表单 |
| 4 | [04-effects-data-fetching.md](./react/04-effects-data-fetching.md) | useEffect、副作用、接口请求 |
| 5 | [05-component-architecture-hooks.md](./react/05-component-architecture-hooks.md) | 组件架构、父子通信、Context、自定义 Hook |
| 6 | [06-practice-and-next-steps.md](./react/06-practice-and-next-steps.md) | 练习路线和下一步学什么 |

## 推荐阅读方式

先读：

```text
docs/react/README.md
```

然后按 01 到 06 的顺序读。

不要先学 Redux、Next.js、性能优化。先把：

- JSX
- 组件
- props
- useState
- 事件
- 条件渲染
- 列表渲染
- 表单
- useEffect
- 组件拆分

这些基础学明白。

## 一句话总结

React 的核心是：

```text
UI = f(state, props)
```

也就是：

```text
页面是由状态和传入数据计算出来的。
```

状态变了，React 重新执行组件函数，页面就更新。
