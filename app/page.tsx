import { Suspense } from "react";
import { Hero } from "@/components/home/hero";
import { CategoryGrid } from "@/components/home/category-grid";
import { CategoryGridSkeleton } from "@/components/home/category-grid-skeleton";
import { ProductSection } from "@/components/home/product-section";
import { ProductSectionSkeleton } from "@/components/home/product-section-skeleton";
import { PromoBanner } from "@/components/home/promo-banner";
import { ValuePropStrip } from "@/components/home/value-prop-strip";
import {
  mockCategories,
  mockRecommendedProducts,
  mockNewArrivalProducts,
} from "@/lib/mock-data";
import { getCategories,getProducts } from "@/lib/api";
// import { getProducts } from "@/lib/api/products";

/**
 * TEMPORARY async wrappers around mock data.
 * These exist as separate components (not awaited directly in Home)
 * so each Suspense boundary below can stream independently once real
 * fetches replace the mock arrays — one slow section won't block the
 * rest of the page from painting.
 *
 * Swap point: replace the mock array with the real await call,
 * marked below with TODO.
 */



async function Categories() {
  const { categories } = await getCategories();
  return <CategoryGrid categories={categories} />;
}

async function RecommendedProducts() {
  // TODO: await await getProducts({ sort: "latest", ourRecommendation: true,});
  const products =  await getProducts({ sort: "latest", ourRecommendation: true,}); 
  console.log("products", products);
  console.log("products", products.products);
  return <ProductSection title="Recommended" products={products.products} />;
}

async function NewArrivals() {
   // TODO: await getProducts({ sort: "latest" })
  const products =  await getProducts({ sort: "latest", limit: 10}); 
  return (
    <ProductSection
      title="New Arrivals"
      products={products.products}
      viewAllHref="/products?sort=latest"
    />
  );
}

export default function Home() {
  return (
    <main className="bg-white">
      <Hero />

      <Suspense fallback={<CategoryGridSkeleton />}>
        <Categories />
      </Suspense>

      <Suspense fallback={<ProductSectionSkeleton />}>
        <RecommendedProducts />
      </Suspense>

      <PromoBanner headline="Less, but better." imageSrc="/images/promo-banner.avif" />

      <Suspense fallback={<ProductSectionSkeleton />}>
        <NewArrivals />
      </Suspense>

      <ValuePropStrip />
    </main>
  );
}