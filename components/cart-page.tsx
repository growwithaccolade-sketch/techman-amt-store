"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { money, products } from "@/lib/products";

export default function CartPageClient() {
  const { lines, setQty, removeItem } = useCart();
  const items = lines.map((line) => ({ line, product: products.find((p) => p.id === line.id) })).filter((item) => item.product);
  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.line.qty, 0);

  if (!items.length) {
    return <section className="emptyCart shell"><ShoppingBag size={44}/><h1>Your cart is empty.</h1><p>Start with the tech you actually need, then build your setup from there.</p><Link className="primaryBtn" href="/#shop">Shop latest tech</Link></section>;
  }

  return (
    <section className="cartPage shell">
      <div className="pageIntro"><span className="kicker">YOUR CART</span><h1>Ready when you are.</h1><p>Review your items before moving to checkout.</p></div>
      <div className="cartLayout">
        <div className="cartLines">
          {items.map(({ line, product }) => product && (
            <article className="cartLine" key={product.id}>
              <Image src={product.image} alt={product.name} width={170} height={170}/>
              <div className="cartLineInfo">
                <span className="brandName">{product.brand}</span>
                <Link href={`/product/${product.slug}`}><h2>{product.name}</h2></Link>
                <p>{product.condition} · {product.warranty}</p>
                <strong>{money(product.price)}</strong>
              </div>
              <div className="qtyControl">
                <button aria-label="Reduce quantity" onClick={() => setQty(product.id, line.qty - 1)}><Minus size={15}/></button>
                <span>{line.qty}</span>
                <button aria-label="Increase quantity" onClick={() => setQty(product.id, line.qty + 1)}><Plus size={15}/></button>
              </div>
              <button className="removeBtn" aria-label="Remove item" onClick={() => removeItem(product.id)}><Trash2 size={18}/></button>
            </article>
          ))}
        </div>
        <aside className="orderSummary">
          <span className="kicker">ORDER SUMMARY</span>
          <div><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
          <div><span>Delivery</span><span>Calculated at checkout</span></div>
          <div className="summaryTotal"><span>Total before delivery</span><strong>{money(subtotal)}</strong></div>
          <Link className="primaryBtn checkoutBtn" href="/checkout">Continue to checkout</Link>
          <small>No hidden product fees. Delivery is confirmed before you complete your order.</small>
        </aside>
      </div>
    </section>
  );
}
