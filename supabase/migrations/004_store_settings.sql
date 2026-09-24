create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  store_name text not null default 'TechMan AMT',
  support_email text,
  whatsapp_number text,
  announcement_text text not null default 'Better tech, smarter upgrades.',
  free_delivery_threshold_ngn bigint check (free_delivery_threshold_ngn is null or free_delivery_threshold_ngn >= 0),
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public can read store settings" on public.site_settings;
create policy "Public can read store settings"
on public.site_settings for select
to anon, authenticated
using (true);

insert into public.site_settings (id, store_name, announcement_text)
values (1, 'TechMan AMT', 'Better tech, smarter upgrades.')
on conflict (id) do nothing;
