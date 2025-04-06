"use server";

import { getFavoritesProducts } from "@/lib/actionsProducts";
import { ThreeDCardDemo } from "./3DCard";
import { User } from "@/generated/prisma";

interface CardProps {
  item: {
    title: string | null; // Allow title to be null
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    price: number;
    stock: number;
    images: string[];
    id: string;
    category: string;
    country: string;
    locality: string;
    period: string;
    stages: string;
  };
  user: User;
}

export default async function Card({ item, user }: CardProps) {
  const userId = user.id;

  const favorite = await getFavoritesProducts(userId);

  return (
    <>
      <ThreeDCardDemo data={item} user={user} favorite={favorite} />
    </>
  );
}
