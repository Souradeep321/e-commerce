import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(priceInPaise: number | null): string {
  if (!priceInPaise) return 'Price not available'
  return `₹${(priceInPaise / 100).toFixed(2)}`
}

export function formatPriceRange(
  minPrice: number | null,
  maxPrice: number | null
): string {
  if (!minPrice && !maxPrice) return 'Price not available'
  if (!maxPrice || minPrice === maxPrice) return formatPrice(minPrice)
  return `₹${(minPrice! / 100).toFixed(0)} - ₹${(maxPrice / 100).toFixed(0)}`
}
