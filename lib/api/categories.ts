// import { Category } from '@/types/category'

// export async function getCategories(): Promise<Category[]> {
//     const res = await fetch('http://localhost:3000/api/categories', {
//         // cache: 'no-store', // Disable caching to always fetch fresh data
//         next: { revalidate: 3600 } // refreshes every 1 hour
//     })

//     if (!res.ok) {
//         throw new Error('Failed to fetch categories')
//     }

//     const data = await res.json()
//     return data.categories
// }

// lib/api/categories.ts

import { Category, CategoryResponse } from '@/types/category'
import config from '@/lib/constants'

const { API_URL } = config

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      next: { revalidate: 3600 },
    })
    
    if (!res.ok) throw new Error('Failed to fetch categories')
    
    const data: CategoryResponse = await res.json()
    return data.categories
  } catch (error) {
    console.error('getCategories error:', error)
    return []
  }
}

export async function getCategory(slug: string): Promise<Category | null> {
  try {
    const res = await fetch(`${API_URL}/api/categories/${slug}`, {
      next: { revalidate: 1800 },
    })
    
    if (!res.ok) return null
    
    const data = await res.json()
    return data.category
  } catch (error) {
    console.error('getCategory error:', error)
    return null
  }
}