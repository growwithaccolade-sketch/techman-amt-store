"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = { id: number; qty: number };

type CartContextValue = {
  lines: CartLine[];
  totalItems: number;
  addItem: (id: number, qty?: number) => void;
  removeItem: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "techman-amt-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
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
    const existing = current.find((line) => line.id === id);
    if (existing) return current.map((line) => line.id === id ? { ...line, qty: line.qty + qty } : line);
    return [...current, { id, qty }];
  }), []);

  const removeItem = useCallback((id: number) => setLines((current) => current.filter((line) => line.id !== id)), []);

  const setQty = useCallback((id: number, qty: number) => setLines((current) =>
    qty <= 0 ? current.filter((line) => line.id !== id) : current.map((line) => line.id === id ? { ...line, qty } : line)
  ), []);

  const clearCart = useCallback(() => setLines((current) => current.length ? [] : current), []);

  const value = useMemo<CartContextValue>(() => ({
    lines,
    totalItems: lines.reduce((sum, line) => sum + line.qty, 0),
    addItem,
    removeItem,
    setQty,
    clearCart,
  }), [lines, addItem, removeItem, setQty, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
