import React, { createContext, useContext, useState, useEffect } from "react";
import type { CartItem } from "../types";

interface CartContextType {
  items: CartItem[];
  addItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    if (raw) {
      try {
        setItems(JSON.parse(raw));
      } catch {}
    }
    setLoading(false);
  }, []);

  const addItem = (productId: string, quantity: number) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === productId);
      let next = prev;
      if (existing) {
        next = prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i);
      } else {
        next = [...prev, { id: crypto.randomUUID(), productId, name: "Item", price: 0, quantity, unit: "" }];
      }
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.productId !== productId);
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prev => {
      const next = prev
        .map(i => i.productId === productId ? { ...i, quantity } : i)
        .filter(i => i.quantity > 0);
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
