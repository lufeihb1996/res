import type { DietaryTag, MenuItem } from "../../domain/menu";
import { formatPrice } from "../../domain/menu";

interface MenuItemCardProps {
  item: MenuItem;
  tags: DietaryTag[];
  actionLabel?: string;
  onAction?: (item: MenuItem) => void;
}

export function MenuItemCard({ item, tags, actionLabel, onAction }: MenuItemCardProps) {
  const itemTags = tags.filter((tag) => item.tagIds.includes(tag.id));

  return (
    <article className={item.available ? "menu-card" : "menu-card unavailable"}>
      {item.imageUrl ? (
        <img className="menu-card-image" alt={item.name} src={item.imageUrl} />
      ) : null}
      <div className="menu-card-top">
        <div>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
        <strong>{formatPrice(item.price)}</strong>
      </div>
      <div className="tag-row">
        {item.featured ? <span className="tag featured">推荐</span> : null}
        {itemTags.map((tag) => (
          <span className="tag" key={tag.id}>
            {tag.label}
          </span>
        ))}
        <span className={item.available ? "status available" : "status unavailable"}>
          {item.available ? "可售" : "暂不可售"}
        </span>
      </div>
      {actionLabel ? (
        <button
          className="small-button"
          disabled={!item.available}
          type="button"
          onClick={() => onAction?.(item)}
        >
          {item.available ? actionLabel : "暂不可点"}
        </button>
      ) : null}
    </article>
  );
}
