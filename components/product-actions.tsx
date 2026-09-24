"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Heart, MessageCircle, Scale, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { makeWhatsappUrl } from "@/lib/site";

export default function ProductActions({ id, name, price }: { id: number; name: string; price: string }) {
  const { addItem, settings, wishlist, compare, toggleWishlist, toggleCompare } = useCart();
  const [added, setAdded] = useState(false);
  const wa = makeWhatsappUrl(settings.whatsappNumber, `Hello TechMan AMT, I'm interested in ${name} listed at ${price}. Is it available?`);

  const handleAdd = () => {
    addItem(id);
    setAdded(true);
  };

  return (
    <div className="productActions">
      <button className={`primaryAction ${added ? "success" : ""}`} onClick={handleAdd}>
        {added ? <Check size={18}/> : <ShoppingBag size={18}/>}
        {added ? "Added to cart" : "Add to cart"}
      </button>
      <Link className="secondaryAction" href="/cart">View cart</Link><button className="secondaryAction" type="button" onClick={() => toggleWishlist(id)}><Heart size={18} fill={wishlist.includes(id) ? "currentColor" : "none"}/>{wishlist.includes(id) ? "Saved" : "Save for later"}</button>
      <button className="secondaryAction" type="button" onClick={() => toggleCompare(id)}><Scale size={18}/>{compare.includes(id) ? "Remove compare" : "Compare"}</button>
      {wa && <a className="whatsappAction" href={wa} target="_blank" rel="noreferrer"><MessageCircle size={18}/> Ask on WhatsApp</a>}
    </div>
  );
}
