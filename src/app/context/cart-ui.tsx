"use client";

import { toast } from "sonner";
import React, { createContext, useContext, useEffect, useState } from "react";

import type { CartItem, CartUIContextType, Product } from "@/types";

const CartUIContext = createContext<CartUIContextType | undefined>(undefined);

export const CartUIProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hasNewItem, setHasNewItem] = useState(false);
  const [newItemCount, setNewItemCount] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        toast.success(`${product.title} a été ajouté au panier.`);

        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    if (!isOpen) {
      setHasNewItem(true);
      setNewItemCount((count) => count + 1);
    }
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, qty: number) =>
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: qty } : item))
        .filter((item) => item.quantity > 0)
    );

  const clearCart = () => {
    setCart([]);
  };

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const openCheckout = () => setIsCheckoutOpen(true);
  const closeCheckout = () => setIsCheckoutOpen(false);

  return (
    <CartUIContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isOpen,
        open,
        close,
        hasNewItem,
        setHasNewItem,
        newItemCount,
        setNewItemCount,
        isCheckoutOpen,
        openCheckout,
        closeCheckout
      }}
    >
      {children}
    </CartUIContext.Provider>
  );
};

export const useCartUI = () => {
  const context = useContext(CartUIContext);
  if (!context) {
    throw new Error("useCartUI must be used within a CartUIProvider");
  }
  return context;
};
