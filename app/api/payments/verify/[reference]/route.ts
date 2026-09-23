import { NextResponse } from "next/server";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { verifyPaystackTransaction } from "@/lib/paystack";

export async function GET(_: Request, { params }: { params: Promise<{ reference: string }> }) {
  if (!commerceBackendConfigured() || !process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json({ error: "Payment verification is not configured." }, { status: 503 });
  }

  const { reference } = await params;
  const supabase = getSupabaseAdmin();
  const { data: order } = await supabase.from("orders").select("id,total_ngn,payment_status").eq("reference", reference).maybeSingle();

  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  try {
    const transaction = await verifyPaystackTransaction(reference);
    const amountMatches = transaction.amount === Number(order.total_ngn) * 100;
    const paid = transaction.status === "success" && transaction.currency === "NGN" && amountMatches;

    if (paid) {
      await supabase.from("orders").update({
        payment_status: "paid",
        status: "paid",
        paystack_transaction_id: transaction.id,
        paid_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).eq("id", order.id);
    }

    return NextResponse.json({ paid, reference, status: transaction.status, amountMatches });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to verify payment." }, { status: 502 });
  }
}
