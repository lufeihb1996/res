# 04. useEffect、副作用、数据请求

## 本章目标

读完这一章，你应该能：

- 理解什么是副作用。
- 正确使用 `useEffect`。
- 页面加载时请求数据。
- 处理 loading、error、empty 状态。
- 知道 `useEffect` 依赖数组是什么意思。
- 知道什么时候不要用 `useEffect`。

## 1. 什么是副作用

React 组件主要负责根据 state 和 props 返回 UI。

但有些事情不是单纯计算 UI：

- 请求接口。
- 读写 localStorage。
- 设置定时器。
- 订阅 WebSocket。
- 监听窗口大小。
- 手动操作 DOM。

这些叫副作用。

React 用 `useEffect` 处理副作用。

## 2. useEffect 基本写法

```tsx
import { useEffect } from "react";

function Page() {
  useEffect(() => {
    console.log("组件渲染后执行");
  });

  return <div>页面</div>;
}
```

这个 effect 每次渲染后都会执行。

## 3. 只在组件挂载时执行一次

```tsx
useEffect(() => {
  console.log("只执行一次");
}, []);
```

第二个参数 `[]` 是依赖数组。

空数组表示：

```text
这个 effect 不依赖任何会变化的值，所以只在组件首次出现后执行一次。
```

这类似 Vue 的 `onMounted`。

## 4. 监听某个值变化

```tsx
useEffect(() => {
  console.log("userId 变化了", userId);
}, [userId]);
```

意思是：

```text
首次渲染后执行一次。
之后每次 userId 变化，再执行一次。
```

## 5. 清理副作用

例如定时器：

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

`return` 的函数叫清理函数。

它会在：

- 组件卸载时执行。
- effect 下次重新执行前执行。

## 6. 请求数据

基础写法：

```tsx
function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
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

这能跑，但真实项目还不够，因为没有处理：

- 加载中。
- 请求失败。
- 空数据。

## 7. 完整请求状态

```tsx
interface User {
  id: number;
  name: string;
}

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/users");

        if (!response.ok) {
          throw new Error("请求失败");
        }

        const data = (await response.json()) as User[];
        setUsers(data);
      } catch {
        setError("用户列表加载失败");
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  if (loading) return <div>加载中...</div>;
  if (error) return <div>{error}</div>;
  if (users.length === 0) return <div>暂无用户</div>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

真实页面至少应该考虑：

```text
loading
error
empty
success
```

## 8. 依赖数组为什么重要

错误：

```tsx
function UserDetail({ userId }: { userId: string }) {
  useEffect(() => {
    fetch(`/api/users/${userId}`);
  }, []);

  return <div>用户详情</div>;
}
```

如果 `userId` 变了，这个 effect 不会重新执行。

正确：

```tsx
useEffect(() => {
  fetch(`/api/users/${userId}`);
}, [userId]);
```

规则：

```text
effect 里面用到了组件里的可变值，一般就应该放进依赖数组。
```

## 9. 避免过时请求覆盖新数据

如果用户快速切换 id，旧请求可能比新请求晚返回。

简单处理：

```tsx
useEffect(() => {
  let ignore = false;

  async function loadUser() {
    const response = await fetch(`/api/users/${userId}`);
    const data = await response.json();

    if (!ignore) {
      setUser(data);
    }
  }

  loadUser();

  return () => {
    ignore = true;
  };
}, [userId]);
```

当 `userId` 变了，旧 effect 会被清理，`ignore` 变成 `true`，旧请求回来也不会改 state。

## 10. localStorage

读取 localStorage：

```tsx
const [theme, setTheme] = useState(() => {
  return localStorage.getItem("theme") ?? "light";
});
```

写入 localStorage：

```tsx
useEffect(() => {
  localStorage.setItem("theme", theme);
}, [theme]);
```

意思是：

```text
theme 变化时，把最新 theme 保存到 localStorage。
```

## 11. 什么时候不要用 useEffect

不要用 effect 做能直接计算的事情。

不要：

```tsx
const [fullName, setFullName] = useState("");

useEffect(() => {
  setFullName(firstName + lastName);
}, [firstName, lastName]);
```

要：

```tsx
const fullName = firstName + lastName;
```

不要把派生数据放 state。

如果一个值能从现有 state/props 算出来，就直接算。

## 12. useMemo 和 useEffect 的区别

`useMemo` 是缓存计算结果。

```tsx
const filteredItems = useMemo(() => {
  return items.filter((item) => item.name.includes(keyword));
}, [items, keyword]);
```

`useEffect` 是处理副作用。

```tsx
useEffect(() => {
  document.title = title;
}, [title]);
```

简单理解：

| 场景 | 用什么 |
|---|---|
| 根据数据算另一个数据 | 普通变量 / `useMemo` |
| 请求接口 | `useEffect` |
| 写 localStorage | `useEffect` |
| 设置定时器 | `useEffect` |
| 过滤数组 | 普通变量 / `useMemo` |

## 13. 常见错误

### 错误 1：依赖数组少写

```tsx
useEffect(() => {
  loadData(userId);
}, []);
```

应该把 `userId` 放进去：

```tsx
useEffect(() => {
  loadData(userId);
}, [userId]);
```

### 错误 2：无限循环

```tsx
useEffect(() => {
  setCount(count + 1);
}, [count]);
```

`count` 变化触发 effect，effect 又改 `count`，会一直循环。

### 错误 3：用 effect 存派生数据

能直接算就直接算。

## 14. 本章练习

练习 1：请求用户列表

- 页面加载时请求 `/api/users`。
- 显示 loading。
- 请求失败显示错误。
- 没数据显示暂无用户。

练习 2：搜索接口

- 有一个输入框 `keyword`。
- keyword 变化时请求 `/api/search?q=keyword`。
- 注意依赖数组。

练习 3：主题保存

- 用户可以切换 light/dark。
- 保存到 localStorage。
- 刷新页面后还原。

