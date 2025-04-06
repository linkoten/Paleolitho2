import { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/actionsProducts";
import { getAllBlogPosts } from "@/lib/actionsBlog"; // Si vous avez cette fonction

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // URL de base
  const baseUrl = "https://www.paleolitho.com";

  // Pages statiques
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/dashboard/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  // Pages produits dynamiques
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getAllProducts();
    productPages = products.map((product) => ({
      url: `${baseUrl}/dashboard/shop/${product.id}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des produits pour le sitemap:",
      error
    );
  }

  // Pages blog dynamiques (si applicable)
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    // Si vous avez une fonction pour récupérer tous les articles de blog
    if (typeof getAllBlogPosts === "function") {
      const posts = await getAllBlogPosts();
      blogPages = posts.map((post) => ({
        url: `${baseUrl}/dashboard/blog/${post.slug || post.id}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "monthly",
        priority: 0.5,
      }));
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des articles pour le sitemap:",
      error
    );
  }

  // Combiner toutes les URLs
  return [...staticPages, ...productPages, ...blogPages];
}
