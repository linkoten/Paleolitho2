import React, { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserFromDatabase } from "@/lib/userAction";
import { getFavoritesProducts } from "@/lib/actionsProducts";
import { prisma } from "@/lib/db";
import FavoriteList from "@/app/components/shop/FavoriteList";
import Loading from "@/app/components/Loading";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HeartIcon,
  ShoppingBagIcon,
  PackageIcon,
  ChevronRightIcon,
  ShoppingCartIcon,
  BadgeCheckIcon,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Fonctions d'aide pour formater les dates et montants
const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const formatPrice = (price: number) => {
  return (price / 100).toFixed(2) + " €";
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          En attente
        </Badge>
      );
    case "paid":
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          Payé
        </Badge>
      );
    case "shipped":
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          Expédié
        </Badge>
      );
    case "delivered":
      return (
        <Badge variant="outline" className="bg-indigo-100 text-indigo-800">
          Livré
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800">
          Annulé
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default async function DashboardHomePage() {
  // Authentication check
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  // Get user data
  const user = await getUserFromDatabase(userId);
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Erreur d'authentification</h1>
          <p className="mb-4">
            Impossible de charger les informations utilisateur.
          </p>
          <Button asChild>
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Fetch favorites and orders in parallel
  const [favoriteProducts, orders] = await Promise.all([
    getFavoritesProducts(user.id),
    prisma.order.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        email: true,
        amount: true,
        status: true,
        products: true,
        createdAt: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    }),
  ]);

  // Parse products from JSON strings in orders if needed
  const parsedOrders = orders.map((order) => ({
    ...order,
    parsedProducts: order.products ? JSON.parse(order.products) : [],
  }));

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Mon compte</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row items-start gap-4 mb-8">
        <div className="flex-shrink-0">
          {user.image ? (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20">
              <Image
                src={user.image}
                alt={user.name || "Utilisateur"}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-4 border-primary/20">
              <span className="text-3xl font-bold text-muted-foreground">
                {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
              </span>
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bienvenue, {user.name || "Utilisateur"}!
          </h1>
          <p className="text-muted-foreground">{user.email}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary">
              {favoriteProducts?.favorites?.length || 0} favoris
            </Badge>
            <Badge variant="secondary">{orders.length} commandes</Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="favorites" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <HeartIcon className="h-4 w-4" />
            Mes favoris
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <ShoppingBagIcon className="h-4 w-4" />
            Mes commandes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Mes produits favoris</CardTitle>
              <CardDescription>
                Les produits que vous avez ajoutés à vos favoris
              </CardDescription>
            </CardHeader>
            <CardContent>
              {favoriteProducts &&
              favoriteProducts.favorites &&
              favoriteProducts.favorites.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2  gap-4">
                  <Suspense fallback={<Loading />}>
                    {favoriteProducts.favorites.map((data, index) => (
                      <FavoriteList
                        key={index}
                        data={data?.product}
                        user={user}
                        favorite={favoriteProducts}
                      />
                    ))}
                  </Suspense>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-muted p-6 w-20 h-20 flex items-center justify-center">
                      <HeartIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Aucun produit favori
                  </h3>
                  <p className="text-muted-foreground mb-8">
                    Vous n'avez pas encore ajouté de produits à vos favoris
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/shop">
                      <ShoppingCartIcon className="h-4 w-4 mr-2" />
                      Parcourir la boutique
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Historique des commandes
              </CardTitle>
              <CardDescription>
                Consultez vos commandes passées et leur statut
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders && orders.length > 0 ? (
                <div className="space-y-6">
                  {parsedOrders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/50 pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Commande #{order.id.slice(-8)}
                            </p>
                            <p className="text-sm font-medium">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(order.status)}
                            <p className="font-bold">{order.amount} €</p>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          {order.items.slice(0, 2).map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-4"
                            >
                              <div className="relative w-12 h-12 flex-shrink-0 rounded bg-muted overflow-hidden">
                                {item.product?.images?.[0] ? (
                                  <Image
                                    src={item.product.images[0]}
                                    alt={item.product.title || "Produit"}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <PackageIcon className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <div className="flex-grow min-w-0">
                                <p className="font-medium truncate">
                                  {item.product.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {item.quantity} × {item.priceAtPurchase} €
                                </p>
                              </div>
                            </div>
                          ))}

                          {order.items.length > 2 && (
                            <p className="text-sm text-muted-foreground">
                              + {order.items.length - 2} autres produits
                            </p>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="flex justify-between bg-muted/20 border-t">
                        <Button variant="ghost" size="sm" className="ml-auto">
                          Voir détails{" "}
                          <ChevronRightIcon className="h-4 w-4 ml-1" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-muted p-6 w-20 h-20 flex items-center justify-center">
                      <ShoppingBagIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-2">Aucune commande</h3>
                  <p className="text-muted-foreground mb-8">
                    Vous n'avez pas encore passé de commande
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/shop">
                      <ShoppingCartIcon className="h-4 w-4 mr-2" />
                      Parcourir la boutique
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
