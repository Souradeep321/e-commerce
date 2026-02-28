import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Category } from '@/types/category'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
    categories: Category[]
}

export function CategoryGrid({ categories }: Props) {
    if (!categories || categories.length === 0) {
        return (
            <section className="mx-auto max-w-7xl px-4 py-12">
                <p className="text-center text-gray-500">
                    No categories available at the moment.
                </p>
            </section>
        )
    }

    return (
        <section
            id="categories"
            className="mx-auto max-w-7xl px-4 py-12 sm:py-16 lg:px-6"
        >
            <div className="mb-8 flex items-end justify-between sm:mb-10">
                <div>
                    <span className="mb-2 block text-xs font-bold  uppercase tracking-wider text-[#e75723]">
                        Browse
                    </span>
                    <h2 className="font-serif text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Shop by Category
                    </h2>
                </div>

                <Link
                    href="/categories"
                    className="hidden items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 sm:flex"
                >
                    View All
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/category/${category.slug}`}
                        className="group relative overflow-hidden rounded-2xl bg-gray-100"
                    >
                        <div className="relative aspect-3/4 overflow-hidden">
                            <Image
                                src={`/images/categories/${category.slug}.jpg`}
                                alt={`Shop ${category.name}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 640px) 50vw, 25vw"
                            />

                            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                            <h3 className="text-lg font-bold text-white sm:text-xl">
                                {category.name}
                            </h3>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export function CategoryGridSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <Skeleton className="h-4 w-16 mb-2" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="aspect-3/4 rounded-2xl" />
        ))}
      </div>
    </section>
  )
}