// app/api/checkout/route.ts
// ✅ FIXED VERSION - All TypeScript errors resolved

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuthAPI } from "@/lib/auth";
import Razorpay from "razorpay";

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
    
    if (response) {
      return response; // Unauthorized
    }

    const { addressId } = await req.json();

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
    let address;
    if (addressId) {
      address = await prisma.userAddress.findFirst({
        where: {
          id: addressId,
          userId: user!.id,
        },
      });

      if (!address) {
        return NextResponse.json(
          { success: false, message: "Address not found" },
          { status: 404 }
        );
      }
    } else {
      // Get default address
      address = await prisma.userAddress.findFirst({
        where: {
          userId: user!.id,
          isDefault: true,
        },
      });

      if (!address) {
        return NextResponse.json(
          {
            success: false,
            message: "No delivery address found. Please add an address.",
          },
          { status: 400 }
        );
      }
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
    const order = await prisma.order.create({
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
            fullName: address.fullName,
            phone: address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        address: true,
      },
    });

    // Mark cart as converted
    await prisma.cart.update({
      where: { id: cart.id },
      data: { status: "CONVERTED" },
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