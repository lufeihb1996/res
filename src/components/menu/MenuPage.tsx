import { useMemo, useState } from "react";
import type { DietaryTag, MenuCategory, MenuItem } from "../../domain/menu";
import { MenuFilters } from "./MenuFilters";
import { MenuItemCard } from "./MenuItemCard";

interface MenuPageProps {
  categories: MenuCategory[];
  tags: DietaryTag[];
  items: MenuItem[];
  actionLabel?: string;
  onItemAction?: (item: MenuItem) => void;
}

export function MenuPage({ categories, tags, items, actionLabel, onItemAction }: MenuPageProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTag, setActiveTag] = useState("all");

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        const categoryMatch = activeCategory === "all" || item.categoryId === activeCategory;
        const tagMatch = activeTag === "all" || item.tagIds.includes(activeTag);
        return categoryMatch && tagMatch;
      }),
    [activeCategory, activeTag, items],
  );

  return (
    <section className="page">
      <div className="section-heading">
        <p className="eyebrow">菜单</p>
        <h1>按分类和饮食偏好找到适合的一餐</h1>
      </div>
      <MenuFilters
        activeCategory={activeCategory}
        activeTag={activeTag}
        categories={categories}
        tags={tags}
        onCategoryChange={setActiveCategory}
        onTagChange={setActiveTag}
      />
      {filteredItems.length > 0 ? (
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              actionLabel={actionLabel}
              item={item}
              tags={tags}
              onAction={onItemAction}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>未找到匹配菜品</h2>
          <p>可以清除筛选条件，或换一个分类试试。</p>
          <button
            className="secondary-button"
            type="button"
            onClick={() => {
              setActiveCategory("all");
              setActiveTag("all");
            }}
          >
            清除筛选
          </button>
        </div>
      )}
    </section>
  );
}
