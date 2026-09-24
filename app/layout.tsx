import type { Metadata, Viewport } from "next";
import { CartProvider } from "@/components/cart-provider";
import MotionController from "@/components/motion-controller";
import SiteFooter from "@/components/site-footer";
import { getStoreCatalog } from "@/lib/catalog";
import { getStoreSettings } from "@/lib/store-settings";
import "./globals.css";

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#090b10",
};

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
    description: "Shop phones, laptops, audio, accessories and creator tools in Nigeria.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "TechMan AMT",
    description: "Phones, laptops, audio, accessories and creator tools in Nigeria.",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [catalog, settings] = await Promise.all([getStoreCatalog(), getStoreSettings()]);
  return <html lang="en"><body><MotionController/><CartProvider catalog={catalog} settings={settings}>{children}<SiteFooter/></CartProvider></body></html>;
}
