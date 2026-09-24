import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { validPaystackWebhook } from "@/lib/paystack";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!validPaystackWebhook(rawBody, signature)) {
    return new NextResponse("Invalid signature", { status: 401 });
  }

  const event = JSON.parse(rawBody) as {
    event?: string;
    data?: {
      id?: number;
      status?: string;
      reference?: string;
      amount?: number;
      currency?: string;
    };
  };

  if (event.event === "charge.success" && event.data?.reference) {
    const supabase = getSupabaseAdmin();
    const { data: order } = await supabase.from("orders").select("id,total_ngn").eq("reference", event.data.reference).maybeSingle();

    if (
      order &&
      event.data.status === "success" &&
      event.data.currency === "NGN" &&
      event.data.amount === Number(order.total_ngn) * 100
    ) {
      await supabase.rpc("mark_order_paid", {
        p_reference: event.data.reference,
        p_transaction_id: event.data.id ?? null,
      });
    }
  }

  return NextResponse.json({ received: true });
}
