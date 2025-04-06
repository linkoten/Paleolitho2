import React, { Suspense } from "react";
import { getProduct, getProductRatings } from "@/lib/actionsProducts";
import SelectImage from "@/app/components/shop/SelectImage";
import Loading from "@/app/components/Loading";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { getUserFromDatabase } from "@/lib/userAction";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>; // Updated to match the expected type
  searchParams: Promise<{ [key: string]: string }>; // Updated to match the expected type
}

// Fonction pour générer les métadonnées dynamiques
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params; // Résolution de la promesse pour obtenir l'ID

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

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { userId } = await auth();

  const { id } = await params; // Résolution de la promesse pour les paramètres
  const searchParamsResolved = await searchParams; // Résolution de la promesse pour les paramètres de recherche

  console.log("Search Params:", searchParamsResolved); // Example usage

  // Récupération des données
  const product = await getProduct(id);
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
