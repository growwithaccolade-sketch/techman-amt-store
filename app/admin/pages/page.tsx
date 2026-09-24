import { redirect } from "next/navigation";
import AdminNav from "@/components/admin-nav";
import { hasAdminSession } from "@/app/admin/actions";
import { getAdminPages } from "@/lib/site-pages";
import { deletePage, savePage } from "./actions";

type PageRow = {
  slug:string;eyebrow?:string|null;title:string;intro?:string|null;sections?:Array<{title:string;body:string;points?:string[]}>;seo_title?:string|null;seo_description?:string|null;active:boolean;
};

function toText(sections: PageRow["sections"]) {
  return (sections || []).map(section => [section.title, section.body, ...(section.points || [])].join("\n")).join("\n\n");
}

const core = ["home","about","contact","delivery","returns","warranty","faq","privacy","terms","refund-policy"];

export default async function PagesAdmin({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  if (!(await hasAdminSession())) redirect("/admin");
  const { error, success } = await searchParams;
  const data = await getAdminPages();
  const pages = data.pages as PageRow[];

  return <main className="adminShell">
    <AdminNav active="pages"/>
    <section className="adminMain">
      <div className="adminTop"><div><span className="kicker">CONTENT CMS</span><h1>Pages</h1></div><a className="secondaryAction" href="/">View storefront</a></div>
      {!data.backend && <div className="adminNotice warning">Apply migration 013 and connect Supabase before page edits can be saved.</div>}
      {error && <div className="adminNotice error">Could not save page: {error}</div>}
      {success && <div className="adminNotice success">Page content updated.</div>}

      <section className="adminCard">
        <span className="kicker">CREATE OR OVERRIDE</span><h2>Edit any page copy</h2>
        <p className="adminMuted">Use a core slug such as {core.join(", ")} to override that page. Other slugs create custom pages at /p/your-slug. Separate sections with a blank line. First line is the section title, second is body, remaining lines become bullet points.</p>
        <form className="adminForm" action={savePage}>
          <div className="fieldGrid"><label>Page slug<input name="slug" required placeholder="about"/></label><label>Eyebrow<input name="eyebrow" placeholder="ABOUT"/></label></div>
          <label>Page title<input name="title" required/></label>
          <label>Intro<textarea name="intro" rows={3}/></label>
          <label>Sections<textarea name="sectionsText" rows={10} placeholder={"Section title\nSection body\nOptional bullet\nOptional bullet\n\nSecond section\nSecond body"}/></label>
          <div className="fieldGrid"><label>SEO title<input name="seoTitle"/></label><label>SEO description<input name="seoDescription"/></label></div>
          <label className="checkLabel"><input name="active" type="checkbox" defaultChecked/> Page active</label>
          <button className="primaryAction" disabled={!data.backend}>Save page</button>
        </form>
      </section>

      <section className="adminCard adminOrdersCard">
        <div className="adminListHead"><div><span className="kicker">SAVED CONTENT</span><h2>{pages.length} edited pages</h2></div></div>
        {pages.length === 0 ? <div className="adminEmpty"><h3>No page overrides yet.</h3><p>The code defaults remain live until you save an override.</p></div> :
        <div className="adminProductList">{pages.map(page=><details className="adminProductRow" key={page.slug}>
          <summary><div><strong>/{page.slug}</strong><span>{page.title}</span></div><em className={page.active ? "statusLive":"statusOff"}>{page.active ? "Active":"Hidden"}</em></summary>
          <div className="adminProductEdit">
            <form className="adminForm" action={savePage}>
              <input type="hidden" name="slug" value={page.slug}/>
              <div className="fieldGrid"><label>Eyebrow<input name="eyebrow" defaultValue={page.eyebrow || ""}/></label><label>Title<input name="title" defaultValue={page.title} required/></label></div>
              <label>Intro<textarea name="intro" rows={3} defaultValue={page.intro || ""}/></label>
              <label>Sections<textarea name="sectionsText" rows={10} defaultValue={toText(page.sections)}/></label>
              <div className="fieldGrid"><label>SEO title<input name="seoTitle" defaultValue={page.seo_title || ""}/></label><label>SEO description<input name="seoDescription" defaultValue={page.seo_description || ""}/></label></div>
              <label className="checkLabel"><input name="active" type="checkbox" defaultChecked={page.active}/> Page active</label>
              <button className="primaryAction">Save changes</button>
            </form>
            <form action={deletePage}><input type="hidden" name="slug" value={page.slug}/><button className="dangerButton">Delete override</button></form>
          </div>
        </details>)}</div>}
      </section>
    </section>
  </main>;
}
