import type { Metadata } from "next";
import AuthForm from "@/components/auth-form";
import { customerAuthConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Sign In", robots: { index: false, follow: false } };

export default function SignInPage() {
  if (!customerAuthConfigured()) return <main className="authPage"><section className="authCard"><span className="kicker">CUSTOMER ACCOUNT</span><h1>Account login is being configured.</h1><p>Supabase customer authentication will appear here once the production project URL and publishable key are connected.</p><a className="primaryBtn" href="/">Back to store</a></section></main>;
  return <AuthForm mode="sign-in"/>;
}
