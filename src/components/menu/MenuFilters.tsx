import type { DietaryTag, MenuCategory } from "../../domain/menu";

interface MenuFiltersProps {
  categories: MenuCategory[];
  tags: DietaryTag[];
  activeCategory: string;
  activeTag: string;
  onCategoryChange: (categoryId: string) => void;
  onTagChange: (tagId: string) => void;
}

export function MenuFilters({
  categories,
  tags,
  activeCategory,
  activeTag,
  onCategoryChange,
  onTagChange,
}: MenuFiltersProps) {
  return (
    <div className="filter-panel">
      <div>
        <h2>菜单分类</h2>
        <div className="segmented-control" role="group" aria-label="菜单分类">
          <button className={activeCategory === "all" ? "active" : ""} type="button" onClick={() => onCategoryChange("all")}>
            全部
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={activeCategory === category.id ? "active" : ""}
              type="button"
              onClick={() => onCategoryChange(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h2>饮食标签</h2>
        <div className="segmented-control" role="group" aria-label="饮食标签">
          <button className={activeTag === "all" ? "active" : ""} type="button" onClick={() => onTagChange("all")}>
            全部
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              className={activeTag === tag.id ? "active" : ""}
              type="button"
              onClick={() => onTagChange(tag.id)}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
