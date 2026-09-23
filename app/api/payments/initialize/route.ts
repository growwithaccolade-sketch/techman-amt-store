import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { products } from "@/lib/products";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { initializePaystackTransaction } from "@/lib/paystack";

type CheckoutPayload = {
  email?: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  items?: Array<{ id: number; qty: number }>;
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

  const resolved = body.items.map((line) => {
    const product = products.find((item) => item.id === Number(line.id));
    const qty = Number(line.qty);
    if (!product || !Number.isInteger(qty) || qty < 1 || qty > 10) return null;
    return { product, qty };
  });

  if (resolved.some((item) => !item)) {
    return NextResponse.json({ error: "Your cart contains an invalid item or quantity." }, { status: 400 });
  }

  const lines = resolved.filter(Boolean) as Array<{ product: (typeof products)[number]; qty: number }>;
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
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
    delivery_fee_ngn: 0,
    total_ngn: subtotal,
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
      amountKobo: subtotal * 100,
      reference,
      callbackUrl: `${origin}/payment/verify?reference=${encodeURIComponent(reference)}`,
      metadata: { orderId: order.id, customerName: body.name, phone: body.phone },
    });

    return NextResponse.json({ authorizationUrl: payment.authorization_url, reference });
  } catch (error) {
    await supabase.from("orders").update({ payment_status: "initialization_failed" }).eq("id", order.id);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Payment initialization failed." }, { status: 502 });
  }
}
