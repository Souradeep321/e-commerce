"use client";

import Image from "next/image";
import { motion } from "motion/react";

interface PromoBannerProps {
  eyebrow?: string;
  headline: string;
  imageSrc: string;
  imageAlt?: string;
}

export function PromoBanner({
  eyebrow = "The Edit",
  headline,
  imageSrc,
  imageAlt = "Promotional banner",
}: PromoBannerProps) {
  return (
    <section className="relative flex h-[50vh] min-h-80 w-full items-center justify-center overflow-hidden bg-neutral-800">
      <Image src={imageSrc} alt={imageAlt} fill className="object-cover opacity-90" />
      <div className="absolute inset-0 bg-black/30" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 text-center"
      >
        <p className="mb-2 text-xs uppercase tracking-widest text-neutral-200">
          {eyebrow}
        </p>
        <h2 className="font-serif text-3xl text-white sm:text-4xl">{headline}</h2>
      </motion.div>
    </section>
  );
}