import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { getStoreSettings } from "@/lib/store-settings";

export type DeliveryQuote = {
  configured: boolean;
  matched: boolean;
  fee: number;
  state: string;
  message: string;
};

export async function calculateDelivery(stateInput: string, merchandiseTotal: number): Promise<DeliveryQuote> {
  const state = stateInput.trim();
  if (!state) return { configured: false, matched: false, fee: 0, state: "", message: "Enter a delivery state." };
  if (!commerceBackendConfigured()) return { configured: false, matched: false, fee: 0, state, message: "Delivery pricing will be confirmed by the store." };

  const supabase = getSupabaseAdmin();
  const [{ data: zones, error }, settings] = await Promise.all([
    supabase.from("delivery_zones").select("state_name,fee_ngn,note").eq("active", true),
    getStoreSettings(),
  ]);

  if (error || !zones?.length) {
    return { configured: false, matched: false, fee: 0, state, message: "Delivery pricing will be confirmed by the store." };
  }

  const normalized = state.toLowerCase().replace(/s+/g, " ").trim();
  const match = zones.find((zone) => String(zone.state_name).toLowerCase().replace(/s+/g, " ").trim() === normalized)
    || zones.find((zone) => String(zone.state_name).trim() === "*");

  if (!match) {
    return { configured: true, matched: false, fee: 0, state, message: "This delivery location needs a manual quote before online payment." };
  }

  if (settings.freeDeliveryThreshold && merchandiseTotal >= settings.freeDeliveryThreshold) {
    return { configured: true, matched: true, fee: 0, state, message: "Free delivery threshold reached." };
  }

  const fee = Number(match.fee_ngn || 0);
  return { configured: true, matched: true, fee, state, message: match.note || (fee ? "Delivery fee calculated." : "Free delivery for this zone.") };
}
