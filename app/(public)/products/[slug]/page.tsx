// app/(public)/products/[slug]/page.tsx - Product detail page
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { ProductDetail } from '@/components/ProductDetail'
import { getProductBySlug, getProducts } from '@/lib/api/products'
import { ProductGrid, ProductGridSkeleton } from '@/components/Productgrid'
import { Suspense } from 'react'

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }

  return {
    title: `${product.name} | My E-commerce Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      // images: product.images?.[0]?.url ? [product.images[0].url] : [],
      images: product.images.map((img) => ({
        url: img.url,
        width: 800,
        height: 1067, // 3:4 aspect ratio
      })),
    },
  }
}


export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  console.log('Fetching product with slug:', slug) // Debug log to verify slug

  const product = await getProductBySlug(slug)
  console.log('Fetched product:', product?.category.slug) // Debug log to verify fetched product

  const { products } = await getProducts({
    category: product?.category.slug,
    limit: 1,
  })


  // Handle not found
  if (!product) {
    notFound()
  }

  // Handle inactive products
  if (!product.isActive) {
    notFound()
  }

  return (
    <>
      <ProductDetail product={product} />
      <section className="mx-auto sm:mx-10 xl:mx-20 max-w-7xl px-4 py-6 sm:py-10 lg:px-6  
      ">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductGrid
            id='Similar Tshirts'
            title='Similar Products'
            subtitle='You might also like'
            filter='latest'
            limit={4}
            viewAllHref={`/shop?category=${product.category.slug}&sort=latest`}
            products={products} />
        </Suspense>

      </section>
    </>
  )
}