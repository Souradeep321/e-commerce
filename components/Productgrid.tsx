// components/ProductGrid.tsx - Flexible grid with auto-fetch

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Product } from '@/types/product'
import { ProductCard } from '@/components/ProductCard'
import { fi } from 'zod/locales'

interface ProductGridProps {
  title: string
  subtitle: string
  filter?: 'latest' | 'recommended' | 'all'
  id?: string
  limit?: number
  category?: string
  viewAllHref?: string
  products: Product[]
}

export function ProductGrid({
  title,
  subtitle,
  filter,
  id,
  limit = 8,
  category,
  viewAllHref = '/shop',
  products }: ProductGridProps) {
  let filtered = products

  if (filter === 'recommended') {
    filtered = products.filter(p => p.ourRecommendation === true)
  }


  if (!filtered || filtered.length === 0) {
    return (
      <section id={id} className="mx-auto max-w-7xl px-4 py-12">
        <div className="text-center">
          <p className="text-gray-500">No products found.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:px-6">
      {/* Header */}
      <div className="mb-8 flex items-end justify-between sm:mb-10">
        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#e75723]">
            {subtitle}
          </span>
          <h2 className="font-serif text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {title}
          </h2>
        </div>

        {/* View All Link */}
        <Link
          href={viewAllHref}
          className="hidden items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 sm:flex"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mobile View All Button */}
      <div className="mt-8 text-center sm:hidden">
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}

// Simple skeleton for ProductGrid
export function ProductGridSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:px-6">
      <div className="mb-8">
        <div className="h-3 w-24 rounded bg-gray-200 animate-pulse mb-2" />
        <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-3/4 rounded-2xl bg-gray-200" />
            <div className="mt-3 space-y-2">
              <div className="h-3 w-16 rounded bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
              <div className="h-5 w-24 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}