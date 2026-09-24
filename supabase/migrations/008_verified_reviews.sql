create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_external_id integer not null,
  order_id uuid references public.orders(id) on delete set null,
  email text not null,
  display_name text not null,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text not null,
  verified_purchase boolean not null default false,
  approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (order_id, product_external_id)
);

alter table public.product_reviews enable row level security;

drop policy if exists "Public can read approved reviews" on public.product_reviews;
create policy "Public can read approved reviews"
on public.product_reviews for select
to anon, authenticated
using (approved = true);

create index if not exists product_reviews_product_approved_idx
on public.product_reviews(product_external_id, approved, created_at desc);
