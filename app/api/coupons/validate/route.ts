import { NextResponse } from "next/server";
import { getStoreProductsByIds } from "@/lib/catalog";
import { commerceBackendConfigured } from "@/lib/supabase/admin";
import { validateCoupon } from "@/lib/coupons";

export async function POST(request: Request) {
  if (!commerceBackendConfigured()) {
    return NextResponse.json({ error: "Coupons are not configured yet." }, { status: 503 });
  }

  const body = await request.json() as { code?: string; items?: Array<{ id: number; qty: number }> };
  if (!body.code || !Array.isArray(body.items) || !body.items.length) {
    return NextResponse.json({ error: "Coupon code and cart items are required." }, { status: 400 });
  }

  const ids = body.items.map((line) => Number(line.id));
  const products = await getStoreProductsByIds(ids);
  const subtotal = body.items.reduce((sum, line) => {
    const product = products.find((item) => item.id === Number(line.id));
    const qty = Number(line.qty);
    return sum + (product && Number.isInteger(qty) && qty > 0 ? product.price * qty : 0);
  }, 0);

  const result = await validateCoupon(body.code, subtotal);
  if (!result.valid) return NextResponse.json({ error: result.message }, { status: 400 });
  return NextResponse.json(result);
}
