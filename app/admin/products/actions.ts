"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasAdminSession } from "@/app/admin/actions";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { uploadProductImage } from "@/lib/product-images";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function parseHighlights(raw: string) { return raw.split("\n").map(v => v.trim()).filter(Boolean); }
function parseSpecs(raw: string) { const out: Record<string,string> = {}; raw.split("\n").forEach(line => { const i=line.indexOf(":"); if(i>0) out[line.slice(0,i).trim()] = line.slice(i+1).trim(); }); return out; }

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function requireAdmin() {
  if (!(await hasAdminSession())) redirect("/admin");
  if (!commerceBackendConfigured()) redirect("/admin/products?error=backend");
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const supabase = getSupabaseAdmin();
  const name = text(formData, "name");
  const slug = slugify(text(formData, "slug") || name);
  const price = Number(text(formData, "price"));
  const stock = Number(text(formData, "stock"));
  const oldPriceRaw = text(formData, "oldPrice");
  let imageUrl = text(formData, "image");
  const imageFile = formData.get("imageFile");
  if (imageFile instanceof File && imageFile.size > 0) {
    try { imageUrl = await uploadProductImage(imageFile); }
    catch (error) { redirect(`/admin/products?error=${encodeURIComponent(error instanceof Error ? error.message : "Image upload failed")}`); }
  }

  if (!name || !slug || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
    redirect("/admin/products?error=invalid");
  }

  const { data: latest } = await supabase.from("products").select("external_id").order("external_id", { ascending: false }).limit(1).maybeSingle();
  const externalId = Number(latest?.external_id || 0) + 1;

  const { error } = await supabase.from("products").insert({
    external_id: externalId,
    slug,
    name,
    brand: text(formData, "brand") || "TechMan AMT",
    category: text(formData, "category") || "Gadgets",
    price_ngn: Math.round(price),
    old_price_ngn: oldPriceRaw ? Math.round(Number(oldPriceRaw)) : null,
    stock,
    image_url: imageUrl,
    blurb: text(formData, "blurb"),
    badge: text(formData, "badge") || null,
    warranty: text(formData, "warranty") || null,
    condition: text(formData, "condition") || "New",
    highlights: parseHighlights(text(formData, "highlights")),
    specs: parseSpecs(text(formData, "specs")),
    active: true,
    updated_at: new Date().toISOString(),
  });

  if (error) redirect(`/admin/products?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products?success=created");
}

export async function updateProduct(formData: FormData) {
  await requireAdmin();
  const supabase = getSupabaseAdmin();
  const id = text(formData, "id");
  const price = Number(text(formData, "price"));
  const stock = Number(text(formData, "stock"));
  const oldPriceRaw = text(formData, "oldPrice");
  let imageUrl = text(formData, "image");
  const imageFile = formData.get("imageFile");
  if (imageFile instanceof File && imageFile.size > 0) {
    try { imageUrl = await uploadProductImage(imageFile); }
    catch (error) { redirect(`/admin/products?error=${encodeURIComponent(error instanceof Error ? error.message : "Image upload failed")}`); }
  }

  const { error } = await supabase.from("products").update({
    name: text(formData, "name"),
    brand: text(formData, "brand"),
    category: text(formData, "category"),
    price_ngn: Math.round(price),
    old_price_ngn: oldPriceRaw ? Math.round(Number(oldPriceRaw)) : null,
    stock,
    image_url: imageUrl,
    blurb: text(formData, "blurb"),
    badge: text(formData, "badge") || null,
    warranty: text(formData, "warranty") || null,
    condition: text(formData, "condition") || "New",
    highlights: parseHighlights(text(formData, "highlights")),
    specs: parseSpecs(text(formData, "specs")),
    active: formData.get("active") === "on",
    updated_at: new Date().toISOString(),
  }).eq("id", id);

  if (error) redirect(`/admin/products?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products?success=updated");
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const supabase = getSupabaseAdmin();
  const id = text(formData, "id");
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/");
  redirect("/admin/products?success=deleted");
}
