"use client";

import React from "react";
import Image from "next/image";
import { addToCart } from "@/lib/actionsCart";
import { Input } from "@/components/ui/input";
import ButtonToast from "../ButtonToast";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, X, ZoomIn, ZoomOut, Lock } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useCallback, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import ProductRating from "./ProductRating";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import {
  getProductsByCategory,
  getProductsByCountry,
  getProductsByLocality,
  getProductsByPeriod,
  getProductsByStage,
} from "@/lib/actionsProducts";
import { Products, User } from "@/generated/prisma";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { toast } from "sonner";

interface SelectImageProps {
  product: Products;
  user: User | null;
  ratings: any;
  isAuthenticated: boolean;
}

type ProductWithoutSomeProps = Omit<
  Products,
  | "description"
  | "price"
  | "createdAt"
  | "updatedAt"
  | "stock"
  | "weight"
  | "globalRating"
>;

interface RelatedProductsState {
  [key: string]: ProductWithoutSomeProps[];
}

export default function SelectImage({
  product,
  user,
  ratings,
  isAuthenticated,
}: SelectImageProps) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [relatedProducts, setRelatedProducts] = useState<RelatedProductsState>(
    {}
  );
  const imageRef = useRef<HTMLDivElement>(null);
  const zoomLevels = [1, 1.5, 2, 2.5];
  const [activeBadges, setActiveBadges] = useState<string[]>([]);
  const handleZoom = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((event.clientX - left) / width) * 100;
    const y = ((event.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  }, []);

  const handleZoomChange = useCallback(
    (delta: number) => {
      setZoomLevel((prevLevel) => {
        const newLevel = prevLevel + delta;
        return Math.max(0, Math.min(newLevel, zoomLevels.length - 1));
      });
    },
    [zoomLevels.length]
  );

  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      handleZoomChange(event.deltaY > 0 ? -1 : 1);
    },
    [handleZoomChange]
  );

  const handleBadgeClick = async (badgeType: string, value: string) => {
    let products;
    switch (badgeType) {
      case "category":
        products = await getProductsByCategory(value);
        break;
      case "country":
        products = await getProductsByCountry(value);
        break;
      case "locality":
        products = await getProductsByLocality(value);
        break;
      case "period":
        products = await getProductsByPeriod(value);
        break;
      case "stages":
        products = await getProductsByStage(value);
        break;
      default:
        return;
    }

    setRelatedProducts((prev) => ({
      ...prev,
      [badgeType]: products,
    }));

    setActiveBadges((prev) =>
      prev.includes(badgeType)
        ? prev.filter((b) => b !== badgeType)
        : [...prev, badgeType]
    );
  };

  // Gestion quand l'utilisateur n'est pas connecté
  const handleAuthRequired = () => {
    toast.error("Veuillez vous connecter pour utiliser cette fonctionnalité");
  };

  const words = product.description;

  return (
    <section>
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/shop">Shop</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.id}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-col gap-6">
            {/* Première colonne : Carousel et images secondaires */}
            <div className="space-y-4 ">
              <h2 className="text-2xl font-bold pt-12">{product.title}</h2>

              <Carousel className=" mx-auto ">
                <CarouselContent>
                  <CarouselItem>
                    <div className="relative h-96 ">
                      <Image
                        src={activeImage}
                        onClick={() => {
                          setIsModalOpen(true);
                        }}
                        alt={product.title!}
                        className="rounded-lg w-auto h-full cursor-pointer object-cover"
                        fill
                        sizes="auto"
                      />
                      <Badge className="absolute top-2 right-2 bg-blue-600">
                        Nouveau
                      </Badge>
                    </div>
                  </CarouselItem>
                </CarouselContent>
              </Carousel>
              <div className="flex flex-wrap gap-2 overflow-x-auto justify-center ">
                {product.images.map((img: string, index: any) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 relative rounded-md overflow-hidden my-2 ${
                      activeImage === img ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => setActiveImage(img)}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} - vue ${index + 1}`}
                      fill
                      sizes="auto"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Deuxième colonne : Informations */}
            <div className="space-y-4 ">
              <div></div>
              <TextGenerateEffect words={words!} className=" text-xs" />

              {isAuthenticated ? (
                <ProductRating
                  productId={product.id}
                  userId={user!.id}
                  ratings={ratings}
                />
              ) : (
                <div className="flex items-center justify-center py-4 px-2 border border-dashed rounded-md border-gray-300 bg-gray-50">
                  <Lock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    Connectez-vous pour noter ce produit
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 justify-center">
                {["category", "country", "locality", "period", "stages"].map(
                  (badgeType) => (
                    <Badge
                      key={badgeType}
                      onClick={() =>
                        handleBadgeClick(
                          badgeType,
                          product[
                            badgeType as keyof ProductWithoutSomeProps
                          ] as string
                        )
                      }
                      className={`cursor-pointer ${
                        activeBadges.includes(badgeType) ? "bg-blue-600" : ""
                      }`}
                    >
                      {product[badgeType as keyof ProductWithoutSomeProps]}
                    </Badge>
                  )
                )}
              </div>
            </div>
            <Button
              variant={"ghost"}
              className="text-lg font-bold border border-yellow-200 w-fit mx-auto "
            >
              {product.price} €
            </Button>

            {/* Troisième colonne : Prix, stock et bouton */}
            <div className="space-y-4 flex flex-col justify-between ">
              {product.stock > 0 && <div className="flex mb-2"></div>}
              {product.stock > 0 ? (
                isAuthenticated ? (
                  <form action={addToCart}>
                    <Input
                      type="text"
                      name="userId"
                      defaultValue={user!.id}
                      className="hidden"
                    />
                    <Input
                      type="text"
                      name="productId"
                      defaultValue={product.id}
                      className="hidden"
                    />
                    <div className="w-full flex flex-col items-center gap-2">
                      <label htmlFor="quantity" className="font-medium text-sm">
                        Quantité:
                      </label>
                      <div className="flex gap-2 w-full justify-center">
                        <Input
                          id="quantity"
                          type="number"
                          name="quantity"
                          min="1"
                          max={product.stock}
                          defaultValue={1}
                          className="w-24"
                        />
                        <ButtonToast
                          toastText="Produit ajouté au panier"
                          type="submit"
                          className="w-1/2"
                        >
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Ajouter au panier
                        </ButtonToast>
                      </div>
                    </div>
                  </form>
                ) : (
                  <Button
                    onClick={handleAuthRequired}
                    className="w-full opacity-70"
                    variant="outline"
                  >
                    <Lock className="h-4 w-4 mr-2" /> Connexion requise pour
                    acheter
                  </Button>
                )
              ) : (
                <Button className="bg-red-500 hover:bg-red-600 line-through cursor-not-allowed">
                  <ShoppingCart className="mr-2 h-5 w-5" /> Ajouter au panier
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {activeBadges.map((badgeType) => (
        <div key={badgeType} className="mt-8">
          <h3 className="text-xl font-bold mb-4">
            Related {badgeType.charAt(0).toUpperCase() + badgeType.slice(1)}{" "}
            Products
          </h3>
          <InfiniteMovingCards
            items={
              relatedProducts[badgeType]?.map((p: ProductWithoutSomeProps) => ({
                id: p.id,
                title: p.title || "",
                image: p.images[0],
                badges: [p.category, p.country, p.locality, p.period, p.stages],
              })) || []
            }
            direction="left"
            speed="slow"
          />
        </div>
      ))}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent
          className="max-w-3xl"
          title={product.title!}
          aria-describedby={product.title!}
        >
          <DialogTitle></DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </DialogClose>
          <div className="absolute left-4 top-4 z-10 flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleZoomChange(1)}
              disabled={zoomLevel === zoomLevels.length - 1}
            >
              <ZoomIn className="h-4 w-4" />
              <span className="sr-only">Zoomer</span>
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleZoomChange(-1)}
              disabled={zoomLevel === 0}
            >
              <ZoomOut className="h-4 w-4" />
              <span className="sr-only">Dézoomer</span>
            </Button>
          </div>
          <div
            className="relative h-[80vh] overflow-hidden "
            ref={imageRef}
            onMouseMove={handleZoom}
            onWheel={handleWheel}
          >
            <Image
              src={activeImage}
              alt={`${product.title} - vue ${activeImage + 1}`}
              fill
              objectFit="contain"
              style={{
                transform: `scale(${zoomLevels[zoomLevel]})`,
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
