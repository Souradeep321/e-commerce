import { getCategoryBySlug } from "@/lib/api";

interface CategoriesSlugPageProps {
    params: Promise<{ slug: string }>;
}

export default async function CategoriesSlugPage({ params }: CategoriesSlugPageProps) {
    const { slug } = await params;

    const { category, products } = await getCategoryBySlug(slug);
    console.log("category", category);
    console.log("products", products);

    return (
        <>
        </>
    );
}