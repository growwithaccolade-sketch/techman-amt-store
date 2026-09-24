"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/app/admin/actions";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

async function requireAdmin() {
  if (!(await hasAdminSession())) redirect("/admin");
  if (!commerceBackendConfigured()) redirect("/admin/marketing?error=backend");
}

export async function setSubscriberActive(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const active = String(formData.get("active") || "") === "true";
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("newsletter_subscribers").update({
    active,
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) redirect(`/admin/marketing?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/marketing");
  redirect("/admin/marketing?success=1");
}

export async function deleteSubscriber(formData: FormData) {
  await requireAdmin();
  const supabase = getSupabaseAdmin();
  await supabase.from("newsletter_subscribers").delete().eq("id", String(formData.get("id") || ""));
  revalidatePath("/admin/marketing");
  redirect("/admin/marketing?success=1");
}
