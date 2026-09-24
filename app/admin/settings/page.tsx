import { redirect } from "next/navigation";
import AdminNav from "@/components/admin-nav";
import { hasAdminSession } from "@/app/admin/actions";
import { getStoreSettings } from "@/lib/store-settings";
import { commerceBackendConfigured } from "@/lib/supabase/admin";
import { updateStoreSettings } from "./actions";

export default async function AdminSettingsPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  if (!(await hasAdminSession())) redirect("/admin");
  const { error, success } = await searchParams;
  const backend = commerceBackendConfigured();
  const settings = await getStoreSettings();

  return (
    <main className="adminShell">
      <AdminNav active="settings"/>
      <section className="adminMain">
        <div className="adminTop"><div><span className="kicker">STORE SETTINGS</span><h1>Public business details</h1></div><a className="secondaryAction" href="/contact">View contact page</a></div>
        {!backend && <div className="adminNotice warning">Supabase is not connected. The form shows environment fallbacks but cannot save database settings yet.</div>}
        {error && <div className="adminNotice error">Could not save settings: {error}</div>}
        {success && <div className="adminNotice success">Store settings updated.</div>}

        <section className="adminCard settingsCard">
          <span className="kicker">EDITABLE WITHOUT CODE</span>
          <h2>Customer-facing settings</h2>
          <p className="adminMuted">These values appear in announcements, WhatsApp actions, contact information and delivery messaging. Keep them accurate because customers use them to make purchase decisions.</p>
          <form className="adminForm" action={updateStoreSettings}>
            <label>Announcement bar<input name="announcementText" defaultValue={settings.announcementText} maxLength={120}/></label>
            <div className="fieldGrid">
              <label>Support email<input name="supportEmail" type="email" defaultValue={settings.supportEmail}/></label>
              <label>WhatsApp number<input name="whatsappNumber" inputMode="tel" defaultValue={settings.whatsappNumber} placeholder="2348012345678"/></label>
            </div>
            <label>Free delivery threshold in ₦<input name="freeDeliveryThreshold" type="number" min="0" step="1" defaultValue={settings.freeDeliveryThreshold ?? ""} placeholder="Leave blank if not running this offer"/></label>
            <button className="primaryAction" type="submit" disabled={!backend}>Save public settings</button>
          </form>
        </section>
      </section>
    </main>
  );
}
