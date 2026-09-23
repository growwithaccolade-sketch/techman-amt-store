import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TechMan AMT | Phones, Gadgets & Creator Tech",
  description: "Shop phones, laptops, gadgets, creator tools and everyday tech in Nigeria.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
