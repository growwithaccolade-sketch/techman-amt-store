"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/app/admin/actions";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendOrderStatusEmail } from "@/lib/order-status-email";

export async function updateOrder(formData: FormData) {
  if (!(await hasAdminSession())) redirect("/admin");
  if (!commerceBackendConfigured()) redirect("/admin/orders?error=backend");

  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "pending");
  const adminNote = String(formData.get("adminNote") || "").trim();
  const allowed = ["pending", "paid", "processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"];
  if (!allowed.includes(status)) redirect("/admin/orders?error=invalid");

  const supabase = getSupabaseAdmin();
  const { data: existing } = await supabase.from("orders").select("reference,email,customer_name,status").eq("id", id).maybeSingle();

  const { error } = await supabase.from("orders").update({
    status,
    admin_note: adminNote || null,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) redirect(`/admin/orders?error=${encodeURIComponent(error.message)}`);

  if (existing && existing.status !== status) {
    await sendOrderStatusEmail({
      reference: existing.reference,
      email: existing.email,
      customerName: existing.customer_name,
      status,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  redirect("/admin/orders?success=updated");
}
