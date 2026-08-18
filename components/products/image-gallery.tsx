"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/types/api/product.types";

interface ImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Defensive fallback — a product should always have at least one image
  // (your admin create route requires it), but don't let the gallery crash
  // if it somehow doesn't.
  if (images.length === 0) {
    return <div className="aspect-3/4 w-full bg-neutral-100" />;
  }

  const activeImage = images[selectedIndex];

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-3/4 w-full h-[85%] rounded-[15px] overflow-hidden bg-neutral-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={activeImage.url}
              alt={productName}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails — only shown when there's more than one image to switch between */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto ">
          {images.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onMouseEnter={() => setSelectedIndex(index)}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-current={index === selectedIndex}
              className={cn(
                "relative h-20 w-16 shrink-0 overflow-hidden border transition-opacity rounded-[7px]",
                index === selectedIndex
                  ? "border-neutral-900"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={image.url}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover rounded-[7px]"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
