import { Category } from '@/types/category'

export async function getCategories(): Promise<Category[]> {
    const res = await fetch('http://localhost:3000/api/categories', {
        // cache: 'no-store', // Disable caching to always fetch fresh data
        next: { revalidate: 3600 } // refreshes every 1 hour
    })

    if (!res.ok) {
        throw new Error('Failed to fetch categories')
    }

    const data = await res.json()
    return data.categories
}