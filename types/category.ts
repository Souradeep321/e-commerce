export interface Category {
  id: string
  name: string
  slug: string
  parentId?: string | null
}

export interface CategoryResponse {
  success: boolean
  categories: Category[]
}