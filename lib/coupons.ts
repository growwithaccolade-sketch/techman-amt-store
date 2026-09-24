import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type CouponResult =
  | { valid: true; code: string; discount: number; message: string }
  | { valid: false; discount: 0; message: string };

export async function validateCoupon(rawCode: string, subtotal: number): Promise<CouponResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { valid: false, discount: 0, message: "Enter a coupon code." };

  const supabase = getSupabaseAdmin();
  const { data: coupon, error } = await supabase.from("coupons").select("*").eq("code", code).maybeSingle();

  if (error || !coupon || !coupon.active) return { valid: false, discount: 0, message: "That coupon is not available." };

  const now = Date.now();
  if (coupon.starts_at && new Date(coupon.starts_at).getTime() > now) return { valid: false, discount: 0, message: "That coupon is not active yet." };
  if (coupon.ends_at && new Date(coupon.ends_at).getTime() < now) return { valid: false, discount: 0, message: "That coupon has expired." };
  if (coupon.usage_limit != null && Number(coupon.usage_count) >= Number(coupon.usage_limit)) return { valid: false, discount: 0, message: "That coupon has reached its usage limit." };
  if (subtotal < Number(coupon.min_order_ngn || 0)) return { valid: false, discount: 0, message: `Spend at least ₦${Number(coupon.min_order_ngn).toLocaleString("en-NG")} to use this coupon.` };

  let discount = coupon.kind === "percent"
    ? Math.floor(subtotal * Number(coupon.value) / 100)
    : Number(coupon.value);

  if (coupon.max_discount_ngn != null) discount = Math.min(discount, Number(coupon.max_discount_ngn));
  discount = Math.max(0, Math.min(discount, subtotal));

  if (!discount) return { valid: false, discount: 0, message: "This coupon does not apply to the current order." };
  return { valid: true, code, discount, message: `Coupon applied. You save ₦${discount.toLocaleString("en-NG")}.` };
}
