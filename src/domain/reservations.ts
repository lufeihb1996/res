export type ReservationStatus = "pending" | "accepted" | "declined" | "completed";

export interface ReservationRequest {
  id: string;
  customerName: string;
  contact: string;
  date: string;
  time: string;
  partySize: number;
  notes?: string;
  status: ReservationStatus;
  createdAt: string;
}

export const reservationStatusLabels: Record<ReservationStatus, string> = {
  pending: "待确认",
  accepted: "已接受",
  declined: "已拒绝",
  completed: "已完成",
};

export function isValidReservationStatusTransition(
  current: ReservationStatus,
  next: ReservationStatus,
): boolean {
  if (current === next) return true;
  if (current === "pending") return next === "accepted" || next === "declined";
  if (current === "accepted") return next === "completed";
  return false;
}
