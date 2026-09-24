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
  compare: number[];
  totalItems: number;
  addItem: (id: number, qty?: number) => void;
  removeItem: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: number) => void;
  clearWishlist: () => void;
  toggleCompare: (id: number) => void;
  clearCompare: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const CART_KEY = "techman-amt-cart";
const WISHLIST_KEY = "techman-amt-wishlist";
const COMPARE_KEY = "techman-amt-compare";

export function CartProvider({ children, catalog, settings }: { children: React.ReactNode; catalog: Product[]; settings: StoreSettings }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [compare, setCompare] = useState<number[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const cartRaw = localStorage.getItem(CART_KEY);
      const wishlistRaw = localStorage.getItem(WISHLIST_KEY);
      const compareRaw = localStorage.getItem(COMPARE_KEY);
      if (cartRaw) setLines(JSON.parse(cartRaw));
      if (wishlistRaw) setWishlist(JSON.parse(wishlistRaw));
      if (compareRaw) setCompare(JSON.parse(compareRaw));
    } catch {
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(WISHLIST_KEY);
      localStorage.removeItem(COMPARE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(lines));
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compare));
  }, [lines, wishlist, compare, hydrated]);

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
  const toggleCompare = useCallback((id: number) => setCompare((current) => {
    if (current.includes(id)) return current.filter((item) => item !== id);
    if (current.length >= 4) return current;
    return [...current, id];
  }), []);
  const clearCompare = useCallback(() => setCompare((current) => current.length ? [] : current), []);

  const value = useMemo<CartContextValue>(() => ({
    catalog,
    settings,
    lines,
    wishlist,
    compare,
    totalItems: lines.reduce((sum, line) => sum + line.qty, 0),
    addItem,
    removeItem,
    setQty,
    clearCart,
    toggleWishlist,
    clearWishlist,
    toggleCompare,
    clearCompare,
  }), [catalog, settings, lines, wishlist, compare, addItem, removeItem, setQty, clearCart, toggleWishlist, clearWishlist, toggleCompare, clearCompare]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
