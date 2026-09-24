import { NextResponse } from "next/server";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  if (!commerceBackendConfigured()) {
    return NextResponse.json({ error: "Reviews are not connected yet." }, { status: 503 });
  }

  const body = await request.json() as {
    productId?: number;
    orderReference?: string;
    email?: string;
    displayName?: string;
    rating?: number;
    title?: string;
    review?: string;
  };

  const productId = Number(body.productId);
  const reference = String(body.orderReference || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const displayName = String(body.displayName || "").trim();
  const rating = Number(body.rating);
  const title = String(body.title || "").trim();
  const review = String(body.review || "").trim();

  if (!Number.isInteger(productId) || !reference || !email || !displayName || !Number.isInteger(rating) || rating < 1 || rating > 5 || review.length < 20) {
    return NextResponse.json({ error: "Complete the order, rating and review details. Review text must be at least 20 characters." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: order, error: orderError } = await supabase.from("orders")
    .select("id,payment_status,order_items(external_product_id)")
    .eq("reference", reference)
    .eq("email", email)
    .maybeSingle();

  if (orderError || !order) {
    return NextResponse.json({ error: "We could not match that order reference and email." }, { status: 404 });
  }

  if (order.payment_status !== "paid") {
    return NextResponse.json({ error: "Only paid orders can submit verified purchase reviews." }, { status: 400 });
  }

  const purchased = (order.order_items ?? []).some((item: { external_product_id: number }) => Number(item.external_product_id) === productId);
  if (!purchased) {
    return NextResponse.json({ error: "That product was not found in the matched order." }, { status: 400 });
  }

  const { error } = await supabase.from("product_reviews").insert({
    product_external_id: productId,
    order_id: order.id,
    email,
    display_name: displayName.slice(0, 80),
    rating,
    title: title ? title.slice(0, 120) : null,
    body: review.slice(0, 2000),
    verified_purchase: true,
    approved: false,
  });

  if (error?.code === "23505") {
    return NextResponse.json({ error: "A review for this product has already been submitted from that order." }, { status: 409 });
  }
  if (error) return NextResponse.json({ error: "We could not save your review." }, { status: 500 });

  return NextResponse.json({ ok: true, message: "Review received and awaiting moderation." });
}
