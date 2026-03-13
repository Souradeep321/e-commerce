import {
  Product,
  ProductsResponse,
  ProductFilters,
  ProductDetail,
  ProductDetailResponse
} from '@/types/product'
import config from '@/lib/constants'

const { API_URL } = config


export async function getProducts(
  filters: ProductFilters = {}
): Promise<{
  products: Product[]
  totalPages: number
  totalItems: number
  page: number
}> {
  try {
    const params = new URLSearchParams()

    if (filters.category) params.set('category', filters.category)
    if (filters.gender) params.set('gender', filters.gender)
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString())
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString())
    if (filters.sort) params.set('sort', filters.sort)
    if (filters.page) params.set('page', filters.page.toString())
    if (filters.limit) params.set('limit', filters.limit.toString())

    const res = await fetch(`${API_URL}/api/products?${params}`, {
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`)
    }

    const data: ProductsResponse = await res.json()

    return {
      products: data.products || [],
      totalPages: data.totalPages || 0,
      totalItems: data.totalItems || 0,
      page: data.page || 1,
    }
  } catch (error) {
    console.error('getProducts error:', error)
    return {
      products: [],
      totalPages: 0,
      totalItems: 0,
      page: 1,
    }
  }
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!res.ok) {
      if (res.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch product: ${res.status}`)
    }

    const data: ProductDetailResponse = await res.json()
    return data.product
  } catch (error) {
    console.error(`getProductBySlug(${slug}) error:`, error)
    return null
  }
}
