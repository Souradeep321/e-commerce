// app/api/products/[slug]/questions/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";
import { writeRateLimit } from "@/lib/rate-limit/rate-limit";
import {checkRateLimit} from "@/lib/rate-limit/rate-limit-helper";
import { handleApiError } from "@/lib/api-error-handler";

// GET - Fetch all questions for a product
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get product
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Fetch all questions
    const questions = await prisma.question.findMany({
      where: { productId: product.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { answeredAt: "desc" }, // Answered questions first
        { createdAt: "desc" },  // Then newest questions
      ],
    });

    const answeredCount = questions.filter(q => q.answer).length;
    const unansweredCount = questions.filter(q => !q.answer).length;

    return NextResponse.json({
      success: true,
      message: "Questions fetched successfully",
      data: {
        questions,
        totalQuestions: questions.length,
        answeredCount,
        unansweredCount,
      },
    });
  } catch (error: any) {
    console.error("Error in GET /api/products/[slug]/questions:", error);
    return handleApiError(error, "GET /api/products/[slug]/questions");
  }
}

// POST - Ask a question
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const ratelimitResponse = await checkRateLimit(writeRateLimit, `ask-question:${user!.email}`);
    if (ratelimitResponse) return ratelimitResponse;

    const { slug } = await params;
    const { question } = await req.json();

    if (!question || question.trim().length < 10) {
      return NextResponse.json(
        { success: false, message: "Question must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { id: true, name: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Create question
    const newQuestion = await prisma.question.create({
      data: {
        userId: user!.id,
        productId: product.id,
        question: question.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    // Create notification for admin
    await prisma.notification.create({
      data: {
        audience: "ADMIN",
        type: "QUESTION_ANSWERED",
        title: "New Product Question",
        message: `New question on ${product.name}`,
        entityId: newQuestion.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Question submitted successfully. We'll answer soon!",
      question: newQuestion,
    }, { status: 201 });
  } catch (error: any) {
    console.error("CREATE QUESTION ERROR in POST /api/products/[slug]/questions:", error);
    return handleApiError(error, "CREATE QUESTION");
  }
}