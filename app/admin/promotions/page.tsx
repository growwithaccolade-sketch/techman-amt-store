import { redirect } from "next/navigation";
import AdminNav from "@/components/admin-nav";
import { hasAdminSession } from "@/app/admin/actions";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { money } from "@/lib/products";
import { createCoupon, deleteCoupon, updateCoupon } from "./actions";

type Coupon = {
  id: string;
  code: string;
  kind: "percent" | "fixed";
  value: number;
  min_order_ngn: number;
  max_discount_ngn?: number | null;
  usage_limit?: number | null;
  usage_count: number;
  starts_at?: string | null;
  ends_at?: string | null;
  active: boolean;
};

function dateInput(value?: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0,16);
}

export default async function PromotionsPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  if (!(await hasAdminSession())) redirect("/admin");
  const { error, success } = await searchParams;
  const backend = commerceBackendConfigured();
  let coupons: Coupon[] = [];

  if (backend) {
    const supabase = getSupabaseAdmin();
    const result = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
    coupons = (result.data ?? []) as Coupon[];
  }

  return <main className="adminShell">
    <AdminNav active="promotions"/>
    <section className="adminMain">
      <div className="adminTop"><div><span className="kicker">OFFERS</span><h1>Coupons & Promotions</h1></div><a className="secondaryAction" href="/checkout">Open checkout</a></div>
      {!backend && <div className="adminNotice warning">Connect Supabase and apply migration 007 before creating real coupon codes.</div>}
      {error && <div className="adminNotice error">Could not complete that change: {error}</div>}
      {success && <div className="adminNotice success">Promotion updated.</div>}

      <div className="adminCatalogLayout">
        <section className="adminCard">
          <span className="kicker">NEW OFFER</span><h2>Create a coupon</h2>
          <form className="adminForm" action={createCoupon}>
            <div className="fieldGrid"><label>Coupon code<input name="code" required placeholder="TECH10"/></label><label>Discount type<select name="kind"><option value="percent">Percentage</option><option value="fixed">Fixed naira amount</option></select></label></div>
            <div className="fieldGrid"><label>Value<input name="value" type="number" min="1" required placeholder="10"/></label><label>Minimum order ₦<input name="minOrder" type="number" min="0" defaultValue="0"/></label></div>
            <div className="fieldGrid"><label>Max discount ₦<input name="maxDiscount" type="number" min="1" placeholder="Optional"/></label><label>Usage limit<input name="usageLimit" type="number" min="1" placeholder="Optional"/></label></div>
            <div className="fieldGrid"><label>Starts at<input name="startsAt" type="datetime-local"/></label><label>Ends at<input name="endsAt" type="datetime-local"/></label></div>
            <button className="primaryAction" disabled={!backend}>Create coupon</button>
          </form>
        </section>

        <section className="adminCard">
          <div className="adminListHead"><div><span className="kicker">CURRENT OFFERS</span><h2>{coupons.length} coupons</h2></div><span>Usage is counted after verified payment</span></div>
          {!backend ? <div className="adminEmpty"><h3>Promotion engine is waiting for the database.</h3></div> :
          coupons.length === 0 ? <div className="adminEmpty"><h3>No coupons yet.</h3><p>Create a code to start a controlled promotion.</p></div> :
          <div className="adminProductList">{coupons.map((coupon) => <details className="adminProductRow" key={coupon.id}>
            <summary><div><strong>{coupon.code}</strong><span>{coupon.kind === "percent" ? `${coupon.value}% off` : `${money(coupon.value)} off`}</span></div><div><b>{coupon.usage_count}{coupon.usage_limit ? ` / ${coupon.usage_limit}` : ""} uses</b><em className={coupon.active ? "statusLive" : "statusOff"}>{coupon.active ? "Active" : "Paused"}</em></div></summary>
            <div className="adminProductEdit">
              <form className="adminForm" action={updateCoupon}>
                <input type="hidden" name="id" value={coupon.id}/>
                <div className="fieldGrid"><label>Type<select name="kind" defaultValue={coupon.kind}><option value="percent">Percentage</option><option value="fixed">Fixed naira</option></select></label><label>Value<input name="value" type="number" min="1" defaultValue={coupon.value} required/></label></div>
                <div className="fieldGrid"><label>Minimum order ₦<input name="minOrder" type="number" min="0" defaultValue={coupon.min_order_ngn}/></label><label>Max discount ₦<input name="maxDiscount" type="number" min="1" defaultValue={coupon.max_discount_ngn ?? ""}/></label></div>
                <div className="fieldGrid"><label>Usage limit<input name="usageLimit" type="number" min="1" defaultValue={coupon.usage_limit ?? ""}/></label><label className="checkLabel"><input name="active" type="checkbox" defaultChecked={coupon.active}/> Coupon active</label></div>
                <div className="fieldGrid"><label>Starts at<input name="startsAt" type="datetime-local" defaultValue={dateInput(coupon.starts_at)}/></label><label>Ends at<input name="endsAt" type="datetime-local" defaultValue={dateInput(coupon.ends_at)}/></label></div>
                <button className="primaryAction">Save promotion</button>
              </form>
              <form action={deleteCoupon}><input type="hidden" name="id" value={coupon.id}/><button className="dangerButton">Delete coupon</button></form>
            </div>
          </details>)}</div>}
        </section>
      </div>
    </section>
  </main>;
}
