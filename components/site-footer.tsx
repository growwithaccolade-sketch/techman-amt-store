"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/brand-logo";
import { useCart } from "@/components/cart-provider";
import { makeWhatsappUrl } from "@/lib/site";

export default function SiteFooter() {
  const pathname = usePathname();
  const { settings } = useCart();
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  const supportLink = makeWhatsappUrl(settings.whatsappNumber, "Hello TechMan AMT, I need help with a product or order.");

  return <footer className="footer premiumFooter">
    <div className="shell premiumFooterTop">
      <div className="footerBrandBlock"><BrandLogo light/><p>Phones, laptops, audio, accessories and creator tools.</p><small>{settings.locationLabel}</small></div>
      <div><b>Shop</b><Link href="/shop?category=Phones">Phones</Link><Link href="/shop?category=Laptops">Laptops</Link><Link href="/shop?category=Creator%20Tools">Creator Tools</Link><Link href="/shop">All Products</Link></div>
      <div><b>Help</b><Link href="/track-order">Track order</Link><Link href="/delivery">Delivery</Link><Link href="/returns">Returns</Link><Link href="/warranty">Warranty</Link></div>
      <div><b>Company</b><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/trade-in">Trade In</Link><Link href="/corporate">Bulk Orders</Link></div>
      <div><b>Support</b>{supportLink ? <a href={supportLink} target="_blank" rel="noreferrer">WhatsApp support</a> : <span>WhatsApp being configured</span>}<Link href="/faq">FAQs</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
    </div>
    <div className="shell copyright premiumCopyright"><span>© 2026 TechMan AMT</span><a href={settings.footerCreditUrl} target="_blank" rel="noreferrer">{settings.footerCreditLabel}</a></div>
  </footer>;
}
