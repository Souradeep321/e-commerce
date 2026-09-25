// "use client";

// import { createContext, useContext, useEffect, useState, useCallback } from "react";
// import { CartWithTotals,CartResponse, } from "@/types/api/cart.types";
// import { CartItemInput } from "@/schemas/cart.schema";
// import { getCart, addToCart, updateCartItem, clearCart } from "@/lib/api";

// interface CartContextValue {
//     cart: CartWithTotals | null;
//     loading: boolean;
//     itemCount: number;
//     isDrawerOpen: boolean;
//     openDrawer: () => void;
//     closeDrawer: () => void;
//     addItem: (data: CartItemInput) => Promise<any>;
//     updateItem: (itemId: string, quantity: number) => Promise<void>;
//     removeItem: (itemId: string) => Promise<void>;
//     clearAll: () => Promise<void>;
//     refresh: () => Promise<void>;
// }

// const CartContext = createContext<CartContextValue | null>(null);

// export function CartProvider({ children }: { children: React.ReactNode }) {
//     const [cart, setCart] = useState<CartWithTotals | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [isDrawerOpen, setIsDrawerOpen] = useState(false);

//     const refresh = useCallback(async () => {
//         try {
//             const res = await getCart();
//             setCart(res.cart);
//         } catch (err) {
//             console.error("Failed to fetch cart:", err);
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         refresh();
//     }, [refresh]);

//     // addToCart/updateCartItem both return the full updated cart —
//     // apply it directly rather than refetching. clearCart doesn't
//     // (ClearCartResponse has no cart field), so that one refetches.
//     async function addItem(data: CartItemInput) {
//         const res = await addToCart(data); // throws ApiError — caller's catch handles it
//         setCart(res.cart);
//     }

//     async function updateItem(itemId: string, quantity: number) {
//         const res = await updateCartItem(itemId, quantity);
//         setCart(res.cart);
//     }

//     async function removeItem(itemId: string) {
//         // quantity: 0 is handled as a delete server-side (see lib/api/cart.ts)
//         const res = await updateCartItem(itemId, 0);
//         setCart(res.cart);
//     }

//     async function clearAll() {
//         await clearCart();
//         await refresh();
//     }

//     return (
//         <CartContext.Provider
//             value={{
//                 cart,
//                 loading,
//                 itemCount: cart?.itemCount ?? 0,
//                 isDrawerOpen,
//                 openDrawer: () => setIsDrawerOpen(true),
//                 closeDrawer: () => setIsDrawerOpen(false),
//                 addItem,
//                 updateItem,
//                 removeItem,
//                 clearAll,
//                 refresh,
//             }}
//         >
//             {children}
//         </CartContext.Provider>
//     );
// }

// export function useCart() {
//     const ctx = useContext(CartContext);
//     if (!ctx) throw new Error("useCart must be used within CartProvider");
//     return ctx;
// }

"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { CartWithTotals, CartResponse } from "@/types/api/cart.types";
import { CartItemInput } from "@/schemas/cart.schema";
import { getCart, addToCart, updateCartItem, clearCart } from "@/lib/api";

interface CartContextValue {
  cart: CartWithTotals | null;
  loading: boolean;
  itemCount: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (data: CartItemInput) => Promise<CartResponse>;
  updateItem: (itemId: string, quantity: number) => Promise<CartResponse>;
  removeItem: (itemId: string) => Promise<void>;
  clearAll: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartWithTotals | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Every fetch/mutation gets a ticket. Only the response whose ticket
  // matches the LATEST issued ticket is allowed to setCart. This is what
  // actually fixes the sync bug: the mount refresh() and a click-triggered
  // addItem()/refresh() can resolve out of order, and without this guard
  // the slower one (often the mount fetch) silently overwrites the
  // faster, more-correct one.
  const requestTicket = useRef(0);

  const refresh = useCallback(async () => {
    const ticket = ++requestTicket.current;
    try {
      const res = await getCart();
      if (ticket !== requestTicket.current) return; // superseded — drop it
      setCart(res.cart);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      if (ticket === requestTicket.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // addToCart/updateCartItem both return the full updated cart in their
  // response — apply it directly. Never call refresh() after these; a
  // second round trip is exactly what reopens the race window.
  async function addItem(data: CartItemInput) {
    const ticket = ++requestTicket.current;
    const res = await addToCart(data); // throws ApiError — caller's catch handles it
    if (ticket === requestTicket.current) setCart(res.cart);
    return res;
  }

  async function updateItem(itemId: string, quantity: number) {
    const ticket = ++requestTicket.current;
    const res = await updateCartItem(itemId, quantity);
    if (ticket === requestTicket.current) setCart(res.cart);
    return res;
  }

  async function removeItem(itemId: string) {
    // quantity: 0 is handled as a delete server-side
    await updateItem(itemId, 0);
  }

  async function clearAll() {
    await clearCart(); // ClearCartResponse has no cart field — refetch
    await refresh();
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        itemCount: cart?.itemCount ?? 0,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        addItem,
        updateItem,
        removeItem,
        clearAll,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}