import type { MenuItem } from "../../domain/menu";
import type { OrderRequest } from "../../domain/orders";
import type { ReservationRequest } from "../../domain/reservations";

interface AdminSummaryProps {
  menuItems: MenuItem[];
  reservations: ReservationRequest[];
  orders: OrderRequest[];
}

export function AdminSummary({ menuItems, reservations, orders }: AdminSummaryProps) {
  const stats = [
    { label: "待处理预订", value: reservations.filter((item) => item.status === "pending").length },
    { label: "待处理订单", value: orders.filter((item) => item.status === "pending").length },
    { label: "不可售菜品", value: menuItems.filter((item) => !item.available).length },
  ];

  return (
    <section className="summary-grid" aria-label="后台摘要">
      {stats.map((stat) => (
        <article className="summary-card" key={stat.label}>
          <span>{stat.label}</span>
          <strong>{stat.value}</strong>
        </article>
      ))}
    </section>
  );
}
