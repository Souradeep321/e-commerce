import { HeroSection } from "@/components/HeroSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { PromoBanner } from "@/components/PromoBanner";

// Types
import { Category } from "@/types/category";
// fetch from backend API
import { getCategories } from "@/lib/api";

// This is the main page of the application, which includes the HeroSection component.
const page = async () => {

  // TODO: Fetch categories from the backend API and pass them to the CategoryGrid component.
  const categorie = await getCategories();
  console.log('Fetching categories...', categorie) // Debug log to check if the function is being called

  const categories: Category[] = [
    {
      id: 'women',
      name: 'WOMEN',
      slug: 'women'
    },
    {
      id: 'men',
      name: 'Men',
      slug: 'men'
    },
    {
      id: 'kids',
      name: 'Kids',
      slug: 'kids'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      slug: 'accessories'
    },
  ]

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <HeroSection />
      {/* Category Grid */}
      <CategoryGrid categories={categories} />
      {/* Promo Banner */}
      <PromoBanner />
    </main>
  );
}

export default page
