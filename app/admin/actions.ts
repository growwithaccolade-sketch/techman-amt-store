"use server";

import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { verifyAdminPassword } from "@/lib/admin-auth";

const COOKIE_NAME = "techman_admin_session";
const OWNER_USERNAME = process.env.ADMIN_USERNAME || "admin";
const FALLBACK_OWNER_HASH = "bc979b33513a9ba7527c9d4faf1a7346:27069305c08e429b4c526395ef1c8b406641c8884198fa600233dfc14a0265e73d903f846e56399a4ee427a008db95709ed51a91cad590f5bb2f6b19cf71d9c5";

export type AdminSession = {
  id: string;
  username: string;
  displayName: string;
  role: "owner" | "manager" | "editor" | "support";
  exp: number;
};

function safeEqual(aValue: string, bValue: string) {
  const a = Buffer.from(aValue);
  const b = Buffer.from(bValue);
  return a.length === b.length && timingSafeEqual(a, b);
}

function ownerPasswordValid(password: string) {
  const configured = process.env.ADMIN_PASSWORD;
  if (configured) {
    return safeEqual(
      createHash("sha256").update(password).digest("hex"),
      createHash("sha256").update(configured).digest("hex")
    );
  }
  return verifyAdminPassword(password, FALLBACK_OWNER_HASH);
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_ACCESS_KEY || FALLBACK_OWNER_HASH;
}

function signPayload(payload: string) {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function makeSessionCookie(session: AdminSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${signPayload(payload)}`;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const current = cookieStore.get(COOKIE_NAME)?.value;
  if (!current) return null;

  const [payload, signature] = current.split(".");
  if (!payload || !signature || !safeEqual(signature, signPayload(payload))) return null;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSession;
    if (!session.exp || session.exp < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function hasAdminSession() {
  return Boolean(await getAdminSession());
}

export async function requireOwner() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");
  if (session.role !== "owner") redirect("/admin?error=owner");
  return session;
}

export async function loginAdmin(formData: FormData) {
  const username = String(formData.get("username") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  let session: AdminSession | null = null;

  if (username === OWNER_USERNAME.toLowerCase() && ownerPasswordValid(password)) {
    session = {
      id: "owner",
      username: OWNER_USERNAME,
      displayName: "Store Owner",
      role: "owner",
      exp: Date.now() + 1000 * 60 * 60 * 8,
    };
  } else if (commerceBackendConfigured()) {
    const supabase = getSupabaseAdmin();
    const { data } = await supabase
      .from("admin_staff")
      .select("id,username,display_name,role,password_hash,active")
      .eq("username", username)
      .eq("active", true)
      .maybeSingle();

    if (data && verifyAdminPassword(password, String(data.password_hash || ""))) {
      session = {
        id: String(data.id),
        username: String(data.username),
        displayName: String(data.display_name || data.username),
        role: data.role as AdminSession["role"],
        exp: Date.now() + 1000 * 60 * 60 * 8,
      };
    }
  }

  if (!session) redirect("/admin?error=invalid");

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, makeSessionCookie(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: 60 * 60 * 8,
  });
  redirect("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/admin");
}
