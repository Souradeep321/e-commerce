// lib/cart-merge.ts
import prisma from "@/lib/prisma";

/**
 * Merges guest cart with user cart when user logs in
 * @param userId - The logged-in user's ID
 * @param sessionId - The guest session ID from cookies
 */
export async function mergeGuestCartWithUserCart(
  userId: string,
  sessionId: string
): Promise<void> {
  try {
    // Find guest cart
    const guestCart = await prisma.cart.findFirst({
      where: {
        sessionId,
        userId: null,
        status: "ACTIVE",
      },
      include: { items: true },
    });

    if (!guestCart || guestCart.items.length === 0) {
      return; // Nothing to merge
    }

    // Find or create user cart
    let userCart = await prisma.cart.findFirst({
      where: {
        userId,
        status: "ACTIVE",
      },
      include: { items: true },
    });

    if (!userCart) {
      // Convert guest cart to user cart
      await prisma.cart.update({
        where: { id: guestCart.id },
        data: {
          userId,
          sessionId: null, // Clear session ID
        },
      });
      return;
    }

    // Merge items from guest cart to user cart
    for (const guestItem of guestCart.items) {
      const existingUserItem = userCart.items.find(
        (item) =>
          item.productId === guestItem.productId &&
          item.variantId === guestItem.variantId
      );

      if (existingUserItem) {
        // Update quantity
        await prisma.cartItem.update({
          where: { id: existingUserItem.id },
          data: {
            quantity: existingUserItem.quantity + guestItem.quantity,
          },
        });
      } else {
        // Move item to user cart
        await prisma.cartItem.update({
          where: { id: guestItem.id },
          data: { cartId: userCart.id },
        });
      }
    }

    // Delete empty guest cart
    await prisma.cart.delete({
      where: { id: guestCart.id },
    });
  } catch (error) {
    console.error("CART MERGE ERROR:", error);
    // Don't throw - cart merge failure shouldn't prevent login
  }
}

/**
 * Get active cart for user or guest
 */
export async function getActiveCart(userId?: string, sessionId?: string) {
  if (userId) {
    // Logged-in user
    let cart = await prisma.cart.findFirst({
      where: { userId, status: "ACTIVE" },
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

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId, status: "ACTIVE" },
        include: { items: { include: { product: true, variant: true } } },
      });
    }

    return cart;
  } else if (sessionId) {
    // Guest user
    let cart = await prisma.cart.findFirst({
      where: { sessionId, userId: null, status: "ACTIVE" },
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

    if (!cart) {
      cart = await prisma.cart.create({
        data: { sessionId, status: "ACTIVE" },
        include: { items: { include: { product: true, variant: true } } },
      });
    }

    return cart;
  }

  return null;
}
