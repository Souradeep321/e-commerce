// app/(public)/shop/page.tsx - Main shop/listing page

import { Suspense } from 'react'
import { ProductGrid,ProductGridSkeleton } from '@/components/Productgrid'
import { ShopFilters } from '@/components/ShopFilters'
import { ShopHeader } from '@/components/ShopHeader'
import { getProducts } from '@/lib/api'
import { Metadata } from 'next'
import { ProductCard } from '@/components/ProductCard'
import { Pagination } from '@/components/Pagination'

export const metadata: Metadata = {
  title: 'Shop - AURVA',
  description: 'Browse our complete collection of premium fashion products',
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string
    gender?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    page?: string
  }>
}) {
  const filters = await searchParams
  
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      {/* Page Header */}
      <ShopHeader />

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block">
          <ShopFilters />
        </aside>

        {/* Main Content */}
        <div>
          <Suspense fallback={<ProductGridSkeleton />}>
            <ShopProductsSection filters={filters} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

// Separate component for data fetching
async function ShopProductsSection({
  filters,
}: {
  filters: {
    category?: string
    gender?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
    page?: string
  }
}) {
  const { products, totalPages, totalItems, page } = await getProducts({})

  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">No products found</p>
          <p className="mt-2 text-sm text-gray-600">
            Try adjusting your filters
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Results Info */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {products.length} of {totalItems} products
        </p>
        
        {/* Sort Dropdown - Mobile */}
        <div className="lg:hidden">
          {/* TODO: Mobile sort dropdown */}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      )}
    </div>
  )
}