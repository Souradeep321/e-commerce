import { NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { ZodError } from "zod";

export function handleApiError(error: unknown, context: string) {
  console.error(`${context} ERROR:`, error);

  // Zod validation errors
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation failed",
        errors: error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // Prisma known errors (constraint violations, not found, etc.)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, message: "A record with this value already exists" },
        { status: 409 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json(
        { success: false, message: "Record not found" },
        { status: 404 }
      );
    }
    if (error.code === "P2003") {
      return NextResponse.json(
        { success: false, message: "Related record not found" },
        { status: 400 }
      );
    }
    // Fallback for other Prisma errors — don't leak internal details
    return NextResponse.json(
      { success: false, message: "Database error occurred" },
      { status: 500 }
    );
  }

  // Custom thrown errors (e.g. from requireUser/requireAdmin)
  if (error instanceof Error) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ success: false, message: "Please login to continue" }, { status: 401 });
    }
    if (error.message === "Forbidden") {
      return NextResponse.json({ success: false, message: "Admin access required" }, { status: 403 });
    }
  }

  // Truly unexpected — never leak error.message to the client
  return NextResponse.json(
    { success: false, message: "Something went wrong. Please try again." },
    { status: 500 }
  );
}