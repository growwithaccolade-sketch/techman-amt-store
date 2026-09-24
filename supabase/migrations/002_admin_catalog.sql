alter table public.products
  add column if not exists old_price_ngn bigint check (old_price_ngn is null or old_price_ngn >= 0),
  add column if not exists image_url text,
  add column if not exists blurb text,
  add column if not exists badge text,
  add column if not exists warranty text,
  add column if not exists condition text not null default 'New',
  add column if not exists highlights jsonb not null default '[]'::jsonb,
  add column if not exists specs jsonb not null default '{}'::jsonb;

create index if not exists products_active_category_idx
on public.products(active, category);

alter table public.orders
  add column if not exists customer_note text,
  add column if not exists admin_note text;

create index if not exists orders_created_at_idx
on public.orders(created_at desc);
