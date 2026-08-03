// app/api/payment/verify/route.ts
// ✅ FIXED VERSION - Using auth helpers & null checks

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";
import crypto from "crypto";
import { handleApiError } from "@/lib/api-error-handler";

export async function POST(req: Request) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = await req.json();
  try {
    // ✅ FIXED: Using helper function
    const { user, response } = await requireAuthAPI();

    if (response) {
      return response; // Unauthorized
    }

    // ========================================
    // VERIFY RAZORPAY SIGNATURE
    // ========================================
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // ========================================
    // GET ORDER WITH ITEMS
    // ========================================
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    if (order.razorpayOrderId !== razorpay_order_id) {
      return NextResponse.json(
        { success: false, message: "Order mismatch" },
        { status: 400 }
      );
    }

    // ========================================
    // VERIFY OWNERSHIP
    // ========================================
    if (order.userId !== user!.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    // ========================================
    // DOUBLE-CHECK STOCK (Race Condition Protection)
    // ========================================
    const stockErrors: string[] = [];

    for (const item of order.items) {
      // ✅ FIXED: Null check for product
      if (!item.product) {
        stockErrors.push("Invalid order item detected");
        continue;
      }

      const currentStock = item.variant?.stock ?? item.product.stock ?? 0;

      if (item.quantity > currentStock) {
        stockErrors.push(
          `${item.product.name}${item.variant ? ` (${item.variant.size})` : ""}: ` +
          `Stock changed. Only ${currentStock} available`
        );
      }
    }

    if (stockErrors.length > 0) {
      // Payment succeeded but stock unavailable
      // Mark order as FAILED (you should initiate refund process here)
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "FAILED" },
      });

      return NextResponse.json(
        {
          success: false,
          message: "Stock unavailable. Payment will be refunded.",
          errors: stockErrors,
          requiresRefund: true,
        },
        { status: 400 }
      );
    }

    // ========================================
    // UPDATE ORDER & REDUCE STOCK (ATOMIC TRANSACTION)
    // ========================================
    await prisma.$transaction(async (tx) => {
      // 1. Update order status
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          paymentCaptured: true,
        },
      });

      // 2. Reduce stock for each item
      for (const item of order.items) {
        if (item.variantId) {
          // Reduce variant stock
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        } else {
          // Reduce product stock
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // 3. Create notification for customer
      await tx.notification.create({
        data: {
          userId: user!.id,
          audience: "CUSTOMER",
          type: "ORDER_PLACED",
          title: "Order Placed Successfully",
          message: `Your order #${orderId.slice(-8)} has been placed successfully`,
          entityId: orderId,
        },
      });

      // 4. Create notification for admin
      await tx.notification.create({
        data: {
          audience: "ADMIN",
          type: "ORDER_PLACED",
          title: "New Order Received",
          message: `New order #${orderId.slice(-8)} worth ₹${order.totalAmount / 100}`,
          entityId: orderId,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      orderId,
    });
  } catch (error) {
    console.error("PAYMENT VERIFICATION ERROR in POST /api/payment/verify:", error);

    if (orderId) {
      try {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: "FAILED" },
        });
      } catch (e) {
        console.error("Failed to mark order as failed:", e);
      }
    }

        return handleApiError(error, "PAYMENT VERIFICATION");

  }
}