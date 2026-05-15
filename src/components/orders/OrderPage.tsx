import { useState } from "react";
import type { OrderInput } from "../../data/repository";
import type { CartItem, DietaryTag, MenuCategory, MenuItem } from "../../domain/menu";
import { MenuPage } from "../menu/MenuPage";
import { CartPanel } from "./CartPanel";
import { OrderForm } from "./OrderForm";

interface OrderPageProps {
  categories: MenuCategory[];
  tags: DietaryTag[];
  menuItems: MenuItem[];
  onCreateOrder: (input: OrderInput) => void;
}

export function OrderPage({ categories, tags, menuItems, onCreateOrder }: OrderPageProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [message, setMessage] = useState("");

  function addItem(item: MenuItem): void {
    if (!item.available) {
      setMessage("该菜品暂不可售，无法加入购物车。");
      return;
    }
    setCartItems((current) => {
      const existing = current.find((cartItem) => cartItem.menuItemId === item.id);
      if (existing) {
        return current.map((cartItem) =>
          cartItem.menuItemId === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        );
      }
      return [...current, { menuItemId: item.id, quantity: 1 }];
    });
    setMessage(`${item.name} 已加入购物车。`);
  }

  function updateQuantity(menuItemId: string, quantity: number): void {
    if (quantity < 1) {
      setCartItems((current) => current.filter((cartItem) => cartItem.menuItemId !== menuItemId));
      return;
    }
    setCartItems((current) =>
      current.map((cartItem) => (cartItem.menuItemId === menuItemId ? { ...cartItem, quantity } : cartItem)),
    );
  }

  return (
    <section className="page order-page">
      <div className="section-heading">
        <p className="eyebrow">点单</p>
        <h1>选择菜品并提交待确认订单</h1>
        <p className="muted">订单提交后仍需餐厅确认，不代表即时承诺。</p>
      </div>
      {message ? <p className="success-message">{message}</p> : null}
      <div className="order-layout">
        <MenuPage categories={categories} tags={tags} items={menuItems} actionLabel="加入购物车" onItemAction={addItem} />
        <aside>
          <CartPanel
            cartItems={cartItems}
            menuItems={menuItems}
            onQuantityChange={updateQuantity}
            onRemove={(menuItemId) => setCartItems((current) => current.filter((item) => item.menuItemId !== menuItemId))}
          />
          <OrderForm
            cartItems={cartItems}
            onSubmit={(input) => {
              onCreateOrder(input);
              setCartItems([]);
              setMessage("点单请求已提交，状态为待确认。");
            }}
          />
        </aside>
      </div>
    </section>
  );
}
