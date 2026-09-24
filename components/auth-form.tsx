"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { createCustomerBrowserClient } from "@/lib/supabase/client";

export default function AuthForm({ mode }: { mode: "sign-in" | "sign-up" | "forgot" | "update" }) {
  const router = useRouter();
  const [state, setState] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [message, setMessage] = useState("");

  async function signInWithGoogle() {
    setState("loading");
    setMessage("");
    try {
      const supabase = createCustomerBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin + "/auth/callback?next=/account" },
      });
      if (error) throw error;
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Google sign-in could not be started.");
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setMessage("");
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    const fullName = String(form.get("fullName") || "").trim();
    const supabase = createCustomerBrowserClient();

    try {
      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/account");
        router.refresh();
        return;
      }

      if (mode === "sign-up") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin + "/auth/callback?next=/account",
          },
        });
        if (error) throw error;
        if (data.session) {
          router.push("/account");
          router.refresh();
          return;
        }
        setState("success");
        setMessage("Account created. Check your email to confirm the address, then return to TechMan AMT.");
        return;
      }

      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: window.location.origin + "/auth/callback?next=/auth/update-password",
        });
        if (error) throw error;
        setState("success");
        setMessage("If that email can receive a reset message, the recovery link has been sent.");
        return;
      }

      if (mode === "update") {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        router.push("/account");
        router.refresh();
      }
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Authentication could not be completed.");
    }
  }

  const title = mode === "sign-in" ? "Welcome back."
    : mode === "sign-up" ? "Create your TechMan AMT account."
    : mode === "forgot" ? "Recover your account."
    : "Choose a new password.";

  return <main className="authPage">
    <section className="authCard">
      <Link href="/" className="brand"><span className="brandMark">T</span><span>TECHMAN <b>AMT</b></span></Link>
      <div className="authIntro"><span className="kicker">CUSTOMER ACCOUNT</span><h1>{title}</h1><p>{mode === "sign-in" ? "See your order history and keep account access in one place." : mode === "sign-up" ? "Create an account with email and password. Checkout can still work without an account." : mode === "forgot" ? "Enter your account email to request a secure recovery link." : "Use a strong password you do not reuse elsewhere."}</p></div>
{(mode === "sign-in" || mode === "sign-up") && <><button type="button" className="oauthButton" onClick={signInWithGoogle}>Continue with Google</button><div className="authDivider"><span>or use email</span></div></>}
      <form className="authForm" onSubmit={submit}>
        {mode === "sign-up" && <label>Full name<input name="fullName" required autoComplete="name"/></label>}
        {mode !== "update" && <label>Email address<input name="email" type="email" required autoComplete="email"/></label>}
        {(mode === "sign-in" || mode === "sign-up" || mode === "update") && <label>Password<input name="password" type="password" minLength={8} required autoComplete={mode === "sign-in" ? "current-password" : "new-password"}/></label>}
        <button className="primaryAction" disabled={state === "loading"}><LockKeyhole size={18}/>{state === "loading" ? "Working..." : mode === "sign-in" ? "Sign in" : mode === "sign-up" ? "Create account" : mode === "forgot" ? "Send recovery link" : "Update password"} <ArrowRight size={16}/></button>
      </form>
      {state === "success" && <div className="authMessage success">{message}</div>}
      {state === "error" && <div className="authMessage error">{message}</div>}
      <div className="authLinks">
        {mode === "sign-in" && <><Link href="/auth/forgot-password">Forgot password?</Link><Link href="/auth/sign-up">Create an account</Link></>}
        {mode === "sign-up" && <Link href="/auth/sign-in">Already have an account? Sign in</Link>}
        {mode === "forgot" && <Link href="/auth/sign-in">Back to sign in</Link>}
      </div>
    </section>
  </main>;
}
