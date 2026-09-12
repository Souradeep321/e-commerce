import {getAdminCategories} from "@/lib/api";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();
  console.log(categories);
  // TODO: render categories in a table with pagination, search, and filters

  return (
    <div>page</div>
  )
}
