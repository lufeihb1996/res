export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  sortOrder: number;
}

export interface DietaryTag {
  id: string;
  label: string;
  description?: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  tagIds: string[];
  available: boolean;
  featured?: boolean;
}

export interface CartItem {
  menuItemId: string;
  quantity: number;
}

export function canAddToCart(item: MenuItem | undefined): item is MenuItem {
  return Boolean(item?.available);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
  }).format(price);
}
