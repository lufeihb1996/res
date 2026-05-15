import type { MenuCategory, DietaryTag, MenuItem, CartItem } from "../domain/menu";
import { canAddToCart } from "../domain/menu";
import type { OrderRequest, OrderStatus } from "../domain/orders";
import { isValidOrderStatusTransition } from "../domain/orders";
import type { ReservationRequest, ReservationStatus } from "../domain/reservations";
import { isValidReservationStatusTransition } from "../domain/reservations";
import type { RestaurantProfile } from "../domain/restaurant";
import { dietaryTags, menuCategories, menuItems, restaurantProfile } from "./seed";

export interface RestaurantState {
  profile: RestaurantProfile;
  categories: MenuCategory[];
  tags: DietaryTag[];
  menuItems: MenuItem[];
  reservations: ReservationRequest[];
  orders: OrderRequest[];
}

export interface ReservationInput {
  customerName: string;
  contact: string;
  date: string;
  time: string;
  partySize: number;
  notes?: string;
}

export interface OrderInput {
  customerName: string;
  contact: string;
  fulfillment: string;
  notes?: string;
  cartItems: CartItem[];
}

const storageKey = "restaurant-project-state-v2";
type Listener = (state: RestaurantState) => void;

function createInitialState(): RestaurantState {
  return {
    profile: restaurantProfile,
    categories: [...menuCategories],
    tags: [...dietaryTags],
    menuItems: [...menuItems],
    reservations: [],
    orders: [],
  };
}

function readState(): RestaurantState {
  const fallback = createInitialState();
  if (typeof window === "undefined") return fallback;
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return fallback;
  try {
    const parsed = JSON.parse(saved) as Partial<RestaurantState>;
    return {
      ...fallback,
      ...parsed,
      profile: parsed.profile ?? fallback.profile,
      categories: parsed.categories ?? fallback.categories,
      tags: parsed.tags ?? fallback.tags,
      menuItems: (parsed.menuItems ?? fallback.menuItems).map((item) => ({
        ...fallback.menuItems.find((seedItem) => seedItem.id === item.id),
        ...item,
      })),
      reservations: parsed.reservations ?? [],
      orders: parsed.orders ?? [],
    };
  } catch {
    return fallback;
  }
}

let state = readState();
const listeners = new Set<Listener>();

function save(next: RestaurantState): void {
  state = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  }
  listeners.forEach((listener) => listener(state));
}

function nextId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const repository = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getState(): RestaurantState {
    return state;
  },

  reset(): void {
    save(createInitialState());
  },

  upsertMenuItem(item: MenuItem): void {
    const exists = state.menuItems.some((candidate) => candidate.id === item.id);
    const menuItems = exists
      ? state.menuItems.map((candidate) => (candidate.id === item.id ? item : candidate))
      : [...state.menuItems, item];
    save({ ...state, menuItems });
  },

  removeMenuItem(itemId: string): void {
    save({ ...state, menuItems: state.menuItems.filter((item) => item.id !== itemId) });
  },

  createReservation(input: ReservationInput): ReservationRequest {
    const reservation: ReservationRequest = {
      id: nextId("reservation"),
      customerName: input.customerName.trim(),
      contact: input.contact.trim(),
      date: input.date,
      time: input.time,
      partySize: input.partySize,
      notes: input.notes?.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    save({ ...state, reservations: [reservation, ...state.reservations] });
    return reservation;
  },

  updateReservationStatus(id: string, status: ReservationStatus): void {
    const reservations = state.reservations.map((reservation) => {
      if (reservation.id !== id) return reservation;
      if (!isValidReservationStatusTransition(reservation.status, status)) return reservation;
      return { ...reservation, status };
    });
    save({ ...state, reservations });
  },

  createOrder(input: OrderInput): OrderRequest {
    const lines = input.cartItems
      .map((cartItem) => {
        const item = state.menuItems.find((candidate) => candidate.id === cartItem.menuItemId);
        if (!canAddToCart(item)) return null;
        return {
          menuItemId: item.id,
          nameSnapshot: item.name,
          priceSnapshot: item.price,
          quantity: cartItem.quantity,
          lineTotal: item.price * cartItem.quantity,
        };
      })
      .filter((line): line is NonNullable<typeof line> => Boolean(line));
    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    const order: OrderRequest = {
      id: nextId("order"),
      customerName: input.customerName.trim(),
      contact: input.contact.trim(),
      fulfillment: input.fulfillment,
      notes: input.notes?.trim(),
      items: lines,
      subtotal,
      total: subtotal,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    save({ ...state, orders: [order, ...state.orders] });
    return order;
  },

  updateOrderStatus(id: string, status: OrderStatus): void {
    const orders = state.orders.map((order) => {
      if (order.id !== id) return order;
      if (!isValidOrderStatusTransition(order.status, status)) return order;
      return { ...order, status };
    });
    save({ ...state, orders });
  },
};
