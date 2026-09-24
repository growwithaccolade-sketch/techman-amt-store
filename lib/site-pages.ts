import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import type { InfoSection } from "@/components/info-page";

export type EditablePage = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  sections: InfoSection[];
  seoTitle?: string;
  seoDescription?: string;
};

export async function getEditablePage(slug: string, fallback: EditablePage): Promise<EditablePage> {
  if (!commerceBackendConfigured()) return fallback;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("site_pages")
    .select("slug,eyebrow,title,intro,sections,seo_title,seo_description,active")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error || !data) return fallback;
  return {
    slug,
    eyebrow: String(data.eyebrow || fallback.eyebrow),
    title: String(data.title || fallback.title),
    intro: String(data.intro || fallback.intro),
    sections: Array.isArray(data.sections) && data.sections.length ? data.sections as InfoSection[] : fallback.sections,
    seoTitle: String(data.seo_title || ""),
    seoDescription: String(data.seo_description || ""),
  };
}

export async function getAdminPages() {
  if (!commerceBackendConfigured()) return { backend: false, pages: [] as Record<string, unknown>[] };
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("site_pages").select("*").order("slug");
  if (error) throw new Error(error.message);
  return { backend: true, pages: data ?? [] };
}
