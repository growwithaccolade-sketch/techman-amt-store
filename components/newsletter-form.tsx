"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export default function NewsletterForm() {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setMessage("");
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") || "");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setState("error");
        setMessage(payload.error || "Could not subscribe.");
        return;
      }
      form.reset();
      setState("success");
      setMessage("You're on the TechMan AMT list.");
    } catch {
      setState("error");
      setMessage("Newsletter signup is temporarily unavailable.");
    }
  }

  return <div className="newsletterFormWrap"><form onSubmit={submit}><input name="email" type="email" required placeholder="Your email address"/><button disabled={state === "sending"}>{state === "sending" ? "Joining..." : "Join TechMan AMT"} {state !== "sending" && <ArrowRight size={17}/>}</button></form>{state === "success" && <span className="newsletterStatus success"><Check size={14}/>{message}</span>}{state === "error" && <span className="newsletterStatus error">{message}</span>}</div>;
}
