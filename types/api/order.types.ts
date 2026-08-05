// ==========================================
// Shared order / checkout / payment shapes
// ==========================================

export interface OrderAddress {
  id?: string;
  fullName: string;
  email?: string | null;
  phone: string;
  addressLine1: string; 
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderProductSummary {
  id: string;
  name: string;
  slug: string;
  price: number | null;
  images: { url: string }[];
}

export interface OrderVariantSummary {
  id: string;
  size: string;
  price: number;
  stock: number;
}

export interface OrderItemBase {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  price: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemWithRelations extends OrderItemBase {
  product: OrderProductSummary | null;
  variant: OrderVariantSummary | null;
}

export interface OrderSummary {
  id: string;
  userId: string;
  totalAmount: number;
  status: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  razorpaySignature: string | null;
  paymentCaptured: boolean | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItemWithRelations[];
  address: OrderAddress;
}

// ==========================================
// GET /api/checkout
// ==========================================
export interface CheckoutCartSummaryItem {
  id: string;
  cartId: string;
  productId: string | null;
  variantId: string | null;
  quantity: number;
  product: OrderProductSummary | null;
  variant: OrderVariantSummary | null;
}

export interface CheckoutCartSummary {
  items: CheckoutCartSummaryItem[];
  itemCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface CheckoutUserSummary {
  name: string | null;
  email: string;
}

export interface CheckoutGetResponse {
  success: boolean;
  data: {
    cart: CheckoutCartSummary;
    addresses: OrderAddress[];
    user: CheckoutUserSummary;
  };
}

// ==========================================
// POST /api/checkout
// ==========================================
export interface CheckoutPostResponse {
  success: boolean;
  message: string;
  order: {
    id: string;
    totalAmount: number;
    razorpayOrderId: string;
    razorpayKeyId: string | undefined;
  };
}

// ==========================================
// GET /api/orders
// ==========================================
export interface OrderListItem extends Omit<OrderSummary, "items" | "address"> {
  items: {
    id: string;
    orderId: string;
    productId: string;
    variantId: string | null;
    price: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    product: {
      id: string;
      name: string;
      slug: string;
      images: { url: string }[];
    };
    variant: {
      size: string;
    } | null;
  }[];
  address: OrderAddress;
}

export interface OrdersGetResponse {
  success: boolean;
  message: string;
  page: number;
  totalPages: number;
  totalItems: number;
  orders: OrderListItem[];
}

// ==========================================
// POST /api/payment/verify
// ==========================================
export interface PaymentVerifyRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderId: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  message: string;
  orderId?: string;
  requiresRefund?: boolean;
  errors?: string[];
}
 