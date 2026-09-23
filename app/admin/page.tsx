import Link from "next/link";
import { BarChart3, Boxes, LayoutDashboard, LogOut, Package, Settings, ShieldCheck, ShoppingCart, Users } from "lucide-react";
import { hasAdminSession, loginAdmin, logoutAdmin } from "./actions";

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
          <p>This area is intentionally hidden from the storefront navigation.</p>
          {error === "invalid" && <div className="adminError">That access key is not valid.</div>}
          {error === "config" && <div className="adminError">ADMIN_ACCESS_KEY is not configured on the server yet.</div>}
          <form action={loginAdmin}><label>Admin access key<input name="accessKey" type="password" required autoComplete="current-password"/></label><button className="primaryAction" type="submit"><ShieldCheck size={18}/> Sign in securely</button></form>
          <small>For production, this foundation should be upgraded to Supabase Auth with role-based permissions and optional MFA.</small>
        </div>
      </main>
    );
  }

  return (
    <main className="adminShell">
      <aside className="adminSidebar">
        <Link href="/" className="brand footerBrand"><span className="brandMark">T</span><span>TECHMAN <b>AMT</b></span></Link>
        <nav>
          <a className="active"><LayoutDashboard size={18}/> Overview</a>
          <a><Package size={18}/> Products</a>
          <a><ShoppingCart size={18}/> Orders</a>
          <a><Boxes size={18}/> Inventory</a>
          <a><Users size={18}/> Customers</a>
          <a><BarChart3 size={18}/> Analytics</a>
          <a><Settings size={18}/> Settings</a>
        </nav>
        <form action={logoutAdmin}><button><LogOut size={18}/> Sign out</button></form>
      </aside>
      <section className="adminMain">
        <div className="adminTop"><div><span className="kicker">STORE OVERVIEW</span><h1>TechMan AMT Admin</h1></div><Link href="/" className="secondaryAction">View storefront</Link></div>
        <div className="metricGrid">
          <article><span>Products</span><strong>8</strong><small>Demo catalog currently loaded</small></article>
          <article><span>Orders</span><strong>—</strong><small>Connect database to start tracking</small></article>
          <article><span>Revenue</span><strong>—</strong><small>Appears after payments are connected</small></article>
          <article><span>Low stock</span><strong>0</strong><small>Inventory engine comes next</small></article>
        </div>
        <div className="adminPanels">
          <article><span className="kicker">FOUNDATION STATUS</span><h2>What is live in the codebase</h2><ul><li><CheckItem/>Responsive storefront</li><li><CheckItem/>Persistent browser cart</li><li><CheckItem/>Product detail routes</li><li><CheckItem/>Checkout details flow</li><li><CheckItem/>Environment-based contact settings</li><li><CheckItem/>Protected admin entry point</li></ul></article>
          <article><span className="kicker">NEXT CONNECTIONS</span><h2>Production services</h2><p>Connect Supabase for products, inventory, customers and orders. Then wire Paystack webhooks for verified payments and order creation.</p><div className="adminSetup"><span>1</span><b>Supabase database + Auth</b></div><div className="adminSetup"><span>2</span><b>Paystack payments + webhook</b></div><div className="adminSetup"><span>3</span><b>Image storage + admin CRUD</b></div></article>
        </div>
      </section>
    </main>
  );
}

function CheckItem() {
  return <span className="adminCheck">✓</span>;
}
