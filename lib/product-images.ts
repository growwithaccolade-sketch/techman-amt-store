import { randomUUID } from "crypto";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const allowed = new Set(["image/jpeg","image/png","image/webp","image/avif"]);
const extensionByType: Record<string,string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export async function uploadProductImage(file: File) {
  if (!file || file.size <= 0) return "";
  if (!allowed.has(file.type)) throw new Error("Use a JPG, PNG, WebP or AVIF image.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Product images must be 8MB or smaller.");

  const supabase = getSupabaseAdmin();
  const ext = extensionByType[file.type] || "jpg";
  const path = `products/${new Date().toISOString().slice(0,10)}/${randomUUID()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from("product-images").upload(path, bytes, {
    contentType: file.type,
    upsert: false,
    cacheControl: "31536000",
  });

  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}
