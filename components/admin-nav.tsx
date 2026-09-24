import Link from "next/link";
import { BarChart3, Boxes, LayoutDashboard, LogOut, MessageSquare, Package, Settings, ShoppingCart, TicketPercent, Users } from "lucide-react";
import { logoutAdmin } from "@/app/admin/actions";

export default function AdminNav({ active }: { active: "overview" | "products" | "orders" | "inventory" | "customers" | "analytics" | "settings" | "leads" | "promotions" }) {
  return (
    <aside className="adminSidebar">
      <Link href="/" className="brand footerBrand"><span className="brandMark">T</span><span>TECHMAN <b>AMT</b></span></Link>
      <nav>
        <Link className={active === "overview" ? "active" : ""} href="/admin"><LayoutDashboard size={18}/> Overview</Link>
        <Link className={active === "products" ? "active" : ""} href="/admin/products"><Package size={18}/> Products</Link>
        <Link className={active === "orders" ? "active" : ""} href="/admin/orders"><ShoppingCart size={18}/> Orders</Link>
        <Link className={active === "inventory" ? "active" : ""} href="/admin/products"><Boxes size={18}/> Inventory</Link>
        <Link className={active === "leads" ? "active" : ""} href="/admin/leads"><MessageSquare size={18}/> Leads</Link><Link className={active === "promotions" ? "active" : ""} href="/admin/promotions"><TicketPercent size={18}/> Promotions</Link><span className={active === "customers" ? "active" : ""}><Users size={18}/> Customers <small>Soon</small></span>
        <span className={active === "analytics" ? "active" : ""}><BarChart3 size={18}/> Analytics <small>Soon</small></span>
        <Link className={active === "settings" ? "active" : ""} href="/admin/settings"><Settings size={18}/> Settings</Link>
      </nav>
      <form action={logoutAdmin}><button><LogOut size={18}/> Sign out</button></form>
    </aside>
  );
}
