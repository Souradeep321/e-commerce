// components/admin/products/form/product-images-field.tsx
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAdminTheme } from "../../admin-theme-provider";
import { cn } from "@/lib/utils";

interface ExistingImage {
  id: string;
  url: string;
}

interface NewImage {
  file: File;
  previewUrl: string;
}

interface ProductImagesFieldProps {
  existingImages: ExistingImage[];
  newImages: NewImage[];
  onAddFiles: (files: File[]) => void;
  onRemoveNew: (index: number) => void;
  hasImageError: boolean; // create mode only — true when 0 images selected
  // Edit mode: PATCH /api/admin/products/[id] doesn't accept image
  // changes (by design — updateProductSchema has no images field).
  // Rather than offer upload/remove controls that would silently do
  // nothing against the real backend, this renders existing images
  // as a plain read-only grid instead. Same principle already used
  // for "Our Recommendation" being disabled in create mode: don't
  // show UI for something the backend doesn't support.
  readOnly?: boolean;
}

export function ProductImagesField({
  existingImages,
  newImages,
  onAddFiles,
  onRemoveNew,
  hasImageError,
  readOnly = false,
}: ProductImagesFieldProps) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    onAddFiles(Array.from(fileList));
  }

  if (readOnly) {
    return (
      <div>
        <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-400")}>
          Images can&apos;t be changed after a product is created.
        </p>
        {existingImages.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {existingImages.map((img) => (
              <div key={img.id} className="relative h-20 w-20 shrink-0 overflow-hidden rounded border">
                <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed py-10 text-center transition-colors",
          isDark
            ? dragActive
              ? "border-neutral-500 bg-neutral-800"
              : "border-neutral-700 bg-neutral-900"
            : dragActive
              ? "border-neutral-400 bg-neutral-100"
              : "border-neutral-300 bg-neutral-50"
        )}
      >
        <Upload className={cn("h-5 w-5", isDark ? "text-neutral-500" : "text-neutral-400")} />
        <p className={cn("mt-2 text-sm", isDark ? "text-neutral-300" : "text-neutral-600")}>
          <span className="font-medium underline">Click to upload</span> or drag and drop
        </p>
        <p className={cn("mt-1 text-xs", isDark ? "text-neutral-600" : "text-neutral-400")}>
          PNG, JPG, WEBP up to 10MB
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {newImages.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {newImages.map((img, index) => (
            <div key={img.previewUrl} className="group relative h-20 w-20 shrink-0 overflow-hidden rounded border">
              <Image src={img.previewUrl} alt="" fill className="object-cover" sizes="80px" />
              <Badge className="absolute left-1 top-1 bg-blue-600 text-[9px] text-white">New</Badge>
              <button
                type="button"
                aria-label="Remove image"
                onClick={() => onRemoveNew(index)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {hasImageError && (
        <p className="mt-3 text-xs text-rose-500">
          Image required: at least one product image is required before this product can be saved.
        </p>
      )}
    </div>
  );
}