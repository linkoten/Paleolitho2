"use server";

import { User } from "@/generated/prisma";
import BentoGridProducts from "./BentoGridProducts";
import { getFavoritesProducts } from "@/lib/actionsProducts";

interface Products {
  id: string;
  title: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  price: number;
  stock: number;
  images: string[];
  category: string;
  country: string;
  locality: string;
  period: string;
  stages: string;
}

interface ListCardsProps {
  products: Products[];
  user: User | null; // Rendre user optionnel
}

async function ListCards({ products, user }: ListCardsProps) {
  // Si l'utilisateur n'est pas connecté, afficher la grille sans fonctionnalités de favoris
  let favorite = null;

  if (user) {
    // Récupérer les favoris seulement si un utilisateur est connecté
    try {
      favorite = await getFavoritesProducts(user.id);
    } catch (error) {
      console.error("Erreur lors de la récupération des favoris:", error);
    }
  }

  return (
    <div className="container mx-auto py-6">
      <BentoGridProducts products={products} user={user} favorite={favorite} />
    </div>
  );
}

export default ListCards;
