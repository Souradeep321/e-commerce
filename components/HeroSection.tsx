import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="grid items-center gap-8 py-12 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:py-24">

          {/* Content */}
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div>
              <span className="mb-4 inline-block rounded-full bg-[rgba(251,204,204,0.38)] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#e75723] ">
                New Season Collection
              </span>

              <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                <span className="text-balance">
                  Elevate your everyday style
                </span>
              </h1>
            </div>

            <p className="mx-auto max-w-md text-base leading-relaxed text-gray-600 sm:text-lg lg:mx-0">
              Discover curated fashion that blends contemporary design with
              timeless elegance. Made for the modern Indian wardrobe.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                className="w-full rounded-full bg-black px-8 text-sm font-semibold text-white hover:bg-gray-900 sm:w-auto"
              >
                Shop Collection
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-full border-gray-300 px-8 text-sm font-semibold text-gray-900 hover:bg-gray-100 sm:w-auto"
              >
                Explore Sale
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 pt-2 lg:justify-start">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">50K+</p>
                <p className="text-xs text-gray-500">Happy Customers</p>
              </div>

              <div className="h-8 w-px bg-gray-300" />

              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">4.8</p>
                <p className="text-xs text-gray-500">App Rating</p>
              </div>

              <div className="h-8 w-px bg-gray-300" />

              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">Free</p>
                <p className="text-xs text-gray-500">Easy Returns</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative mx-auto aspect-3/4 w-full max-w-md overflow-hidden rounded-3xl lg:max-w-none shadow-xl">
            <Image
              src="/images/hero-fashion.jpg"
              alt="Model wearing the latest fashion collection"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  )
}