"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createCustomerServerClient, customerAuthConfigured } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  if (!customerAuthConfigured()) redirect("/auth/sign-in");
  const supabase = await createCustomerServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  const fullName = String(formData.get("fullName") || "").trim().slice(0,120);
  const phone = String(formData.get("phone") || "").trim().slice(0,40);

  const { error } = await supabase.from("profiles").upsert({
    user_id: user.id,
    full_name: fullName || null,
    phone: phone || null,
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });

  if (error) redirect("/account?error=profile");
  revalidatePath("/account");
  redirect("/account?success=profile");
}

export async function signOutCustomer() {
  if (customerAuthConfigured()) {
    const supabase = await createCustomerServerClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
