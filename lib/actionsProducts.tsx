"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const getAllProducts = async () => {
  const data = await prisma.products.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
};

export const getFavoritesProducts = async (userId: string) => {
  const favoriteProducts = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      favorites: {
        select: {
          product: true,
        },
      },
    },
  });
  return favoriteProducts;
};

export const toggleFavorite = async (formData: FormData) => {
  const userId = formData.get("userId") as string;
  const productId = formData.get("productId") as string;

  try {
    // Vérifier si le produit est déjà dans les favoris de l'utilisateur
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingFavorite) {
      // Si le produit est déjà dans les favoris, le retirer
      await prisma.favorite.delete({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });
      return { message: "Product removed from favorites" };
    } else {
      // Si le produit n'est pas dans les favoris, l'ajouter
      const favorite = await prisma.favorite.create({
        data: {
          userId,
          productId,
        },
      });
      return favorite;
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  } finally {
    revalidatePath("/");
  }
};

export async function rateProduct(formData: FormData) {
  const userId = formData.get("userId") as string;
  const productId = formData.get("productId") as string;
  const rating = Number(formData.get("rating") as unknown);

  // Vérifiez si la note existe déjà
  // Vérifiez si la note existe déjà
  const existingRating = await prisma.rating.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existingRating) {
    // Mettre à jour la note existante
    await prisma.rating.update({
      where: {
        id: existingRating.id,
      },
      data: {
        rating,
      },
    });
  } else {
    // Créer une nouvelle note
    await prisma.rating.create({
      data: {
        userId,
        productId,
        rating,
      },
    });
  }
  redirect(`/dashboard/shop/${productId}`);
}
export const getProductRatings = async (productId: string) => {
  const productRatings = await prisma.products.findUnique({
    where: {
      id: productId,
    },
    include: {
      ratings: {
        include: {
          user: true,
        },
      },
    },
  });
  return productRatings;
};

export async function getProductRating(productId: string) {
  try {
    const ratings = await prisma.rating.findMany({
      where: {
        productId: productId,
      },
      include: {
        user: true, // Inclure les informations de l'utilisateur si nécessaire
      },
    });

    return ratings;
  } catch (error) {
    console.error("Erreur lors de la récupération des notations :", error);
    throw error;
  }
}

export async function getUserProductRating(userId: string, productId: string) {
  try {
    const rating = await prisma.rating.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return rating;
  } catch (error) {
    console.error("Erreur lors de la récupération de la notation :", error);
    throw error;
  }
}

const ITEMS_PER_PAGE = 12;

export async function fetchFilteredPages(
  query: string,
  currentPage: number,
  country: string,
  locality: string,
  period: string,
  stages: string,
  category: string
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const products = await prisma.products.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
          { country: { contains: query, mode: "insensitive" } },
          { locality: { contains: query, mode: "insensitive" } },
          { period: { contains: query, mode: "insensitive" } },
          { stages: { contains: query, mode: "insensitive" } },
        ],
        AND: [
          { category: { contains: category, mode: "insensitive" } },
          { country: { contains: country, mode: "insensitive" } },
          { locality: { contains: locality, mode: "insensitive" } },
          { period: { contains: period, mode: "insensitive" } },
          { stages: { contains: stages, mode: "insensitive" } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });

    return products;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchProductsPages(
  query: string,
  country: string,
  locality: string,
  period: string,
  stages: string,
  category: string
) {
  try {
    const count = await prisma.products.count({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
          { country: { contains: query, mode: "insensitive" } },
          { locality: { contains: query, mode: "insensitive" } },
          { period: { contains: query, mode: "insensitive" } },
          { stages: { contains: query, mode: "insensitive" } },
        ],
        AND: [
          { category: { contains: category, mode: "insensitive" } },
          { country: { contains: country, mode: "insensitive" } },
          { locality: { contains: locality, mode: "insensitive" } },
          { period: { contains: period, mode: "insensitive" } },
          { stages: { contains: stages, mode: "insensitive" } },
        ],
      },
    });
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Error updating product:", error);
  }
}

export const createProduct = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const country = formData.get("country") as string;
  const locality = formData.get("locality") as string;
  const period = formData.get("period") as string;
  const stages = formData.get("stages") as string;
  const price = Number(formData.get("price") as unknown);
  const stock = Number(formData.get("stock") as unknown);
  const weight = Number(formData.get("weight") as unknown);

  const images = formData.getAll("images") as string[];

  if (
    !title ||
    !description ||
    !category ||
    !country ||
    !locality ||
    !period ||
    !stages ||
    isNaN(price) ||
    isNaN(stock) ||
    isNaN(weight) ||
    images.length === 0
  ) {
    throw new Error("Invalid form data");
  }

  await prisma.products.create({
    data: {
      title,
      description,
      category,
      country,
      locality,
      period,
      stages,
      price,
      stock,
      weight,
      images,
    },
  });
  redirect("/dashboard/admin");
};

export const deleteProduct = async (formData: FormData) => {
  const id = formData.get("id") as string;
  await prisma.products.delete({
    where: { id },
  });
  revalidatePath("/");
};

export const getProduct = async (id: string) => {
  const product = await prisma.products.findUnique({
    where: { id: id },
  });

  if (product && product.images) {
    product.images = product.images.filter((image) => image !== "");
  }

  return product;
};

export const updateProduct = async (formData: FormData) => {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const country = formData.get("country") as string;
    const locality = formData.get("locality") as string;
    const period = formData.get("period") as string;
    const stages = formData.get("stages") as string;
    const weight = Number(formData.get("weight") as unknown);
    const price = Number(formData.get("price") as unknown);
    const stock = Number(formData.get("stock") as unknown);
    const images = formData.getAll("images") as string[];

    if (title !== null || description !== null) {
      await prisma.products.update({
        where: { id },
        data: {
          title,
          description,
          price,
          stock,
          category,
          images,
          country,
          locality,
          period,
          stages,
          weight,
        },
      });
    }
  } catch (error) {
    console.error("Error updating note:", error);
  } finally {
    redirect("/dashboard/admin");
  }
};

export const getCheckoutProducts = async (data: { title: string }) => {
  const products = await prisma.products.findMany({
    where: {
      title: data.title, // Filter by the provided ID
    },
  });
  return products;
};

export const decrementProductStock = async (
  productId: string,
  quantity: any
) => {
  try {
    await prisma.products.update({
      where: { id: productId },
      data: {
        stock: {
          decrement: quantity, // Decrement stock by 1 unit
        },
      },
    });
    console.log("Stock decremented for product:", productId);
  } catch (error) {
    console.error("Error decrementing product stock:", error);
  }
};

export const restoreProductStock = async (productId: string, quantity: any) => {
  try {
    await prisma.products.update({
      where: { id: productId },
      data: {
        stock: {
          increment: quantity, // Decrement stock by 1 unit
        },
      },
    });
    console.log("Stock incremented for product:", productId);
  } catch (error) {
    console.error("Error incrementing product stock:", error);
  }
};

export async function getProductsByCategory(category: string) {
  const selectFields = {
    id: true,
    title: true,
    images: true,
    category: true,
    country: true,
    locality: true,
    period: true,
    stages: true,
  } as const;

  // Le type sera automatiquement inféré en fonction des champs sélectionnés
  return await prisma.products.findMany({
    where: { category },
    select: selectFields,
  });
}

export async function getProductsByCountry(country: string) {
  const selectFields = {
    id: true,
    title: true,
    images: true,
    category: true,
    country: true,
    locality: true,
    period: true,
    stages: true,
  } as const;

  return await prisma.products.findMany({
    where: { country },
    select: selectFields,
  });
}

export async function getProductsByLocality(locality: string) {
  const selectFields = {
    id: true,
    title: true,
    images: true,
    category: true,
    country: true,
    locality: true,
    period: true,
    stages: true,
  } as const;

  return await prisma.products.findMany({
    where: { locality },
    select: selectFields,
  });
}

export async function getProductsByPeriod(period: string) {
  const selectFields = {
    id: true,
    title: true,
    images: true,
    category: true,
    country: true,
    locality: true,
    period: true,
    stages: true,
  } as const;

  return await prisma.products.findMany({
    where: { period },
    select: selectFields,
  });
}

export async function getProductsByStage(stages: string) {
  const selectFields = {
    id: true,
    title: true,
    images: true,
    category: true,
    country: true,
    locality: true,
    period: true,
    stages: true,
  } as const;

  return await prisma.products.findMany({
    where: { stages },
    select: selectFields,
  });
}
