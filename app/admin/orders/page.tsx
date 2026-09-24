import { redirect } from "next/navigation";
import AdminNav from "@/components/admin-nav";
import { hasAdminSession } from "@/app/admin/actions";
import { getAdminOrders } from "@/lib/admin-data";
import { money } from "@/lib/products";
import { updateOrder } from "./actions";

type OrderRow = {
  id: string;
  reference: string;
  email: string;
  customer_name: string;
  phone: string;
  city: string;
  state: string;
  subtotal_ngn: number;
  discount_ngn?: number | null;
  coupon_code?: string | null;
  delivery_fee_ngn?: number | null;
  total_ngn: number;
  status: string;
  payment_status: string;
  admin_note?: string | null;
  created_at: string;
  order_items?: Array<{ product_name: string; quantity: number }>;
};

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  if (!(await hasAdminSession())) redirect("/admin");
  const { error, success } = await searchParams;
  const { backend, orders } = await getAdminOrders();
  const rows = orders as OrderRow[];

  return (
    <main className="adminShell">
      <AdminNav active="orders"/>
      <section className="adminMain">
        <div className="adminTop"><div><span className="kicker">FULFILMENT</span><h1>Orders</h1></div><a className="secondaryAction" href="/track-order">Open customer tracking</a></div>
        {!backend && <div className="adminNotice warning">Supabase is not connected yet, so live orders cannot appear here.</div>}
        {error && <div className="adminNotice error">Could not update that order: {error}</div>}
        {success && <div className="adminNotice success">Order updated.</div>}

        <section className="adminCard adminOrdersCard">
          <div className="adminListHead"><div><span className="kicker">LATEST ORDERS</span><h2>{rows.length} records</h2></div><span>Showing up to 100 recent orders</span></div>
          {!backend ? <div className="adminEmpty"><h3>Connect the commerce database.</h3><p>Once Supabase is configured, paid and pending orders will appear here automatically.</p></div> :
          rows.length === 0 ? <div className="adminEmpty"><h3>No orders yet.</h3><p>Completed checkout attempts will populate this area.</p></div> :
          <div className="orderAdminList">
            {rows.map((order) => <details className="orderAdminRow" key={order.id}>
              <summary>
                <div><strong>{order.reference}</strong><span>{order.customer_name} · {order.email}</span></div>
                <div><b>{money(Number(order.total_ngn))}</b><span>{order.payment_status}</span><em>{order.status}</em></div>
              </summary>
              <div className="orderAdminBody">
                <div className="orderFacts">
                  <span><b>Customer</b>{order.customer_name}</span>
                  <span><b>Phone</b>{order.phone}</span>
                  <span><b>Destination</b>{order.city}, {order.state}</span>
                  <span><b>Created</b>{new Date(order.created_at).toLocaleString("en-NG")}</span>
                  <span><b>Subtotal</b>{money(Number(order.subtotal_ngn || 0))}</span>
                  <span><b>Discount</b>{order.discount_ngn ? `-${money(Number(order.discount_ngn))}` : "—"}</span>
                  <span><b>Coupon</b>{order.coupon_code || "—"}</span>
                  <span><b>Delivery</b>{order.delivery_fee_ngn ? money(Number(order.delivery_fee_ngn)) : "Free / not charged"}</span>
                </div>
                <div className="trackedItems">{order.order_items?.map((item) => <div key={item.product_name}><span>{item.product_name}</span><b>× {item.quantity}</b></div>)}</div>
                <form className="adminForm orderUpdateForm" action={updateOrder}>
                  <input type="hidden" name="id" value={order.id}/>
                  <label>Status<select name="status" defaultValue={order.status}><option value="pending">Pending</option><option value="paid">Paid</option><option value="processing">Processing</option><option value="packed">Packed</option><option value="shipped">Shipped</option><option value="out_for_delivery">Out for delivery</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></label>
                  <label>Internal note<textarea name="adminNote" rows={3} defaultValue={order.admin_note ?? ""} placeholder="Visible to staff only"/></label>
                  <button className="primaryAction" type="submit">Update order</button>
                </form>
              </div>
            </details>)}
          </div>}
        </section>
      </section>
    </main>
  );
}
