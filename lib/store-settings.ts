import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { fallbackStoreSettings, type StoreSettings } from "@/lib/site";

export async function getStoreSettings(): Promise<StoreSettings> {
  if (!commerceBackendConfigured()) return fallbackStoreSettings;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error || !data) return fallbackStoreSettings;

    return {
      storeName: data.store_name || fallbackStoreSettings.storeName,
      supportEmail: data.support_email || fallbackStoreSettings.supportEmail,
      whatsappNumber: data.whatsapp_number || fallbackStoreSettings.whatsappNumber,
      announcementText: data.announcement_text || fallbackStoreSettings.announcementText,
      freeDeliveryThreshold: data.free_delivery_threshold_ngn == null ? null : Number(data.free_delivery_threshold_ngn),
    };
  } catch {
    return fallbackStoreSettings;
  }
}
