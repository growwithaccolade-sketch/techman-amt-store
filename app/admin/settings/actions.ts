"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/app/admin/actions";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

export async function updateStoreSettings(formData: FormData) {
  if (!(await hasAdminSession())) redirect("/admin");
  if (!commerceBackendConfigured()) redirect("/admin/settings?error=backend");

  const supportEmail = String(formData.get("supportEmail") || "").trim();
  const whatsappNumber = String(formData.get("whatsappNumber") || "").replace(/[^0-9+]/g, "").trim();
  const announcementText = String(formData.get("announcementText") || "").trim() || "Better tech, smarter upgrades.";
  const locationLabel = String(formData.get("locationLabel") || "").trim();
  const footerCreditLabel = String(formData.get("footerCreditLabel") || "").trim();
  const footerCreditUrl = String(formData.get("footerCreditUrl") || "").trim();
  const thresholdRaw = String(formData.get("freeDeliveryThreshold") || "").trim();
  const threshold = thresholdRaw ? Number(thresholdRaw) : null;

  if (threshold !== null && (!Number.isFinite(threshold) || threshold < 0)) {
    redirect("/admin/settings?error=invalid");
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    store_name: "TechMan AMT",
    support_email: supportEmail || null,
    whatsapp_number: whatsappNumber || null,
    announcement_text: announcementText,
    free_delivery_threshold_ngn: threshold === null ? null : Math.round(threshold),
    location_label: locationLabel || null,
    footer_credit_label: footerCreditLabel || "Built by Mike Accolade",
    footer_credit_url: footerCreditUrl || "https://mikeaccolade.xyz",
    updated_at: new Date().toISOString(),
  }, { onConflict: "id" });

  if (error) redirect(`/admin/settings?error=${encodeURIComponent(error.message)}`);

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?success=1");
}
