"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "number" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  options?: string[];
};

export default function LeadForm({ type, fields, submitLabel }: { type: "trade_in" | "device_request" | "corporate_quote"; fields: Field[]; submitLabel: string }) {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setMessage("");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...data }),
      });
      const payload = await response.json();
      if (!response.ok) {
        setState("error");
        setMessage(payload.error || "Your request could not be saved.");
        return;
      }
      e.currentTarget.reset();
      setState("success");
      setMessage("Request received. We will follow up using the details provided.");
    } catch {
      setState("error");
      setMessage("The request service is temporarily unavailable.");
    }
  }

  return (
    <form className="leadForm" onSubmit={submit}>
      <div className="fieldGrid"><label>Full name<input name="name" required/></label><label>Phone number<input name="phone" required inputMode="tel"/></label></div>
      <label>Email address<input name="email" type="email"/></label>
      {fields.map((field) => <label key={field.name}>{field.label}
        {field.type === "textarea" ? <textarea name={field.name} rows={4} placeholder={field.placeholder} required={field.required}/> :
        field.type === "select" ? <select name={field.name} required={field.required}><option value="">Choose one</option>{field.options?.map((option) => <option key={option}>{option}</option>)}</select> :
        <input name={field.name} type={field.type || "text"} placeholder={field.placeholder} required={field.required}/>}
      </label>)}
      <button className="primaryAction" disabled={state === "sending"}>{state === "sending" ? "Sending..." : submitLabel} <Send size={17}/></button>
      {state === "success" && <div className="leadMessage success"><CheckCircle2 size={18}/>{message}</div>}
      {state === "error" && <div className="leadMessage error">{message}</div>}
    </form>
  );
}
