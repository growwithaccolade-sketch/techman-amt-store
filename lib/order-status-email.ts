import { sendTransactionalEmail, transactionalEmailConfigured } from "@/lib/email";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char] || char));
}

const copy: Record<string, { subject: string; message: string }> = {
  processing: { subject: "Your order is being processed", message: "Your payment has been confirmed and the order is now being prepared." },
  packed: { subject: "Your order is packed", message: "Your order has been packed and is getting ready for dispatch." },
  shipped: { subject: "Your order has shipped", message: "Your order has left fulfilment and is on the way." },
  out_for_delivery: { subject: "Your order is out for delivery", message: "Your order is with the delivery team for final delivery." },
  delivered: { subject: "Your TechMan AMT order was delivered", message: "Your order has been marked delivered. If anything is not right, contact support with your order reference." },
  cancelled: { subject: "Update on your TechMan AMT order", message: "Your order has been marked cancelled. Contact support if you need clarification about payment or fulfilment." },
};

export async function sendOrderStatusEmail(input: {
  reference: string;
  email: string;
  customerName: string;
  status: string;
}) {
  if (!transactionalEmailConfigured()) return;
  const statusCopy = copy[input.status];
  if (!statusCopy) return;

  const humanStatus = input.status.replaceAll("_", " ");
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#111">
      <p style="font-size:12px;letter-spacing:.12em;font-weight:700">TECHMAN AMT</p>
      <h1 style="font-size:30px">${escapeHtml(statusCopy.subject)}.</h1>
      <p>Hi ${escapeHtml(input.customerName)},</p>
      <p>${escapeHtml(statusCopy.message)}</p>
      <div style="margin:24px 0;padding:16px;border:1px solid #eee;border-radius:12px">
        <strong>Order ${escapeHtml(input.reference)}</strong><br/>
        <span style="text-transform:capitalize">Status: ${escapeHtml(humanStatus)}</span>
      </div>
      <p>Keep this reference for order tracking and support.</p>
    </div>`;

  try {
    await sendTransactionalEmail({
      to: input.email,
      subject: `${statusCopy.subject}: ${input.reference}`,
      html,
      idempotencyKey: `order-status/${input.reference}/${input.status}`,
    });
  } catch (error) {
    console.error("Order status email failed", error);
  }
}
