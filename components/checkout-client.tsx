"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, LockKeyhole, MessageCircle } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { money, products } from "@/lib/products";
import { whatsappUrl } from "@/lib/site";

export default function CheckoutClient() {
  const { lines, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [orderLink, setOrderLink] = useState("");
  const items = useMemo(() => lines.map((line) => ({ line, product: products.find((p) => p.id === line.id) })).filter((x) => x.product), [lines]);
  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.line.qty, 0);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const itemText = items.map(({ line, product }) => `${product?.name} x${line.qty}`).join(", ");
    const message = `Hello TechMan AMT, I want to place an order. Name: ${data.get("name")}. Phone: ${data.get("phone")}. Delivery: ${data.get("address")}, ${data.get("city")}, ${data.get("state")}. Items: ${itemText}. Subtotal: ${money(subtotal)}.`;
    setOrderLink(whatsappUrl(message));
    setSubmitted(true);
  }

  if (!items.length && !submitted) {
    return <section className="emptyCart shell"><h1>Nothing to check out yet.</h1><p>Add products to your cart first.</p><Link className="primaryBtn" href="/#shop">Browse products</Link></section>;
  }

  if (submitted) {
    return <section className="checkoutSuccess shell"><CheckCircle2 size={52}/><span className="kicker">ORDER DETAILS READY</span><h1>Finish with a real person.</h1><p>Your order summary is ready. Continue to WhatsApp to confirm stock, delivery cost and payment details before paying.</p>{orderLink ? <a className="primaryBtn" href={orderLink} onClick={clearCart} target="_blank" rel="noreferrer"><MessageCircle size={18}/> Continue on WhatsApp</a> : <p className="setupNotice">Store WhatsApp is not configured yet. Add NEXT_PUBLIC_WHATSAPP_NUMBER to enable assisted checkout.</p>}<Link href="/cart" className="secondaryAction">Back to cart</Link></section>;
  }

  return (
    <section className="checkoutPage shell">
      <div className="pageIntro"><span className="kicker">CHECKOUT</span><h1>Simple, clear, secure.</h1><p>Enter your delivery details. We will confirm availability and delivery before payment.</p></div>
      <form className="checkoutLayout" onSubmit={submit}>
        <div className="checkoutForm">
          <div className="formSection"><h2>Contact</h2><label>Full name<input name="name" required autoComplete="name"/></label><div className="fieldGrid"><label>Phone number<input name="phone" required inputMode="tel"/></label><label>Email<input name="email" type="email" required autoComplete="email"/></label></div></div>
          <div className="formSection"><h2>Delivery address</h2><label>Street address<input name="address" required autoComplete="street-address"/></label><div className="fieldGrid"><label>City<input name="city" required/></label><label>State<input name="state" required/></label></div><label>Landmark or delivery note<textarea name="note" rows={4}/></label></div>
          <div className="secureNote"><LockKeyhole size={18}/><span><b>Payment is confirmed after stock and delivery verification.</b><small>Online Paystack checkout will be connected once live merchant credentials are supplied.</small></span></div>
        </div>
        <aside className="orderSummary">
          <span className="kicker">YOUR ORDER</span>
          {items.map(({ line, product }) => product && <div className="checkoutItem" key={product.id}><span>{product.name} × {line.qty}</span><strong>{money(product.price * line.qty)}</strong></div>)}
          <div className="summaryTotal"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
          <button className="primaryAction" type="submit">Review & continue</button>
          <small>Submitting this form does not charge you.</small>
        </aside>
      </form>
    </section>
  );
}
