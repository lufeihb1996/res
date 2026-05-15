import type { ReservationRequest, ReservationStatus } from "../../domain/reservations";
import { reservationStatusLabels } from "../../domain/reservations";

interface ReservationManagerProps {
  reservations: ReservationRequest[];
  onStatusChange: (id: string, status: ReservationStatus) => void;
}

const reservationStatuses: ReservationStatus[] = ["pending", "accepted", "declined", "completed"];

export function ReservationManager({ reservations, onStatusChange }: ReservationManagerProps) {
  return (
    <section className="admin-section">
      <h2>预订管理</h2>
      {reservations.length === 0 ? (
        <p className="muted">暂无预订请求。</p>
      ) : (
        <div className="admin-list">
          {reservations.map((reservation) => (
            <article className="admin-row" key={reservation.id}>
              <div>
                <strong>{reservation.customerName}</strong>
                <span>{reservation.date} {reservation.time} · {reservation.partySize} 人 · {reservation.contact}</span>
              </div>
              <select value={reservation.status} onChange={(event) => onStatusChange(reservation.id, event.target.value as ReservationStatus)}>
                {reservationStatuses.map((status) => (
                  <option key={status} value={status}>
                    {reservationStatusLabels[status]}
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
