alter table public.orders
  add column if not exists inventory_applied boolean not null default false;

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
