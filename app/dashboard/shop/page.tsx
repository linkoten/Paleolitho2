import {
  fetchFilteredPages,
  fetchProductsPages,
  getAllProducts,
} from "@/lib/actionsProducts";
import ListCards from "@/app/components/shop/ProductsList";
import Pagination from "@/app/components/shop/Pagination";
import Search from "@/app/components/shop/Search";
import Filters from "@/app/components/shop/Filters";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Suspense } from "react";
import Loading from "@/app/components/Loading";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { getUserFromDatabase } from "@/lib/userAction";

// Define interface for Next.js 14 static pages with searchParams
interface PageProps {
  params: {};
  searchParams: {
    query?: string;
    page?: string;
    country?: string;
    locality?: string;
    period?: string;
    stages?: string;
    category?: string;
  };
}

export const metadata: Metadata = {
  title: "Paleolitho/shop",
  description: "Official Shop of Paleolitho where you can find and buy Fossils",
};

export default async function Home({ searchParams }: PageProps) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  const country = searchParams?.country || "";
  const locality = searchParams?.locality || "";
  const period = searchParams?.period || "";
  const stages = searchParams?.stages || "";
  const category = searchParams?.category || "";

  const totalPages = await fetchProductsPages(
    query,
    country,
    locality,
    period,
    stages,
    category
  );

  const products = await fetchFilteredPages(
    query,
    currentPage,
    country,
    locality,
    period,
    stages,
    category
  );

  const items = await getAllProducts();

  // Récupérer l'utilisateur actuel (peut être null)
  const { userId } = await auth();
  let user = null;

  if (userId) {
    try {
      user = await getUserFromDatabase(userId);
    } catch (error) {
      console.error("Error fetching user:", error);
      // Si une erreur se produit, user reste null
    }
  }

  if (!totalPages) {
    return (
      <>
        <div className="text-center text-xl pt-20">
          Il n&apos;y a aucun produit qui correspond à vos critères !
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Shop</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {!userId && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-4 text-amber-800">
          <p>
            Connectez-vous pour ajouter des produits à vos favoris et effectuer
            des achats.
          </p>
        </div>
      )}

      <Search placeholder="Recherche..." />

      <Filters items={items} />
      <Suspense fallback={<Loading />}>
        <ListCards products={products} user={user} />
      </Suspense>
      <div className="mt-5 pb-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
