"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Heart, Menu, Scale, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import BrandLogo from "@/components/brand-logo";

export default function CommerceHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { totalItems, wishlist, compare, settings } = useCart();

  return (
    <>
      <div className="announcement premiumAnnouncement">
        <span>{settings.announcementText || "Phones, laptops, audio and creator tools."}</span>
        <span className="announcementDesktop">Delivery across Nigeria · Order support</span>
      </div>

      <header className="nav shell premiumNav commercePremiumNav">
        <BrandLogo/>

        <nav className="desktopNav premiumDesktopNav">
          <Link className={pathname === "/" ? "current" : ""} aria-current={pathname === "/" ? "page" : undefined} href="/">Home</Link>
          <Link className={pathname.startsWith("/shop") || pathname.startsWith("/product") ? "current" : ""} aria-current={pathname.startsWith("/shop") ? "page" : undefined} href="/shop">Shop</Link>
          <Link href="/#collections">Collections</Link>
          <Link className={pathname.startsWith("/blog") ? "current" : ""} aria-current={pathname.startsWith("/blog") ? "page" : undefined} href="/blog">Guides</Link>
          <Link className={pathname === "/contact" ? "current" : ""} aria-current={pathname === "/contact" ? "page" : undefined} href="/contact">Contact</Link>
        </nav>

        <div className="navActions premiumNavActions">
          <Link className="iconBtn navSearchButton" aria-label="Search" href="/search"><Search size={18}/></Link>
          <Link className="iconBtn" aria-label="Account" href="/account"><UserRound size={18}/></Link>
          <Link className="iconBtn badgeWrap" aria-label="Compare products" href="/compare">
            <Scale size={18}/>{compare.length > 0 && <span className="count">{compare.length}</span>}
          </Link>
          <Link className="iconBtn badgeWrap" aria-label="Wishlist" href="/wishlist">
            <Heart size={18}/>{wishlist.length > 0 && <span className="count">{wishlist.length}</span>}
          </Link>
          <Link className="cartBtn premiumCartBtn" href="/cart">
            <ShoppingBag size={17}/><span className="cartLabel">Cart</span><em>{totalItems}</em>
          </Link>
          <button className="menuBtn" aria-label="Open menu" onClick={() => setOpen(true)}><Menu/></button>
        </div>
      </header>

      {open && (
        <div className="mobileMenu premiumMobileMenu">
          <div className="mobileMenuTop">
            <BrandLogo/>
            <button onClick={() => setOpen(false)} aria-label="Close menu"><X/></button>
          </div>
          <nav>
            <Link href="/" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/shop" onClick={() => setOpen(false)}>Shop</Link>
            <Link href="/blog" onClick={() => setOpen(false)}>Guides</Link>
            <Link href="/contact" onClick={() => setOpen(false)}>Contact</Link>
            <Link href="/track-order" onClick={() => setOpen(false)}>Track Order</Link>
          </nav>
          <div className="mobileMenuUtilities">
            <Link href="/account" onClick={() => setOpen(false)}>Account</Link>
            <Link href="/wishlist" onClick={() => setOpen(false)}>Wishlist ({wishlist.length})</Link>
            <Link href="/compare" onClick={() => setOpen(false)}>Compare ({compare.length})</Link>
            <Link href="/cart" onClick={() => setOpen(false)}>Cart ({totalItems})</Link>
          </div>
        </div>
      )}
    </>
  );
}
