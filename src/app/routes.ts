export type RouteKey = "home" | "menu" | "reservations" | "orders" | "contact" | "admin";

export const routes: Array<{ key: RouteKey; label: string }> = [
  { key: "home", label: "首页" },
  { key: "menu", label: "菜单" },
  { key: "reservations", label: "预订" },
  { key: "orders", label: "点单" },
  { key: "contact", label: "联系" },
  { key: "admin", label: "后台" },
];
