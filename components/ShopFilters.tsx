// components/ShopFilters.tsx

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

export function ShopFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    gender: true,
    price: true,
    sort: true,
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    // Reset to page 1 when filters change
    params.delete('page')
    
    router.push(`/shop?${params.toString()}`)
  }

  const clearAllFilters = () => {
    router.push('/shop')
  }

  const hasActiveFilters = Array.from(searchParams.keys()).some(
    (key) => key !== 'page'
  )

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <X className="h-4 w-4" />
          Clear All Filters
        </button>
      )}

      {/* Sort */}
      <div className="border-b pb-6">
        <button
          onClick={() => toggleSection('sort')}
          className="flex w-full items-center justify-between text-sm font-semibold text-gray-900"
        >
          Sort By
          {expandedSections.sort ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        
        {expandedSections.sort && (
          <div className="mt-4 space-y-2">
            {[
              { label: 'Newest', value: 'newest' },
              { label: 'Price: Low to High', value: 'price_asc' },
              { label: 'Price: High to Low', value: 'price_desc' },
              { label: 'Best Rating', value: 'rating' },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="sort"
                  value={option.value}
                  checked={searchParams.get('sort') === option.value}
                  onChange={(e) => updateFilter('sort', e.target.value)}
                  className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Gender */}
      <div className="border-b pb-6">
        <button
          onClick={() => toggleSection('gender')}
          className="flex w-full items-center justify-between text-sm font-semibold text-gray-900"
        >
          Gender
          {expandedSections.gender ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        
        {expandedSections.gender && (
          <div className="mt-4 space-y-2">
            {[
              { label: 'All', value: null },
              { label: 'Men', value: 'MEN' },
              { label: 'Women', value: 'WOMEN' },
              { label: 'Unisex', value: 'UNISEX' },
            ].map((option) => (
              <label
                key={option.label}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  name="gender"
                  value={option.value || ''}
                  checked={
                    option.value
                      ? searchParams.get('gender') === option.value
                      : !searchParams.get('gender')
                  }
                  onChange={() => updateFilter('gender', option.value)}
                  className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b pb-6">
        <button
          onClick={() => toggleSection('price')}
          className="flex w-full items-center justify-between text-sm font-semibold text-gray-900"
        >
          Price Range
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        
        {expandedSections.price && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">Min</label>
                <input
                  type="number"
                  placeholder="₹0"
                  value={searchParams.get('minPrice') || ''}
                  onChange={(e) =>
                    updateFilter('minPrice', e.target.value || null)
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600">Max</label>
                <input
                  type="number"
                  placeholder="₹10000"
                  value={searchParams.get('maxPrice') || ''}
                  onChange={(e) =>
                    updateFilter('maxPrice', e.target.value || null)
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>
            </div>
            
            {/* Quick Price Filters */}
            <div className="space-y-2">
              <p className="text-xs text-gray-600">Quick Select</p>
              {[
                { label: 'Under ₹500', min: null, max: '50000' },
                { label: '₹500 - ₹1000', min: '50000', max: '100000' },
                { label: '₹1000 - ₹2000', min: '100000', max: '200000' },
                { label: 'Above ₹2000', min: '200000', max: null },
              ].map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString())
                    if (range.min) params.set('minPrice', range.min)
                    else params.delete('minPrice')
                    if (range.max) params.set('maxPrice', range.max)
                    else params.delete('maxPrice')
                    params.delete('page')
                    router.push(`/shop?${params.toString()}`)
                  }}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}