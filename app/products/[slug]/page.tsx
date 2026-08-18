import { ImageGallery } from "@/components/products/image-gallery";
import { ProductPurchasePanel } from "@/components/products/product-purchase-panel";
import { ProductDescription } from "@/components/products/product-description";
import { mockProductDetail } from "@/lib/mock-data";
// import { notFound } from "next/navigation";
// import { getProduct } from "@/lib/api/products";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  // TODO: swap for real fetch once products are seeded:
  // const { product } = await getProduct(slug);
  // if (!product) notFound();
  const product = mockProductDetail;
  void slug; // mock ignores the actual slug — remove this line once the real fetch uses it above

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <ImageGallery images={product.images} productName={product.name} />
        <ProductPurchasePanel product={product} />
      </div>

      <ProductDescription description={product.description} />
    </main>
  );
}