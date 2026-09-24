import type { Metadata } from "next";
import AuthForm from "@/components/auth-form";
import { customerAuthConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Create Account", robots: { index: false, follow: false } };

export default function SignUpPage() {
  if (!customerAuthConfigured()) return <main className="authPage"><section className="authCard"><span className="kicker">CUSTOMER ACCOUNT</span><h1>Account creation is being configured.</h1><p>The store can still be browsed and checkout remains available without an account.</p><a className="primaryBtn" href="/shop">Continue shopping</a></section></main>;
  return <AuthForm mode="sign-up"/>;
}
