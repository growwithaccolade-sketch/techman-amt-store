import { NextResponse } from "next/server";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  if (!commerceBackendConfigured()) {
    return NextResponse.json({ error: "Order tracking is not configured yet." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference")?.trim();
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!reference || !email) {
    return NextResponse.json({ error: "Reference and email are required." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("orders")
    .select("reference,status,payment_status,total_ngn,city,state,created_at,order_items(product_name,quantity)")
    .eq("reference", reference)
    .eq("email", email)
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Unable to check this order." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "No matching order was found." }, { status: 404 });

  return NextResponse.json({ order: data });
}
