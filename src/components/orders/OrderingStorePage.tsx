import { useMemo, useState } from "react";
import type { OrderInput } from "../../data/repository";
import type { CartItem, DietaryTag, MenuCategory, MenuItem } from "../../domain/menu";
import { formatPrice } from "../../domain/menu";
import type { RestaurantProfile } from "../../domain/restaurant";

interface OrderingStorePageProps {
  profile: RestaurantProfile;
  categories: MenuCategory[];
  tags: DietaryTag[];
  menuItems: MenuItem[];
  onCreateOrder: (input: OrderInput) => void;
}

interface CheckoutForm {
  customerName: string;
  contact: string;
  fulfillment: string;
}

const initialCheckout: CheckoutForm = {
  customerName: "",
  contact: "",
  fulfillment: "到店自取",
};

export function OrderingStorePage({
  profile,
  categories,
  tags,
  menuItems,
  onCreateOrder,
}: OrderingStorePageProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "all");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [checkout, setCheckout] = useState(initialCheckout);
  const [notice, setNotice] = useState("");
  const [activeTab, setActiveTab] = useState<"order" | "reviews" | "merchant">("order");

  const featuredItems = menuItems.filter((item) => item.featured);
  const visibleItems = useMemo(
    () => menuItems.filter((item) => item.categoryId === activeCategory),
    [activeCategory, menuItems],
  );
  const cartLines = cartItems.map((cartItem) => ({
    cartItem,
    item: menuItems.find((candidate) => candidate.id === cartItem.menuItemId),
  }));
  const subtotal = cartLines.reduce((sum, line) => sum + (line.item?.price ?? 0) * line.cartItem.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  function addItem(item: MenuItem): void {
    if (!item.available) {
      setNotice("该菜品暂不可售");
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
    setNotice(`${item.name} 已加入购物车`);
  }

  function updateQuantity(menuItemId: string, quantity: number): void {
    if (quantity < 1) {
      setCartItems((current) => current.filter((item) => item.menuItemId !== menuItemId));
      return;
    }
    setCartItems((current) =>
      current.map((item) => (item.menuItemId === menuItemId ? { ...item, quantity } : item)),
    );
  }

  function submitOrder(): void {
    if (cartItems.length === 0) {
      setNotice("请先添加菜品");
      return;
    }
    if (!checkout.customerName.trim() || !checkout.contact.trim()) {
      setNotice("请填写姓名和联系方式");
      return;
    }
    onCreateOrder({ ...checkout, notes: "网页点餐提交", cartItems });
    setCartItems([]);
    setCheckout(initialCheckout);
    setNotice("订单请求已提交，等待餐厅确认");
  }

  return (
    <div className="ordering-shell">
      <section className="store-hero">
        <div className="store-hero-bg" />
        <div className="store-hero-content">
          <div>
            <p className="store-badge">营业中 · 支持到店自取</p>
            <h1>{profile.name}</h1>
            <div className="store-metrics" aria-label="店铺指标">
              <span>4.8 分</span>
              <span>月售 1280+</span>
              <span>人均 ¥58</span>
              <span>30 分钟出餐</span>
            </div>
            <p className="store-announcement">{profile.contactNotes}</p>
          </div>
          <div className="coupon-stack">
            <span>满 88 减 12</span>
            <span>新客立减 8 元</span>
          </div>
        </div>
      </section>

      <nav className="store-tabs" aria-label="店铺栏目">
        <button className={activeTab === "order" ? "active" : ""} type="button" onClick={() => setActiveTab("order")}>
          点餐
        </button>
        <button className={activeTab === "reviews" ? "active" : ""} type="button" onClick={() => setActiveTab("reviews")}>
          评价
        </button>
        <button className={activeTab === "merchant" ? "active" : ""} type="button" onClick={() => setActiveTab("merchant")}>
          商家
        </button>
      </nav>

      {notice ? <div className="toast">{notice}</div> : null}

      {activeTab === "order" ? (
        <section className="ordering-layout">
          <aside className="category-rail" aria-label="菜品分类">
            <button
              className={activeCategory === "featured" ? "active" : ""}
              type="button"
              onClick={() => setActiveCategory("featured")}
            >
              招牌推荐
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                className={activeCategory === category.id ? "active" : ""}
                type="button"
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </aside>

          <main className="dish-list">
            <div className="dish-list-heading">
              <h2>{activeCategory === "featured" ? "招牌推荐" : categories.find((item) => item.id === activeCategory)?.name}</h2>
              <span>图片、价格、销量和可售状态一屏看清</span>
            </div>
            {(activeCategory === "featured" ? featuredItems : visibleItems).map((item) => (
              <article className="dish-row" key={item.id}>
                <button className="dish-image-button" type="button" onClick={() => setSelectedItem(item)}>
                  <img alt={item.name} src={item.imageUrl} />
                </button>
                <div className="dish-info">
                  <div className="dish-title-line">
                    <h3>{item.name}</h3>
                    {item.featured ? <span className="hot-tag">招牌</span> : null}
                  </div>
                  <p>{item.description}</p>
                  <div className="dish-meta">
                    <span>月售 {Math.floor(item.price * 18)}</span>
                    <span>好评率 98%</span>
                    {item.tagIds.slice(0, 2).map((tagId) => (
                      <span key={tagId}>{tags.find((tag) => tag.id === tagId)?.label}</span>
                    ))}
                  </div>
                  <div className="dish-action-line">
                    <strong>{formatPrice(item.price)}</strong>
                    <button className="add-button" disabled={!item.available} type="button" onClick={() => addItem(item)}>
                      {item.available ? "+" : "售罄"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </main>

          <aside className="checkout-card">
            <div className="checkout-head">
              <h2>购物车</h2>
              <span>{cartCount} 件</span>
            </div>
            {cartLines.length === 0 ? (
              <div className="cart-empty">选好菜品后会在这里结算</div>
            ) : (
              <div className="checkout-lines">
                {cartLines.map(({ cartItem, item }) => (
                  <div className="checkout-line" key={cartItem.menuItemId}>
                    <div>
                      <strong>{item?.name}</strong>
                      <span>{formatPrice((item?.price ?? 0) * cartItem.quantity)}</span>
                    </div>
                    <div className="stepper">
                      <button type="button" onClick={() => updateQuantity(cartItem.menuItemId, cartItem.quantity - 1)}>
                        -
                      </button>
                      <span>{cartItem.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(cartItem.menuItemId, cartItem.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="checkout-form">
              <input
                placeholder="姓名"
                value={checkout.customerName}
                onChange={(event) => setCheckout({ ...checkout, customerName: event.target.value })}
              />
              <input
                placeholder="手机号或邮箱"
                value={checkout.contact}
                onChange={(event) => setCheckout({ ...checkout, contact: event.target.value })}
              />
              <select
                value={checkout.fulfillment}
                onChange={(event) => setCheckout({ ...checkout, fulfillment: event.target.value })}
              >
                <option>到店自取</option>
                <option>到店堂食</option>
              </select>
            </div>
            <div className="checkout-total">
              <span>合计</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>
            <button className="checkout-button" type="button" onClick={submitOrder}>
              去结算
            </button>
          </aside>
        </section>
      ) : null}

      {activeTab === "reviews" ? (
        <section className="store-info-panel">
          <h2>顾客评价</h2>
          <p>4.8 分 · 最近 30 天好评率 98%。顾客常提到：出餐稳定、菜品清楚、点单方便。</p>
        </section>
      ) : null}

      {activeTab === "merchant" ? (
        <section className="store-info-panel">
          <h2>商家信息</h2>
          <p>{profile.address}</p>
          <p>{profile.phone}</p>
          <p>{profile.hours.join("；")}</p>
        </section>
      ) : null}

      {selectedItem ? (
        <div className="dish-modal-backdrop" role="presentation" onClick={() => setSelectedItem(null)}>
          <section className="dish-modal" role="dialog" aria-modal="true" aria-label={`${selectedItem.name} 规格`}>
            <img alt={selectedItem.name} src={selectedItem.imageUrl} />
            <div className="dish-modal-body">
              <h2>{selectedItem.name}</h2>
              <p>{selectedItem.description}</p>
              <div className="option-group">
                <span>辣度</span>
                <button type="button">不辣</button>
                <button type="button">微辣</button>
                <button type="button">标准</button>
              </div>
              <div className="modal-footer">
                <strong>{formatPrice(selectedItem.price)}</strong>
                <button
                  className="checkout-button"
                  type="button"
                  onClick={() => {
                    addItem(selectedItem);
                    setSelectedItem(null);
                  }}
                >
                  加入购物车
                </button>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
