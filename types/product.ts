// types/product.ts - UPDATED to match your API response exactly

export interface Product {
  id: string
  name: string
  slug: string
  price: number | null        // In paise
  minPrice: number | null     // In paise
  maxPrice: number | null     // In paise
  isActive: boolean

  // ✅ Images array
  images: Array<{
    id?: string
    url: string
    publicId?: string
  }>

  // ✅ Category
  category: {
    id?: string
    name: string
    slug: string
  } | null

  // Optional fields
  description?: string
  stock?: number | null
  gender?: 'MEN' | 'WOMEN' | 'UNISEX' | null
  ourRecommendation?: boolean
  rating?: number
  reviewCount?: number
  createdAt?: string
  updatedAt?: string
}

// ✅ For product detail page (matches your API response)
export interface ProductDetail {
  id: string
  name: string
  slug: string
  description: string
  price: number | null
  stock: number | null
  isActive: boolean
  categoryId: string
  gender: 'MEN' | 'WOMEN' | 'UNISEX' | null
  minPrice: number | null
  maxPrice: number | null
  ourRecommendation: boolean
  createdAt: string
  updatedAt: string

  // ✅ Full images
  images: Array<{
    id: string
    url: string
    publicId: string
    productId: string
  }>

  // ✅ Variants (user selects size here)
  variants: Array<{
    id: string
    productId: string
    size: string
    price: number
    stock: number
  }>

  // ✅ Category
  category: {
    id: string
    name: string
    slug: string
  }

  // ✅ Reviews
  reviews: Array<{
    id: string
    rating: number
    comment: string | null
    user: {
      id: string
      name: string | null
    }
    images?: Array<{
      id: string
      url: string
    }>
    createdAt: string
  }>
}

export interface ProductFilters {
  category?: string
  gender?: 'MEN' | 'WOMEN' | 'UNISEX'
  minPrice?: number
  maxPrice?: number
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating'
  page?: number
  limit?: number
}

export interface ProductsResponse {
  success: boolean
  message?: string
  page?: number
  totalPages?: number
  totalItems?: number
  products: Product[]
}

export interface ProductDetailResponse {
  success: boolean
  message: string
  product: ProductDetail
}