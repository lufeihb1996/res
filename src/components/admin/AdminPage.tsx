import type { RestaurantState } from "../../data/repository";
import type { MenuItem } from "../../domain/menu";
import type { OrderStatus } from "../../domain/orders";
import type { ReservationStatus } from "../../domain/reservations";
import { AdminSummary } from "./AdminSummary";
import { MenuManager } from "./MenuManager";
import { OrderManager } from "./OrderManager";
import { ReservationManager } from "./ReservationManager";

interface AdminPageProps {
  state: RestaurantState;
  onSaveMenuItem: (item: MenuItem) => void;
  onRemoveMenuItem: (itemId: string) => void;
  onReservationStatusChange: (id: string, status: ReservationStatus) => void;
  onOrderStatusChange: (id: string, status: OrderStatus) => void;
}

export function AdminPage({
  state,
  onSaveMenuItem,
  onRemoveMenuItem,
  onReservationStatusChange,
  onOrderStatusChange,
}: AdminPageProps) {
  return (
    <section className="page">
      <div className="section-heading">
        <p className="eyebrow">后台</p>
        <h1>餐厅运营管理</h1>
        <p className="warning-message">开发阶段占位能力：未实现认证和授权前，不可用于生产环境。</p>
      </div>
      <AdminSummary menuItems={state.menuItems} orders={state.orders} reservations={state.reservations} />
      <div className="admin-grid">
        <MenuManager
          categories={state.categories}
          items={state.menuItems}
          tags={state.tags}
          onRemove={onRemoveMenuItem}
          onSave={onSaveMenuItem}
        />
        <ReservationManager reservations={state.reservations} onStatusChange={onReservationStatusChange} />
        <OrderManager orders={state.orders} onStatusChange={onOrderStatusChange} />
      </div>
    </section>
  );
}
