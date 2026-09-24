import { redirect } from "next/navigation";
import AdminNav from "@/components/admin-nav";
import { hasAdminSession } from "@/app/admin/actions";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { updateLead } from "./actions";

type LeadRow = {
  id: string;
  type: string;
  name: string;
  email?: string | null;
  phone: string;
  payload: Record<string, unknown>;
  status: string;
  admin_note?: string | null;
  created_at: string;
};

export default async function AdminLeadsPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  if (!(await hasAdminSession())) redirect("/admin");
  const { error, success } = await searchParams;
  const backend = commerceBackendConfigured();
  let leads: LeadRow[] = [];

  if (backend) {
    const supabase = getSupabaseAdmin();
    const result = await supabase.from("lead_requests").select("*").order("created_at", { ascending: false }).limit(100);
    leads = (result.data ?? []) as LeadRow[];
  }

  return (
    <main className="adminShell">
      <AdminNav active="leads"/>
      <section className="adminMain">
        <div className="adminTop"><div><span className="kicker">SALES PIPELINE</span><h1>Leads & Requests</h1></div><a className="secondaryAction" href="/corporate">Open quote form</a></div>
        {!backend && <div className="adminNotice warning">Supabase is not connected, so sales requests cannot be stored or shown yet.</div>}
        {error && <div className="adminNotice error">Could not update lead: {error}</div>}
        {success && <div className="adminNotice success">Lead updated.</div>}
        <section className="adminCard adminOrdersCard">
          <div className="adminListHead"><div><span className="kicker">RECENT REQUESTS</span><h2>{leads.length} records</h2></div><span>Trade-ins, sourcing and corporate quotes</span></div>
          {!backend ? <div className="adminEmpty"><h3>Lead inbox is waiting for the database.</h3></div> :
          leads.length === 0 ? <div className="adminEmpty"><h3>No requests yet.</h3><p>Submitted forms will appear here automatically.</p></div> :
          <div className="orderAdminList">{leads.map((lead) => <details className="orderAdminRow" key={lead.id}>
            <summary><div><strong>{lead.name}</strong><span>{lead.type.replaceAll("_", " ")} · {lead.phone}</span></div><div><b>{lead.status}</b><span>{new Date(lead.created_at).toLocaleString("en-NG")}</span></div></summary>
            <div className="orderAdminBody">
              <div className="orderFacts"><span><b>Email</b>{lead.email || "Not supplied"}</span><span><b>Phone</b>{lead.phone}</span><span><b>Type</b>{lead.type.replaceAll("_", " ")}</span><span><b>Status</b>{lead.status}</span></div>
              <div className="leadPayload">{Object.entries(lead.payload || {}).map(([key, value]) => <div key={key}><span>{key.replaceAll("_", " ")}</span><b>{String(value || "—")}</b></div>)}</div>
              <form className="adminForm orderUpdateForm" action={updateLead}>
                <input type="hidden" name="id" value={lead.id}/>
                <label>Status<select name="status" defaultValue={lead.status}><option value="new">New</option><option value="contacted">Contacted</option><option value="reviewing">Reviewing</option><option value="quoted">Quoted</option><option value="won">Won</option><option value="lost">Lost</option><option value="closed">Closed</option></select></label>
                <label>Internal note<textarea name="adminNote" rows={3} defaultValue={lead.admin_note ?? ""}/></label>
                <button className="primaryAction">Update lead</button>
              </form>
            </div>
          </details>)}</div>}
        </section>
      </section>
    </main>
  );
}
