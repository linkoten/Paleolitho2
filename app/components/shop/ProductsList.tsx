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
  user: User;
}

async function ListCards({ products, user }: ListCardsProps) {
  const userId = user.id;
  const favorite = await getFavoritesProducts(userId);

  return (
    <div className="container mx-auto py-6">
      <BentoGridProducts products={products} user={user} favorite={favorite} />
    </div>
  );
}

export default ListCards;
