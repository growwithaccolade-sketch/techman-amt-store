export type StoreSettings = {
  storeName: string;
  supportEmail: string;
  whatsappNumber: string;
  announcementText: string;
  freeDeliveryThreshold: number | null;
};

export const fallbackStoreSettings: StoreSettings = {
  storeName: "TechMan AMT",
  supportEmail: process.env.NEXT_PUBLIC_STORE_EMAIL || "",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  announcementText: "Better tech, smarter upgrades.",
  freeDeliveryThreshold: null,
};

export function makeWhatsappUrl(number: string, message: string) {
  const cleaned = number.replace(/\D/g, "");
  if (!cleaned) return "";
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}
