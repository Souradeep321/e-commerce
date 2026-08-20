import { ImageGallery } from "@/components/products/image-gallery";
import { ProductPurchasePanel } from "@/components/products/product-purchase-panel";
import { ProductDescription } from "@/components/products/product-description";
import { ProductReviewsSection } from "@/components/products/product-reviews-section";
import { ProductQuestionsSection } from "@/components/products/product-questions-section";
import { ProductSection } from "@/components/home/product-section";
import {
  mockProductDetail,
  mockAverageRating,
  mockTotalReviews,
  mockRatingCounts,
  mockReviewsPage1,
  mockQuestions,
  mockRecommendedProducts, // standing in for "related products" until getProducts({ category }) is real
} from "@/lib/mock-data";
// import { notFound } from "next/navigation";
// import { getProduct } from "@/lib/api/products";
// import { getProductReviews } from "@/lib/api/reviews";
// import { getProductQuestions } from "@/lib/api/questions";
// import { getProducts } from "@/lib/api/products";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  // TODO: swap for real fetches once products are seeded:
  // const { product } = await getProduct(slug);
  // if (!product) notFound();
  // const reviewsRes = await getProductReviews(slug, { page: 1 });
  // const questionsRes = await getProductQuestions(slug);
  // const relatedRes = product.category
  //   ? await getProducts({ category: product.category.slug })
  //   : null;
  // const relatedProducts = relatedRes
  //   ? relatedRes.products.filter((p) => p.id !== product.id)
  //   : [];
  const product = mockProductDetail;
  const relatedProducts = mockRecommendedProducts;
  void slug;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ImageGallery images={product.images} productName={product.name} />
        <ProductPurchasePanel
          product={product}
          averageRating={mockAverageRating}
          totalReviews={mockTotalReviews}
        />
      </div>

      <ProductDescription description={product.description} />

      <ProductReviewsSection
        productSlug={slug}
        averageRating={mockAverageRating}
        totalReviews={mockTotalReviews}
        ratingCounts={mockRatingCounts}
        initialReviews={mockReviewsPage1}
        initialPage={1}
        initialTotalPages={2}
      />

      <ProductQuestionsSection
        productId={product.id}
        productSlug={slug}
        questions={mockQuestions}
      />

      {relatedProducts.length > 0 && (
        <ProductSection
          title="More From This Category"
          products={relatedProducts}
          viewAllHref={
            product.category ? `/categories/${product.category.slug}` : "/products"
          }
        />
      )}
    </main>
  );
}