// components/admin/categories/categories-list.tsx
"use client";

import Link from "next/link";
import { Children, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronRight, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useAdminTheme } from "../admin-theme-provider";
import { cn } from "@/lib/utils";
import { deleteCategory, ApiError } from "@/lib/api";
import { CategoryWithChildren, Category } from "@/types/api/category.types";
import { CategoriesEmptyState } from "./categories-empty-state";

interface CategoriesListProps {
  categories: CategoryWithChildren[];
}
  
export function CategoriesList({ categories }: CategoriesListProps) {
  if (categories.length === 0) {
    return <CategoriesEmptyState />;
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
}

function CategoryCard({ category }: { category: CategoryWithChildren }) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  const borderColor = isDark ? "border-neutral-800" : "border-neutral-200";

  return (
    <div className={cn("rounded-lg border", borderColor, isDark ? "bg-neutral-900" : "bg-white")}>
      <CategoryRow category={category} childCount={category.children.length} isChild={false} />

      {category.children.length > 0 && (
        <div className={cn("divide-y border-t", borderColor, isDark ? "divide-neutral-800" : "divide-neutral-100")}>
          {category.children.map((child) => (
            <CategoryRow key={child.id} category={child} childCount={0} isChild />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryRow({
  category,
  childCount,
  isChild,
}: {
  category: CategoryWithChildren | Category;
  childCount: number;
  isChild: boolean;
}) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteCategory(category.id);
      toast.success("Category deleted");
      router.refresh();
    } catch (err) {
      // Surfaces the route's real 400 verbatim — "Cannot delete category
      // with subcategories" / "...with products" — rather than a generic
      // message; the backend already gives an accurate reason.
      toast.error(err instanceof ApiError ? err.message : "Failed to delete category.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className={cn("flex items-center gap-3 px-4 py-3", isChild && "pl-10")}>
      {isChild && (
        <ChevronRight className={cn("h-3.5 w-3.5 shrink-0", isDark ? "text-neutral-600" : "text-neutral-300")} />
      )}
      <Tag className={cn("h-4 w-4 shrink-0", isDark ? "text-neutral-500" : "text-neutral-400")} />

      <div className="min-w-0 flex-1">
        <Link
          href={`/admin/categories/${category.id}`}
          className={cn("text-sm font-medium hover:underline", isDark ? "text-neutral-100" : "text-neutral-900")}
        >
          {category.name}
        </Link>
        <p className={cn("text-xs", isDark ? "text-neutral-500" : "text-neutral-400")}>
          /{category.slug}
          {!isChild && childCount > 0 && ` · ${childCount} subcategor${childCount === 1 ? "y" : "ies"}`}
        </p>
      </div>

      <Button variant="ghost" size="sm" asChild>
        <Link href={`/admin/categories/${category.id}`}>View products</Link>
      </Button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label={`Delete ${category.name}`}>
            {deleting ? <Spinner className="size-3.5" /> : <Trash2 className="size-3.5 text-red-500" />}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this category?</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting <strong>{category.name}</strong> is permanent. This is blocked if it has
              subcategories or any products assigned to it — remove or reassign those first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}