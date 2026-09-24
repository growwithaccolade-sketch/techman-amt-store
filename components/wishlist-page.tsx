"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { money } from "@/lib/products";
import ProductImage from "@/components/product-image";

export default function WishlistPageClient() {
  const { catalog, wishlist, toggleWishlist, addItem, lines, clearWishlist } = useCart();
  const products = wishlist.map((id) => catalog.find((product) => product.id === id)).filter(Boolean);

  if (!products.length) {
    return <section className="emptyCart shell"><Heart size={44}/><h1>Your wishlist is empty.</h1><p>Save products you want to compare, revisit or buy later.</p><Link className="primaryBtn" href="/shop">Browse the store</Link></section>;
  }

  return (
    <section className="wishlistPage shell">
      <div className="pageIntro"><span className="kicker">WISHLIST</span><h1>Saved products.</h1><p>Saved products stay on this browser until you remove them.</p></div>
      <div className="wishlistToolbar"><b>{products.length} saved products</b><button onClick={clearWishlist}>Clear wishlist</button></div>
      <div className="productGrid">
        {products.map((product) => product && <article className="productCard" key={product.id}>
          <div className="productImageWrap">
            <button className="wishBtn on" onClick={() => toggleWishlist(product.id)} aria-label="Remove from wishlist"><Trash2 size={17}/></button>
            <Link href={`/product/${product.slug}`}><ProductImage src={product.image} alt={product.name} brand={product.brand} sizes="(max-width: 720px) 92vw, 31vw"/></Link>
          </div>
          <div className="productInfo">
            <span className="brandName">{product.brand} · {product.category}</span>
            <Link href={`/product/${product.slug}`}><h3>{product.name}</h3></Link>
            <p>{product.blurb}</p>
            <div className="priceLine"><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}</div>
            <button className={`addBtn ${lines.some((line) => line.id === product.id) ? "added" : ""}`} onClick={() => addItem(product.id)} disabled={product.stock <= 0}>{product.stock <= 0 ? "Out of stock" : "Add to cart"} <ShoppingBag size={17}/></button>
          </div>
        </article>)}
      </div>
    </section>
  );
}
