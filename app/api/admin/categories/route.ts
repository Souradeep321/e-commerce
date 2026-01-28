import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import slugify from "slugify";
import { categorySchema } from "@/schemas/category.schema";

export async function POST(req: Request) {
    try {
        // 1️⃣ Admin check
        // await requireAdmin();

        // 2️⃣ Parse body
        const body = await req.json();
        const parsed = categorySchema.parse(body);

        const { name, parentId } = parsed;

        // 3️⃣ Generate slug
        const slug = slugify(name, {
            lower: true,
            strict: true,
            trim: true,
        });

        // 4️⃣ Check duplicate (name or slug)
        const existing = await prisma.category.findFirst({
            where: {
                OR: [{ name }, { slug }],
            },
        });

        if (existing) {
            return NextResponse.json(
                { success: false, message: "Category already exists" },
                { status: 409 }
            );
        }

        // 5️⃣ Validate parentId if provided
        if (parentId) {
            const parentExists = await prisma.category.findUnique({
                where: { id: parentId },
            });

            if (!parentExists) {
                return NextResponse.json(
                    { success: false, message: "Parent category not found" },
                    { status: 400 }
                );
            }
        }

        // 6️⃣ Create category
        const category = await prisma.category.create({
            data: {
                name,
                slug,
                parentId: parentId ?? null,
            },
        });


        return NextResponse.json({
            success: true,
            message: "Category created successfully",
            category
        }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error?.message || "Failed to create category" },
            { status: 400 }
        );
    }
}

export async function GET(req: Request) {
    // await requireAdmin();
    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: "asc" },
            include: {
                children: true,
                products: true,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Categories fetched successfully",
            categories,
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error?.message || "Failed to fetch categories" },
            { status: 400 }
        );
    }
}