// components/ProductDetail.tsx - Product detail page component
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Star,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Minus,
  Plus,
  MessageCircle,
  Heart,
  Share2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ProductDetail as ProductDetailType } from '@/types/product'
import { formatPrice } from '@/lib/utils'

interface ProductDetailProps {
  product: ProductDetailType
}

// TODO: change the styling of this component to match the design with products/slug/page.tsx 

export function ProductDetail({ product }: ProductDetailProps) {
  // State
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [quantity, setQuantity] = useState<number>(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details')

  // Calculate average rating if reviews exist
  const averageRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
      product.reviews.length
      : 0

  // Calculate rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: product.reviews.filter((r) => r.rating === rating).length,
  }))

  const handleAddToCart = () => {
    // TODO: Add to cart logic
    console.log('Add to cart:', {
      productId: product.id,
      variantId: selectedVariant.id,
      quantity,
    })
  }

  return (
    <>
      {/* Breadcrumb */}
      <nav
        className="mb-6 flex items-center gap-1.5 text-xs text-gray-600 sm:mb-8 sm:text-sm"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="transition-colors hover:text-gray-900">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        {product.category && (
          <>
            <Link
              href={`/category/${product.category.slug}`}
              className="capitalize transition-colors hover:text-gray-900"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="h-3 w-3" />
          </>
        )}
        <span className="truncate text-gray-900">{product.name}</span>
      </nav>

      {/* Main Content Grid */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left: Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={product.images[selectedImageIndex].url}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Badges */}
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.ourRecommendation && (
                <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                  Recommended
                </Badge>
              )}
              {product.gender && (
                <Badge variant="secondary" className="bg-white/90">
                  {product.gender}
                </Badge>
              )}
            </div>
          </div>

          {/* Thumbnail Images - Horizontal on mobile, Vertical on desktop */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImageIndex(index)}
                  onMouseEnter={() => setSelectedImageIndex(index)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${selectedImageIndex === index
                    ? 'border-gray-900'
                    : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                >
                  <Image
                    src={image.url}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col gap-6">
          {/* Product Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            {product.category && (
              <p className="mt-2 text-sm text-gray-600">
                {product.category.name}
              </p>
            )}

            {/* Rating */}
            {product.reviews.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(averageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-gray-200 text-gray-200'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">
                  {averageRating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-600">
                  ({product.reviews.length} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-gray-700">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(selectedVariant.price)}
            </span>
            {/* TODO: Add original price if discount exists */}
          </div>

          {/* Size Selection */}
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-900">
              Size: {selectedVariant.size}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => {
                    setSelectedVariant(variant)
                    setQuantity(1) // Reset quantity when changing size
                  }}
                  disabled={variant.stock === 0}
                  className={`flex h-11 min-w-11 items-center justify-center rounded-lg border-2 px-4 text-sm font-medium transition-all ${selectedVariant.id === variant.id
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : variant.stock === 0
                      ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 line-through'
                      : 'border-gray-300 hover:border-gray-900'
                    }`}
                >
                  {variant.size}
                </button>
              ))}
            </div>

            {/* Stock Warning */}
            {selectedVariant.stock === 0 ? (
              <p className="mt-2 text-xs text-red-600">
                Out of stock
              </p>
            ) : selectedVariant.stock <= 5 ? (
              <p className="mt-2 text-xs text-orange-600">
                Only {selectedVariant.stock} left in stock!
              </p>
            ) : null}
          </div>

          {/* Quantity Selector */}
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-900">
              Quantity
            </p>
            <div className="inline-flex items-center rounded-lg border border-gray-300">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-gray-100"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="flex h-10 `min-w-12 items-center justify-center text-sm font-semibold">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(selectedVariant.stock, quantity + 1))
                }
                disabled={quantity >= selectedVariant.stock}
                className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={selectedVariant.stock === 0}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <ShoppingBag className="h-5 w-5" />
              {selectedVariant.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* Secondary Actions Row */}
            <div className="grid grid-cols-3 gap-3">
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Chat</span>
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Wishlist</span>
              </button>
              <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            {[
              {
                icon: Truck,
                title: 'Free Delivery',
                desc: 'Above ₹999',
              },
              {
                icon: RotateCcw,
                title: 'Easy Returns',
                desc: '15 days',
              },
              {
                icon: ShieldCheck,
                title: 'Authentic',
                desc: '100% genuine',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center gap-1.5 text-center"
              >
                <feature.icon className="h-5 w-5 text-gray-600" />
                <p className="text-xs font-semibold text-gray-900">
                  {feature.title}
                </p>
                <p className="text-[10px] text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Section - Details & Reviews */}
      <div className="mt-12 border-t pt-8">
        {/* Tab Headers */}
        <div className="flex gap-8 border-b">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-4 text-sm font-semibold ${activeTab === 'details'
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 text-sm font-semibold ${activeTab === 'reviews'
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Reviews ({product.reviews.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'details' && (
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900">
                Product Information
              </h3>
              <p className="mt-4 text-gray-700">{product.description}</p>

              {/* Additional product details can go here */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Category</p>
                  <p className="text-sm text-gray-600">{product.category.name}</p>
                </div>
                {product.gender && (
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Gender</p>
                    <p className="text-sm text-gray-600">{product.gender}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Review Stats */}
              {product.reviews.length > 0 ? (
                <>
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-12">
                    {/* Overall Rating */}
                    <div className="text-center sm:text-left">
                      <div className="flex items-center justify-center gap-2 sm:justify-start">
                        <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                        <span className="text-3xl font-bold">
                          {averageRating.toFixed(1)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {product.reviews.length} review{product.reviews.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {/* Rating Bars */}
                    <div className="flex-1 space-y-2">
                      {ratingCounts.map(({ rating, count }) => {
                        const percentage =
                          product.reviews.length > 0
                            ? (count / product.reviews.length) * 100
                            : 0
                        return (
                          <div key={rating} className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">{rating}</span>
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                              <div
                                className="h-full bg-amber-400"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div className="space-y-6 border-t pt-6">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-gray-200 text-gray-200'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium">
                            {review.user.name || 'Anonymous'}
                          </span>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-700">{review.comment}</p>
                        )}
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
