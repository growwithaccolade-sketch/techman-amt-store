"use client";

import Link from "next/link";
import { ArrowUpRight, Heart, Search, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { useCart } from "@/components/cart-provider";
import { money } from "@/lib/products";
import ProductImage from "@/components/product-image";

export default function CatalogBrowser({
  title = "Shop TechMan AMT",
  intro = "Phones, laptops, audio, accessories and creator tools.",
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
      const queryMatch =
        !q ||
        `${product.name} ${product.brand} ${product.category} ${product.blurb}`
          .toLowerCase()
          .includes(q);
      return categoryMatch && brandMatch && queryMatch;
    });

    const badgeWeight = (badge?: string) => {
      const value = (badge || "").toLowerCase();
      if (value.includes("new 2026")) return 100;
      if (value.includes("bestseller") || value.includes("popular")) return 80;
      if (value.includes("featured") || value.includes("pro")) return 65;
      if (value.includes("creator") || value.includes("camera")) return 55;
      return badge ? 35 : 0;
    };

    return [...filtered].sort((a, b) => {
      if (sort === "price-low") {
        if (a.price <= 0 && b.price > 0) return 1;
        if (b.price <= 0 && a.price > 0) return -1;
        return a.price - b.price;
      }
      if (sort === "price-high") return b.price - a.price;
      if (sort === "stock") return b.stock - a.stock;
      const badgeDiff = badgeWeight(b.badge) - badgeWeight(a.badge);
      if (badgeDiff) return badgeDiff;
      const availabilityDiff = Number(b.stock > 0) - Number(a.stock > 0);
      if (availabilityDiff) return availabilityDiff;
      return b.id - a.id;
    });
  }, [catalog, query, category, brand, sort]);

  return (
    <main className="catalogPage shell premiumCatalogPage">
      <section className="catalogHero premiumCatalogHero">
        <span className="kicker">SHOP</span>
        <h1>{title}</h1>
        <p>{intro}</p>
      </section>

      <div className="catalogControls premiumCatalogControls">
        <label className="catalogSearch">
          <span>Search</span>
          <div><Search size={17}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Phones, laptops, brands..."/></div>
        </label>
        <label>Category<select value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Brand<select value={brand} onChange={(e) => setBrand(e.target.value)}>{brands.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Sort<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="featured">New & trending</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="stock">Most stock</option></select></label>
      </div>

      <div className="catalogMeta premiumCatalogMeta">
        <span><b>{products.length}</b> products</span>
        {(query || category !== "All" || brand !== "All") && <button onClick={() => { setQuery(""); setCategory("All"); setBrand("All"); }}>Clear filters</button>}
      </div>

      {products.length ? (
        <div className="premiumProductGrid catalogPremiumGrid">
          {products.map((product) => {
            const inCart = lines.some((line) => line.id === product.id);
            return (
              <article className="premiumProductCard" key={product.id}>
                <div className="premiumProductMedia">
                  {product.badge && <span className="productBadge">{product.badge}</span>}
                  <button
                    className={`wishBtn ${wishlist.includes(product.id) ? "on" : ""}`}
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Save product"
                  >
                    <Heart size={17} fill={wishlist.includes(product.id) ? "currentColor" : "none"}/>
                  </button>
                  <Link href={`/product/${product.slug}`}>
                    <ProductImage src={product.image} alt={product.name} brand={product.brand} sizes="(max-width: 720px) 92vw, (max-width: 1100px) 46vw, 31vw"/>
                  </Link>
                </div>

                <div className="premiumProductBody">
                  <div className="productMetaLine"><span>{product.brand}</span><span>{product.category}</span></div>
                  <Link href={`/product/${product.slug}`}><h3>{product.name}</h3></Link>
                  <p>{product.blurb}</p>
                  <div className="premiumPriceLine">
                    <strong>{product.price > 0 ? money(product.price) : "Price on request"}</strong>
                    {product.oldPrice && <del>{money(product.oldPrice)}</del>}
                  </div>
                  <div className={product.price <= 0 ? "premiumStock request" : product.stock > 0 ? "premiumStock" : "premiumStock out"}>
                    {product.price <= 0 ? "Availability on request" : product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                  </div>
                  <div className="premiumCardActions">
                    {product.price <= 0 ? (
                      <Link className="premiumAddButton requestButton" href={`/device-request?product=${encodeURIComponent(product.name)}`}>
                        Request price
                      </Link>
                    ) : (
                      <button
                        className={`premiumAddButton ${inCart ? "added" : ""}`}
                        onClick={() => addItem(product.id)}
                        disabled={product.stock <= 0}
                      >
                        <ShoppingBag size={16}/>
                        {product.stock <= 0 ? "Out of stock" : inCart ? "Add another" : "Add to cart"}
                      </button>
                    )}
                    <Link className="premiumDetailButton" href={`/product/${product.slug}`} aria-label={`View ${product.name}`}>
                      <ArrowUpRight size={18}/>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="emptyState premiumEmptyState">
          <Search size={34}/>
          <h3>No products match those filters.</h3>
          <p>Try clearing a brand, category or search phrase.</p>
          <button onClick={() => { setQuery(""); setCategory("All"); setBrand("All"); }}>Clear filters</button>
        </div>
      )}
    </main>
  );
}
