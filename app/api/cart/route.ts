// app/api/cart/route.ts
// ✅ FINAL UNIFIED CART API - USE THIS ONE
// Handles both guest and authenticated users automatically

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { cartItemSchema, cartSchema } from "@/schemas/cart.schema";
import { writeRateLimit } from "@/lib/rate-limit";
import { checkRateLimit } from "@/lib/rate-limit-helper";
import { handleApiError } from "@/lib/api-error-handler";

// ============================================
// HELPER: Get or create guest session ID
// ============================================
async function getGuestSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("guest_session_id")?.value;

  if (!sessionId) {
    sessionId = uuidv4();
    cookieStore.set("guest_session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return sessionId;
}

// FIXME: GET/POST/DELETE all duplicate the same "find or create active cart"
// logic (auth vs guest branching). Refactor to use getActiveCart() from
// lib/cart-merge.ts instead, so this logic lives in one place.
/*
const cart = session?.user?.id
  ? await getActiveCart(session.user.id)
  : await getActiveCart(undefined, await getGuestSessionId());
*/

// ============================================
// GET - Fetch cart (works for both)
// ============================================
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    let cart;

    if (session?.user?.id) {
      // ✅ AUTHENTICATED USER
      cart = await prisma.cart.findFirst({
        where: {
          userId: session.user.id,
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
                  minPrice: true,
                  maxPrice: true,
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

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            userId: session.user.id,
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
                    minPrice: true,
                    maxPrice: true,
                    images: { take: 1, select: { url: true } },
                  },
                },
                variant: true,
              },
            },
          },
        });
      }
    } else {
      // ✅ GUEST USER
      const sessionId = await getGuestSessionId();

      cart = await prisma.cart.findFirst({
        where: {
          sessionId,
          userId: null,
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
                  minPrice: true,
                  maxPrice: true,
                  images: { take: 1, select: { url: true } },
                },
              },
              variant: true,
            },
          },
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: {
            sessionId,
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
                    minPrice: true,
                    maxPrice: true,
                    images: { take: 1, select: { url: true } },
                  },
                },
                variant: true,
              },
            },
          },
        });
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => {
      const itemPrice = item.variant?.price || item.product?.price || 0;
      return sum + itemPrice * item.quantity;
    }, 0);

    return NextResponse.json({
      success: true,
      message: "Cart fetched successfully",
      cart: {
        ...cart,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
      },
    });
  } catch (error) {
    console.error("Error in GET /api/cart:", error);
    return handleApiError(error, "GET CART");
  }
}

// ============================================
// POST - Add item to cart
// ============================================
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Determine rate-limit identifier based on auth status
    const identifier = session?.user?.id
      ? `add-to-cart:${session.user.id}`
      : `add-to-cart:${await getGuestSessionId()}`;

    const rateLimitResponse = await checkRateLimit(writeRateLimit, identifier);
    if (rateLimitResponse) return rateLimitResponse;

    const body = await req.json();
    const parsed = cartItemSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: "Invalid cart item" }, { status: 400 });
    }
    const { productId, productVariantId: variantId, quantity } = parsed.data;

    // Verify product exists and is active
    const product = await prisma.product.findFirst({
      where: { id: productId, isActive: true },
      include: { variants: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found or inactive" },
        { status: 404 }
      );
    }

    // Check stock availability
    let availableStock = 0;
    if (variantId) {
      const variant = product.variants.find((v) => v.id === variantId);
      if (!variant) {
        return NextResponse.json(
          { success: false, message: "Variant not found" },
          { status: 404 }
        );
      }
      availableStock = variant.stock;
    } else {
      availableStock = product.stock || 0;
    }

    if (quantity > availableStock) {
      return NextResponse.json(
        {
          success: false,
          message: `Only ${availableStock} items available in stock`,
        },
        { status: 400 }
      );
    }

    // Get or create cart (based on auth status)
    let cart;

    if (session?.user?.id) {
      // ✅ AUTHENTICATED USER
      cart = await prisma.cart.findFirst({
        where: { userId: session.user.id, status: "ACTIVE" },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId: session.user.id, status: "ACTIVE" },
        });
      }
    } else {
      // ✅ GUEST USER
      const sessionId = await getGuestSessionId();

      cart = await prisma.cart.findFirst({
        where: { sessionId, userId: null, status: "ACTIVE" },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { sessionId, status: "ACTIVE" },
        });
      }
    }

    // Check if item already in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      // Check if new quantity exceeds stock
      if (newQuantity > availableStock) {
        return NextResponse.json(
          {
            success: false,
            message: `Cannot add more. Only ${availableStock} items available`,
          },
          { status: 400 }
        );
      }

      // Update existing item
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Create new cart item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId: variantId || null,
          quantity,
        },
      });
    }

    // Fetch updated cart with all details
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
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
            variant: true,
          },
        },
      },
    });

    // Add this:
    const subtotal = updatedCart!.items.reduce((sum, item) => {
      const itemPrice = item.variant?.price ?? item.product?.price ?? 0;
      return sum + itemPrice * item.quantity;
    }, 0);

    const itemCount = updatedCart!.items.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({
      success: true,
      message: "Item added to cart successfully",
      cart: {
        ...updatedCart,
        itemCount,
        subtotal,
      },
    });
  } catch (error) {
    console.error("Error in POST /api/cart:", error);
    return handleApiError(error, "ADD TO CART");
  }
}

// ============================================
// PATCH - Update item quantity
// ============================================
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    const identifier = session?.user?.id
      ? `update-cart:${session.user.id}`
      : `update-cart:${await getGuestSessionId()}`;

    const rateLimitResponse = await checkRateLimit(writeRateLimit, identifier);
    if (rateLimitResponse) return rateLimitResponse;


    const { itemId, quantity } = await req.json();

    // Validation
    if (!itemId || quantity < 0) {
      return NextResponse.json(
        { success: false, message: "Invalid request" },
        { status: 400 }
      );
    }

    // Find the cart item with cart details
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
        variant: true,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { success: false, message: "Cart item not found" },
        { status: 404 }
      );
    }

    // Verify ownership (important security check!)
    if (session?.user?.id) {
      // Authenticated user
      if (cartItem.cart.userId !== session.user.id) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 403 }
        );
      }
    } else {
      // Guest user
      const sessionId = await getGuestSessionId();
      if (cartItem.cart.sessionId !== sessionId) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 403 }
        );
      }
    }

    if (quantity === 0) {
      // Remove item from cart
      await prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      // Check stock before updating
      const availableStock = cartItem.variant?.stock ?? cartItem.product?.stock ?? 0;

      if (quantity > availableStock) {
        return NextResponse.json(
          {
            success: false,
            message: `Only ${availableStock} items available`,
          },
          { status: 400 }
        );
      }

      // Update quantity
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    // Fetch updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { id: cartItem.cart.id },
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
            variant: true,
          },
        },
      },
    });

    // Add this:
    const subtotal = updatedCart!.items.reduce((sum, item) => {
      const itemPrice = item.variant?.price ?? item.product?.price ?? 0;
      return sum + itemPrice * item.quantity;
    }, 0);

    const itemCount = updatedCart!.items.reduce((sum, item) => sum + item.quantity, 0);

    return NextResponse.json({
      success: true,
      message: "Cart updated successfully",
      cart: {
        ...updatedCart,
        itemCount,
        subtotal,
      },
    });
  } catch (error) {
    console.error("Error in PATCH /api/cart:", error);
    return handleApiError(error, "UPDATE CART");
  }
}

// ============================================
// DELETE - Clear entire cart
// ============================================
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    const identifier = session?.user?.id
      ? `clear-cart:${session.user.id}`
      : `clear-cart:${await getGuestSessionId()}`;

    const rateLimitResponse = await checkRateLimit(writeRateLimit, identifier);
    if (rateLimitResponse) return rateLimitResponse;


    let cart;

    if (session?.user?.id) {
      // Authenticated user
      cart = await prisma.cart.findFirst({
        where: { userId: session.user.id, status: "ACTIVE" },
      });
    } else {
      // Guest user
      const sessionId = await getGuestSessionId();
      cart = await prisma.cart.findFirst({
        where: { sessionId, userId: null, status: "ACTIVE" },
      });
    }

    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 }
      );
    }

    // Delete all items in the cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/cart:", error);
    return handleApiError(error, "CLEAR CART");
  }
}