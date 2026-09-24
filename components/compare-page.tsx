"use client";

import Link from "next/link";
import { Scale, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { money } from "@/lib/products";
import ProductImage from "@/components/product-image";

export default function ComparePageClient() {
  const { catalog, compare, toggleCompare, clearCompare } = useCart();
  const products = compare.map((id) => catalog.find((product) => product.id === id)).filter(Boolean);

  if (!products.length) {
    return <section className="emptyCart shell"><Scale size={44}/><h1>No products selected.</h1><p>Add products from a product page, then compare their price, condition, stock, warranty and available specifications here.</p><Link className="primaryBtn" href="/shop">Browse products</Link></section>;
  }

  const specKeys = Array.from(new Set(products.flatMap((product) => product ? Object.keys(product.specs) : []))).slice(0, 10);

  return (
    <section className="comparePage shell">
      <div className="pageIntro"><span className="kicker">COMPARE</span><h1>Compare products.</h1><p>Compare up to four products.</p></div>
      <div className="wishlistToolbar"><b>{products.length} of 4 selected</b><button onClick={clearCompare}>Clear comparison</button></div>
      <div className="compareScroller">
        <table className="compareTable">
          <thead><tr><th>Feature</th>{products.map((product) => product && <th key={product.id}><button className="compareRemove" onClick={() => toggleCompare(product.id)} aria-label="Remove product"><X size={15}/></button><div className="compareImageWrap"><ProductImage src={product.image} alt={product.name} brand={product.brand} sizes="180px"/></div><Link href={`/product/${product.slug}`}>{product.name}</Link></th>)}</tr></thead>
          <tbody>
            <tr><td>Price</td>{products.map((p) => p && <td key={p.id}><strong>{money(p.price)}</strong></td>)}</tr>
            <tr><td>Brand</td>{products.map((p) => p && <td key={p.id}>{p.brand}</td>)}</tr>
            <tr><td>Category</td>{products.map((p) => p && <td key={p.id}>{p.category}</td>)}</tr>
            <tr><td>Condition</td>{products.map((p) => p && <td key={p.id}>{p.condition}</td>)}</tr>
            <tr><td>Stock</td>{products.map((p) => p && <td key={p.id}>{p.stock > 0 ? `${p.stock} available` : "Out of stock"}</td>)}</tr>
            <tr><td>Warranty</td>{products.map((p) => p && <td key={p.id}>{p.warranty}</td>)}</tr>
            {specKeys.map((key) => <tr key={key}><td>{key}</td>{products.map((p) => p && <td key={p.id}>{p.specs[key] || "Not listed"}</td>)}</tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}
