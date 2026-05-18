# 05. 组件架构、父子通信、Context、自定义 Hook

## 本章目标

读完这一章，你应该能：

- 判断什么时候拆组件。
- 理解 state 应该放在哪里。
- 用回调函数实现子组件通知父组件。
- 理解 Context 适合什么场景。
- 写简单自定义 Hook。

## 1. 为什么要拆组件

一个页面全写在一个组件里，刚开始很快，后面会很痛苦。

问题：

- 文件太长。
- 状态太多。
- 函数太多。
- JSX 嵌套太深。
- 改一个地方容易影响其他地方。

拆组件的目标不是“为了拆而拆”，而是让代码更好理解。

## 2. 什么时候拆组件

适合拆的情况：

- 这块 UI 会重复出现。
- 这块 UI 有明确名字。
- 这块 UI 逻辑相对独立。
- 父组件 JSX 太长。
- 你想单独测试或复用它。

例如：

```text
ProductCard
ProductList
CartPanel
CheckoutForm
UserMenu
Modal
Tabs
```

这些名字本身就说明它们适合当组件。

## 3. 组件拆分例子

没拆之前：

```tsx
function ShopPage() {
  return (
    <div>
      <header>商城</header>
      <main>
        <article>
          <h3>苹果</h3>
          <p>¥5</p>
          <button>加入购物车</button>
        </article>
      </main>
    </div>
  );
}
```

拆成：

```tsx
function ProductCard({
  name,
  price,
  onAdd,
}: {
  name: string;
  price: number;
  onAdd: () => void;
}) {
  return (
    <article>
      <h3>{name}</h3>
      <p>¥{price}</p>
      <button onClick={onAdd}>加入购物车</button>
    </article>
  );
}
```

页面：

```tsx
function ShopPage() {
  return (
    <div>
      <header>商城</header>
      <main>
        <ProductCard name="苹果" price={5} onAdd={() => console.log("add")} />
      </main>
    </div>
  );
}
```

## 4. State 应该放在哪里

React 里一个关键问题：

```text
这个状态应该放在哪个组件？
```

原则：

```text
谁需要用这个状态，就放在它们最近的共同父组件。
```

例子：

```text
ShopPage
  ProductList
  CartPanel
```

`ProductList` 要加入购物车。  
`CartPanel` 要显示购物车。

购物车 state 应该放在共同父组件 `ShopPage`：

```tsx
function ShopPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  return (
    <>
      <ProductList onAdd={addToCart} />
      <CartPanel items={cartItems} />
    </>
  );
}
```

## 5. 父传子：props

父组件：

```tsx
<CartPanel items={cartItems} />
```

子组件：

```tsx
function CartPanel({ items }: { items: CartItem[] }) {
  return <div>{items.length}</div>;
}
```

## 6. 子通知父：回调函数

React 没有 Vue 的 `emit`。

React 用父组件传函数。

父组件：

```tsx
function ShopPage() {
  function addToCart(productId: number) {
    console.log("加入购物车", productId);
  }

  return <ProductList onAdd={addToCart} />;
}
```

子组件：

```tsx
function ProductList({ onAdd }: { onAdd: (productId: number) => void }) {
  return <button onClick={() => onAdd(1)}>加入购物车</button>;
}
```

这个模式非常重要：

```text
父组件拥有状态
父组件把状态传给子组件
父组件把修改状态的函数传给子组件
子组件调用函数通知父组件
```

## 7. Props drilling 是什么

如果层级很深：

```text
App
  Layout
    Sidebar
      UserMenu
        Avatar
```

如果 `Avatar` 要用当前用户信息，你可能要一层层传：

```tsx
<Layout user={user} />
<Sidebar user={user} />
<UserMenu user={user} />
<Avatar user={user} />
```

这叫 props drilling。

如果只是两三层，没关系。

如果很多层都只是“转交 props”，可以考虑 Context。

## 8. Context

Context 用来跨层级共享数据。

适合：

- 当前登录用户。
- 主题。
- 语言。
- 全局配置。

创建 Context：

```tsx
import { createContext, useContext } from "react";

const ThemeContext = createContext("light");
```

提供数据：

```tsx
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Page />
    </ThemeContext.Provider>
  );
}
```

读取数据：

```tsx
function Page() {
  const theme = useContext(ThemeContext);
  return <div>当前主题：{theme}</div>;
}
```

## 9. 不要滥用 Context

不适合放 Context：

- 输入框内容。
- 单个弹窗开关。
- 某个卡片的 hover 状态。
- 很局部的状态。

这些用普通 `useState` 就好。

Context 不是替代所有 props 的工具。

## 10. 自定义 Hook 是什么

自定义 Hook 是复用逻辑的函数。

名字必须以 `use` 开头。

例如窗口宽度：

```tsx
function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return width;
}
```

使用：

```tsx
function Page() {
  const width = useWindowWidth();

  return <div>窗口宽度：{width}</div>;
}
```

## 11. 自定义 Hook 复用的是逻辑，不是 UI

复用 UI：

```tsx
function Button() {
  return <button>按钮</button>;
}
```

复用逻辑：

```tsx
function useLocalStorageState() {
  // ...
}
```

这是两种不同东西。

## 12. 组件目录怎么组织

小项目可以：

```text
src/
  components/
  data/
  domain/
  styles/
  app/
```

中型项目可以按功能：

```text
src/
  features/
    products/
      ProductList.tsx
      ProductCard.tsx
      productTypes.ts
    orders/
      OrderList.tsx
      OrderDetail.tsx
    auth/
      LoginForm.tsx
```

没有绝对标准，核心是：

```text
相关代码放近一点
公共组件单独放
业务组件按功能放
```

## 13. 常见错误

### 错误 1：所有状态都放 App

如果状态只有一个小组件用，不要放到全局。

### 错误 2：过早使用 Context

两层 props 传递不算问题。

### 错误 3：组件拆太碎

如果一个组件只有两行，而且没有复用价值，没必要拆。

### 错误 4：自定义 Hook 里违反 Hook 规则

Hook 只能在顶层调用，不能写在 if 里。

## 14. 本章练习

练习 1：拆商品页面

拆成：

- `ProductList`
- `ProductCard`
- `CartPanel`

练习 2：父子通信

点击 `ProductCard` 的按钮，通知父组件加入购物车。

练习 3：写一个 `useLocalStorageState`

要求：

- 初始值从 localStorage 读。
- state 变化时保存到 localStorage。

