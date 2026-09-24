"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { CreditCard, LockKeyhole, MessageCircle } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { money } from "@/lib/products";
import { whatsappUrl } from "@/lib/site";

export default function CheckoutClient() {
  const { catalog, lines } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const items = useMemo(() => lines.map((line) => ({ line, product: catalog.find((p) => p.id === line.id) })).filter((x) => x.product), [catalog, lines]);
  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.line.qty, 0);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const data = new FormData(e.currentTarget);
    const submitEvent = e.nativeEvent as SubmitEvent;
    const intent = (submitEvent.submitter as HTMLButtonElement | null)?.value || "online";
    const itemText = items.map(({ line, product }) => `${product?.name} x${line.qty}`).join(", ");
    const wa = whatsappUrl(`Hello TechMan AMT, I want to place an order. Name: ${data.get("name")}. Phone: ${data.get("phone")}. Delivery: ${data.get("address")}, ${data.get("city")}, ${data.get("state")}. Items: ${itemText}. Subtotal: ${money(subtotal)}.`);

    if (intent === "whatsapp") {
      if (!wa) {
        setError("WhatsApp ordering is not configured yet.");
        return;
      }
      window.location.assign(wa);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: String(data.get("email") || ""),
          name: String(data.get("name") || ""),
          phone: String(data.get("phone") || ""),
          address: String(data.get("address") || ""),
          city: String(data.get("city") || ""),
          state: String(data.get("state") || ""),
          items: lines,
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.authorizationUrl) {
        setError(payload.error || "Online payment could not be started. You can still order through WhatsApp.");
        return;
      }

      window.location.assign(payload.authorizationUrl);
    } catch {
      setError("We could not reach the payment service. Try again or use WhatsApp ordering.");
    } finally {
      setLoading(false);
    }
  }

  if (!items.length) {
    return <section className="emptyCart shell"><h1>Nothing to check out yet.</h1><p>Add products to your cart first.</p><Link className="primaryBtn" href="/#shop">Browse products</Link></section>;
  }

  return (
    <section className="checkoutPage shell">
      <div className="pageIntro"><span className="kicker">CHECKOUT</span><h1>Simple, clear, secure.</h1><p>Enter your details, choose secure online payment or continue with assisted WhatsApp ordering.</p></div>
      <form className="checkoutLayout" onSubmit={submit}>
        <div className="checkoutForm">
          <div className="formSection"><h2>Contact</h2><label>Full name<input name="name" required autoComplete="name"/></label><div className="fieldGrid"><label>Phone number<input name="phone" required inputMode="tel"/></label><label>Email<input name="email" type="email" required autoComplete="email"/></label></div></div>
          <div className="formSection"><h2>Delivery address</h2><label>Street address<input name="address" required autoComplete="street-address"/></label><div className="fieldGrid"><label>City<input name="city" required/></label><label>State<input name="state" required/></label></div><label>Landmark or delivery note<textarea name="note" rows={4}/></label></div>
          <div className="secureNote"><LockKeyhole size={18}/><span><b>Your payment key never enters the browser.</b><small>Online transactions are initialized on the server and completed on Paystack&apos;s secure checkout.</small></span></div>
          {error && <div className="checkoutError">{error}</div>}
        </div>
        <aside className="orderSummary">
          <span className="kicker">YOUR ORDER</span>
          {items.map(({ line, product }) => product && <div className="checkoutItem" key={product.id}><span>{product.name} × {line.qty}</span><strong>{money(product.price * line.qty)}</strong></div>)}
          <div className="summaryTotal"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
          <button className="primaryAction" name="intent" value="online" type="submit" disabled={loading}><CreditCard size={18}/>{loading ? "Starting secure payment..." : "Pay securely online"}</button>
          <button className="whatsappCheckout" name="intent" value="whatsapp" type="submit"><MessageCircle size={18}/> Order on WhatsApp</button>
          <small>Delivery fees can be added after your delivery location is confirmed.</small>
        </aside>
      </form>
    </section>
  );
}
