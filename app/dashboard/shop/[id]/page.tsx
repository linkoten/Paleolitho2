import React, { Suspense } from "react";
import { getProduct, getProductRatings } from "@/lib/actionsProducts";
import SelectImage from "@/app/components/shop/SelectImage";
import Loading from "@/app/components/Loading";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { getUserFromDatabase } from "@/lib/userAction";
import { notFound } from "next/navigation";

// The correct way to define types for dynamic routes in Next.js 14+
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Await the params to properly access the id
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found",
    };
  }

  return {
    title: `${product.title} | Paleolitho Shop`,
    description: product.description || "Product details",
  };
}

export default async function ProductPage({ params }: PageProps) {
  // Await the params before accessing properties
  const { id } = await params;

  // Authentication check
  const { userId } = await auth();

  // Data fetching using the awaited id
  const product = await getProduct(id);

  // Récupérer les avis sur le produit
  const ratings = await getProductRatings(id);

  // Rest of your code remains the same
  let user = null;
  if (userId) {
    user = await getUserFromDatabase(userId);
  }

  if (!product) {
    return notFound();
  }

  if (!ratings) {
    console.error("Impossible de charger les avis pour ce produit");
  }

  const isAuthenticated = !!userId && !!user;

  return (
    <>
      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4 text-amber-800">
          <p>
            Connectez-vous pour ajouter ce produit à votre panier ou le noter.
          </p>
        </div>
      )}

      <Suspense fallback={<Loading />}>
        <SelectImage
          product={product}
          user={user}
          ratings={ratings}
          isAuthenticated={isAuthenticated}
        />
      </Suspense>
    </>
  );
}
