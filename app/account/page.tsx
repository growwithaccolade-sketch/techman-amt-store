import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart, LogOut, PackageSearch, Scale, ShoppingBag, UserRound } from "lucide-react";
import CommerceHeader from "@/components/commerce-header";
import { createCustomerServerClient, customerAuthConfigured } from "@/lib/supabase/server";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { money } from "@/lib/products";
import { signOutCustomer, updateProfile } from "./actions";

export const metadata: Metadata = { title: "My Account", robots: { index: false, follow: false } };

type AccountOrder = {
  reference: string;
  total_ngn: number;
  status: string;
  payment_status: string;
  created_at: string;
  order_items?: Array<{ product_name: string; quantity: number }>;
};

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  if (!customerAuthConfigured()) redirect("/auth/sign-in");

  const supabase = await createCustomerServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) redirect("/auth/sign-in");

  const { data: profile } = await supabase.from("profiles").select("full_name,phone").eq("user_id", user.id).maybeSingle();
  let orders: AccountOrder[] = [];

  if (commerceBackendConfigured()) {
    const admin = getSupabaseAdmin();
    const result = await admin.from("orders")
      .select("reference,total_ngn,status,payment_status,created_at,order_items(product_name,quantity)")
      .eq("email", user.email.toLowerCase())
      .order("created_at", { ascending: false })
      .limit(50);
    orders = (result.data ?? []) as AccountOrder[];
  }

  const { error, success } = await searchParams;

  return <>
    <CommerceHeader/>
    <main className="accountPage shell">
      <section className="accountHero"><div><span className="kicker">ACCOUNT</span><h1>Your account.</h1><p>{user.email}</p></div><form action={signOutCustomer}><button className="secondaryAction"><LogOut size={17}/> Sign out</button></form></section>
      {error && <div className="adminNotice error">Profile changes could not be saved.</div>}
      {success && <div className="adminNotice success">Profile updated.</div>}

      <div className="accountGrid">
        <section className="accountCard profileCard">
          <div className="accountCardHead"><UserRound/><div><span className="kicker">PROFILE</span><h2>Your details</h2></div></div>
          <form className="accountForm" action={updateProfile}>
            <label>Full name<input name="fullName" defaultValue={profile?.full_name || String(user.user_metadata?.full_name || "")}/></label>
            <label>Email<input value={user.email} disabled readOnly/></label>
            <label>Phone number<input name="phone" inputMode="tel" defaultValue={profile?.phone || ""}/></label>
            <button className="primaryAction">Save profile</button>
          </form>
        </section>

        <section className="accountCard">
          <div className="accountCardHead"><ShoppingBag/><div><span className="kicker">SHOPPING</span><h2>Quick links</h2></div></div>
          <div className="accountLinks"><Link href="/wishlist"><Heart/> Wishlist</Link><Link href="/compare"><Scale/> Compare products</Link><Link href="/track-order"><PackageSearch/> Track an order</Link><Link href="/shop"><ShoppingBag/> Continue shopping</Link></div>
        </section>
      </div>

      <section className="accountOrders">
        <div className="sectionHead"><div><span className="kicker">ORDERS</span><h2>Order history.</h2></div><p>Orders using this account email appear here.</p></div>
        {!commerceBackendConfigured() ? <div className="adminNotice warning">The order database is not connected yet.</div> :
        orders.length === 0 ? <div className="adminEmpty"><h3>No matching orders yet.</h3><p>Guest orders using this same email will appear here once recorded.</p></div> :
        <div className="accountOrderList">{orders.map((order)=><article key={order.reference} className="accountOrder">
          <div className="accountOrderTop"><div><strong>{order.reference}</strong><span>{new Date(order.created_at).toLocaleDateString("en-NG")}</span></div><div><b>{money(Number(order.total_ngn))}</b><span>{order.payment_status} · {order.status.replaceAll("_"," ")}</span></div></div>
          <div className="trackedItems">{order.order_items?.map((item)=><div key={item.product_name}><span>{item.product_name}</span><b>× {item.quantity}</b></div>)}</div>
          <Link href={`/track-order?reference=${encodeURIComponent(order.reference)}`}>Track this order →</Link>
        </article>)}</div>}
      </section>
    </main>
  </>;
}
