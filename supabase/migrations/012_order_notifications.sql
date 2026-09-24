alter table public.orders
  add column if not exists payment_email_sent_at timestamptz;
