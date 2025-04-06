import React, { Suspense } from "react";
import { getProduct, getProductRatings } from "@/lib/actionsProducts";
import SelectImage from "@/app/components/shop/SelectImage";
import Loading from "@/app/components/Loading";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { getUserFromDatabase } from "@/lib/userAction";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>; // Already updated to match the expected type
  searchParams: Promise<{ [key: string]: string }>; // Updated to match the expected type
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { userId } = await auth();

  const { id } = await params; // Await the params if it's a Promise
  const searchParamsResolved = await searchParams; // Await the searchParams if it's a Promise

  // Data fetching
  const product = await getProduct(id);

  // Récupérer les avis sur le produit
  const ratings = await getProductRatings(id);

  // Récupérer les informations utilisateur si connecté
  let user = null;
  if (userId) {
    user = await getUserFromDatabase(userId);
  }

  // Vérifier que le produit existe
  if (!product) {
    return notFound();
  }

  // Vérifier que les avis sont disponibles
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
