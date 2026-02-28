import { HeroSection } from "@/components/HeroSection";
import { CategoryGrid, CategoryGridSkeleton } from "@/components/CategoryGrid";
import { PromoBanner } from "@/components/PromoBanner";
import { Suspense } from 'react'

// Types
import { Category } from "@/types/category";

// fetch from backend API
import { getCategories } from "@/lib/api/categories";

// This is the main page of the application, which includes the HeroSection component.
const page = async () => {

  // TODO: Fetch categories from the backend API and pass them to the CategoryGrid component.
  // async function CategoriesSection() {
  //   const categories = await getCategories()
  //   console.log('Fetched categories:', categories) // Debug log to verify fetched data
  //   return <CategoryGrid categories={categories} />
  // }

  const categories: Category[] = [
    {
      id: 'women',
      name: 'WOMEN',
      slug: 'women',
      parentId: null
    },
    {
      id: 'men',
      name: 'Men',
      slug: 'men',
      parentId: null
    },
    {
      id: 'kids',
      name: 'Kids',
      slug: 'kids',
      parentId: null
    },
    {
      id: 'accessories',
      name: 'Accessories',
      slug: 'accessories',
      parentId: null
    },
  ]

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <HeroSection />
      {/* Categories Section */}
      <Suspense fallback={<CategoryGridSkeleton />}>
        <CategoryGrid categories={categories} />
      </Suspense>
      {/* Promo Banner */}
      <PromoBanner />
    </main>
  );
}



export default page
