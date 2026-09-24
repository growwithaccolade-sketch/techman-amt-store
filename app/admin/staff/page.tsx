import { redirect } from "next/navigation";
import AdminNav from "@/components/admin-nav";
import { getAdminSession, hasAdminSession } from "@/app/admin/actions";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { createStaff, deleteStaff, updateStaff } from "./actions";

type Staff = { id:string;username:string;display_name:string;role:string;active:boolean;created_at:string };

export default async function StaffPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  if (!(await hasAdminSession())) redirect("/admin");
  const session = await getAdminSession();
  if (session?.role !== "owner") redirect("/admin?error=owner");

  const { error, success } = await searchParams;
  const backend = commerceBackendConfigured();
  let staff: Staff[] = [];

  if (backend) {
    const supabase = getSupabaseAdmin();
    const result = await supabase.from("admin_staff").select("id,username,display_name,role,active,created_at").order("created_at");
    staff = (result.data ?? []) as Staff[];
  }

  return <main className="adminShell">
    <AdminNav active="staff"/>
    <section className="adminMain">
      <div className="adminTop"><div><span className="kicker">ACCESS CONTROL</span><h1>Staff</h1></div><a className="secondaryAction" href="/admin">Overview</a></div>
      {!backend && <div className="adminNotice warning">Apply migration 013 and connect Supabase before staff accounts can be stored.</div>}
      {error && <div className="adminNotice error">Could not update staff: {error}</div>}
      {success && <div className="adminNotice success">Staff access updated.</div>}

      <div className="adminCatalogLayout">
        <section className="adminCard">
          <span className="kicker">ADD STAFF</span><h2>Create login</h2>
          <form className="adminForm" action={createStaff}>
            <label>Display name<input name="displayName" required/></label>
            <label>Username<input name="username" required placeholder="sales.team"/></label>
            <label>Temporary password<input name="password" type="password" minLength={8} required/></label>
            <label>Role<select name="role" defaultValue="support"><option value="manager">Manager</option><option value="editor">Editor</option><option value="support">Support</option></select></label>
            <button className="primaryAction" disabled={!backend}>Add staff</button>
          </form>
        </section>

        <section className="adminCard">
          <div className="adminListHead"><div><span className="kicker">TEAM ACCESS</span><h2>{staff.length} staff accounts</h2></div></div>
          {staff.length === 0 ? <div className="adminEmpty"><h3>No staff accounts yet.</h3><p>The owner account remains separate from staff accounts.</p></div> :
          <div className="adminProductList">{staff.map(person=><details className="adminProductRow" key={person.id}>
            <summary><div><strong>{person.display_name}</strong><span>@{person.username}</span></div><div><b>{person.role}</b><em className={person.active ? "statusLive":"statusOff"}>{person.active ? "Active":"Paused"}</em></div></summary>
            <div className="adminProductEdit">
              <form className="adminForm" action={updateStaff}>
                <input type="hidden" name="id" value={person.id}/>
                <label>Display name<input name="displayName" defaultValue={person.display_name} required/></label>
                <label>Role<select name="role" defaultValue={person.role}><option value="manager">Manager</option><option value="editor">Editor</option><option value="support">Support</option></select></label>
                <label>New password<input name="password" type="password" minLength={8} placeholder="Leave blank to keep current password"/></label>
                <label className="checkLabel"><input name="active" type="checkbox" defaultChecked={person.active}/> Active</label>
                <button className="primaryAction">Save staff</button>
              </form>
              <form action={deleteStaff}><input type="hidden" name="id" value={person.id}/><button className="dangerButton">Delete staff</button></form>
            </div>
          </details>)}</div>}
        </section>
      </div>
    </section>
  </main>;
}
