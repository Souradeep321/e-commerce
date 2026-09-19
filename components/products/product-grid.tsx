// import { ProductListItem } from "@/types/api/product.types";
// import { ProductCard } from "@/components/home/product-card";
// import { EmptyState } from "./empty-state";

// interface ProductGridProps {
//   products: ProductListItem[];
// }

// export function ProductGrid({ products }: ProductGridProps) {
//   if (products.length === 0) {
//     return <EmptyState />;
//   }

//   return (
//     <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
//       {products.map((product) => (
//         <ProductCard key={product.id} product={product} />
//       ))}
//     </div>
//   );
// }

import { ProductCard, ProductCardData } from "@/components/home/product-card";
import { EmptyState } from "./empty-state";

interface ProductGridProps {
  products: ProductCardData[];
  // Passed straight through to EmptyState's "Clear filters" link —
  // defaults there to "/products". Category page passes
  // `/categories/${slug}` so "clear filters" doesn't lose the category
  // scope by bouncing to the global listing.
  clearFiltersHref?: string;
}

export function ProductGrid({ products, clearFiltersHref }: ProductGridProps) {
  if (products.length === 0) {
    return <EmptyState clearFiltersHref={clearFiltersHref} />;
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}