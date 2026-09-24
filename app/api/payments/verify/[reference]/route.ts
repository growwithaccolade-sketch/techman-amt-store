import { NextResponse } from "next/server";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { sendPaidOrderConfirmation } from "@/lib/order-email";

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
      const { error: paidError } = await supabase.rpc("mark_order_paid", {
        p_reference: reference,
        p_transaction_id: transaction.id,
      });

      if (paidError) {
        return NextResponse.json({ error: "Payment was verified but order finalization needs attention." }, { status: 500 });
      }
      await sendPaidOrderConfirmation(reference);
    }

    return NextResponse.json({ paid, reference, status: transaction.status, amountMatches });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to verify payment." }, { status: 502 });
  }
}
