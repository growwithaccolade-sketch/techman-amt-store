export const siteConfig = {
  name: "TechMan AMT",
  email: process.env.NEXT_PUBLIC_STORE_EMAIL || "",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
};

export function whatsappUrl(message: string) {
  if (!siteConfig.whatsappNumber) return "";
  return `https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
