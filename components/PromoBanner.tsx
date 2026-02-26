import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:py-10 lg:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-foreground">
        <div className="absolute inset-0">
          <Image
            src="/images/banner-sale.jpg"
            alt="End of season sale"
            fill
            className="object-cover opacity-50"
          />
        </div>

        <div className="relative flex flex-col items-center justify-center px-6 py-16 text-center sm:py-20 lg:py-28">
          <span className="mb-3 inline-block rounded-full bg-[#e75723] px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
            Limited Time
          </span>

          <h2 className="font-serif text-3xl font-bold text-background sm:text-4xl lg:text-5xl">
            <span className="text-balance">End of Season Sale</span>
          </h2>

          <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-background/80 sm:text-base">
            Up to 60% off on your favourite brands. Refresh your wardrobe with
            curated picks at unbeatable prices.
          </p>

          <Link href="#">
            <Button
              size="lg"
              className="mt-6 rounded-full bg-background px-8 text-sm font-semibold text-foreground hover:bg-background/90"
            >
              Shop the Sale
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}




