import { HeroSection } from "@/components/HeroSection";
import { CategoryGrid, CategoryGridSkeleton } from "@/components/CategoryGrid";
import { PromoBanner } from "@/components/PromoBanner";
import { Suspense } from 'react'

// Types
import { Category } from "@/types/category";

// fetch from backend API
import { getCategories, getProducts } from "@/lib/api/index";
import { ProductGrid, ProductGridSkeleton } from "@/components/Productgrid";

// This is the main page of the application, which includes the HeroSection component.
const page = async () => {

  // TODO: Fetch categories from the backend API and pass them to the CategoryGrid component.
  // async function CategoriesSection() {
  //   const categories = await getCategories()
  //   console.log('Fetched categories:', categories) // Debug log to verify fetched data
  //   return <CategoryGrid categories={categories} />
  // }

  async function ProductsSection() {
    const data = await getProducts()
    console.log('Fetched products:', data) // Debug log to verify fetched data
    return <ProductGrid
      id="Latest Arrivals"
      title="Latest Arrivals"
      subtitle="Check out our newest products"
      filter="latest"
      limit={8}
      viewAllHref="/shop?sort=latest"
      products={data.products}
    />
  }

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

  // 9 demo products for testing ,with random images
  const demoProducts = [
    {
      id: '1',
      name: 'Black T-Shirt',
      slug: 'black-t-shirt',
      price: 49900,
      minPrice: null,
      maxPrice: null,
      isActive: true,
      images: [
        { url: 'https://res.cloudinary.com/demo/image/upload/v1690000001/products/black_tshirt.webp' }
      ],
      category: { name: 'T-Shirts', slug: 't-shirts' }
    },
    {
      id: '2',
      name: 'Blue Denim Jacket',
      slug: 'blue-denim-jacket',
      price: null,
      minPrice: 149900,
      maxPrice: 399900,
      isActive: true,
      images: [
        { url: 'https://res.cloudinary.com/demo/image/upload/v1690000002/products/denim_jacket.webp' }
      ],
      category: { name: 'Jackets', slug: 'jackets' }
    },
    {
      id: '3',
      name: 'Red Hoodie',
      slug: 'red-hoodie',
      price: null,
      minPrice: 49900,
      maxPrice: 220000,
      isActive: true,
      images: [
        { url: 'https://res.cloudinary.com/demo/image/upload/v1690000003/products/red_hoodie.webp' }
      ],
      category: { name: 'Hoodies', slug: 'hoodies' }
    },
    {
      id: '4',
      name: 'White Sneakers',
      slug: 'white-sneakers',
      price: 279900,
      minPrice: null,
      maxPrice: null,
      isActive: true,
      images: [
        { url: 'https://res.cloudinary.com/demo/image/upload/v1690000004/products/white_sneakers.webp' }
      ],
      category: { name: 'Footwear', slug: 'footwear' }
    },
    {
      id: '5',
      name: 'Grey Joggers',
      slug: 'grey-joggers',
      price: null,
      minPrice: 69900,
      maxPrice: 179900,
      isActive: true,
      images: [
        { url: 'https://res.cloudinary.com/demo/image/upload/v1690000005/products/grey_joggers.webp' }
      ],
      category: { name: 'Bottomwear', slug: 'bottomwear' }
    },
    {
      id: '6',
      name: 'Classic Watch',
      slug: 'classic-watch',
      price: 349900,
      minPrice: null,
      maxPrice: null,
      isActive: true,
      images: [
        { url: 'https://res.cloudinary.com/demo/image/upload/v1690000006/products/classic_watch.webp' }
      ],
      category: { name: 'Accessories', slug: 'accessories' }
    },
    {
      id: '7',
      name: 'Leather Wallet',
      slug: 'leather-wallet',
      price: 99900,
      minPrice: null,
      maxPrice: null,
      isActive: true,
      images: [
        { url: 'https://res.cloudinary.com/demo/image/upload/v1690000007/products/leather_wallet.webp' }
      ],
      category: { name: 'Accessories', slug: 'accessories' }
    },
    {
      id: '8',
      name: 'Sports Cap',
      slug: 'sports-cap',
      price: 39900,
      minPrice: null,
      maxPrice: null,
      isActive: true,
      images: [
        { url: 'https://res.cloudinary.com/demo/image/upload/v1690000008/products/sports_cap.webp' }
      ],
      category: { name: 'Caps', slug: 'caps' }
    },
    {
      id: '9',
      name: 'Formal Shirt',
      slug: 'formal-shirt',
      price: null,
      minPrice: 79900,
      maxPrice: 249900,
      isActive: true,
      images: [
        { url: 'https://res.cloudinary.com/demo/image/upload/v1690000009/products/formal_shirt.webp' }
      ],
      category: { name: 'Shirts', slug: 'shirts' }
    }
  ]

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <HeroSection />
      {/* Categories Section */}
      <Suspense fallback={<CategoryGridSkeleton />}>
        <CategoryGrid categories={categories} />
      </Suspense>
      {/* products section */}
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductsSection />
      </Suspense>
      {/* Promo Banner */}
      <PromoBanner />

    </main>
  );
}

export default page
