// ==========================================
// Shared building blocks
// ==========================================
export interface CartItemProduct {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  minPrice?: number | null; // present in GET, not always in POST/PATCH's select
  maxPrice?: number | null;
  images: { url: string }[];
}

export interface CartItemVariant {
  id: string;
  size: string;
  price: number;
  stock: number;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string | null;
  variantId: string | null;
  quantity: number;
  product: CartItemProduct | null;
  variant: CartItemVariant | null;
}

export interface Cart {
  id: string;
  userId: string | null;
  sessionId: string | null;
  status: "ACTIVE" | "CONVERTED";
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}


// GET /api/cart — includes computed totals
export interface CartWithTotals extends Cart {
  itemCount: number;
  subtotal: number;
}

// Used by GET, POST, and PATCH — all now return the same shape
export interface CartResponse {
  success: boolean;
  message: string;
  cart: CartWithTotals;
}

// DELETE /api/cart
export interface ClearCartResponse {
  success: boolean;
  message: string;
}

// ==========================================
// POST /api/cart/merge
// (already defined in auth.types.ts as CartMergeResponse — reuse that)
// ==========================================