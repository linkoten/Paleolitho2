"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Star, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import ButtonToast from "@/app/components/ButtonToast";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/lib/actionsProducts";
import { addToCart } from "@/lib/actionsCart";
import { User } from "@/generated/prisma";
import { toast } from "sonner";

interface Product {
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

interface BentoGridProps {
  products: Product[];
  user: User | null;
  favorite: any | null;
}

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  product,
  user,
  isFavorite,
  isAuthenticated,
}: {
  className?: string;
  product: Product;
  user: User | null;
  isFavorite: boolean;
  isAuthenticated: boolean;
}) => {
  const productId = product.id;
  const userId = user?.id;
  const toastText = "Le produit a été ajouté au panier";
  const toastTextFavorite = isFavorite
    ? "Produit supprimé des favoris"
    : "Produit ajouté aux favoris";
  
  // Gestion quand l'utilisateur n'est pas connecté
  const handleAuthRequired = () => {
    toast.error("Veuillez vous connecter pour utiliser cette fonctionnalité");
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 border border-black/10 dark:border-white/20 bg-white dark:bg-black p-4 overflow-hidden relative",
        className
      )}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-lg truncate dark:text-white">
          {product.title}
        </h2>
        <div className="flex space-x-2 items-center">
          {isAuthenticated ? (
            <form action={(formData) => toggleFavorite(formData).then(() => {})}>
              <Input
                type="text"
                name="userId"
                defaultValue={userId}
                className="hidden"
              />
              <Input
                type="text"
                name="productId"
                defaultValue={productId}
                className="hidden"
              />
              <ButtonToast
                type="submit"
                variant={"outline"}
                toastText={toastTextFavorite}
                className="border border-yellow-200 p-1"
              >
                <Star
                  className={`cursor-pointer ${
                    isFavorite ? "fill-yellow-300" : ""
                  }`}
                  size={18}
                />
              </ButtonToast>
            </form>
          ) : (
            <button
              onClick={handleAuthRequired}
              className="border border-yellow-200 p-1 opacity-50 cursor-not-allowed"
              disabled
            >
              <Star size={18} />
            </button>
          )}
          <Badge variant={"secondary"} className="text-sm">
            {product.price}€
          </Badge>
        </div>
      </div>

      <Link href={`shop/${product.id}`} className="block">
        <div className="relative h-48 w-full mb-3">
          <Image
            src={product.images[0]}
            alt={product.title || "Product image"}
            fill
            className="object-cover rounded-lg group-hover/bento:shadow-lg transition-all duration-300"
          />
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {product.country}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {product.locality}
          </Badge>

          <Badge variant="outline" className="text-xs">
            {product.period}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {product.stages}
          </Badge>
        </div>
      </Link>

      <div className="flex justify-between items-center mt-2">
        <p
          className={`text-sm font-medium ${
            product.stock > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {product.stock > 0 ? `Stock: ${product.stock}` : "Rupture de stock"}
        </p>

        {product.stock > 0 ? (
          isAuthenticated ? (
            <form
              action={(formData) => addToCart(formData).then(() => {})}
              className="flex space-x-2"
            >
              <Input
                type="text"
                name="userId"
                defaultValue={userId}
                className="hidden"
              />
              <Input
                type="text"
                name="productId"
                defaultValue={productId}
                className="hidden"
              />
              <Input
                type="number"
                name="quantity"
                defaultValue={1}
                min={1}
                max={product.stock}
                className="w-16 text-sm"
              />
              <ButtonToast
                toastText={toastText}
                type="submit"
                className="text-sm"
              >
                Ajouter
              </ButtonToast>
            </form>
          ) : (
            <Button 
              onClick={handleAuthRequired}
              className="text-sm opacity-70"
              variant="outline"
            >
              <Lock className="h-3 w-3 mr-2" /> Connexion requise
            </Button>
          )
        ) : (
          <Button
            disabled
            className="text-sm bg-red-500 line-through opacity-60"
          >
            Ajouter
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default function BentoGridProducts({
  products,
  user,
  favorite,
}: BentoGridProps) {
  const isAuthenticated = !!user; // Vérifier si l'utilisateur est authentifié

  return (
    <BentoGrid className="max-w-7xl mx-auto px-4">
      {products.map((product, i) => {
        // Si l'utilisateur est authentifié et a des favoris, on vérifie si ce produit est un favori
        const isFavorite = isAuthenticated && favorite?.favorites 
          ? favorite.favorites.some((fav: any) => fav.product.id === product.id)
          : false;

        const isEvenRow = Math.floor(i / 2) % 2 === 0;
        const isFirstProduct = i % 2 === 0;

        let itemClass = "";

        if (isEvenRow) {
          itemClass = isFirstProduct ? "md:col-span-2" : "md:col-span-1";
        } else {
          itemClass = isFirstProduct ? "md:col-span-1" : "md:col-span-2";
        }

        return (
          <BentoGridItem
            key={product.id}
            product={product}
            user={user}
            isFavorite={isFavorite}
            isAuthenticated={isAuthenticated}
            className={itemClass}
          />
        );
      })}
    </BentoGrid>
  );
}