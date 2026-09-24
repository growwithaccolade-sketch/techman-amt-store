import { redirect } from "next/navigation";
import AdminNav from "@/components/admin-nav";
import { hasAdminSession } from "@/app/admin/actions";
import { getSalesAnalytics } from "@/lib/admin-analytics";
import { money } from "@/lib/products";

export default async function AnalyticsPage() {
  if (!(await hasAdminSession())) redirect("/admin");
  const analytics = await getSalesAnalytics();
  const maxRevenue = Math.max(1, ...analytics.daily.map((day) => day.revenue));

  return <main className="adminShell">
    <AdminNav active="analytics"/>
    <section className="adminMain">
      <div className="adminTop"><div><span className="kicker">PERFORMANCE</span><h1>Sales Analytics</h1></div><span className="analyticsPeriod">Last 30 days + 14-day trend</span></div>
      {!analytics.backend && <div className="adminNotice warning">Connect Supabase to populate live sales analytics.</div>}
      <div className="metricGrid">
        <article><span>Paid revenue · 30d</span><strong>{analytics.backend ? money(analytics.paidRevenue30) : "—"}</strong><small>Verified payments only</small></article>
        <article><span>Paid revenue · 7d</span><strong>{analytics.backend ? money(analytics.paidRevenue7) : "—"}</strong><small>Recent trading window</small></article>
        <article><span>Paid orders · 30d</span><strong>{analytics.backend ? analytics.paidOrders30 : "—"}</strong><small>Successful orders</small></article>
        <article><span>Average order value</span><strong>{analytics.backend ? money(analytics.averageOrderValue30) : "—"}</strong><small>30-day paid AOV</small></article>
      </div>

      <div className="analyticsGrid">
        <section className="adminCard analyticsChart">
          <div className="adminListHead"><div><span className="kicker">REVENUE TREND</span><h2>Last 14 days</h2></div></div>
          <div className="barChart">{analytics.daily.map((day) => <div className="barDay" key={day.date}><div className="barTrack"><i style={{height: `${Math.max(day.revenue ? 8 : 0, (day.revenue / maxRevenue) * 100)}%`}}/></div><b>{new Date(day.date + "T00:00:00").toLocaleDateString("en-NG",{day:"2-digit",month:"short"})}</b><span>{day.orders}</span></div>)}</div>
        </section>

        <section className="adminCard">
          <span className="kicker">PROMOTION IMPACT</span><h2>Discount health</h2>
          <div className="analyticsFacts"><div><span>Discount value · 30d</span><b>{analytics.backend ? money(analytics.discounts30) : "—"}</b></div><div><span>Coupon orders · 30d</span><b>{analytics.backend ? analytics.couponOrders30 : "—"}</b></div></div>
          <p className="adminMuted">Track discount cost beside revenue. Coupons should create incremental demand or larger baskets, not simply give margin away.</p>
        </section>
      </div>

      <section className="adminCard topProductsCard">
        <div className="adminListHead"><div><span className="kicker">PRODUCT PERFORMANCE</span><h2>Top sellers · 30d</h2></div></div>
        {analytics.topProducts.length ? <div className="topProductList">{analytics.topProducts.map((product,index)=><div key={product.name}><span>{String(index+1).padStart(2,"0")}</span><strong>{product.name}</strong><b>{product.quantity} sold</b><em>{money(product.revenue)}</em></div>)}</div> : <div className="adminEmpty"><h3>No paid product data yet.</h3></div>}
      </section>
    </section>
  </main>;
}
