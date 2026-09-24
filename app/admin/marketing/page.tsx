import { redirect } from "next/navigation";
import AdminNav from "@/components/admin-nav";
import { hasAdminSession } from "@/app/admin/actions";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { deleteSubscriber, setSubscriberActive } from "./actions";

type Subscriber = { id: string; email: string; source: string; active: boolean; created_at: string };

export default async function MarketingPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  if (!(await hasAdminSession())) redirect("/admin");
  const { error, success } = await searchParams;
  const backend = commerceBackendConfigured();
  let subscribers: Subscriber[] = [];
  let pendingOrders = 0;
  let newLeads = 0;

  if (backend) {
    const supabase = getSupabaseAdmin();
    const [subscriberResult, pendingResult, leadResult] = await Promise.all([
      supabase.from("newsletter_subscribers").select("*").order("created_at", { ascending: false }).limit(500),
      supabase.from("orders").select("*", { count: "exact", head: true }).eq("payment_status", "pending"),
      supabase.from("lead_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
    ]);
    subscribers = (subscriberResult.data ?? []) as Subscriber[];
    pendingOrders = pendingResult.count ?? 0;
    newLeads = leadResult.count ?? 0;
  }

  const activeCount = subscribers.filter((subscriber) => subscriber.active).length;

  return <main className="adminShell">
    <AdminNav active="marketing"/>
    <section className="adminMain">
      <div className="adminTop"><div><span className="kicker">GROWTH</span><h1>Marketing Operations</h1></div><a className="secondaryAction" href="/admin/promotions">Manage promotions</a></div>
      {!backend && <div className="adminNotice warning">Connect Supabase and apply the newsletter/lead migrations to populate marketing operations.</div>}
      {error && <div className="adminNotice error">Could not update subscriber: {error}</div>}
      {success && <div className="adminNotice success">Subscriber updated.</div>}

      <div className="metricGrid">
        <article><span>Active subscribers</span><strong>{backend ? activeCount : "—"}</strong><small>Newsletter audience</small></article>
        <article><span>Pending payments</span><strong>{backend ? pendingOrders : "—"}</strong><small>Orders that did not reach paid status</small></article>
        <article><span>New sales leads</span><strong>{backend ? newLeads : "—"}</strong><small>Trade-in, sourcing and bulk requests</small></article>
        <article><span>Audience source</span><strong>{backend ? "Storefront" : "—"}</strong><small>Current newsletter acquisition source</small></article>
      </div>

      <div className="analyticsGrid">
        <section className="adminCard">
          <span className="kicker">FOLLOW-UP PRIORITIES</span><h2>Where attention can create revenue</h2>
          <div className="marketingPriority"><span>01</span><div><b>Pending payments</b><p>Review pending orders before treating them as abandoned. Some may be payment initialization failures or customers who chose a different payment route.</p></div></div>
          <div className="marketingPriority"><span>02</span><div><b>New sales leads</b><p>Trade-in, sourcing and bulk requests are high-intent conversations. Move them through lead statuses quickly.</p></div></div>
          <div className="marketingPriority"><span>03</span><div><b>Subscribers</b><p>Use the audience for meaningful product drops, useful guides and controlled offers—not constant discounts.</p></div></div>
        </section>

        <section className="adminCard">
          <span className="kicker">OFFER DISCIPLINE</span><h2>Protect margin</h2>
          <p className="adminMuted">Use Analytics beside Promotions. If coupon usage rises without stronger order volume or average order value, the offer may be subsidising customers who would have purchased anyway.</p>
          <a className="secondaryAction" href="/admin/analytics">Open sales analytics</a>
        </section>
      </div>

      <section className="adminCard adminOrdersCard">
        <div className="adminListHead"><div><span className="kicker">NEWSLETTER AUDIENCE</span><h2>{subscribers.length} subscribers</h2></div><span>{activeCount} currently active</span></div>
        {!backend ? <div className="adminEmpty"><h3>Subscriber data is waiting for the database.</h3></div> :
        subscribers.length === 0 ? <div className="adminEmpty"><h3>No subscribers yet.</h3><p>The homepage newsletter form feeds this list automatically.</p></div> :
        <div className="subscriberList">{subscribers.map((subscriber)=><div className="subscriberRow" key={subscriber.id}><span><strong>{subscriber.email}</strong><small>{subscriber.source} · {new Date(subscriber.created_at).toLocaleDateString("en-NG")}</small></span><em className={subscriber.active ? "statusLive" : "statusOff"}>{subscriber.active ? "Active" : "Inactive"}</em><form action={setSubscriberActive}><input type="hidden" name="id" value={subscriber.id}/><input type="hidden" name="active" value={subscriber.active ? "false" : "true"}/><button>{subscriber.active ? "Deactivate" : "Reactivate"}</button></form><form action={deleteSubscriber}><input type="hidden" name="id" value={subscriber.id}/><button className="dangerText">Delete</button></form></div>)}</div>}
      </section>
    </section>
  </main>;
}
