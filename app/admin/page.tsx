import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import AdminNav from "@/components/admin-nav";
import { getAdminSession, hasAdminSession, loginAdmin } from "./actions";
import { getAdminMetrics } from "@/lib/admin-data";
import { money } from "@/lib/products";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const authenticated = await hasAdminSession();

  if (!authenticated) {
    return (
      <main className="adminLogin">
        <div className="adminLoginCard">
          <Link href="/" className="brand"><span className="brandMark">T</span><span>TECHMAN <b>AMT</b></span></Link>
          <span className="kicker">PRIVATE ADMIN</span>
          <h1>Store control starts here.</h1>
          <p>Sign in to manage products, pages, orders, staff and store settings.</p>
          {error === "invalid" && <div className="adminError">Incorrect username or password.</div>}
          {error === "owner" && <div className="adminError">Owner access is required for that action.</div>}
          <form action={loginAdmin}><label>Username<input name="username" required autoComplete="username" defaultValue="admin"/></label><label>Password<input name="password" type="password" required autoComplete="current-password"/></label><button className="primaryAction" type="submit"><ShieldCheck size={18}/> Sign in</button></form>
          <small>Owner and staff sessions are server-signed. Add staff from the Staff section after signing in.</small>
        </div>
      </main>
    );
  }

  const metrics = await getAdminMetrics();
  const session = await getAdminSession();

  return (
    <main className="adminShell">
      <AdminNav active="overview"/>
      <section className="adminMain">
        <div className="adminTop"><div><span className="kicker">STORE OVERVIEW</span><h1>TechMan AMT Admin</h1><p className="adminMuted">Signed in as {session?.displayName} · {session?.role}</p></div><Link href="/" className="secondaryAction">View storefront</Link></div>
        {!metrics.backend && <div className="adminNotice warning">The admin is running in demo fallback mode. Connect Supabase and apply both migrations to turn on live product, order and revenue data.</div>}
        <div className="metricGrid">
          <article><span>Products</span><strong>{metrics.products}</strong><small>{metrics.backend ? "Database catalog" : "Demo catalog fallback"}</small></article>
          <article><span>Orders</span><strong>{metrics.orders}</strong><small>{metrics.backend ? "All recorded orders" : "Connect database to track orders"}</small></article>
          <article><span>Paid revenue</span><strong>{metrics.backend ? money(metrics.revenue) : "—"}</strong><small>Verified paid orders only</small></article>
          <article><span>Low stock</span><strong>{metrics.lowStock}</strong><small>Products with 5 units or fewer</small></article>
        </div>
        <div className="adminPanels">
          <article>
            <span className="kicker">OPERATIONS</span>
            <h2>Manage the store from here.</h2>
            <p>Product changes now feed the live storefront when the database is connected. Checkout validates current price and stock from the same catalog before starting payment.</p>
            <div className="adminQuickLinks"><Link href="/admin/products">Manage products</Link><Link href="/admin/orders">Manage orders</Link><Link href="/track-order">Test customer tracking</Link></div>
          </article>
          <article>
            <span className="kicker">PRODUCTION CHECKLIST</span>
            <h2>What still needs credentials</h2>
            <div className="adminSetup"><span>1</span><b>Apply Supabase migrations 001 and 002</b></div>
            <div className="adminSetup"><span>2</span><b>Add Supabase and Paystack environment variables</b></div>
            <div className="adminSetup"><span>3</span><b>Add TechMan AMT WhatsApp number and final domain</b></div>
            <div className="adminSetup"><span>4</span><b>Run test-mode payment end to end before live keys</b></div>
          </article>
        </div>
      </section>
    </main>
  );
}
