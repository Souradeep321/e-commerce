// lib/admin/product.ts — FRONTEND ONLY. No server/API code here.
import { ProductFormValues, paiseToRupees } from "./product-form-schema";
import { AdminProduct } from "@/types/api/product.types";

/**
 * Converts an existing AdminProduct (prices in paise, as returned by
 * GET/PATCH) into the rupee-based ProductFormValues shape the edit
 * form works with.
 */
export function adminProductToFormValues(product: AdminProduct): ProductFormValues {
  const hasVariants = product.variants.length > 0;

  return {
    name: product.name,
    description: product.description,
    categoryId: product.categoryId ?? "",
    gender: product.gender ?? undefined,
    pricingMode: hasVariants ? "variants" : "simple",
    priceRupees: product.price !== null ? paiseToRupees(product.price) : undefined,
    stock: product.stock ?? undefined,
    variants: product.variants.map((v) => ({
      size: v.size,
      priceRupees: paiseToRupees(v.price),
      stock: v.stock,
    })),
    isActive: product.isActive,
    ourRecommendation: product.ourRecommendation,
  };
}

/**
 * Builds the multipart FormData the real API routes expect.
 *
 * IMPORTANT: prices are sent as plain RUPEE numbers, not paise — both
 * POST /api/admin/products and PATCH /api/admin/products/[id] do the
 * rupees -> paise conversion themselves server-side.
 *
 * IMAGES ARE CREATE-ONLY. PATCH /api/admin/products/[id] does not
 * accept image changes at all — updateProductSchema deliberately has
 * no images field, by design (not a gap to fix). So `newFiles` is
 * only ever appended when mode === "create"; edit mode never sends
 * any image-related fields, and the Edit form doesn't offer add/
 * remove image UI in the first place (see ProductImagesField's
 * readOnly mode).
 *
 * ourRecommendation is also create-excluded, for a similar reason —
 * productSchema (create) doesn't have that field either.
 */
export function buildProductFormData(
  mode: "create" | "edit",
  values: ProductFormValues,
  newFiles: File[]
): FormData {
  const fd = new FormData();

  fd.append("name", values.name);
  fd.append("description", values.description);
  fd.append("categoryId", values.categoryId);
  if (values.gender) fd.append("gender", values.gender);
  fd.append("isActive", String(values.isActive));

  if (mode === "edit") {
    fd.append("ourRecommendation", String(values.ourRecommendation));
  }

  if (values.pricingMode === "simple") {
    fd.append("price", String(values.priceRupees));
    fd.append("stock", String(values.stock));
    fd.append("variants", JSON.stringify([]));
  } else {
    fd.append(
      "variants",
      JSON.stringify(values.variants.map((v) => ({ size: v.size, price: v.priceRupees, stock: v.stock })))
    );
  }

  if (mode === "create") {
    newFiles.forEach((file) => fd.append("images", file));
  }

  return fd;
}

export type StockStatusTone = "ok" | "low" | "out";
export interface StockStatus {
  label: string;
  tone: StockStatusTone;
}

const LOW_STOCK_THRESHOLD = 5;

export function getStockStatus(stock: number): StockStatus {
  if (stock === 0) return { label: "Out of stock", tone: "out" };
  if (stock <= LOW_STOCK_THRESHOLD) return { label: `${stock} left`, tone: "low" };
  return { label: "In stock", tone: "ok" };
}