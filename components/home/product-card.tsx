// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { motion } from "motion/react";
// import { Star, Plus } from "lucide-react";
// import { ProductListItem } from "@/types/api/product.types";
// import { formatProductPrice, formatRating } from "@/lib/format";
// import { Button } from "@/components/ui/button";

// interface ProductCardProps {
//   product: ProductListItem;
// }

// export function ProductCard({ product }: ProductCardProps) {
//   const image = product.images[0]?.url ?? "/images/placeholder.jpg";

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       viewport={{ once: true, margin: "-40px" }}
//       transition={{ duration: 0.4, ease: "easeOut" }}
//     >
//       <Link href={`/products/${product.slug}`} className="group block">
//         {/* Image */}
//         <div className="relative aspect-square overflow-hidden bg-neutral-100">
//           <Image
//             src={image}
//             alt={product.name}
//             fill
//             className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
//             sizes="(max-width: 768px) 50vw, 25vw"
//           />

//           {/* Quick-add icon — CSS-driven hover, no JS state needed */}
//           <Button
//             type="button"
//             aria-label={`Quick add ${product.name}`}
//             onClick={(e) => {
//               e.preventDefault(); // don't navigate when clicking quick-add
//               // TODO: wire to addToCart() once cart integration lands
//             }}
//             className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center
//                        bg-white text-black opacity-0 transition-opacity duration-300
//                        group-hover:opacity-100"
//           >
//             <Plus className="h-4 w-4" />
//           </Button>
//         </div>

//         {/* Details */}
//         <div className="mt-3 space-y-1">
//           {product.category && (
//             <p className="text-xs uppercase tracking-wide text-neutral-500">
//               {product.category.name}
//             </p>
//           )}

//           <h3 className="truncate text-sm font-medium text-neutral-900">
//             {product.name}
//           </h3>

//           <p className="text-sm text-neutral-900">
//             {formatProductPrice(product)}
//           </p>

//           {product.reviewCount > 0 && (
//             <div className="flex items-center gap-1 text-xs text-neutral-500">
//               <Star className="h-3 w-3 fill-neutral-400 text-neutral-400" />
//               <span>{formatRating(product.rating)}</span>
//               <span>({product.reviewCount})</span>
//             </div>
//           )}
//         </div>
//       </Link>
//     </motion.div>
//   );
// }

"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Star, Plus } from "lucide-react";
import { ProductListItem } from "@/types/api/product.types";
import { formatProductPrice, formatRating } from "@/lib/format";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: ProductListItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images[0]?.url ?? "/images/placeholder.jpg";

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

          {/* Quick-add — shadcn Button, icon-only variant */}
          <Button
            size="icon"
            variant="secondary"
            aria-label={`Quick add ${product.name}`}
            onClick={(e) => {
              e.preventDefault(); // don't navigate when clicking quick-add
              // TODO: wire to addToCart() once cart integration lands
            }}
            className="absolute bottom-2 right-2 h-8 w-8 opacity-0 transition-opacity
                       duration-300 group-hover:opacity-100"
          >
            <Plus className="h-4 w-4" />
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

          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              <Star className="h-3 w-3 fill-neutral-400 text-neutral-400" />
              <span>{formatRating(product.rating)}</span>
              <span>({product.reviewCount})</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}