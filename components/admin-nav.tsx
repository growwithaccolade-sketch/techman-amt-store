import Link from "next/link";
import { BarChart3, Boxes, FileText, LayoutDashboard, LogOut, Megaphone, MessageSquare, Package, Settings, ShoppingCart, Star, TicketPercent, Truck, UserCog, Users } from "lucide-react";
import { logoutAdmin } from "@/app/admin/actions";

export default function AdminNav({ active }: { active: "overview" | "products" | "orders" | "inventory" | "customers" | "analytics" | "settings" | "leads" | "promotions" | "reviews" | "delivery" | "marketing" | "staff" | "pages" }) {
  return (
    <aside className="adminSidebar">
      <Link href="/" className="brand footerBrand"><span className="brandMark">T</span><span>TECHMAN <b>AMT</b></span></Link>
      <nav>
        <Link className={active === "overview" ? "active" : ""} href="/admin"><LayoutDashboard size={18}/> Overview</Link>
        <Link className={active === "products" ? "active" : ""} href="/admin/products"><Package size={18}/> Products</Link>
        <Link className={active === "orders" ? "active" : ""} href="/admin/orders"><ShoppingCart size={18}/> Orders</Link><Link className={active === "delivery" ? "active" : ""} href="/admin/delivery"><Truck size={18}/> Delivery</Link>
        <Link className={active === "inventory" ? "active" : ""} href="/admin/products"><Boxes size={18}/> Inventory</Link>
        <Link className={active === "leads" ? "active" : ""} href="/admin/leads"><MessageSquare size={18}/> Leads</Link><Link className={active === "promotions" ? "active" : ""} href="/admin/promotions"><TicketPercent size={18}/> Promotions</Link><Link className={active === "marketing" ? "active" : ""} href="/admin/marketing"><Megaphone size={18}/> Marketing</Link><Link className={active === "reviews" ? "active" : ""} href="/admin/reviews"><Star size={18}/> Reviews</Link><Link className={active === "customers" ? "active" : ""} href="/admin/customers"><Users size={18}/> Customers</Link>
        <Link className={active === "analytics" ? "active" : ""} href="/admin/analytics"><BarChart3 size={18}/> Analytics</Link>
        <Link className={active === "pages" ? "active" : ""} href="/admin/pages"><FileText size={18}/> Pages</Link><Link className={active === "staff" ? "active" : ""} href="/admin/staff"><UserCog size={18}/> Staff</Link><Link className={active === "settings" ? "active" : ""} href="/admin/settings"><Settings size={18}/> Settings</Link>
      </nav>
      <form action={logoutAdmin}><button><LogOut size={18}/> Sign out</button></form>
    </aside>
  );
}
