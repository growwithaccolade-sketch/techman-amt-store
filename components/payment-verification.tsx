"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react";
import { useCart } from "@/components/cart-provider";

export default function PaymentVerification({ reference }: { reference: string }) {
  const { clearCart } = useCart();
  const [state, setState] = useState<"loading" | "paid" | "failed">("loading");
  const [message, setMessage] = useState("Confirming your payment with Paystack...");

  useEffect(() => {
    if (!reference) {
      setState("failed");
      setMessage("No payment reference was supplied.");
      return;
    }

    let cancelled = false;
    fetch(`/api/payments/verify/${encodeURIComponent(reference)}`, { cache: "no-store" })
      .then(async (response) => ({ response, payload: await response.json() }))
      .then(({ response, payload }) => {
        if (cancelled) return;
        if (response.ok && payload.paid) {
          clearCart();
          setState("paid");
          setMessage("Payment confirmed. Your order has been marked as paid.");
        } else {
          setState("failed");
          setMessage(payload.error || "We could not confirm a successful payment yet.");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState("failed");
          setMessage("Payment verification could not be completed.");
        }
      });

    return () => { cancelled = true; };
  }, [reference, clearCart]);

  return (
    <section className="paymentVerify shell">
      {state === "loading" && <LoaderCircle className="spin" size={54}/>}
      {state === "paid" && <CheckCircle2 size={54}/>}
      {state === "failed" && <XCircle size={54}/>}
      <span className="kicker">PAYMENT STATUS</span>
      <h1>{state === "paid" ? "Payment confirmed." : state === "failed" ? "Payment needs attention." : "Checking payment..."}</h1>
      <p>{message}</p>
      <div className="verifyActions">
        <Link className="primaryBtn" href={reference ? `/track-order?reference=${encodeURIComponent(reference)}` : "/track-order"}>Track this order</Link>
        <Link className="secondaryAction" href="/">Back to store</Link>
      </div>
      {reference && <small>Reference: {reference}</small>}
    </section>
  );
}
