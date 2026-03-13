// lib/utils.ts - Add these to your existing utils

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Product } from '@/types/product'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format price from paise to rupees
 */
export function formatPrice(priceInPaise: number | null): string {
  if (!priceInPaise) return 'Price not available'
  
  const priceInRupees = priceInPaise / 100
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(priceInRupees)
}

/**
 * Get display price for product card
 * Returns single price (not range) for cleaner UI
 * 
 * @param product - Product object
 * @returns Single price in paise
 * 
 * Logic:
 * - If has single price → use it
 * - If has variants → use minPrice (lowest price, like Amazon)
 * - Fallback → 0
 */
export function getDisplayPrice(product: Product): number {
  // Single price product
  if (product.price !== null) {
    return product.price
  }
  
  // Product with variants - show "starting from" price
  if (product.minPrice !== null) {
    return product.minPrice
  }
  
  return 0
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

