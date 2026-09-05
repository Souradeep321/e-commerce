// components/admin/products/form/product-form.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PricingModeToggle } from "./pricing-mode-toggle";
import { VariantTable } from "./variant-table";
import { ProductImagesField } from "./product-images-field";
import { DeleteProductDialog } from "./delete-product-dialog";
import { useAdminTheme } from "../../admin-theme-provider";
import {
  productFormSchema,
  ProductFormValues,
} from "@/lib/admin/product-form-schema";
import { adminProductToFormValues, buildProductFormData } from "@/lib/admin/product";
import { MOCK_CATEGORY_OPTIONS } from "@/lib/admin/mock-categories";
import { createProduct, updateProduct, ApiError } from "@/lib/api";
import { formatShortDate } from "@/lib/admin/format";
import { cn } from "@/lib/utils";
import { AdminProduct } from "@/types/api/product.types";

interface ProductFormProps {
  mode: "create" | "edit";
  initialProduct?: AdminProduct;
}

interface NewImageState {
  file: File;
  previewUrl: string;
}

const EMPTY_DEFAULTS: ProductFormValues = {
  name: "",
  description: "",
  categoryId: "",
  gender: undefined,
  pricingMode: "simple",
  priceRupees: undefined,
  stock: undefined,
  variants: [],
  isActive: true,
  ourRecommendation: false,
};

export function ProductForm({ mode, initialProduct }: ProductFormProps) {
  const router = useRouter();
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  const sectionBorder = isDark ? "border-neutral-800" : "border-neutral-200";

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialProduct ? adminProductToFormValues(initialProduct) : EMPTY_DEFAULTS,
  });

  const { fields, append, remove, replace } = useFieldArray({ control, name: "variants" });

  const pricingMode = watch("pricingMode");
  const priceRupees = watch("priceRupees");
  const stock = watch("stock");

  // ---------- Images ----------
  // Create-only — see lib/admin/product.ts's buildProductFormData
  // comment for why edit mode never touches images.
  const [newImages, setNewImages] = useState<NewImageState[]>([]);
  const [showImageError, setShowImageError] = useState(false);

  useEffect(() => {
    return () => newImages.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleAddFiles(files: File[]) {
    const next = files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    setNewImages((prev) => [...prev, ...next]);
    setShowImageError(false);
  }

  function handleRemoveNew(index: number) {
    setNewImages((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  const totalImageCount = mode === "create" ? newImages.length : (initialProduct?.images.length ?? 0);

  // ---------- Pricing mode switch ----------
  const hasEnteredPricingData =
    pricingMode === "simple"
      ? priceRupees !== undefined || stock !== undefined
      : fields.length > 0;

  function handleSwitchMode(next: "simple" | "variants") {
    if (next === "simple") {
      replace([]);
      setValue("stock", undefined);
    } else {
      setValue("priceRupees", undefined);
      setValue("stock", undefined);
      replace([{ size: "", priceRupees: 0, stock: 0 }]);
    }
    setValue("priceRupees", undefined);
    setValue("pricingMode", next);
  }

  // ---------- Submit ----------
  async function onSubmit(values: ProductFormValues) {
    if (mode === "create" && totalImageCount === 0) {
      setShowImageError(true);
      return;
    }

    try {
      const formData = buildProductFormData(
        mode,
        values,
        newImages.map((i) => i.file)
      );

      if (mode === "create") {
        await createProduct(formData);
        toast.success("Product created");
      } else {
        await updateProduct(initialProduct!.id, formData);
        toast.success("Product updated");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  const inputTheme = isDark
    ? "border-neutral-800 bg-neutral-900 text-neutral-100"
    : "";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h1 className="text-2xl font-medium">
          {mode === "create" ? "New Product" : `Edit Product`}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {mode === "create"
            ? "Fill in the details below to add a product to the catalog."
            : "Update details, pricing, or images. Changes go live immediately for active products."}
        </p>
        {mode === "edit" && initialProduct && (
          <p className="mt-2 text-xs text-neutral-500">
            Created {formatShortDate(initialProduct.createdAt)} · Last modified{" "}
            {formatShortDate(initialProduct.updatedAt)} ·{" "}
            {initialProduct.variants.length > 0
              ? `${initialProduct.variants.length} sizes · ${initialProduct.variants.reduce((s, v) => s + v.stock, 0)} units`
              : `${initialProduct.stock ?? 0} units`}
          </p>
        )}
      </div>

      {/* Basic Info */}
      <section className={cn("mt-6 border-t pt-6", sectionBorder)}>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Basic Info</h2>

        <div className="mt-4 space-y-4">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="product-name">Name *</FieldLabel>
                <Input id="product-name" {...field} placeholder="Product name" className={inputTheme} />
                {errors.name && <FieldError errors={[errors.name]} />}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Field data-invalid={!!errors.description}>
                <FieldLabel htmlFor="product-description">Description</FieldLabel>
                <Textarea
                  id="product-description"
                  {...field}
                  rows={4}
                  placeholder="Describe the product — material, fit, use case. This appears as body text on the storefront product page."
                  className={inputTheme}
                />
                {errors.description && <FieldError errors={[errors.description]} />}
              </Field>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Field data-invalid={!!errors.categoryId}>
                  <FieldLabel>Category *</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={cn("w-full", inputTheme)}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_CATEGORY_OPTIONS.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && <FieldError errors={[errors.categoryId]} />}
                </Field>
              )}
            />

            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Gender</FieldLabel>
                  <Select
                    value={field.value ?? "unspecified"}
                    onValueChange={(v) => field.onChange(v === "unspecified" ? undefined : v)}
                  >
                    <SelectTrigger className={cn("w-full", inputTheme)}>
                      <SelectValue placeholder="Unspecified" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unspecified">Unspecified</SelectItem>
                      <SelectItem value="MEN">Men</SelectItem>
                      <SelectItem value="WOMEN">Women</SelectItem>
                      <SelectItem value="UNISEX">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </div>
        </div>
      </section>

      {/* Pricing & Stock */}
      <section className={cn("mt-6 border-t pt-6", sectionBorder)}>
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Pricing & Stock</h2>
          <PricingModeToggle mode={pricingMode} hasEnteredData={hasEnteredPricingData} onSwitch={handleSwitchMode} />
        </div>

        <div className="mt-4">
          {pricingMode === "simple" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={control}
                name="priceRupees"
                render={({ field }) => (
                  <Field data-invalid={!!errors.priceRupees}>
                    <FieldLabel>Price (₹) *</FieldLabel>
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      placeholder="0"
                      className={inputTheme}
                    />
                    {errors.priceRupees && <FieldError errors={[errors.priceRupees]} />}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="stock"
                render={({ field }) => (
                  <Field data-invalid={!!errors.stock}>
                    <FieldLabel>Stock *</FieldLabel>
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      placeholder="0"
                      className={inputTheme}
                    />
                    {errors.stock && <FieldError errors={[errors.stock]} />}
                  </Field>
                )}
              />
            </div>
          ) : (
            <VariantTable
              control={control}
              register={register}
              errors={errors}
              fields={fields}
              onAdd={() => append({ size: "", priceRupees: 0, stock: 0 })}
              onRemove={remove}
            />
          )}
        </div>
      </section>

      {/* Images */}
      <section className={cn("mt-6 border-t pt-6", sectionBorder)}>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Images</h2>
        <div className="mt-4">
          <ProductImagesField
            existingImages={initialProduct?.images ?? []}
            newImages={newImages}
            onAddFiles={handleAddFiles}
            onRemoveNew={handleRemoveNew}
            hasImageError={showImageError}
            readOnly={mode === "edit"}
          />
        </div>
      </section>

      {/* Visibility & Flags */}
      <section className={cn("mt-6 border-t pt-6", sectionBorder)}>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Visibility & Flags</h2>

        <div className="mt-4 space-y-4">
          <Controller
            control={control}
            name="isActive"
            render={({ field }) => (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-xs text-neutral-500">
                    When active, this product is visible on the storefront.
                  </p>
                </div>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </div>
            )}
          />

          <Controller
            control={control}
            name="ourRecommendation"
            render={({ field }) => (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Our Recommendation</p>
                  <p className="text-xs text-neutral-500">
                    {mode === "create"
                      ? "Available after the product is created."
                      : 'Displays the "Our Pick" badge on the storefront product page.'}
                  </p>
                </div>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={mode === "create"}
                />
              </div>
            )}
          />
        </div>
      </section>

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : mode === "create" ? "Save" : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>

      {mode === "edit" && initialProduct && (
        <DeleteProductDialog productId={initialProduct.id} productName={initialProduct.name} />
      )}
    </form>
  );
}