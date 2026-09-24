import type { Metadata } from "next";
import { CartProvider } from "@/components/cart-provider";
import { getStoreCatalog } from "@/lib/catalog";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techmanamt.example";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TechMan AMT | Phones, Gadgets & Creator Tech",
    template: "%s | TechMan AMT",
  },
  description: "Shop phones, laptops, gadgets, creator tools and everyday tech in Nigeria.",
  openGraph: {
    type: "website",
    siteName: "TechMan AMT",
    title: "TechMan AMT | Phones, Gadgets & Creator Tech",
    description: "Phones, laptops, creator gear and everyday tech chosen to help you work, create and stay connected.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "TechMan AMT",
    description: "Phones, gadgets and creator tech worth your money.",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const catalog = await getStoreCatalog();
  return <html lang="en"><body><CartProvider catalog={catalog}>{children}</CartProvider></body></html>;
}
