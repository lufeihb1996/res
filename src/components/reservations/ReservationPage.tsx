import type { ReservationInput } from "../../data/repository";
import type { ReservationRequest } from "../../domain/reservations";
import { reservationStatusLabels } from "../../domain/reservations";
import { ReservationForm } from "./ReservationForm";

interface ReservationPageProps {
  reservations: ReservationRequest[];
  onCreate: (input: ReservationInput) => void;
}

export function ReservationPage({ reservations, onCreate }: ReservationPageProps) {
  return (
    <section className="page two-column-page">
      <div>
        <p className="eyebrow">预订</p>
        <h1>提交订座请求</h1>
        <p className="muted">提交后为待确认请求，餐厅工作人员会确认桌位和时间。</p>
        <ReservationForm onSubmit={onCreate} />
      </div>
      <aside className="side-panel">
        <h2>最近预订</h2>
        {reservations.length === 0 ? (
          <p className="muted">暂无预订请求。</p>
        ) : (
          <div className="request-list">
            {reservations.slice(0, 5).map((reservation) => (
              <article key={reservation.id} className="request-card">
                <strong>{reservation.customerName}</strong>
                <span>{reservation.date} {reservation.time} · {reservation.partySize} 人</span>
                <span className="status available">{reservationStatusLabels[reservation.status]}</span>
              </article>
            ))}
          </div>
        )}
      </aside>
    </section>
  );
}
