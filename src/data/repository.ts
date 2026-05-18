import type { MenuCategory, DietaryTag, MenuItem, CartItem } from "../domain/menu";
import { canAddToCart } from "../domain/menu";
import type { OrderLineItem, OrderRequest, OrderStatus } from "../domain/orders";
import { isValidOrderStatusTransition } from "../domain/orders";
import type { ReservationRequest, ReservationStatus } from "../domain/reservations";
import { isValidReservationStatusTransition } from "../domain/reservations";
import type { RestaurantProfile } from "../domain/restaurant";
import { dietaryTags, menuCategories, menuItems, restaurantProfile } from "./seed";
import { isSupabaseConfigured, supabaseRequest } from "./supabaseClient";

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

interface RestaurantRow {
  id: string;
  name: string;
  cuisine: string;
  tagline: string | null;
  phone: string;
  address: string;
  hours: string[];
  contact_notes: string | null;
}

interface CategoryRow {
  id: string;
  name: string;
  description: string | null;
  sort_order: number;
}

interface TagRow {
  id: string;
  label: string;
  description: string | null;
}

interface MenuItemRow {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number | string;
  image_url: string | null;
  tag_ids: string[];
  available: boolean;
  featured: boolean;
}

interface OrderRow {
  id: string;
  customer_name: string;
  contact: string;
  fulfillment: string;
  items: OrderLineItem[];
  subtotal: number | string;
  total: number | string;
  notes: string | null;
  status: OrderStatus;
  created_at: string;
}

interface ReservationRow {
  id: string;
  customer_name: string;
  contact: string;
  date: string;
  time: string;
  party_size: number;
  notes: string | null;
  status: ReservationStatus;
  created_at: string;
}

const storageKey = "restaurant-project-state-v3";
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
let supabaseLoadStarted = false;
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

function toProfile(row: RestaurantRow): RestaurantProfile {
  return {
    id: row.id,
    name: row.name,
    cuisine: row.cuisine,
    tagline: row.tagline ?? undefined,
    phone: row.phone,
    address: row.address,
    hours: row.hours,
    contactNotes: row.contact_notes ?? undefined,
  };
}

function toCategory(row: CategoryRow): MenuCategory {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    sortOrder: row.sort_order,
  };
}

function toTag(row: TagRow): DietaryTag {
  return {
    id: row.id,
    label: row.label,
    description: row.description ?? undefined,
  };
}

function toMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    price: Number(row.price),
    imageUrl: row.image_url ?? undefined,
    tagIds: row.tag_ids,
    available: row.available,
    featured: row.featured,
  };
}

function toOrder(row: OrderRow): OrderRequest {
  return {
    id: row.id,
    customerName: row.customer_name,
    contact: row.contact,
    fulfillment: row.fulfillment,
    items: row.items,
    subtotal: Number(row.subtotal),
    total: Number(row.total),
    notes: row.notes ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}

function toReservation(row: ReservationRow): ReservationRequest {
  return {
    id: row.id,
    customerName: row.customer_name,
    contact: row.contact,
    date: row.date,
    time: row.time,
    partySize: row.party_size,
    notes: row.notes ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}

function warnSupabaseError(action: string, error: unknown): void {
  console.warn(`[Supabase] ${action} failed; using local state instead.`, error);
}

async function loadSupabaseState(): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    const [profileRows, categoryRows, tagRows, menuRows] = await Promise.all([
      supabaseRequest<RestaurantRow[]>(`restaurants?select=*&id=eq.${restaurantProfile.id}&limit=1`),
      supabaseRequest<CategoryRow[]>("menu_categories?select=*&order=sort_order.asc"),
      supabaseRequest<TagRow[]>("dietary_tags?select=*&order=label.asc"),
      supabaseRequest<MenuItemRow[]>("menu_items?select=*&order=name.asc"),
    ]);

    save({
      profile: profileRows[0] ? toProfile(profileRows[0]) : state.profile,
      categories: categoryRows.map(toCategory),
      tags: tagRows.map(toTag),
      menuItems: menuRows.map(toMenuItem),
      orders: state.orders,
      reservations: state.reservations,
    });
  } catch (error) {
    warnSupabaseError("load public restaurant data", error);
    return;
  }
}

function startSupabaseLoad(): void {
  if (supabaseLoadStarted || !isSupabaseConfigured) return;
  supabaseLoadStarted = true;
  void loadSupabaseState();
}

async function persistReservation(reservation: ReservationRequest): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await supabaseRequest("reservations", {
      method: "POST",
      body: JSON.stringify({
        id: reservation.id,
        customer_name: reservation.customerName,
        contact: reservation.contact,
        date: reservation.date,
        time: reservation.time,
        party_size: reservation.partySize,
        notes: reservation.notes,
        status: reservation.status,
        created_at: reservation.createdAt,
      }),
    });
  } catch (error) {
    warnSupabaseError("create reservation", error);
  }
}

async function persistOrder(order: OrderRequest): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await supabaseRequest("orders", {
      method: "POST",
      body: JSON.stringify({
        id: order.id,
        customer_name: order.customerName,
        contact: order.contact,
        fulfillment: order.fulfillment,
        items: order.items,
        subtotal: order.subtotal,
        total: order.total,
        notes: order.notes,
        status: order.status,
        created_at: order.createdAt,
      }),
    });
  } catch (error) {
    warnSupabaseError("create order", error);
  }
}

async function persistMenuItem(item: MenuItem): Promise<void> {
  if (!isSupabaseConfigured) return;
  try {
    await supabaseRequest("menu_items", {
      method: "POST",
      headers: {
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        id: item.id,
        category_id: item.categoryId,
        name: item.name,
        description: item.description,
        price: item.price,
        image_url: item.imageUrl,
        tag_ids: item.tagIds,
        available: item.available,
        featured: item.featured ?? false,
      }),
    });
  } catch (error) {
    warnSupabaseError("upsert menu item", error);
  }
}

export const repository = {
  subscribe(listener: Listener): () => void {
    startSupabaseLoad();
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getState(): RestaurantState {
    startSupabaseLoad();
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
    void persistMenuItem(item);
  },

  removeMenuItem(itemId: string): void {
    save({ ...state, menuItems: state.menuItems.filter((item) => item.id !== itemId) });
    if (isSupabaseConfigured) {
      void supabaseRequest(`menu_items?id=eq.${encodeURIComponent(itemId)}`, {
        method: "DELETE",
      }).catch((error) => warnSupabaseError("remove menu item", error));
    }
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
    void persistReservation(reservation);
    return reservation;
  },

  updateReservationStatus(id: string, status: ReservationStatus): void {
    const reservations = state.reservations.map((reservation) => {
      if (reservation.id !== id) return reservation;
      if (!isValidReservationStatusTransition(reservation.status, status)) return reservation;
      return { ...reservation, status };
    });
    save({ ...state, reservations });
    if (isSupabaseConfigured) {
      void supabaseRequest(`reservations?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }).catch((error) => warnSupabaseError("update reservation status", error));
    }
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
    void persistOrder(order);
    return order;
  },

  updateOrderStatus(id: string, status: OrderStatus): void {
    const orders = state.orders.map((order) => {
      if (order.id !== id) return order;
      if (!isValidOrderStatusTransition(order.status, status)) return order;
      return { ...order, status };
    });
    save({ ...state, orders });
    if (isSupabaseConfigured) {
      void supabaseRequest(`orders?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }).catch((error) => warnSupabaseError("update order status", error));
    }
  },
};
