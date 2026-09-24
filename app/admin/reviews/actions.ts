"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/app/admin/actions";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

async function requireAdmin() {
  if (!(await hasAdminSession())) redirect("/admin");
  if (!commerceBackendConfigured()) redirect("/admin/reviews?error=backend");
}

export async function setReviewApproval(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const approved = String(formData.get("approved") || "") === "true";
  const productId = Number(formData.get("productId") || 0);
  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("product_reviews").update({
    approved,
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) redirect(`/admin/reviews?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/reviews");
  revalidatePath("/product", "layout");
  if (productId) revalidatePath(`/product/${productId}`);
  redirect("/admin/reviews?success=1");
}

export async function deleteReview(formData: FormData) {
  await requireAdmin();
  const supabase = getSupabaseAdmin();
  await supabase.from("product_reviews").delete().eq("id", String(formData.get("id") || ""));
  revalidatePath("/admin/reviews");
  revalidatePath("/product", "layout");
  redirect("/admin/reviews?success=1");
}
