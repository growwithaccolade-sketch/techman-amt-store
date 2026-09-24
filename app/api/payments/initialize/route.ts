import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getStoreProductsByIds } from "@/lib/catalog";
import type { Product } from "@/lib/products";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { initializePaystackTransaction } from "@/lib/paystack";
import { validateCoupon } from "@/lib/coupons";

type CheckoutPayload = {
  email?: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  items?: Array<{ id: number; qty: number }>;
  couponCode?: string;
};

export async function POST(request: Request) {
  if (!commerceBackendConfigured() || !process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "Online payment is not configured yet." }, { status: 503 });
  }

  const body = await request.json() as CheckoutPayload;
  const required = [body.email, body.name, body.phone, body.address, body.city, body.state];
  if (required.some((value) => !value || !String(value).trim()) || !Array.isArray(body.items) || !body.items.length) {
    return NextResponse.json({ error: "Complete your contact, delivery and cart details." }, { status: 400 });
  }

  const requestedIds = body.items.map((line) => Number(line.id));
  const catalogProducts = await getStoreProductsByIds(requestedIds);
  const resolved = body.items.map((line) => {
    const product = catalogProducts.find((item) => item.id === Number(line.id));
    const qty = Number(line.qty);
    if (!product || !Number.isInteger(qty) || qty < 1 || qty > 10 || qty > product.stock) return null;
    return { product, qty };
  });

  if (resolved.some((item) => !item)) {
    return NextResponse.json({ error: "Your cart contains an unavailable item, invalid quantity, or insufficient stock." }, { status: 400 });
  }

  const lines = resolved.filter(Boolean) as Array<{ product: Product; qty: number }>;
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  let discount = 0;
  let couponCode: string | null = null;

  if (body.couponCode?.trim()) {
    const coupon = await validateCoupon(body.couponCode, subtotal);
    if (!coupon.valid) {
      return NextResponse.json({ error: coupon.message }, { status: 400 });
    }
    discount = coupon.discount;
    couponCode = coupon.code;
  }

  const total = Math.max(0, subtotal - discount);
  if (total <= 0) {
    return NextResponse.json({ error: "This order total must be greater than zero to use online payment." }, { status: 400 });
  }

  const reference = `TAMT-${Date.now()}-${randomUUID().slice(0, 8)}`;
  const supabase = getSupabaseAdmin();

  const { data: order, error: orderError } = await supabase.from("orders").insert({
    reference,
    email: body.email!.trim().toLowerCase(),
    customer_name: body.name!.trim(),
    phone: body.phone!.trim(),
    delivery_address: body.address!.trim(),
    city: body.city!.trim(),
    state: body.state!.trim(),
    subtotal_ngn: subtotal,
    discount_ngn: discount,
    coupon_code: couponCode,
    delivery_fee_ngn: 0,
    total_ngn: total,
    status: "pending",
    payment_status: "pending",
  }).select("id").single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Could not create your order." }, { status: 500 });
  }

  const { error: itemsError } = await supabase.from("order_items").insert(lines.map(({ product, qty }) => ({
    order_id: order.id,
    external_product_id: product.id,
    product_name: product.name,
    unit_price_ngn: product.price,
    quantity: qty,
    line_total_ngn: product.price * qty,
  })));

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: "Could not save your order items." }, { status: 500 });
  }

  try {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const payment = await initializePaystackTransaction({
      email: body.email!,
      amountKobo: total * 100,
      reference,
      callbackUrl: `${origin}/payment/verify?reference=${encodeURIComponent(reference)}`,
      metadata: { orderId: order.id, customerName: body.name, phone: body.phone, couponCode, discount },
    });

    return NextResponse.json({ authorizationUrl: payment.authorization_url, reference });
  } catch (error) {
    await supabase.from("orders").update({ payment_status: "initialization_failed" }).eq("id", order.id);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Payment initialization failed." }, { status: 502 });
  }
}
