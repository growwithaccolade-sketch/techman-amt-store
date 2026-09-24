"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/app/admin/actions";
import { hashAdminPassword } from "@/lib/admin-auth";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

async function backend() {
  await requireOwner();
  if (!commerceBackendConfigured()) redirect("/admin/staff?error=backend");
  return getSupabaseAdmin();
}

export async function createStaff(formData: FormData) {
  const supabase = await backend();
  const username = String(formData.get("username") || "").trim().toLowerCase();
  const displayName = String(formData.get("displayName") || "").trim();
  const role = String(formData.get("role") || "support");
  const password = String(formData.get("password") || "");

  if (!/^[a-z0-9._-]{3,40}$/.test(username) || !displayName || password.length < 8 || !["manager","editor","support"].includes(role)) {
    redirect("/admin/staff?error=invalid");
  }

  const { error } = await supabase.from("admin_staff").insert({
    username,
    display_name: displayName,
    role,
    password_hash: hashAdminPassword(password),
    active: true,
  });

  if (error) redirect(`/admin/staff?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/staff");
  redirect("/admin/staff?success=created");
}

export async function updateStaff(formData: FormData) {
  const supabase = await backend();
  const id = String(formData.get("id") || "");
  const displayName = String(formData.get("displayName") || "").trim();
  const role = String(formData.get("role") || "support");
  const password = String(formData.get("password") || "");

  if (!id || !displayName || !["manager","editor","support"].includes(role)) redirect("/admin/staff?error=invalid");

  const patch: Record<string, unknown> = {
    display_name: displayName,
    role,
    active: formData.get("active") === "on",
    updated_at: new Date().toISOString(),
  };
  if (password) {
    if (password.length < 8) redirect("/admin/staff?error=password");
    patch.password_hash = hashAdminPassword(password);
  }

  const { error } = await supabase.from("admin_staff").update(patch).eq("id", id);
  if (error) redirect(`/admin/staff?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/staff");
  redirect("/admin/staff?success=updated");
}

export async function deleteStaff(formData: FormData) {
  const supabase = await backend();
  await supabase.from("admin_staff").delete().eq("id", String(formData.get("id") || ""));
  revalidatePath("/admin/staff");
  redirect("/admin/staff?success=deleted");
}
