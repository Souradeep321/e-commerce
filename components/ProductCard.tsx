// components/ProductCard.tsx - Clean card (no discount, no wishlist)
"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingBag } from 'lucide-react'
import { Product } from '@/types/product'
import { formatPrice, getDisplayPrice } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.url || null
  const displayPrice = getDisplayPrice(product)
  const hasVariants = product.price === null

  return (
    <div className="group flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-gray-100">
        <Link href={`/products/${product.slug}`} className="absolute inset-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              <span className="text-sm">No Image</span>
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
          {/* {product.isBestseller && (
            <span className="rounded-lg bg-[#e75723] px-2 py-1 text-[10px] font-bold uppercase text-white">
              Bestseller
            </span>
          )} */}
          {product.ourRecommendation && (
            <span className="rounded-lg bg-blue-600 px-2 py-1 text-[10px] font-bold uppercase text-white">
              Recommended
            </span>
          )}
        </div>

        {/* Quick Add to Cart Button */}
        <div className="absolute right-2.5 top-2.5 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.preventDefault()
              // TODO: Add to cart logic
              console.log('Add to cart:', product.id)
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg transition-colors hover:bg-gray-800"
            aria-label="Add to bag"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <Link href={`/products/${product.slug}`} className="mt-3 flex flex-col gap-1">
        {/* Category */}
        {product.category && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            {product.category.name}
          </p>
        )}

        {/* Product Name */}
        <h3 className="text-sm font-medium leading-tight text-gray-900 line-clamp-2 group-hover:text-[#e75723] transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.reviewCount && product.reviewCount > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-gray-900">
                {product.rating?.toFixed(1) || 0}
              </span>
            </div>
            <span className="text-[10px] text-gray-500">
              ({product.reviewCount.toLocaleString('en-IN')})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-0.5 flex items-center gap-1">
          <span className="text-base font-bold text-gray-900">
            {formatPrice(displayPrice)}
          </span>
          {/* Show "onwards" for variant products */}
          {hasVariants && (
            <span className="text-[10px] font-medium text-gray-500">onwards</span>
          )}
        </div>
      </Link>
    </div>
  )
}
