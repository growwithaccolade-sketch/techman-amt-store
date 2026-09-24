import { NextResponse } from "next/server";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  if (!commerceBackendConfigured()) {
    return NextResponse.json({ error: "Newsletter signup is not connected yet." }, { status: 503 });
  }

  const body = await request.json() as { email?: string };
  const email = String(body.email || "").trim().toLowerCase();
  if (!email || !email.includes("@") || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("newsletter_subscribers").upsert({
    email,
    active: true,
    source: "storefront",
    updated_at: new Date().toISOString(),
  }, { onConflict: "email" });

  if (error) return NextResponse.json({ error: "We could not save that email." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
