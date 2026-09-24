"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import type { StoreSettings } from "@/lib/site";

export type CartLine = { id: number; qty: number };

type CartContextValue = {
  catalog: Product[];
  settings: StoreSettings;
  lines: CartLine[];
  wishlist: number[];
  totalItems: number;
  addItem: (id: number, qty?: number) => void;
  removeItem: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: number) => void;
  clearWishlist: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = "techman-amt-cart";
const WISHLIST_KEY = "techman-amt-wishlist";

export function CartProvider({ children, catalog, settings }: { children: React.ReactNode; catalog: Product[]; settings: StoreSettings }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const cartRaw = localStorage.getItem(CART_KEY);
      const wishlistRaw = localStorage.getItem(WISHLIST_KEY);
      if (cartRaw) setLines(JSON.parse(cartRaw));
      if (wishlistRaw) setWishlist(JSON.parse(wishlistRaw));
    } catch {
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(WISHLIST_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [lines, wishlist, hydrated]);

  const addItem = useCallback((id: number, qty = 1) => setLines((current) => {
    const product = catalog.find((item) => item.id === id);
    if (!product || product.stock <= 0) return current;
    const existing = current.find((line) => line.id === id);
    if (existing) return current.map((line) => line.id === id ? { ...line, qty: Math.min(line.qty + qty, Math.max(product.stock, 1)) } : line);
    return [...current, { id, qty: Math.min(qty, Math.max(product.stock, 1)) }];
  }), [catalog]);

  const removeItem = useCallback((id: number) => setLines((current) => current.filter((line) => line.id !== id)), []);

  const setQty = useCallback((id: number, qty: number) => setLines((current) => {
    const product = catalog.find((item) => item.id === id);
    if (!product) return current.filter((line) => line.id !== id);
    if (qty <= 0) return current.filter((line) => line.id !== id);
    return current.map((line) => line.id === id ? { ...line, qty: Math.min(qty, Math.max(product.stock, 1)) } : line);
  }), [catalog]);

  const clearCart = useCallback(() => setLines((current) => current.length ? [] : current), []);
  const toggleWishlist = useCallback((id: number) => setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]), []);
  const clearWishlist = useCallback(() => setWishlist((current) => current.length ? [] : current), []);

  const value = useMemo<CartContextValue>(() => ({
    catalog,
    settings,
    lines,
    wishlist,
    totalItems: lines.reduce((sum, line) => sum + line.qty, 0),
    addItem,
    removeItem,
    setQty,
    clearCart,
    toggleWishlist,
    clearWishlist,
  }), [catalog, settings, lines, wishlist, addItem, removeItem, setQty, clearCart, toggleWishlist, clearWishlist]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
