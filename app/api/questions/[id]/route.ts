// app/api/questions/[id]/route.ts
// User can delete their own unanswered questions
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error-handler";
import { questionSchema } from "@/schemas";

// DELETE - Delete own unanswered question
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const { id } = await params;

    // Check if question exists and belongs to user
    const question = await prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

    if (question.userId !== user!.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // Only allow deletion of unanswered questions
    if (question.answer) {
      return NextResponse.json(
        { success: false, message: "Cannot delete answered questions" },
        { status: 400 }
      );
    }

    // Delete question
    await prisma.question.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/questions/[id]:", error);
    return handleApiError(error, "DELETE /api/questions/[id]");
  }
}

// PATCH - Update a specific question by ID
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Question ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validated = questionSchema.partial().parse(body);

    // Check if question exists and belongs to user
    const question = await prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

    if (question.userId !== user!.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    if (question.answer) {
      return NextResponse.json(
        { success: false, message: "Cannot edit an already-answered question" },
        { status: 400 }
      );
    }

    await prisma.question.update({
      where: { id },
      data: {
        ...(validated.question && { question: validated.question }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Question updated successfully",
    });
  } catch (error) {
    console.error("Error in PATCH /api/questions/[id]:", error);
    return handleApiError(error, "PATCH /api/questions/[id]");
  }

}


// GET - Fetch a specific question by ID
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Question ID is required" },
        { status: 400 }
      );
    }

    const question = await prisma.question.findUnique({
      where: { id },
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

    if (!question) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

    if (question.userId !== user!.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Question fetched successfully",
      question,
    });
  } catch (error) {
    console.error("Error in GET /api/questions/[id]:", error);
    return handleApiError(error, "GET /api/questions/[id]");
  }

}



