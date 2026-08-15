"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { PublicCategory } from "@/types/api/category.types";
import { cn } from "@/lib/utils";

interface CategoryTileProps {
  category: PublicCategory;
  index: number;
}

export function CategoryTile({ category, index }: CategoryTileProps) {
  const isDark = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.05 }}
    >
      <Link
        href={`/categories/${category.slug}`}
        className={cn(
          "group flex aspect-[4/3] items-end p-5 transition-colors duration-300",
          isDark
            ? "bg-neutral-900 hover:bg-neutral-800"
            : "bg-neutral-100 hover:bg-neutral-200"
        )}
      >
        <span
          className={cn(
            "text-base font-medium underline-offset-4 group-hover:underline",
            isDark ? "text-white" : "text-neutral-900"
          )}
        >
          {category.name}
        </span>
      </Link>
    </motion.div>
  );
}