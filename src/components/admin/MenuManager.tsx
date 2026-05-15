import { useState } from "react";
import type { DietaryTag, MenuCategory, MenuItem } from "../../domain/menu";
import { formatPrice } from "../../domain/menu";

interface MenuManagerProps {
  categories: MenuCategory[];
  tags: DietaryTag[];
  items: MenuItem[];
  onSave: (item: MenuItem) => void;
  onRemove: (itemId: string) => void;
}

const emptyItem: MenuItem = {
  id: "",
  categoryId: "starters",
  name: "",
  description: "",
  price: 0,
  tagIds: [],
  available: true,
};

export function MenuManager({ categories, tags, items, onSave, onRemove }: MenuManagerProps) {
  const [draft, setDraft] = useState<MenuItem>(emptyItem);

  function toggleTag(tagId: string): void {
    setDraft((current) => ({
      ...current,
      tagIds: current.tagIds.includes(tagId)
        ? current.tagIds.filter((item) => item !== tagId)
        : [...current.tagIds, tagId],
    }));
  }

  return (
    <section className="admin-section">
      <h2>菜单管理</h2>
      <form
        className="admin-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (!draft.name.trim() || !draft.description.trim()) return;
          onSave({
            ...draft,
            id: draft.id || `menu-${Date.now()}`,
            price: Number(draft.price),
          });
          setDraft(emptyItem);
        }}
      >
        <input placeholder="菜品名称" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
        <input
          placeholder="描述"
          value={draft.description}
          onChange={(event) => setDraft({ ...draft, description: event.target.value })}
        />
        <select value={draft.categoryId} onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })}>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          min="0"
          type="number"
          value={draft.price}
          onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })}
        />
        <label className="checkbox-label">
          <input
            checked={draft.available}
            type="checkbox"
            onChange={(event) => setDraft({ ...draft, available: event.target.checked })}
          />
          可售
        </label>
        <div className="tag-picker">
          {tags.map((tag) => (
            <label key={tag.id}>
              <input checked={draft.tagIds.includes(tag.id)} type="checkbox" onChange={() => toggleTag(tag.id)} />
              {tag.label}
            </label>
          ))}
        </div>
        <button className="primary-button" type="submit">
          {draft.id ? "保存修改" : "新增菜品"}
        </button>
      </form>
      <div className="admin-list">
        {items.map((item) => (
          <article key={item.id} className="admin-row">
            <div>
              <strong>{item.name}</strong>
              <span>{formatPrice(item.price)} · {item.available ? "可售" : "不可售"}</span>
            </div>
            <div className="row-actions">
              <button type="button" onClick={() => setDraft(item)}>
                编辑
              </button>
              <button type="button" onClick={() => onSave({ ...item, available: !item.available })}>
                {item.available ? "下架" : "上架"}
              </button>
              <button type="button" onClick={() => onRemove(item.id)}>
                删除
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
