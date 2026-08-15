import { ProductListItem } from "@/types/api/product.types";

/**
 * Prices are stored in paise (smallest currency unit) in the DB,
 * per schema.prisma comments ("price Int? // base price in paise").
 * Every place a price reaches the UI, it must go through this.
 */
export function formatPaise(paise: number): string {
  const rupees = paise / 100;
  return `₹${rupees.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * A product either has a flat `price`, or (when it has variants)
 * `price` is null and `minPrice`/`maxPrice` are set instead.
 * This returns the right display string for either case.
 */
export function formatProductPrice(
  product: Pick<ProductListItem, "price" | "minPrice" | "maxPrice">
): string {
  if (product.price !== null) {
    return formatPaise(product.price);
  }

  if (product.minPrice !== null && product.maxPrice !== null) {
    if (product.minPrice === product.maxPrice) {
      // all variants happen to cost the same — no need to show a range
      return formatPaise(product.minPrice);
    }
    return `${formatPaise(product.minPrice)} – ${formatPaise(product.maxPrice)}`;
  }

  // Shouldn't happen if data is well-formed (superRefine in product.schema.ts
  // enforces price XOR variants), but don't crash the UI if it does.
  return "Price unavailable";
}

/**
 * "4.3" not "4.333333" — ratings are already pre-rounded server-side
 * (see route.ts: Number(averageRating.toFixed(1))), but this guards
 * the mock data path too, where I might not bother rounding by hand.
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}