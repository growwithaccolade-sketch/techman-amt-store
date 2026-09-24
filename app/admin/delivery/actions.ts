"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/app/admin/actions";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

async function requireAdmin() {
  if (!(await hasAdminSession())) redirect("/admin");
  if (!commerceBackendConfigured()) redirect("/admin/delivery?error=backend");
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export async function createDeliveryZone(formData: FormData) {
  await requireAdmin();
  const stateName = text(formData, "stateName");
  const fee = Number(text(formData, "fee"));
  const note = text(formData, "note");
  if (!stateName || !Number.isFinite(fee) || fee < 0) redirect("/admin/delivery?error=invalid");

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("delivery_zones").insert({
    state_name: stateName,
    fee_ngn: Math.round(fee),
    note: note || null,
    active: true,
    updated_at: new Date().toISOString(),
  });
  if (error) redirect(`/admin/delivery?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/delivery");
  redirect("/admin/delivery?success=created");
}

export async function updateDeliveryZone(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const stateName = text(formData, "stateName");
  const fee = Number(text(formData, "fee"));
  const note = text(formData, "note");
  if (!id || !stateName || !Number.isFinite(fee) || fee < 0) redirect("/admin/delivery?error=invalid");

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("delivery_zones").update({
    state_name: stateName,
    fee_ngn: Math.round(fee),
    note: note || null,
    active: formData.get("active") === "on",
    updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (error) redirect(`/admin/delivery?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/delivery");
  redirect("/admin/delivery?success=updated");
}

export async function deleteDeliveryZone(formData: FormData) {
  await requireAdmin();
  const supabase = getSupabaseAdmin();
  await supabase.from("delivery_zones").delete().eq("id", text(formData, "id"));
  revalidatePath("/admin/delivery");
  redirect("/admin/delivery?success=deleted");
}
