export type OrderStatus = "pending" | "accepted" | "preparing" | "ready" | "declined" | "completed";

export interface OrderLineItem {
  menuItemId: string;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderRequest {
  id: string;
  customerName: string;
  contact: string;
  fulfillment: string;
  items: OrderLineItem[];
  subtotal: number;
  total: number;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
}

export const orderStatusLabels: Record<OrderStatus, string> = {
  pending: "待确认",
  accepted: "已接受",
  preparing: "制作中",
  ready: "可取餐",
  declined: "已拒绝",
  completed: "已完成",
};

export function isValidOrderStatusTransition(current: OrderStatus, next: OrderStatus): boolean {
  if (current === next) return true;
  if (current === "pending") return next === "accepted" || next === "declined";
  if (current === "accepted") return next === "preparing";
  if (current === "preparing") return next === "ready";
  if (current === "ready") return next === "completed";
  return false;
}
