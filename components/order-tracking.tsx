"use client";

import { FormEvent, useState } from "react";
import { Check, PackageSearch } from "lucide-react";
import { money } from "@/lib/products";

type TrackedOrder = {
  reference: string;
  status: string;
  payment_status: string;
  total_ngn: number;
  city: string;
  state: string;
  created_at: string;
  order_items?: Array<{ product_name: string; quantity: number }>;
};

const stages = ["pending", "paid", "processing", "shipped", "delivered"];

export default function OrderTracking({ initialReference = "" }: { initialReference?: string }) {
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const params = new URLSearchParams({
      reference: String(data.get("reference") || ""),
      email: String(data.get("email") || ""),
    });

    try {
      const response = await fetch(`/api/orders/track?${params.toString()}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) {
        setError(payload.error || "We could not find that order.");
      } else {
        setOrder(payload.order);
      }
    } catch {
      setError("Order tracking is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  const activeIndex = order ? Math.max(0, stages.indexOf(order.status)) : 0;

  return (
    <section className="trackingPage shell">
      <div className="pageIntro"><span className="kicker">ORDER TRACKING</span><h1>Know where your order stands.</h1><p>Use the same email address you entered at checkout together with your order reference.</p></div>
      <div className="trackingLayout">
        <form className="trackingForm" onSubmit={submit}>
          <label>Order reference<input name="reference" defaultValue={initialReference} placeholder="TAMT-..." required/></label>
          <label>Email address<input name="email" type="email" required placeholder="you@example.com"/></label>
          <button className="primaryAction" disabled={loading}><PackageSearch size={18}/>{loading ? "Checking..." : "Track order"}</button>
          {error && <div className="checkoutError">{error}</div>}
        </form>
        <div className="trackingResult">
          {!order ? <div className="trackingEmpty"><PackageSearch size={38}/><h2>Your order status will appear here.</h2><p>Tracking details are private and require both the reference and checkout email.</p></div> : <>
            <div className="trackingTop"><div><span className="kicker">REFERENCE</span><h2>{order.reference}</h2></div><strong>{money(Number(order.total_ngn))}</strong></div>
            <div className="statusPills"><span>Order: <b>{order.status}</b></span><span>Payment: <b>{order.payment_status}</b></span></div>
            <div className="timeline">{stages.map((stage, index) => <div className={index <= activeIndex ? "done" : ""} key={stage}><span>{index <= activeIndex && <Check size={13}/>}</span><b>{stage}</b></div>)}</div>
            <div className="trackedItems">{order.order_items?.map((item) => <div key={item.product_name}><span>{item.product_name}</span><b>× {item.quantity}</b></div>)}</div>
            <small>Delivery destination: {order.city}, {order.state}</small>
          </>}
        </div>
      </div>
    </section>
  );
}
