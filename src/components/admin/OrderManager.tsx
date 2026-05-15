import type { OrderRequest, OrderStatus } from "../../domain/orders";
import { orderStatusLabels } from "../../domain/orders";
import { formatPrice } from "../../domain/menu";

interface OrderManagerProps {
  orders: OrderRequest[];
  onStatusChange: (id: string, status: OrderStatus) => void;
}

const orderStatuses: OrderStatus[] = ["pending", "accepted", "preparing", "ready", "declined", "completed"];

export function OrderManager({ orders, onStatusChange }: OrderManagerProps) {
  return (
    <section className="admin-section">
      <h2>订单管理</h2>
      {orders.length === 0 ? (
        <p className="muted">暂无订单请求。</p>
      ) : (
        <div className="admin-list">
          {orders.map((order) => (
            <article className="admin-row order-admin-row" key={order.id}>
              <div>
                <strong>{order.customerName} · {formatPrice(order.total)}</strong>
                <span>{order.contact} · {order.fulfillment}</span>
                <ul>
                  {order.items.map((item) => (
                    <li key={`${order.id}-${item.menuItemId}`}>
                      {item.nameSnapshot} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <select value={order.status} onChange={(event) => onStatusChange(order.id, event.target.value as OrderStatus)}>
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {orderStatusLabels[status]}
                  </option>
                ))}
              </select>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
