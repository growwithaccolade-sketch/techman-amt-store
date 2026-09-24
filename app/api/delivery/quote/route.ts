import { NextResponse } from "next/server";
import { getStoreProductsByIds } from "@/lib/catalog";
import { commerceBackendConfigured } from "@/lib/supabase/admin";
import { validateCoupon } from "@/lib/coupons";
import { calculateDelivery } from "@/lib/delivery";

export async function POST(request: Request) {
  if (!commerceBackendConfigured()) {
    return NextResponse.json({ configured: false, matched: false, fee: 0, message: "Delivery pricing will be confirmed by the store." });
  }

  const body = await request.json() as { state?: string; couponCode?: string; items?: Array<{ id: number; qty: number }> };
  if (!body.state || !Array.isArray(body.items) || !body.items.length) {
    return NextResponse.json({ error: "State and cart items are required." }, { status: 400 });
  }

  const ids = body.items.map((line) => Number(line.id));
  const products = await getStoreProductsByIds(ids);
  const subtotal = body.items.reduce((sum, line) => {
    const product = products.find((item) => item.id === Number(line.id));
    const qty = Number(line.qty);
    return sum + (product && Number.isInteger(qty) && qty > 0 ? product.price * qty : 0);
  }, 0);

  let merchandiseTotal = subtotal;
  if (body.couponCode?.trim()) {
    const coupon = await validateCoupon(body.couponCode, subtotal);
    if (coupon.valid) merchandiseTotal = Math.max(0, subtotal - coupon.discount);
  }

  const quote = await calculateDelivery(body.state, merchandiseTotal);
  return NextResponse.json(quote);
}
