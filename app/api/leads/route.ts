import { NextResponse } from "next/server";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

const allowedTypes = new Set(["trade_in", "device_request", "corporate_quote"]);

export async function POST(request: Request) {
  if (!commerceBackendConfigured()) {
    return NextResponse.json({ error: "Request forms are not connected yet." }, { status: 503 });
  }

  const body = await request.json() as Record<string, unknown>;
  const type = String(body.type || "");
  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim().toLowerCase();

  if (!allowedTypes.has(type) || !name || !phone) {
    return NextResponse.json({ error: "Name, phone number and request type are required." }, { status: 400 });
  }

  const payload = Object.fromEntries(Object.entries(body).filter(([key]) => !["type", "name", "phone", "email"].includes(key)));
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("lead_requests").insert({
    type,
    name,
    phone,
    email: email || null,
    payload,
    status: "new",
  });

  if (error) return NextResponse.json({ error: "We could not save your request." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
