import { redirect } from "next/navigation";
import AdminNav from "@/components/admin-nav";
import { hasAdminSession } from "@/app/admin/actions";
import { getCustomerSummaries } from "@/lib/admin-analytics";
import { money } from "@/lib/products";

export default async function CustomersPage() {
  if (!(await hasAdminSession())) redirect("/admin");
  const { backend, customers } = await getCustomerSummaries();
  const repeat = customers.filter((customer) => customer.paidOrders > 1).length;

  return <main className="adminShell">
    <AdminNav active="customers"/>
    <section className="adminMain">
      <div className="adminTop"><div><span className="kicker">CUSTOMERS</span><h1>Customer Value</h1></div><span className="analyticsPeriod">{repeat} repeat paid customers</span></div>
      {!backend && <div className="adminNotice warning">Connect Supabase to build the customer view from order history.</div>}
      <section className="adminCard adminOrdersCard">
        <div className="adminListHead"><div><span className="kicker">ORDER HISTORY AGGREGATION</span><h2>{customers.length} customers</h2></div><span>Sorted by paid spend</span></div>
        {customers.length ? <div className="customerTable">
          <div className="customerRow head"><span>Customer</span><span>Orders</span><span>Paid orders</span><span>Lifetime spend</span><span>Last order</span></div>
          {customers.map((customer)=><div className="customerRow" key={customer.email}><span><strong>{customer.name}</strong><small>{customer.email}</small></span><span>{customer.orders}</span><span>{customer.paidOrders}</span><span><b>{money(customer.spend)}</b></span><span>{new Date(customer.lastOrderAt).toLocaleDateString("en-NG")}</span></div>)}
        </div> : <div className="adminEmpty"><h3>No customer order history yet.</h3></div>}
      </section>
    </section>
  </main>;
}
