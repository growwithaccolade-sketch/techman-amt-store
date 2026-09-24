create table if not exists public.lead_requests (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('trade_in','device_request','corporate_quote')),
  name text not null,
  email text,
  phone text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'new',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.lead_requests enable row level security;

create index if not exists lead_requests_type_status_idx on public.lead_requests(type, status);
create index if not exists lead_requests_created_at_idx on public.lead_requests(created_at desc);
