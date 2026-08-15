import Link from "next/link";
import { ProductListItem } from "@/types/api/product.types";
import { ProductCard } from "./product-card";

interface ProductSectionProps {
  title: string;
  products: ProductListItem[];
  viewAllHref?: string;
}

export function ProductSection({
  title,
  products,
  viewAllHref = "/products",
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-medium text-neutral-900">{title}</h2>
        <Link
          href={viewAllHref}
          className="text-xs uppercase tracking-wide text-neutral-500 hover:text-neutral-900"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}