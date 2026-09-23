"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";

export default function CommerceHeader() {
  const { totalItems } = useCart();
  return (
    <>
      <div className="announcement"><span>⚡ Better tech, smarter upgrades</span><span>Nationwide delivery options</span><span>Secure shopping experience</span></div>
      <header className="nav shell">
        <Link href="/" className="brand"><span className="brandMark">T</span><span>TECHMAN <b>AMT</b></span></Link>
        <nav className="desktopNav"><Link href="/#shop">Shop</Link><Link href="/#deals">Deals</Link><Link href="/#creator">Creator Tools</Link></nav>
        <div className="navActions"><Link className="cartBtn" href="/cart"><ShoppingBag size={18}/> Cart <span>{totalItems}</span></Link></div>
      </header>
    </>
  );
}
