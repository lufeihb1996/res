import type { ReactNode } from "react";
import { routes, type RouteKey } from "../../app/routes";
import type { RestaurantProfile } from "../../domain/restaurant";

interface AppShellProps {
  activeRoute: RouteKey;
  profile: RestaurantProfile;
  children: ReactNode;
  onNavigate: (route: RouteKey) => void;
}

export function AppShell({ activeRoute, profile, children, onNavigate }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand-button" type="button" onClick={() => onNavigate("home")}>
          <span className="brand-mark">禾</span>
          <span>
            <strong>{profile.name}</strong>
            <small>{profile.cuisine}</small>
          </span>
        </button>
        <nav className="main-nav" aria-label="主导航">
          {routes.map((route) => (
            <button
              key={route.key}
              className={activeRoute === route.key ? "nav-button active" : "nav-button"}
              type="button"
              onClick={() => onNavigate(route.key)}
            >
              {route.label}
            </button>
          ))}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
