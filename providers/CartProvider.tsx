"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { CartWithTotals } from "@/types/api/cart.types";
import { CartItemInput } from "@/schemas/cart.schema";
import { getCart, addToCart, updateCartItem, clearCart } from "@/lib/api";

interface CartContextValue {
    cart: CartWithTotals | null;
    loading: boolean;
    itemCount: number;
    isDrawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    addItem: (data: CartItemInput) => Promise<void>;
    updateItem: (itemId: string, quantity: number) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    clearAll: () => Promise<void>;
    refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartWithTotals | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const refresh = useCallback(async () => {
        try {
            const res = await getCart();
            setCart(res.cart);
        } catch (err) {
            console.error("Failed to fetch cart:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    // addToCart/updateCartItem both return the full updated cart —
    // apply it directly rather than refetching. clearCart doesn't
    // (ClearCartResponse has no cart field), so that one refetches.
    async function addItem(data: CartItemInput) {
        const res = await addToCart(data); // throws ApiError — caller's catch handles it
        setCart(res.cart);
    }

    async function updateItem(itemId: string, quantity: number) {
        const res = await updateCartItem(itemId, quantity);
        setCart(res.cart);
    }

    async function removeItem(itemId: string) {
        // quantity: 0 is handled as a delete server-side (see lib/api/cart.ts)
        const res = await updateCartItem(itemId, 0);
        setCart(res.cart);
    }

    async function clearAll() {
        await clearCart();
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