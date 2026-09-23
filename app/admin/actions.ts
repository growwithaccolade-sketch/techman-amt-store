"use server";

import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "techman_admin_session";

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function hasAdminSession() {
  const expected = process.env.ADMIN_ACCESS_KEY;
  if (!expected) return false;
  const cookieStore = await cookies();
  const current = cookieStore.get(COOKIE_NAME)?.value;
  if (!current) return false;
  const expectedDigest = digest(expected);
  const a = Buffer.from(current);
  const b = Buffer.from(expectedDigest);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function loginAdmin(formData: FormData) {
  const expected = process.env.ADMIN_ACCESS_KEY;
  if (!expected) redirect("/admin?error=config");

  const supplied = String(formData.get("accessKey") || "");
  const suppliedHash = digest(supplied);
  const expectedHash = digest(expected);
  const a = Buffer.from(suppliedHash);
  const b = Buffer.from(expectedHash);

  if (a.length !== b.length || !timingSafeEqual(a, b)) redirect("/admin?error=invalid");

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, expectedHash, {
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
