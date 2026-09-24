"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/app/admin/actions";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

export async function updateOrder(formData: FormData) {
  if (!(await hasAdminSession())) redirect("/admin");
  if (!commerceBackendConfigured()) redirect("/admin/orders?error=backend");

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "pending");
  const adminNote = String(formData.get("adminNote") || "").trim();
  const allowed = ["pending", "paid", "processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"];
  if (!allowed.includes(status)) redirect("/admin/orders?error=invalid");

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("orders").update({
    status,
    admin_note: adminNote || null,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) redirect(`/admin/orders?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  redirect("/admin/orders?success=updated");
}
