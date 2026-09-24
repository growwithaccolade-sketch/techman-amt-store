"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { Check, CreditCard, LockKeyhole, MapPin, MessageCircle, TicketPercent } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { money } from "@/lib/products";
import { makeWhatsappUrl } from "@/lib/site";

const nigeriaStates = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"];

type DeliveryQuote = { configured: boolean; matched: boolean; fee: number; message: string };

export default function CheckoutClient() {
  const { catalog, settings, lines } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; message: string } | null>(null);
  const [couponState, setCouponState] = useState<"idle" | "checking" | "error">("idle");
  const [couponMessage, setCouponMessage] = useState("");
  const [deliveryState, setDeliveryState] = useState("");
  const [deliveryQuote, setDeliveryQuote] = useState<DeliveryQuote | null>(null);
  const [deliveryLoading, setDeliveryLoading] = useState(false);

  const items = useMemo(() => lines.map((line) => ({ line, product: catalog.find((p) => p.id === line.id) })).filter((x) => x.product), [catalog, lines]);
  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.line.qty, 0);
  const merchandiseTotal = Math.max(0, subtotal - (appliedCoupon?.discount || 0));
  const total = merchandiseTotal + (deliveryQuote?.matched ? deliveryQuote.fee : 0);

  async function quoteDelivery(state = deliveryState, coupon = appliedCoupon?.code || "") {
    if (!state) return;
    setDeliveryLoading(true);
    setDeliveryQuote(null);
    try {
      const response = await fetch("/api/delivery/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state, couponCode: coupon, items: lines }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setDeliveryQuote({ configured: false, matched: false, fee: 0, message: payload.error || "Delivery quote unavailable." });
      } else {
        setDeliveryQuote({
          configured: Boolean(payload.configured),
          matched: Boolean(payload.matched),
          fee: Number(payload.fee || 0),
          message: String(payload.message || ""),
        });
      }
    } catch {
      setDeliveryQuote({ configured: false, matched: false, fee: 0, message: "Delivery pricing is temporarily unavailable." });
    } finally {
      setDeliveryLoading(false);
    }
  }

  async function applyCoupon() {
    setCouponState("checking");
    setCouponMessage("");
    setAppliedCoupon(null);
    setDeliveryQuote(null);
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, items: lines }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setCouponState("error");
        setCouponMessage(payload.error || "Coupon could not be applied.");
        return;
      }
      setCouponState("idle");
      const nextCoupon = { code: payload.code, discount: Number(payload.discount), message: payload.message };
      setAppliedCoupon(nextCoupon);
      setCouponCode(payload.code);
      if (deliveryState) await quoteDelivery(deliveryState, payload.code);
    } catch {
      setCouponState("error");
      setCouponMessage("Coupon validation is temporarily unavailable.");
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const data = new FormData(e.currentTarget);
    const submitEvent = e.nativeEvent as SubmitEvent;
    const intent = (submitEvent.submitter as HTMLButtonElement | null)?.value || "online";
    const itemText = items.map(({ line, product }) => `${product?.name} x${line.qty}`).join(", ");
    const deliveryText = deliveryQuote?.matched ? ` Delivery: ${money(deliveryQuote.fee)}.` : "";
    const wa = makeWhatsappUrl(settings.whatsappNumber, `Hello TechMan AMT, I want to place an order. Name: ${data.get("name")}. Phone: ${data.get("phone")}. Delivery: ${data.get("address")}, ${data.get("city")}, ${data.get("state")}. Items: ${itemText}. Subtotal: ${money(subtotal)}.${appliedCoupon ? ` Coupon ${appliedCoupon.code}: -${money(appliedCoupon.discount)}.` : ""}${deliveryText} Estimated total: ${money(total)}.`);

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
          couponCode: appliedCoupon?.code || "",
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
    return <section className="emptyCart shell"><h1>Nothing to check out yet.</h1><p>Add products to your cart first.</p><Link className="primaryBtn" href="/shop">Browse products</Link></section>;
  }

  return (
    <section className="checkoutPage shell">
      <div className="pageIntro"><span className="kicker">CHECKOUT</span><h1>Checkout.</h1><p>Enter delivery details, confirm the delivery fee and choose your payment method.</p></div>
      <form className="checkoutLayout" onSubmit={submit}>
        <div className="checkoutForm">
          <div className="formSection"><h2>Contact</h2><label>Full name<input name="name" required autoComplete="name"/></label><div className="fieldGrid"><label>Phone number<input name="phone" required inputMode="tel"/></label><label>Email<input name="email" type="email" required autoComplete="email"/></label></div></div>

          <div className="formSection"><h2>Delivery address</h2><label>Street address<input name="address" required autoComplete="street-address"/></label><div className="fieldGrid"><label>City<input name="city" required/></label><label>State<select name="state" required value={deliveryState} onChange={(e)=>{setDeliveryState(e.target.value);setDeliveryQuote(null);}}><option value="">Choose state</option>{nigeriaStates.map((state)=><option key={state} value={state}>{state}</option>)}</select></label></div><label>Landmark or delivery note<textarea name="note" rows={4}/></label>
            <button className="deliveryQuoteButton" type="button" onClick={()=>quoteDelivery()} disabled={!deliveryState || deliveryLoading}><MapPin size={17}/>{deliveryLoading ? "Checking delivery..." : "Calculate delivery"}</button>
            {deliveryQuote && <div className={`deliveryQuoteResult ${deliveryQuote.matched ? "ok" : deliveryQuote.configured ? "warn" : ""}`}><span>{deliveryQuote.message}</span>{deliveryQuote.matched && <b>{deliveryQuote.fee ? money(deliveryQuote.fee) : "Free delivery"}</b>}</div>}
          </div>

          <div className="couponBox">
            <div className="couponTitle"><TicketPercent size={18}/><span><b>Coupon</b><small>Enter a valid promotion code.</small></span></div>
            <div className="couponApply"><input value={couponCode} onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setAppliedCoupon(null); setDeliveryQuote(null); }} placeholder="Enter code"/><button type="button" onClick={applyCoupon} disabled={!couponCode.trim() || couponState === "checking"}>{couponState === "checking" ? "Checking..." : "Apply"}</button></div>
            {appliedCoupon && <div className="couponSuccess"><Check size={15}/>{appliedCoupon.message}</div>}
            {couponState === "error" && <div className="couponError">{couponMessage}</div>}
          </div>

          <div className="secureNote"><LockKeyhole size={18}/><span><b>Secure payment</b><small>Online card and bank payments are completed on Paystack.</small></span></div>
          {error && <div className="checkoutError">{error}</div>}
        </div>

        <aside className="orderSummary">
          <span className="kicker">YOUR ORDER</span>
          {items.map(({ line, product }) => product && <div className="checkoutItem" key={product.id}><span>{product.name} × {line.qty}</span><strong>{money(product.price * line.qty)}</strong></div>)}
          <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
          {appliedCoupon && <div className="discountLine"><span>Coupon {appliedCoupon.code}</span><strong>-{money(appliedCoupon.discount)}</strong></div>}
          <div><span>Delivery</span><strong>{deliveryQuote?.matched ? (deliveryQuote.fee ? money(deliveryQuote.fee) : "Free") : "Calculate above"}</strong></div>
          <div className="summaryTotal"><span>Estimated total</span><strong>{money(total)}</strong></div>
          <button className="primaryAction" name="intent" value="online" type="submit" disabled={loading}><CreditCard size={18}/>{loading ? "Starting secure payment..." : "Pay securely online"}</button>
          <button className="whatsappCheckout" name="intent" value="whatsapp" type="submit"><MessageCircle size={18}/> Order on WhatsApp</button>
          <small>Product price, discount, stock and delivery are confirmed before payment starts.</small>
        </aside>
      </form>
    </section>
  );
}
