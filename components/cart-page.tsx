"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { money } from "@/lib/products";
import ProductImage from "@/components/product-image";

export default function CartPageClient() {
  const { catalog, settings, lines, setQty, removeItem } = useCart();
  const items = lines.map((line) => ({ line, product: catalog.find((p) => p.id === line.id) })).filter((item) => item.product);
  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.line.qty, 0);
  const freeDeliveryRemaining = settings.freeDeliveryThreshold ? Math.max(settings.freeDeliveryThreshold - subtotal, 0) : null;

  if (!items.length) {
    return <section className="emptyCart shell"><ShoppingBag size={44}/><h1>Your cart is empty.</h1><p>Add products to your cart to continue.</p><Link className="primaryBtn" href="/shop">Browse products</Link></section>;
  }

  return (
    <section className="cartPage shell">
      <div className="pageIntro"><span className="kicker">CART</span><h1>Review your cart.</h1><p>Confirm products and quantities before checkout.</p></div>
      <div className="cartLayout">
        <div className="cartLines">
          {items.map(({ line, product }) => product && (
            <article className="cartLine" key={product.id}>
              <div className="cartLineMedia"><ProductImage src={product.image} alt={product.name} brand={product.brand} sizes="120px"/></div>
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
          <div><span>Delivery</span><span>{settings.freeDeliveryThreshold && subtotal >= settings.freeDeliveryThreshold ? "Free delivery offer unlocked" : "Calculated at checkout"}</span></div>{freeDeliveryRemaining !== null && freeDeliveryRemaining > 0 && <div className="deliveryProgress"><span>Add {money(freeDeliveryRemaining)} more to reach the configured free-delivery threshold.</span><div><i style={{width: `${Math.min(100, (subtotal / settings.freeDeliveryThreshold!) * 100)}%`}}/></div></div>}
          <div className="summaryTotal"><span>Total before delivery</span><strong>{money(subtotal)}</strong></div>
          <Link className="primaryBtn checkoutBtn" href="/checkout">Continue to checkout</Link>
          <small>Delivery is calculated before payment where a rate is configured.</small>
        </aside>
      </div>
    </section>
  );
}
