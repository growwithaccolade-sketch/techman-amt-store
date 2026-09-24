import { notFound } from "next/navigation";
import InfoPage from "@/components/info-page";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

export default async function CustomPage({ params }: { params: Promise<{slug:string}> }) {
  const { slug } = await params;
  if (!commerceBackendConfigured()) notFound();
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("site_pages").select("eyebrow,title,intro,sections,active").eq("slug",slug).eq("active",true).maybeSingle();
  if (!data) notFound();
  return <InfoPage eyebrow={String(data.eyebrow || "")} title={String(data.title)} intro={String(data.intro || "")} sections={Array.isArray(data.sections) ? data.sections : []}/>;
}
