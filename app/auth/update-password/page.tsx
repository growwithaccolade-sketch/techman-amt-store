import type { Metadata } from "next";
import AuthForm from "@/components/auth-form";
import { customerAuthConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Update Password", robots: { index: false, follow: false } };

export default function UpdatePasswordPage() {
  if (!customerAuthConfigured()) return <main className="authPage"><section className="authCard"><h1>Account recovery is not configured yet.</h1><a className="primaryBtn" href="/">Back to store</a></section></main>;
  return <AuthForm mode="update"/>;
}
