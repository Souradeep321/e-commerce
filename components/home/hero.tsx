import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex h-[85vh] min-h-125 w-full items-end overflow-hidden bg-neutral-900">
      <Image
        src="/images/hero-fashion.jpg"
        alt="Featured collection"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

      <div
        className="relative z-10 max-w-xl animate-in fade-in slide-in-from-bottom-4
                   px-4 pb-16 duration-700 ease-out sm:px-6 lg:px-8"
      >
        <p className="mb-3 text-xs uppercase tracking-widest text-neutral-300">
          Collection — 2026
        </p>
        <h1 className="font-serif text-5xl leading-[1.1] text-white sm:text-6xl">
          Form Follows Feeling
        </h1>
        <p className="mt-4 max-w-sm text-sm text-neutral-300">
          Considered essentials for the unhurried wardrobe.
        </p>
        <Button asChild size="lg" className="mt-6 bg-white text-black hover:bg-neutral-200">
          <a href="/products">Shop Now</a>
        </Button>
      </div>
    </section>
  );
}