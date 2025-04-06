import React, { Suspense } from "react";
import { getProduct, getProductRatings } from "@/lib/actionsProducts";
import SelectImage from "@/app/components/shop/SelectImage";
import Loading from "@/app/components/Loading";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserFromDatabase } from "@/lib/userAction";
import { notFound } from "next/navigation";

interface Params {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  image: number[];
}

interface ProductPageProps {
  params: Params;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.id);

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

export default async function ProductPage({ params }: ProductPageProps) {
  // Authentication check
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  // Data fetching
  const [product, user, ratings] = await Promise.all([
    getProduct(params.id),
    getUserFromDatabase(userId),
    getProductRatings(params.id),
  ]);

  // Error handling
  if (!product) {
    return notFound();
  }

  if (!user) {
    return (
      <div>User information could not be loaded. Please try again later.</div>
    );
  }

  if (!ratings) {
    return (
      <div>Product ratings could not be loaded. Please try again later.</div>
    );
  }

  // Render main component
  return (
    <Suspense fallback={<Loading />}>
      <SelectImage product={product} user={user} ratings={ratings} />
    </Suspense>
  );
}
