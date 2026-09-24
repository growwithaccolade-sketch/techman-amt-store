"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/app/admin/actions";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

function parseSections(raw: string) {
  return raw.split("\n\n").map(block => block.trim()).filter(Boolean).map(block => {
    const lines = block.split("\n").map(line => line.trim()).filter(Boolean);
    const title = lines.shift() || "Section";
    const body = lines.shift() || "";
    const points = lines.length ? lines : undefined;
    return { title, body, points };
  });
}

export async function savePage(formData: FormData) {
  if (!(await hasAdminSession())) redirect("/admin");
  if (!commerceBackendConfigured()) redirect("/admin/pages?error=backend");

  const slug = String(formData.get("slug") || "").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
  const title = String(formData.get("title") || "").trim();
  if (!slug || !title) redirect("/admin/pages?error=invalid");

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("site_pages").upsert({
    slug,
    eyebrow: String(formData.get("eyebrow") || "").trim() || null,
    title,
    intro: String(formData.get("intro") || "").trim() || null,
    sections: parseSections(String(formData.get("sectionsText") || "")),
    seo_title: String(formData.get("seoTitle") || "").trim() || null,
    seo_description: String(formData.get("seoDescription") || "").trim() || null,
    active: formData.get("active") === "on",
    updated_at: new Date().toISOString(),
  }, { onConflict: "slug" });

  if (error) redirect(`/admin/pages?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/", "layout");
  revalidatePath(`/${slug}`);
  revalidatePath(`/p/${slug}`);
  redirect("/admin/pages?success=1");
}

export async function deletePage(formData: FormData) {
  if (!(await hasAdminSession())) redirect("/admin");
  if (!commerceBackendConfigured()) redirect("/admin/pages?error=backend");
  const slug = String(formData.get("slug") || "");
  const supabase = getSupabaseAdmin();
  await supabase.from("site_pages").delete().eq("slug", slug);
  revalidatePath("/", "layout");
  revalidatePath(`/${slug}`);
  revalidatePath(`/p/${slug}`);
  redirect("/admin/pages?success=deleted");
}
