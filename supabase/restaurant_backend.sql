create table if not exists public.restaurants (
  id text primary key,
  name text not null,
  cuisine text not null,
  tagline text,
  phone text not null,
  address text not null,
  hours text[] not null default '{}',
  contact_notes text,
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_categories (
  id text primary key,
  name text not null,
  description text,
  sort_order integer not null default 0
);

create table if not exists public.dietary_tags (
  id text primary key,
  label text not null,
  description text
);

create table if not exists public.menu_items (
  id text primary key,
  category_id text not null references public.menu_categories(id) on delete restrict,
  name text not null,
  description text not null,
  price numeric(10, 2) not null check (price >= 0),
  image_url text,
  tag_ids text[] not null default '{}',
  available boolean not null default true,
  featured boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  customer_name text not null,
  contact text not null,
  fulfillment text not null,
  items jsonb not null,
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  total numeric(10, 2) not null check (total >= 0),
  notes text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'preparing', 'ready', 'declined', 'completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id text primary key,
  customer_name text not null,
  contact text not null,
  date date not null,
  time text not null,
  party_size integer not null check (party_size > 0),
  notes text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role = 'admin'),
  created_at timestamptz not null default now()
);

alter table public.restaurants enable row level security;
alter table public.menu_categories enable row level security;
alter table public.dietary_tags enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.reservations enable row level security;
alter table public.admin_profiles enable row level security;

grant select on public.restaurants to anon, authenticated;
grant select on public.menu_categories to anon, authenticated;
grant select on public.dietary_tags to anon, authenticated;
grant select on public.menu_items to anon, authenticated;
grant insert on public.orders to anon, authenticated;
grant insert on public.reservations to anon, authenticated;
grant select, insert, update, delete on public.restaurants to authenticated;
grant select, insert, update, delete on public.menu_categories to authenticated;
grant select, insert, update, delete on public.dietary_tags to authenticated;
grant select, insert, update, delete on public.menu_items to authenticated;
grant select, update on public.orders to authenticated;
grant select, update on public.reservations to authenticated;
grant select on public.admin_profiles to authenticated;

drop policy if exists "public can read restaurant" on public.restaurants;
create policy "public can read restaurant" on public.restaurants
for select to anon, authenticated
using (true);

drop policy if exists "public can read menu categories" on public.menu_categories;
create policy "public can read menu categories" on public.menu_categories
for select to anon, authenticated
using (true);

drop policy if exists "public can read dietary tags" on public.dietary_tags;
create policy "public can read dietary tags" on public.dietary_tags
for select to anon, authenticated
using (true);

drop policy if exists "public can read available menu items" on public.menu_items;
create policy "public can read available menu items" on public.menu_items
for select to anon, authenticated
using (available = true);

drop policy if exists "public can create pending orders" on public.orders;
create policy "public can create pending orders" on public.orders
for insert to anon, authenticated
with check (status = 'pending');

drop policy if exists "public can create pending reservations" on public.reservations;
create policy "public can create pending reservations" on public.reservations
for insert to anon, authenticated
with check (status = 'pending');

drop policy if exists "admins can manage restaurant" on public.restaurants;
create policy "admins can manage restaurant" on public.restaurants
for all to authenticated
using (exists (select 1 from public.admin_profiles where user_id = auth.uid()))
with check (exists (select 1 from public.admin_profiles where user_id = auth.uid()));

drop policy if exists "admins can manage menu categories" on public.menu_categories;
create policy "admins can manage menu categories" on public.menu_categories
for all to authenticated
using (exists (select 1 from public.admin_profiles where user_id = auth.uid()))
with check (exists (select 1 from public.admin_profiles where user_id = auth.uid()));

drop policy if exists "admins can manage dietary tags" on public.dietary_tags;
create policy "admins can manage dietary tags" on public.dietary_tags
for all to authenticated
using (exists (select 1 from public.admin_profiles where user_id = auth.uid()))
with check (exists (select 1 from public.admin_profiles where user_id = auth.uid()));

drop policy if exists "admins can manage menu items" on public.menu_items;
create policy "admins can manage menu items" on public.menu_items
for all to authenticated
using (exists (select 1 from public.admin_profiles where user_id = auth.uid()))
with check (exists (select 1 from public.admin_profiles where user_id = auth.uid()));

drop policy if exists "admins can manage orders" on public.orders;
create policy "admins can manage orders" on public.orders
for all to authenticated
using (exists (select 1 from public.admin_profiles where user_id = auth.uid()))
with check (exists (select 1 from public.admin_profiles where user_id = auth.uid()));

drop policy if exists "admins can manage reservations" on public.reservations;
create policy "admins can manage reservations" on public.reservations
for all to authenticated
using (exists (select 1 from public.admin_profiles where user_id = auth.uid()))
with check (exists (select 1 from public.admin_profiles where user_id = auth.uid()));

drop policy if exists "admins can read admin profiles" on public.admin_profiles;
create policy "admins can read admin profiles" on public.admin_profiles
for select to authenticated
using (exists (select 1 from public.admin_profiles where user_id = auth.uid()));

insert into public.restaurants (id, name, cuisine, tagline, phone, address, hours, contact_notes)
values (
  'hewei',
  '占城傻逼餐厅',
  '现代中式小馆',
  '把一顿好饭做得轻松、清楚、准时。',
  '021-5888-2026',
  '上海市徐汇区梧桐路 88 号',
  array['周一至周五 11:00-21:30', '周六至周日 10:30-22:00'],
  '预订和点单提交后均为请求，餐厅工作人员会确认可用性。'
)
on conflict (id) do update set
  name = excluded.name,
  cuisine = excluded.cuisine,
  tagline = excluded.tagline,
  phone = excluded.phone,
  address = excluded.address,
  hours = excluded.hours,
  contact_notes = excluded.contact_notes,
  updated_at = now();

insert into public.menu_categories (id, name, description, sort_order) values
  ('starters', '前菜', '清爽开胃的小份菜', 1),
  ('mains', '主菜', '适合正餐分享', 2),
  ('noodles', '面饭', '快速满足的一人食', 3),
  ('drinks', '饮品', '茶饮与无酒精饮品', 4),
  ('desserts', '甜点', '收尾的小甜口', 5)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.dietary_tags (id, label) values
  ('signature', '招牌'),
  ('vegetarian', '素食'),
  ('spicy', '辣味'),
  ('gluten-free', '无麸质'),
  ('light', '清淡'),
  ('limited', '限量')
on conflict (id) do update set
  label = excluded.label;

insert into public.menu_items (id, category_id, name, description, price, image_url, tag_ids, available, featured) values
  ('lotus-root', 'starters', '桂花糯米藕', '莲藕软糯，桂花香气清甜，适合餐前分享。', 28, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85', array['vegetarian', 'light'], true, false),
  ('chili-chicken', 'starters', '藤椒口水鸡', '鸡肉细嫩，藤椒清麻，辣度适中。', 42, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=85', array['spicy', 'signature'], true, true),
  ('braised-pork', 'mains', '慢炖红烧肉', '五花肉慢炖入味，配时令青菜。', 76, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=85', array['signature'], true, true),
  ('mushroom-tofu', 'mains', '菌菇豆腐煲', '多种菌菇与嫩豆腐同煲，汤汁鲜香。', 58, 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=900&q=85', array['vegetarian', 'light'], true, false),
  ('beef-noodle', 'noodles', '番茄牛腩面', '番茄汤底浓郁，牛腩软烂，适合一人食。', 46, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=85', array['signature'], true, false),
  ('cold-noodle', 'noodles', '鸡丝凉面', '芝麻酱香浓，夏季限定。', 36, 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=900&q=85', array['limited'], false, false),
  ('jasmine-tea', 'drinks', '冷泡茉莉茶', '茶香清雅，低糖无负担。', 18, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=900&q=85', array['light', 'gluten-free'], true, false),
  ('plum-soda', 'drinks', '乌梅气泡饮', '酸甜开胃，适合搭配重口味菜品。', 22, 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85', array['signature'], true, false),
  ('almond-pudding', 'desserts', '杏仁豆腐', '口感滑嫩，带淡淡杏仁香。', 24, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=85', array['vegetarian', 'gluten-free'], true, false)
on conflict (id) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  image_url = excluded.image_url,
  tag_ids = excluded.tag_ids,
  available = excluded.available,
  featured = excluded.featured,
  updated_at = now();
