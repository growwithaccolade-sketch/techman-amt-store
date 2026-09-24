"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Star } from "lucide-react";

export default function ReviewForm({ productId, productName }: { productId: number; productName: string }) {
  const [rating, setRating] = useState(5);
  const [state, setState] = useState<"idle"|"sending"|"success"|"error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setMessage("");
    const data = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          orderReference: String(data.get("orderReference") || ""),
          email: String(data.get("email") || ""),
          displayName: String(data.get("displayName") || ""),
          rating,
          title: String(data.get("title") || ""),
          review: String(data.get("review") || ""),
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setState("error");
        setMessage(payload.error || "Your review could not be submitted.");
        return;
      }

      e.currentTarget.reset();
      setRating(5);
      setState("success");
      setMessage(payload.message || "Review received.");
    } catch {
      setState("error");
      setMessage("Review submission is temporarily unavailable.");
    }
  }

  return (
    <form className="reviewForm" onSubmit={submit}>
      <div className="reviewFormHead"><span className="kicker">VERIFIED PURCHASE REVIEW</span><h3>Review {productName}</h3><p>Use the order reference and email from your paid order. Reviews are moderated before appearing publicly.</p></div>
      <div className="fieldGrid"><label>Order reference<input name="orderReference" placeholder="TAMT-..." required/></label><label>Checkout email<input name="email" type="email" required/></label></div>
      <label>Display name<input name="displayName" required maxLength={80}/></label>
      <label>Your rating<div className="starPicker">{[1,2,3,4,5].map((value)=><button type="button" key={value} onClick={()=>setRating(value)} aria-label={String(value) + " stars"} className={value <= rating ? "on" : ""}><Star size={22} fill={value <= rating ? "currentColor" : "none"}/></button>)}</div></label>
      <label>Review title<input name="title" maxLength={120} placeholder="Optional short summary"/></label>
      <label>Review<textarea name="review" rows={5} minLength={20} maxLength={2000} required placeholder="What was useful, what surprised you, and who would you recommend it to?"/></label>
      <button className="primaryAction" disabled={state === "sending"}>{state === "sending" ? "Submitting..." : "Submit verified review"}</button>
      {state === "success" && <div className="leadMessage success"><CheckCircle2 size={18}/>{message}</div>}
      {state === "error" && <div className="leadMessage error">{message}</div>}
    </form>
  );
}
