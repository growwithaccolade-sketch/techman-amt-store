import { redirect } from "next/navigation";
import AdminNav from "@/components/admin-nav";
import { hasAdminSession } from "@/app/admin/actions";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { money } from "@/lib/products";
import { createDeliveryZone, deleteDeliveryZone, updateDeliveryZone } from "./actions";

type Zone = { id: string; state_name: string; fee_ngn: number; note?: string | null; active: boolean };

const nigeriaStates = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"];

export default async function DeliveryAdminPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  if (!(await hasAdminSession())) redirect("/admin");
  const { error, success } = await searchParams;
  const backend = commerceBackendConfigured();
  let zones: Zone[] = [];
  if (backend) {
    const supabase = getSupabaseAdmin();
    const result = await supabase.from("delivery_zones").select("*").order("state_name");
    zones = (result.data ?? []) as Zone[];
  }

  return <main className="adminShell">
    <AdminNav active="delivery"/>
    <section className="adminMain">
      <div className="adminTop"><div><span className="kicker">FULFILMENT PRICING</span><h1>Delivery Zones</h1></div><a className="secondaryAction" href="/checkout">Test checkout</a></div>
      {!backend && <div className="adminNotice warning">Connect Supabase and apply migration 011 before delivery pricing can be managed here.</div>}
      {error && <div className="adminNotice error">Could not update delivery pricing: {error}</div>}
      {success && <div className="adminNotice success">Delivery pricing updated.</div>}

      <div className="adminCatalogLayout">
        <section className="adminCard">
          <span className="kicker">ADD ZONE</span><h2>Set a delivery fee</h2>
          <form className="adminForm" action={createDeliveryZone}>
            <label>State / zone<input name="stateName" list="nigeria-states" required placeholder="Lagos or * for fallback"/></label>
            <datalist id="nigeria-states">{nigeriaStates.map((state)=><option key={state} value={state}/>)}</datalist>
            <label>Delivery fee ₦<input name="fee" type="number" min="0" step="1" required/></label>
            <label>Customer-facing note<textarea name="note" rows={3} placeholder="e.g. 1–2 business days in major areas"/></label>
            <button className="primaryAction" disabled={!backend}>Add delivery zone</button>
          </form>
          <p className="adminMuted">Use <b>*</b> as a fallback fee for states without their own row. If there is no match or fallback, online payment stops and asks for a manual quote.</p>
        </section>

        <section className="adminCard">
          <div className="adminListHead"><div><span className="kicker">PRICING TABLE</span><h2>{zones.length} zones</h2></div><span>Free-delivery threshold from Store Settings can override the fee</span></div>
          {!backend ? <div className="adminEmpty"><h3>Delivery pricing is waiting for the database.</h3></div> :
          zones.length === 0 ? <div className="adminEmpty"><h3>No delivery zones yet.</h3><p>Create state fees or a fallback zone.</p></div> :
          <div className="adminProductList">{zones.map((zone)=><details className="adminProductRow" key={zone.id}>
            <summary><div><strong>{zone.state_name === "*" ? "All other states" : zone.state_name}</strong><span>{zone.note || "No delivery note"}</span></div><div><b>{money(Number(zone.fee_ngn))}</b><em className={zone.active ? "statusLive" : "statusOff"}>{zone.active ? "Active" : "Paused"}</em></div></summary>
            <div className="adminProductEdit">
              <form className="adminForm" action={updateDeliveryZone}>
                <input type="hidden" name="id" value={zone.id}/>
                <div className="fieldGrid"><label>State / zone<input name="stateName" defaultValue={zone.state_name} required/></label><label>Fee ₦<input name="fee" type="number" min="0" defaultValue={zone.fee_ngn} required/></label></div>
                <label>Note<textarea name="note" rows={3} defaultValue={zone.note ?? ""}/></label>
                <label className="checkLabel"><input name="active" type="checkbox" defaultChecked={zone.active}/> Zone active</label>
                <button className="primaryAction">Save zone</button>
              </form>
              <form action={deleteDeliveryZone}><input type="hidden" name="id" value={zone.id}/><button className="dangerButton">Delete zone</button></form>
            </div>
          </details>)}</div>}
        </section>
      </div>
    </section>
  </main>;
}
