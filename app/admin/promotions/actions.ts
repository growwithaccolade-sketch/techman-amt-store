"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/app/admin/actions";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function nullableNumber(formData: FormData, key: string) {
  const value = text(formData, key);
  return value ? Number(value) : null;
}

function nullableDate(formData: FormData, key: string) {
  const value = text(formData, key);
  return value ? new Date(value).toISOString() : null;
}

async function requireAdmin() {
  if (!(await hasAdminSession())) redirect("/admin");
  if (!commerceBackendConfigured()) redirect("/admin/promotions?error=backend");
}

export async function createCoupon(formData: FormData) {
  await requireAdmin();
  const supabase = getSupabaseAdmin();
  const code = text(formData, "code").toUpperCase().replace(/\s+/g, "");
  const kind = text(formData, "kind");
  const value = Number(text(formData, "value"));
  const minOrder = Number(text(formData, "minOrder") || "0");
  const maxDiscount = nullableNumber(formData, "maxDiscount");
  const usageLimit = nullableNumber(formData, "usageLimit");

  if (!code || !["percent","fixed"].includes(kind) || !Number.isFinite(value) || value <= 0 || (kind === "percent" && value > 100)) {
    redirect("/admin/promotions?error=invalid");
  }

  const { error } = await supabase.from("coupons").insert({
    code,
    kind,
    value: Math.round(value),
    min_order_ngn: Math.max(0, Math.round(minOrder)),
    max_discount_ngn: maxDiscount == null ? null : Math.max(1, Math.round(maxDiscount)),
    usage_limit: usageLimit == null ? null : Math.max(1, Math.round(usageLimit)),
    starts_at: nullableDate(formData, "startsAt"),
    ends_at: nullableDate(formData, "endsAt"),
    active: true,
    updated_at: new Date().toISOString(),
  });

  if (error) redirect(`/admin/promotions?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/promotions");
  redirect("/admin/promotions?success=created");
}

export async function updateCoupon(formData: FormData) {
  await requireAdmin();
  const supabase = getSupabaseAdmin();
  const id = text(formData, "id");
  const kind = text(formData, "kind");
  const value = Number(text(formData, "value"));
  const minOrder = Number(text(formData, "minOrder") || "0");
  const maxDiscount = nullableNumber(formData, "maxDiscount");
  const usageLimit = nullableNumber(formData, "usageLimit");

  const { error } = await supabase.from("coupons").update({
    kind,
    value: Math.round(value),
    min_order_ngn: Math.max(0, Math.round(minOrder)),
    max_discount_ngn: maxDiscount == null ? null : Math.max(1, Math.round(maxDiscount)),
    usage_limit: usageLimit == null ? null : Math.max(1, Math.round(usageLimit)),
    starts_at: nullableDate(formData, "startsAt"),
    ends_at: nullableDate(formData, "endsAt"),
    active: formData.get("active") === "on",
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) redirect(`/admin/promotions?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin/promotions");
  redirect("/admin/promotions?success=updated");
}

export async function deleteCoupon(formData: FormData) {
  await requireAdmin();
  const supabase = getSupabaseAdmin();
  await supabase.from("coupons").delete().eq("id", text(formData, "id"));
  revalidatePath("/admin/promotions");
  redirect("/admin/promotions?success=deleted");
}
