import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { transactionalEmailConfigured, sendTransactionalEmail } from "@/lib/email";
import { money } from "@/lib/products";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char] || char));
}

export async function sendPaidOrderConfirmation(reference: string) {
  if (!transactionalEmailConfigured()) return;

  const supabase = getSupabaseAdmin();
  const claimedAt = new Date().toISOString();
  const { data: order, error: claimError } = await supabase.from("orders")
    .update({ payment_email_sent_at: claimedAt })
    .eq("reference", reference)
    .eq("payment_status", "paid")
    .is("payment_email_sent_at", null)
    .select("id,reference,email,customer_name,subtotal_ngn,discount_ngn,delivery_fee_ngn,total_ngn,city,state")
    .maybeSingle();

  if (claimError || !order) return;

  const { data: items } = await supabase.from("order_items")
    .select("product_name,quantity,line_total_ngn")
    .eq("order_id", order.id);

  const rows = (items ?? []).map((item) => `<tr><td style="padding:10px 0;border-bottom:1px solid #eee">${escapeHtml(item.product_name)} × ${item.quantity}</td><td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right">${money(Number(item.line_total_ngn))}</td></tr>`).join("");

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#111">
      <p style="font-size:12px;letter-spacing:.12em;font-weight:700">TECHMAN AMT</p>
      <h1 style="font-size:30px">Payment confirmed.</h1>
      <p>Hi ${escapeHtml(order.customer_name)}, we have confirmed payment for order <strong>${escapeHtml(order.reference)}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0">${rows}</table>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:6px 0">Subtotal</td><td style="text-align:right">${money(Number(order.subtotal_ngn))}</td></tr>
        <tr><td style="padding:6px 0">Discount</td><td style="text-align:right">-${money(Number(order.discount_ngn || 0))}</td></tr>
        <tr><td style="padding:6px 0">Delivery</td><td style="text-align:right">${money(Number(order.delivery_fee_ngn || 0))}</td></tr>
        <tr><td style="padding:10px 0;font-weight:700">Total paid</td><td style="text-align:right;font-weight:700">${money(Number(order.total_ngn))}</td></tr>
      </table>
      <p style="margin-top:24px">Delivery destination: ${escapeHtml(order.city)}, ${escapeHtml(order.state)}.</p>
      <p>Keep your order reference for tracking and support.</p>
    </div>`;

  try {
    await sendTransactionalEmail({
      to: order.email,
      subject: `Payment confirmed: ${order.reference}`,
      html,
      idempotencyKey: `payment-confirmation/${order.reference}`,
    });
  } catch (error) {
    await supabase.from("orders").update({ payment_email_sent_at: null }).eq("id", order.id);
    console.error("Payment confirmation email failed", error);
  }
}
