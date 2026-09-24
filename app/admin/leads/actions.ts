"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/app/admin/actions";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

export async function updateLead(formData: FormData) {
  if (!(await hasAdminSession())) redirect("/admin");
  if (!commerceBackendConfigured()) redirect("/admin/leads?error=backend");

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "new");
  const adminNote = String(formData.get("adminNote") || "").trim();
  const allowed = ["new", "contacted", "reviewing", "quoted", "won", "lost", "closed"];
  if (!allowed.includes(status)) redirect("/admin/leads?error=invalid");

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("lead_requests").update({
    status,
    admin_note: adminNote || null,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) redirect(`/admin/leads?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/leads");
  redirect("/admin/leads?success=1");
}
