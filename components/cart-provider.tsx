"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

export type CartLine = { id: number; qty: number };

type CartContextValue = {
  catalog: Product[];
  lines: CartLine[];
  totalItems: number;
  addItem: (id: number, qty?: number) => void;
  removeItem: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "techman-amt-cart";

export function CartProvider({ children, catalog }: { children: React.ReactNode; catalog: Product[] }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

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

  const value = useMemo<CartContextValue>(() => ({
    catalog,
    lines,
    totalItems: lines.reduce((sum, line) => sum + line.qty, 0),
    addItem,
    removeItem,
    setQty,
    clearCart,
  }), [catalog, lines, addItem, removeItem, setQty, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
