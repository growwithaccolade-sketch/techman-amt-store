create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  kind text not null check (kind in ('percent','fixed')),
  value integer not null check (value > 0),
  min_order_ngn bigint not null default 0 check (min_order_ngn >= 0),
  max_discount_ngn bigint check (max_discount_ngn is null or max_discount_ngn > 0),
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  usage_count integer not null default 0 check (usage_count >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.coupons enable row level security;

alter table public.orders
  add column if not exists coupon_code text,
  add column if not exists discount_ngn bigint not null default 0 check (discount_ngn >= 0);

create index if not exists coupons_code_active_idx on public.coupons(code, active);

create or replace function public.mark_order_paid(
  p_reference text,
  p_transaction_id bigint
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.orders%rowtype;
  v_item record;
begin
  select * into v_order
  from public.orders
  where reference = p_reference
  for update;

  if not found then
    return false;
  end if;

  if not v_order.inventory_applied then
    for v_item in
      select external_product_id, quantity
      from public.order_items
      where order_id = v_order.id
    loop
      update public.products
      set stock = greatest(stock - v_item.quantity, 0),
          updated_at = now()
      where external_id = v_item.external_product_id;

      insert into public.inventory_movements (
        external_product_id,
        order_id,
        quantity_delta,
        reason
      ) values (
        v_item.external_product_id,
        v_order.id,
        -v_item.quantity,
        'paid_order'
      );
    end loop;

    if v_order.coupon_code is not null then
      update public.coupons
      set usage_count = usage_count + 1,
          updated_at = now()
      where code = v_order.coupon_code;
    end if;
  end if;

  update public.orders
  set payment_status = 'paid',
      status = case when status in ('pending', 'paid') then 'paid' else status end,
      paystack_transaction_id = coalesce(p_transaction_id, paystack_transaction_id),
      paid_at = coalesce(paid_at, now()),
      inventory_applied = true,
      updated_at = now()
  where id = v_order.id;

  return true;
end;
$$;

revoke all on function public.mark_order_paid(text, bigint) from public;
revoke all on function public.mark_order_paid(text, bigint) from anon;
revoke all on function public.mark_order_paid(text, bigint) from authenticated;
grant execute on function public.mark_order_paid(text, bigint) to service_role;
