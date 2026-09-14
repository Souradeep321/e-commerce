// components/admin/categories/create-category-dialog.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";
import { createCategory, ApiError } from "@/lib/api";

/**
 * UI-only form schema, deliberately separate from schemas/category.schema.ts's
 * categorySchema — that one is recursive (supports nested `children` on
 * create) to match the full API contract, but this form only ever creates
 * ONE category at a time under an optional existing parent. Same reasoning
 * as lib/admin/product-form-schema.ts being separate from the server schema.
 */
const createCategoryFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  parentId: z.string().optional(),
});
type CreateCategoryFormValues = z.infer<typeof createCategoryFormSchema>;

interface CreateCategoryDialogProps {
  categories: { id: string; name: string; slug: string; parentId: string | null }[];
}

export function CreateCategoryDialog({ categories }: CreateCategoryDialogProps) {
  const router = useRouter();
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategoryFormSchema),
    defaultValues: { name: "", parentId: undefined },
  });

  // Only top-level categories are valid parents — see categories/page.tsx.
  const topLevelOptions = categories.filter((c) => c.parentId === null);
  const inputTheme = isDark ? "border-neutral-800 bg-neutral-900 text-neutral-100" : "";

  async function onSubmit(values: CreateCategoryFormValues) {
    try {
      await createCategory({ name: values.name, parentId: values.parentId || null });
      toast.success("Category created");
      reset();
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to create category.");
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5" />
          Add Category
        </Button>
      </SheetTrigger>

      <SheetContent className={cn(isDark ? "bg-neutral-950 text-neutral-100" : "bg-white text-neutral-900")}>
        <SheetHeader>
          <SheetTitle>New Category</SheetTitle>
          <SheetDescription>Add a top-level category, or nest it under an existing one.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-1 flex-col gap-4 px-4">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="category-name">Name *</FieldLabel>
                <Input id="category-name" {...field} placeholder="e.g. Outerwear" className={inputTheme} />
                {errors.name && <FieldError errors={[errors.name]} />}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="parentId"
            render={({ field }) => (
              <Field>
                <FieldLabel>Parent category</FieldLabel>
                <Select value={field.value ?? "none"} onValueChange={(v) => field.onChange(v === "none" ? undefined : v)}>
                  <SelectTrigger className={cn("w-full", inputTheme)}>
                    <SelectValue placeholder="None (top-level)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None (top-level)</SelectItem>
                    {topLevelOptions.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <SheetFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create Category"}
            </Button>
            <SheetClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}