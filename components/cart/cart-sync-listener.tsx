"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cartKeys } from "@/lib/query/cart-keys";
import { subscribeCartUpdates } from "@/lib/cart/cart-broadcast";

export function CartSyncListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    return subscribeCartUpdates(() => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    });
  }, [queryClient]);

  return null;
}