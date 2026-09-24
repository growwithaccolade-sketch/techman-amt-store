create table if not exists public.delivery_zones (
  id uuid primary key default gen_random_uuid(),
  state_name text unique not null,
  fee_ngn bigint not null check (fee_ngn >= 0),
  active boolean not null default true,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.delivery_zones enable row level security;

drop policy if exists "Public can read active delivery zones" on public.delivery_zones;
create policy "Public can read active delivery zones"
on public.delivery_zones for select
to anon, authenticated
using (active = true);

create index if not exists delivery_zones_state_active_idx
on public.delivery_zones(lower(state_name), active);
