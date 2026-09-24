"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Menu, Scale, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";

export default function CommerceHeader() {
  const [open, setOpen] = useState(false);
  const { totalItems, wishlist, compare, settings } = useCart();

  return (
    <>
      <div className="announcement premiumAnnouncement">
        <span>{settings.announcementText || "Better tech. Smarter upgrades."}</span>
        <span className="announcementDesktop">Nationwide delivery · Secure checkout · Human support</span>
      </div>

      <header className="nav shell premiumNav commercePremiumNav">
        <Link href="/" className="brand premiumBrand"><span className="brandMark">T</span><span>TECHMAN <b>AMT</b></span></Link>

        <nav className="desktopNav premiumDesktopNav">
          <Link href="/shop">Shop</Link>
          <Link href="/#collections">Collections</Link>
          <Link href="/blog">Guides</Link>
          <Link href="/trade-in">Trade In</Link>
          <Link href="/track-order">Track Order</Link>
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
            <Link href="/" className="brand premiumBrand" onClick={() => setOpen(false)}>
              <span className="brandMark">T</span><span>TECHMAN <b>AMT</b></span>
            </Link>
            <button onClick={() => setOpen(false)} aria-label="Close menu"><X/></button>
          </div>
          <nav>
            <Link href="/shop" onClick={() => setOpen(false)}>Shop</Link>
            <Link href="/blog" onClick={() => setOpen(false)}>Buying Guides</Link>
            <Link href="/trade-in" onClick={() => setOpen(false)}>Trade In</Link>
            <Link href="/corporate" onClick={() => setOpen(false)}>Bulk Orders</Link>
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
