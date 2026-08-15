import Link from "next/link";
import { PublicCategory } from "@/types/api/category.types";
import { CategoryTile } from "./category-tile";

interface CategoryGridProps {
  categories: PublicCategory[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-medium text-neutral-900">
          Shop by Category
        </h2>
        <Link
          href="/products"
          className="text-xs uppercase tracking-wide text-neutral-500 hover:text-neutral-900"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category, index) => (
          <CategoryTile key={category.id} category={category} index={index} />
        ))}
      </div>
    </section>
  );
}