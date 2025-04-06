"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEmptyCart(userId: string) {
  return await prisma.cart.create({
    data: {
      userId: userId,
      // Add other default cart fields here as needed
    },
  });
}

export async function deleteFromCard(formData: FormData) {
  const cartId = formData.get("cartId");
  const productId = formData.get("productId");
  console.log("Petit texte", cartId, productId);

  try {
    // Supprime l'élément du panier
    await prisma.cartItem.delete({
      where: {
        cartId_productId: {
          cartId: cartId as string,
          productId: productId as string,
        },
      },
    });
    // Ne retourne rien (void)
  } catch (error) {
    console.error("Error removing cart item:", error);
  } finally {
    revalidatePath("/");
  }
}

export async function getCart(userId: string) {
  try {
    const cart = await prisma.cart.findUnique({
      where: {
        userId: userId,
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });
    return cart;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw new Error("Could not fetch cart");
  }
}

export async function emptyCart(userId: string) {
  try {
    await prisma.cart.update({
      where: { userId },
      data: {
        cartItems: { deleteMany: {} }, // Delete all cart items
      },
    });
    console.log("Cart emptied successfully for user:", userId);
  } catch (error) {
    console.error("Error emptying cart:", error);
    throw new Error("Failed to empty cart"); // Re-throw for handling
  } finally {
    redirect("/dashboard/shop");
  }
}

export const updateCart = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string;
    const quantity = formData.get("quantity") as number | null;

    if (id !== null) {
      await prisma.cartItem.update({
        where: { id },
        data: { quantity: quantity as number | 1 },
      });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
  } finally {
    redirect("/dashboard/shop");
  }
};

interface DeleteFromCartProps {
  userId: string;
  productId: string;
}

export async function deleteProductFromCart({
  userId,
  productId,
}: DeleteFromCartProps) {
  console.log("deleteProductFromCart function called"); // Initial log to check function execution
  console.log("deleteProductFromCart called with:", { userId, productId });

  try {
    // Find the user's cart
    console.log("Finding cart for userId:", userId);
    const cart = await prisma.cart.findUnique({
      where: { userId: userId },
    });
    console.log("Cart found:", cart);

    if (!cart) {
      console.error("Cart not found for the user");
      throw new Error("Cart not found for the user");
    }

    // Delete the product from the cart
    const updatedCart = await prisma.cart.update({
      where: { id: cart.id },
      data: {
        cartItems: {
          delete: {
            cartId_productId: { cartId: cart.id, productId },
          },
        },
      },
      include: { cartItems: true },
    });

    console.log("Product deleted from cart:", updatedCart);
    return updatedCart;
  } catch (error) {
    console.error("Failed to delete product from cart:", error);
    throw new Error("Failed to delete product from cart");
  }
}

export async function addToCart(formData: FormData) {
  const userId = formData.get("userId") as string;
  const productId = formData.get("productId") as string;
  const quantity = Number(formData.get("quantity"));

  try {
    // Find the user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId: userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: userId,
          cartItems: {
            create: {
              productId,
              quantity,
            },
          },
        },
      });
    } else {
      // Update existing cart
      await prisma.cart.update({
        where: { id: cart.id },
        data: {
          cartItems: {
            upsert: {
              where: { cartId_productId: { cartId: cart.id, productId } },
              update: { quantity: { increment: quantity } },
              create: { productId, quantity },
            },
          },
        },
      });
    }

    // Ne retournez rien (void)
  } catch (error) {
    console.error("Failed to update cart:", error);
  } finally {
    revalidatePath("/");
  }
}
