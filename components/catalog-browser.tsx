"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Search, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { money } from "@/lib/products";

export default function CatalogBrowser({
  title = "Shop TechMan AMT",
  intro = "Browse phones, laptops, creator tools and everyday technology.",
  initialCategory = "All",
  initialBrand = "All",
  initialQuery = "",
}: {
  title?: string;
  intro?: string;
  initialCategory?: string;
  initialBrand?: string;
  initialQuery?: string;
}) {
  const { catalog, addItem, lines, wishlist, toggleWishlist } = useCart();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState(initialBrand);
  const [sort, setSort] = useState("featured");

  const categories = useMemo(() => ["All", ...Array.from(new Set(catalog.map((p) => p.category))).sort()], [catalog]);
  const brands = useMemo(() => ["All", ...Array.from(new Set(catalog.map((p) => p.brand))).sort()], [catalog]);

  const products = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = catalog.filter((product) => {
      const categoryMatch = category === "All" || product.category === category;
      const brandMatch = brand === "All" || product.brand === brand;
      const queryMatch = !q || `${product.name} ${product.brand} ${product.category} ${product.blurb}`.toLowerCase().includes(q);
      return categoryMatch && brandMatch && queryMatch;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "stock") return b.stock - a.stock;
      return (b.badge ? 1 : 0) - (a.badge ? 1 : 0);
    });
  }, [catalog, query, category, brand, sort]);

  return (
    <main className="catalogPage shell">
      <section className="catalogHero">
        <span className="kicker">TECHMAN AMT STORE</span>
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>
      <div className="catalogControls">
        <label className="catalogSearch"><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products, brands or categories"/></label>
        <label>Category<select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Brand<select value={brand} onChange={(e) => setBrand(e.target.value)}>{brands.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Sort<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="stock">Most stock</option></select></label>
      </div>
      <div className="catalogMeta"><b>{products.length}</b> matching products</div>
      {products.length ? <div className="productGrid">
        {products.map((product) => {
          const inCart = lines.some((line) => line.id === product.id);
          return <article className="productCard" key={product.id}>
            <div className="productImageWrap">
              {product.badge && <span className="productBadge">{product.badge}</span>}
              <button className={`wishBtn ${wishlist.includes(product.id) ? "on" : ""}`} onClick={() => toggleWishlist(product.id)} aria-label="Save product"><Heart size={18} fill={wishlist.includes(product.id) ? "currentColor" : "none"}/></button>
              <Link href={`/product/${product.slug}`}><Image className="productImage" src={product.image} alt={product.name} width={700} height={700} unoptimized/></Link>
            </div>
            <div className="productInfo">
              <span className="brandName">{product.brand} · {product.category}</span>
              <Link href={`/product/${product.slug}`}><h3>{product.name}</h3></Link>
              <p>{product.blurb}</p>
              <div className="priceLine"><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}</div>
              <div className={product.stock > 0 ? "catalogStock" : "catalogStock out"}>{product.stock > 0 ? `${product.stock} available` : "Out of stock"}</div>
              <button className={`addBtn ${inCart ? "added" : ""}`} onClick={() => addItem(product.id)} disabled={product.stock <= 0}>{product.stock <= 0 ? "Out of stock" : inCart ? "Add another" : "Add to cart"} <ShoppingBag size={17}/></button>
              <Link className="viewProduct" href={`/product/${product.slug}`}>View full details <ArrowRight size={14}/></Link>
            </div>
          </article>;
        })}
      </div> : <div className="emptyState"><Search size={38}/><h3>No products match those filters.</h3><p>Try clearing a brand, category or search phrase.</p><button onClick={() => {setQuery(""); setCategory("All"); setBrand("All");}}>Clear filters</button></div>}
    </main>
  );
}
