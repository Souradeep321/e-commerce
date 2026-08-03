// app/api/notifications/[id]/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error-handler";

// PATCH - Mark notification as read/unread
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const { id } = await params;
    const { isRead } = await req.json();

    if (typeof isRead !== "boolean") {
      return NextResponse.json(
        { success: false, message: "isRead must be a boolean" },
        { status: 400 }
      );
    }

    // Check if notification belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (user!.role === "ADMIN") {
      if (notification.audience !== "ADMIN") {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 403 }
        );
      }
    } else {
      if (notification.userId !== user!.id || notification.audience !== "CUSTOMER") {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 403 }
        );
      }
    }

    // Update notification
    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { isRead },
    });

    return NextResponse.json({
      success: true,
      message: `Notification marked as ${isRead ? "read" : "unread"}`,
      notification: updatedNotification,
    });
  } catch (error: any) {
    console.error("Error in PATCH /api/notifications/[id]:", error);
    return handleApiError(error, "UPDATE NOTIFICATION");
  }
}

// DELETE - Delete single notification
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, response } = await requireAuthAPI();
    if (response) return response;

    const { id } = await params;

    // Check if notification belongs to user
    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      return NextResponse.json(
        { success: false, message: "Notification not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (user!.role === "ADMIN") {
      if (notification.audience !== "ADMIN") {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 403 }
        );
      }
    } else {
      if (notification.userId !== user!.id || notification.audience !== "CUSTOMER") {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 403 }
        );
      }
    }

    // Delete notification
    await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/notifications/[id]:", error);
    return handleApiError(error, "DELETE NOTIFICATION");
  }
}