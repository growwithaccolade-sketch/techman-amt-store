create table if not exists public.admin_staff (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  display_name text not null,
  role text not null check (role in ('manager','editor','support')),
  password_hash text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_staff enable row level security;

create table if not exists public.site_pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  eyebrow text,
  title text not null,
  intro text,
  sections jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.site_pages enable row level security;

drop policy if exists "Public can read active site pages" on public.site_pages;
create policy "Public can read active site pages"
on public.site_pages for select
to anon, authenticated
using (active = true);

alter table public.site_settings
  add column if not exists location_label text,
  add column if not exists footer_credit_label text default 'Built by Mike Accolade',
  add column if not exists footer_credit_url text default 'https://mikeaccolade.xyz';

create index if not exists admin_staff_username_active_idx
on public.admin_staff(lower(username), active);

create index if not exists site_pages_slug_active_idx
on public.site_pages(slug, active);
