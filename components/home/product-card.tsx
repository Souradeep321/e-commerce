"use client";

// import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Star, Plus } from "lucide-react";
// import { toast } from "sonner";
import { ProductListItem } from "@/types/api/product.types";
import { formatProductPrice, formatRating } from "@/lib/format";
import { Button } from "@/components/ui/button";
// import { Spinner } from "@/components/ui/spinner";
// import { addToCart, ApiError } from "@/lib/api";
// import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Some list endpoints return a reduced product shape — e.g.
// CategoryProductListItem (GET /api/categories/[slug]) deliberately
// omits gender/category/rating/reviewCount, per the project's
// "separate types per context" convention (ARCHITECTURE.md). Rather
// than fork ProductCard per source type, its prop type accepts either:
// the four fields that aren't universally available become optional
// here. ProductListItem itself still satisfies this trivially (all
// fields present), so every existing caller (home page, /products) is
// unaffected.
export type ProductCardData = Omit<ProductListItem, "gender" | "category" | "rating" | "reviewCount"> &
  Partial<Pick<ProductListItem, "gender" | "category" | "rating" | "reviewCount">>;

interface ProductCardProps {
  product: ProductCardData;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const image = product.images[0]?.url ?? "/images/placeholder.jpg";
  const reviewCount = product.reviewCount ?? 0;

  // price === null ⟺ the product has variants — same convention
  // formatProductPrice (lib/format.ts) and the product schemas already
  // rely on (price XOR variants, enforced server-side via superRefine).
  // Quick-add has no way to know which size to add from a list card,
  // so it's hidden entirely for variant products rather than guessing
  // or adding without one — size selection belongs on the product
  // detail page.
  {/* This is technically valid, but it creates different behavior depending on the product */ }
  // const hasVariants = product.price === null;

  // const [adding, setAdding] = useState(false);

  // async function handleQuickAdd(e: React.MouseEvent<HTMLButtonElement>) {
  //   e.preventDefault(); // this is an in-place add, not a navigation
  //   e.stopPropagation();
  //   if (adding) return;

  //   setAdding(true);
  //   try {
  //     await addToCart({ productId: product.id, quantity: 1 });
  //     toast.success(`Added ${product.name} to cart`);
  //   } catch (err) {
  //     toast.error(err instanceof ApiError ? err.message : "Couldn't add to cart. Please try again.");
  //   } finally {
  //     setAdding(false);
  //   }
  // }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Link href={`/products/${product.slug}`} className="group block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* Quick-add — flat-price products only, see hasVariants note above */}
          {/* This is technically valid, but it creates different behavior depending on the product */}
          {/* {!hasVariants && (
            <Button
              size="icon"
              variant="secondary"
              aria-label={adding ? "Adding to cart" : `Quick add ${product.name}`}
              onClick={handleQuickAdd}
              disabled={adding}
              className={cn(
                "absolute bottom-2 right-2 h-8 w-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                adding && "opacity-100"
              )}
            >
              {adding ? <Spinner className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          )} */}

          <Button
            size="icon"
            variant="secondary"
            aria-label={`Quick add ${product.name}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push(`/products/${product.slug}`);
            }}
            className="absolute bottom-2 right-2 h-8 w-8 opacity-0 transition-opacity
                       duration-300 group-hover:opacity-100"
          >
            <Plus className="h-4 w-4 " />
          </Button>
        </div>

        {/* Details */}
        <div className="mt-3 space-y-1">
          {product.category && (
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              {product.category.name}
            </p>
          )}

          <h3 className="truncate text-sm font-medium text-neutral-900">
            {product.name}
          </h3>

          <p className="text-sm text-neutral-900">
            {formatProductPrice(product)}
          </p>

          {reviewCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              <Star className="h-3 w-3 fill-neutral-400 text-neutral-400" />
              <span>{formatRating(product.rating ?? 0)}</span>
              <span>({reviewCount})</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}