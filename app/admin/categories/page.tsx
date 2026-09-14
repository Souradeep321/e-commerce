// app/admin/categories/page.tsx
import { getAdminCategories } from "@/lib/api";
import { CategoriesList } from "@/components/admin/categories/categories-list";
import { CreateCategoryDialog } from "@/components/admin/categories/create-category-dialog";

export default async function AdminCategoriesPage() {
  const { categories } = await getAdminCategories();

  // Only top-level categories are valid "parent" choices — matches the
  // one-level nesting Category.children (Category[], not recursive) assumes.
  const parentOptions = categories.map(({ id, name, slug, parentId }) => ({
    id,
    name,
    slug,
    parentId,
  }));

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium">Categories</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Organize products into categories and subcategories.
          </p>
        </div>
        <CreateCategoryDialog categories={parentOptions} />
      </div>

      <div className="mt-6">
        <CategoriesList categories={categories} />
      </div>
    </div>
  );
}