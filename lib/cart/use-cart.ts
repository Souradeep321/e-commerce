"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CartWithTotals,
  CartResponse,
  CartItem,
  CartItemProduct,
  CartItemVariant,
} from "@/types/api/cart.types";
import { CartItemInput } from "@/schemas/cart.schema";
import { getCart, addToCart, updateCartItem, clearCart } from "@/lib/api";
import { cartKeys } from "@/lib/query/cart-keys";
import { recomputeCartTotals } from "@/lib/cart/cart-math";
import { notifyCartUpdated } from "@/lib/cart/cart-broadcast";

export interface AddOptimisticContext {
  product: Pick<CartItemProduct, "id" | "name" | "slug" | "price" | "images">;
  variant?: CartItemVariant;
}

interface MutationContext {
  previousCart: CartWithTotals | undefined;
}

export function useCart() {
  const queryClient = useQueryClient();

  const { data: cart, isLoading: loading } = useQuery({
    queryKey: cartKeys.all,
    queryFn: async () => (await getCart()).cart,
  });

  const addMutation = useMutation({
    scope: { id: "cart" },
    mutationFn: (vars: { data: CartItemInput; optimisticContext?: AddOptimisticContext }) =>
      addToCart(vars.data),
    onMutate: async (vars): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: cartKeys.all });
      const previousCart = queryClient.getQueryData<CartWithTotals>(cartKeys.all);

      if (previousCart) {
        const { data, optimisticContext } = vars;
        const variantId = data.productVariantId ?? null;
        const existingIndex = previousCart.items.findIndex(
          (item) => item.productId === data.productId && item.variantId === variantId
        );

        let nextItems: CartItem[];
        if (existingIndex !== -1) {
          nextItems = previousCart.items.map((item, i) =>
            i === existingIndex ? { ...item, quantity: item.quantity + data.quantity } : item
          );
        } else if (optimisticContext) {
          const newItem: CartItem = {
            id: `optimistic-${Date.now()}`,
            cartId: previousCart.id,
            productId: data.productId ?? null,
            variantId,
            quantity: data.quantity,
            product: optimisticContext.product,
            variant: optimisticContext.variant ?? null,
          };
          nextItems = [...previousCart.items, newItem];
        } else {
          nextItems = previousCart.items;
        }

        queryClient.setQueryData(cartKeys.all, recomputeCartTotals({ ...previousCart, items: nextItems }));
      }

      return { previousCart };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCart) queryClient.setQueryData(cartKeys.all, context.previousCart);
    },
    onSuccess: (res) => {
      queryClient.setQueryData(cartKeys.all, res.cart);
      notifyCartUpdated();
    },
  });

  const updateMutation = useMutation({
    scope: { id: "cart" },
    mutationFn: (vars: { itemId: string; quantity: number }) => updateCartItem(vars.itemId, vars.quantity),
    onMutate: async ({ itemId, quantity }): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: cartKeys.all });
      const previousCart = queryClient.getQueryData<CartWithTotals>(cartKeys.all);

      if (previousCart) {
        const nextItems =
          quantity === 0
            ? previousCart.items.filter((item) => item.id !== itemId)
            : previousCart.items.map((item) => (item.id === itemId ? { ...item, quantity } : item));
        queryClient.setQueryData(cartKeys.all, recomputeCartTotals({ ...previousCart, items: nextItems }));
      }

      return { previousCart };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCart) queryClient.setQueryData(cartKeys.all, context.previousCart);
    },
    onSuccess: (res) => {
      queryClient.setQueryData(cartKeys.all, res.cart);
      notifyCartUpdated();
    },
  });

  const clearMutation = useMutation({
    scope: { id: "cart" },
    mutationFn: clearCart,
    onMutate: async (): Promise<MutationContext> => {
      await queryClient.cancelQueries({ queryKey: cartKeys.all });
      const previousCart = queryClient.getQueryData<CartWithTotals>(cartKeys.all);
      if (previousCart) {
        queryClient.setQueryData(cartKeys.all, { ...previousCart, items: [], itemCount: 0, subtotal: 0 });
      }
      return { previousCart };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousCart) queryClient.setQueryData(cartKeys.all, context.previousCart);
    },
    onSuccess: () => {
      notifyCartUpdated();
      queryClient.invalidateQueries({ queryKey: cartKeys.all }); // ClearCartResponse has no cart field
    },
  });

  async function addItem(data: CartItemInput, optimisticContext?: AddOptimisticContext): Promise<CartResponse> {
    return addMutation.mutateAsync({ data, optimisticContext });
  }
  async function updateItem(itemId: string, quantity: number): Promise<CartResponse> {
    return updateMutation.mutateAsync({ itemId, quantity });
  }
  async function removeItem(itemId: string): Promise<void> {
    await updateItem(itemId, 0);
  }
  async function clearAll(): Promise<void> {
    await clearMutation.mutateAsync();
  }
  async function refresh(): Promise<void> {
    await queryClient.cancelQueries({ queryKey: cartKeys.all });
    await queryClient.invalidateQueries({ queryKey: cartKeys.all });
  }

  return {
    cart: cart ?? null,
    loading,
    itemCount: cart?.itemCount ?? 0,
    addItem,
    updateItem,
    removeItem,
    clearAll,
    refresh,
  };
}