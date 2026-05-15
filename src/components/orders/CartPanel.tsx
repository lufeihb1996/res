import type { CartItem, MenuItem } from "../../domain/menu";
import { formatPrice } from "../../domain/menu";

interface CartPanelProps {
  cartItems: CartItem[];
  menuItems: MenuItem[];
  onQuantityChange: (menuItemId: string, quantity: number) => void;
  onRemove: (menuItemId: string) => void;
}

export function CartPanel({ cartItems, menuItems, onQuantityChange, onRemove }: CartPanelProps) {
  const lines = cartItems.map((cartItem) => {
    const item = menuItems.find((candidate) => candidate.id === cartItem.menuItemId);
    return { cartItem, item };
  });
  const total = lines.reduce((sum, line) => sum + (line.item?.price ?? 0) * line.cartItem.quantity, 0);

  return (
    <section className="cart-panel">
      <h2>购物车</h2>
      {lines.length === 0 ? (
        <p className="muted">还没有添加菜品。</p>
      ) : (
        <>
          {lines.map(({ cartItem, item }) => (
            <div className="cart-line" key={cartItem.menuItemId}>
              <div>
                <strong>{item?.name ?? "未知菜品"}</strong>
                <span>{formatPrice((item?.price ?? 0) * cartItem.quantity)}</span>
              </div>
              <div className="quantity-controls">
                <button type="button" onClick={() => onQuantityChange(cartItem.menuItemId, cartItem.quantity - 1)}>
                  -
                </button>
                <span>{cartItem.quantity}</span>
                <button type="button" onClick={() => onQuantityChange(cartItem.menuItemId, cartItem.quantity + 1)}>
                  +
                </button>
                <button type="button" onClick={() => onRemove(cartItem.menuItemId)}>
                  移除
                </button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <span>总计</span>
            <strong>{formatPrice(total)}</strong>
          </div>
        </>
      )}
    </section>
  );
}
