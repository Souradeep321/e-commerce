import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminAPI } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error-handler";

// GET - Single order details (ADMIN)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, response } = await requireAdminAPI();
    if (response) return response;

    const { id } = await params;
    if (!id) return NextResponse.json({ message: "Order ID missing" }, { status: 400 });

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                images: { take: 1, select: { url: true } },
              },
            },
            variant: {
              select: {
                id: true,
                size: true,
                price: true,
              },
            },
          },
        },
        address: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/orders/[id]:", error);
    return handleApiError(error, "FETCH ORDER");
  }
}

// PATCH - Update order status (ADMIN)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, response } = await requireAdminAPI();
    if (response) return response;

    const { id } = await params;
    if (!id) return NextResponse.json({ message: "Order ID missing" }, { status: 400 });
    const { status } = await req.json();

    // Validate status
    const validStatuses = [
      "PENDING",
      "PAID",
      "FAILED",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    // Create notification for customer
    await prisma.notification.create({
      data: {
        userId: order.userId,
        audience: "CUSTOMER",
        type: "ORDER_STATUS_UPDATE",
        title: "Order Status Updated",
        message: `Your order #${id.slice(-8)} is now ${status}`,
        entityId: id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error in PATCH /api/admin/orders/[id]:", error);
    return handleApiError(error, "UPDATE ORDER STATUS");
  }
}



// DELETE - Delete delivered order (ADMIN)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, response } = await requireAdminAPI();
    if (response) return response;

    const { id } = await params;
    if (!id) return NextResponse.json({ message: "Order ID missing" }, { status: 400 });

    // Find order to verify it exists
    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        status: true,
        items: { select: { id: true } },
        address: { select: { id: true } },
        reviews: { select: { id: true } },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // ========================================
    // ✅ MANUAL CASCADE DELETE (Transaction)
    // ========================================
    await prisma.$transaction(async (tx) => {
      // 1. Delete all reviews for this order
      await tx.review.deleteMany({
        where: { orderId: id },
      });

      // 2. Delete all order items
      await tx.orderItem.deleteMany({
        where: { orderId: id },
      });

      // 3. Delete order address
      if (order.address) {
        await tx.orderAddress.delete({
          where: { orderId: id },
        });
      }

      // 4. Delete the order itself
      await tx.order.delete({
        where: { id },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
      deleted: {
        reviews: order.reviews.length,
        items: order.items.length,
        address: order.address ? 1 : 0,
      },
    });
  } catch (error: any) {
    console.error("Error in DELETE /api/admin/orders/[id]:", error);
    return handleApiError(error, "DELETE ORDER");
  }
}