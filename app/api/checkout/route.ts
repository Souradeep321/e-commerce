// app/api/checkout/route.ts
// ✅ FIXED VERSION - All TypeScript errors resolved

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";
import Razorpay from "razorpay";
import { orderAddressSchema } from "@/schemas/order.schema";
import { writeRateLimit } from "@/lib/rate-limit";
import {checkRateLimit} from "@/lib/rate-limit-helper";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// ============================================
// POST - Create order (requires authentication)
// ============================================
export async function POST(req: Request) {
  try {
    // ✅ FIXED: Using helper function
    const { user, response } = await requireAuthAPI();
    if (response) return response; // Unauthorized

    const ratelimitResponse = await checkRateLimit(writeRateLimit, `checkout:${user!.email}`);
    if (ratelimitResponse) return ratelimitResponse;

    if (!user!.isVerified) {
      return NextResponse.json(
        { success: false, message: "Please verify your email before checkout", requiresVerification: true },
        { status: 403 }
      );
    }


    // Get user's active cart
    const cart = await prisma.cart.findFirst({
      where: {
        userId: user!.id,
        status: "ACTIVE",
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // ✅ FIXED: TypeScript null check + Better error handling
    const stockErrors: string[] = [];

    for (const item of cart.items) {
      // Check if product exists
      if (!item.product) {
        stockErrors.push("Invalid cart item detected");
        continue;
      }

      // Check if product is active
      if (!item.product.isActive) {
        stockErrors.push(`${item.product.name} is no longer available`);
        continue;
      }

      // Check stock
      const availableStock = item.variant?.stock ?? item.product.stock ?? 0;

      if (item.quantity > availableStock) {
        stockErrors.push(
          `${item.product.name}${item.variant ? ` (${item.variant.size})` : ""}: ` +
          `Only ${availableStock} available (you have ${item.quantity} in cart)`
        );
      }
    }

    if (stockErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Some items have stock issues",
          errors: stockErrors,
        },
        { status: 400 }
      );
    }

    // Calculate total amount (in paise)
    const totalAmount = cart.items.reduce((sum, item) => {
      // ✅ FIXED: Null check for product
      if (!item.product) return sum;

      const itemPrice = item.variant?.price ?? item.product.price ?? 0;
      return sum + itemPrice * item.quantity;
    }, 0);

    // Get address
    const { addressId, newAddress } = await req.json();

    let addressData;

    if (addressId) {
      // existing saved address, as before
      const savedAddress = await prisma.userAddress.findFirst({
        where: { id: addressId, userId: user!.id },
      });
      if (!savedAddress) {
        return NextResponse.json({ success: false, message: "Address not found" }, { status: 404 });
      }
      addressData = savedAddress;

    } else if (newAddress) {
      // user typed a one-time address right at checkout — validate it
      const parsed = orderAddressSchema.safeParse(newAddress);
      if (!parsed.success) {
        return NextResponse.json({ success: false, message: "Invalid address" }, { status: 400 });
      }
      addressData = parsed.data;

    } else {
      // fallback to default saved address
      const defaultAddress = await prisma.userAddress.findFirst({
        where: { userId: user!.id, isDefault: true },
      });
      if (!defaultAddress) {
        return NextResponse.json(
          { success: false, message: "Please provide a delivery address" },
          { status: 400 }
        );
      }
      addressData = defaultAddress;
    }

    // ✅ FIXED: Razorpay amount (already in paise, so no conversion needed)
    // If your prices are stored as rupees, multiply by 100:
    // amount: totalAmount * 100
    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount, // Amount in paise (assuming DB stores prices in paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: user!.id,
      },
    });

    // Create order in database
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId: user!.id,
          totalAmount,
          status: "PENDING",
          razorpayOrderId: razorpayOrder.id,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId!,
              variantId: item.variantId,
              price: item.variant?.price ?? item.product?.price ?? 0,
              quantity: item.quantity,
            })),
          },
          address: {
            create: {
              fullName: addressData.fullName,
              phone: addressData.phone,
              addressLine1: addressData.addressLine1,
              addressLine2: addressData.addressLine2,
              city: addressData.city,
              state: addressData.state,
              postalCode: addressData.postalCode,
              country: addressData.country,
            },
          },
        },
        include: {
          items: { include: { product: true, variant: true } },
          address: true,
        },
      });

      await tx.cart.update({
        where: { id: cart.id },
        data: { status: "CONVERTED" },
      });

      return newOrder;
    });


    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: {
        id: order.id,
        totalAmount: order.totalAmount,
        razorpayOrderId: razorpayOrder.id,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Checkout failed" },
      { status: 500 }
    );
  }
}

// ============================================
// GET - Get checkout details (for checkout page)
// ============================================
export async function GET(req: Request) {
  try {
    // ✅ FIXED: Using helper function
    const { user, response } = await requireAuthAPI();

    if (response) {
      return response; // Unauthorized
    }

    // Get cart
    const cart = await prisma.cart.findFirst({
      where: {
        userId: user!.id,
        status: "ACTIVE",
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: { take: 1, select: { url: true } },
              },
            },
            variant: {
              select: {
                id: true,
                size: true,
                price: true,
                stock: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 }
      );
    }

    // Get user addresses
    const addresses = await prisma.userAddress.findMany({
      where: { userId: user!.id },
      orderBy: { isDefault: "desc" },
    });

    // Calculate totals (with null checks)
    const subtotal = cart.items.reduce((sum, item) => {
      if (!item.product) return sum;

      const itemPrice = item.variant?.price ?? item.product.price ?? 0;
      return sum + itemPrice * item.quantity;
    }, 0);

    const shipping = 0; // Free shipping or calculate based on your logic
    const tax = Math.round(subtotal * 0.18); // 18% GST
    const total = subtotal + shipping + tax;

    return NextResponse.json({
      success: true,
      data: {
        cart: {
          items: cart.items,
          itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
          subtotal,
          shipping,
          tax,
          total,
        },
        addresses,
        user: {
          name: user!.name,
          email: user!.email,
        },
      },
    });
  } catch (error) {
    console.error("GET CHECKOUT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch checkout details" },
      { status: 500 }
    );
  }
}