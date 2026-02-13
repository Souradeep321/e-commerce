// app/api/questions/[id]/route.ts
// User can delete their own unanswered questions
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";

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
  } catch (error: any) {
    console.error("DELETE QUESTION ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    );
  }
}