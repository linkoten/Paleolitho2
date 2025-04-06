import { redirect } from "next/navigation";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createProduct } from "@/lib/actionsProducts";
import Link from "next/link";
import ButtonToast from "@/app/components/ButtonToast";
import { auth } from "@clerk/nextjs/server";
import { getUserFromDatabase } from "@/lib/userAction";

export default async function page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await getUserFromDatabase(userId); // Get from YOUR DB (again, now with stripeCustomerId)

  const toastText = "Le produit a été créé";

  if (!user) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    return <div>Please sign in</div>;
  }

  if (user.role === "ADMIN") {
    return (
      <Card>
        <form action={createProduct}>
          <CardHeader>
            <CardTitle>Nouveau Produit</CardTitle>
            <CardDescription>Ajouter un produit</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-5">
            <div className="gap-y-2 flex flex-col">
              <Label htmlFor="title">Nom du produit</Label>
              <Input
                placeholder="Titre du produit"
                required
                type="text"
                name="title"
                id="title"
              />
            </div>
            <div className="gap-y-2 flex flex-col">
              <Label htmlFor="description">Description du produit</Label>
              <Textarea
                placeholder="description du produit"
                required
                name="description"
                id="description"
              />
            </div>

            <div className="gap-y-2 flex flex-col">
              <Label htmlFor="category">Catégorie du produit</Label>
              <Textarea
                placeholder="catégorie du produit"
                required
                name="category"
                id="category"
              />
            </div>
            <div className="gap-y-2 flex flex-col">
              <Label htmlFor="country">Pays du produit</Label>
              <Textarea
                placeholder="Pays du produit"
                required
                name="country"
                id="country"
              />
            </div>
            <div className="gap-y-2 flex flex-col">
              <Label htmlFor="locality">Localité du produit</Label>
              <Textarea
                placeholder="Localité du produit"
                required
                name="locality"
                id="locality"
              />
            </div>
            <div className="gap-y-2 flex flex-col">
              <Label htmlFor="period">Ere du produit</Label>
              <Textarea
                placeholder="Ere du produit"
                required
                name="period"
                id="period"
              />
            </div>
            <div className="gap-y-2 flex flex-col">
              <Label htmlFor="stages">Etage du produit</Label>
              <Textarea
                placeholder="Etage du produit"
                required
                name="stages"
                id="stages"
              />
            </div>

            <div className="gap-y-2 flex flex-col">
              <Label htmlFor="price">Prix</Label>
              <Input
                placeholder="prix du produit"
                required
                type="number"
                name="price"
                id="price"
              />
            </div>

            <div className="gap-y-2 flex flex-col">
              <Label htmlFor="stock">Stock</Label>
              <Input
                placeholder="stock du produit"
                required
                type="number"
                name="stock"
                id="stock"
              />
            </div>
            <div className="gap-y-2 flex flex-col">
              <Label htmlFor="weight">Poids en GRAMMES</Label>
              <Input
                placeholder="poids du produit"
                required
                type="number"
                name="weight"
                id="stock"
              />
            </div>
            <div className="gap-y-2 flex flex-col">
              <Label htmlFor="images">Images</Label>
              <Input
                placeholder="Lien de l'image 1"
                required
                type="text"
                name="images"
                id="image1"
              />
              <Input
                placeholder="Lien de l'image 2"
                type="text"
                name="images"
                id="image2"
              />
              <Input
                placeholder="Lien de l'image 3"
                type="text"
                name="images"
                id="image3"
              />
              <Input
                placeholder="Lien de l'image 4"
                type="text"
                name="images"
                id="image4"
              />
              <Input
                placeholder="Lien de l'image 5"
                type="text"
                name="images"
                id="image5"
              />
              <Input
                placeholder="Lien de l'image 6"
                type="text"
                name="images"
                id="image6"
              />
              <Input
                placeholder="Lien de l'image 7"
                type="text"
                name="images"
                id="image7"
              />
              <Input
                placeholder="Lien de l'image 8"
                type="text"
                name="images"
                id="image8"
              />
              <Input
                placeholder="Lien de l'image 9"
                type="text"
                name="images"
                id="image9"
              />
              <Input
                placeholder="Lien de l'image 10"
                type="text"
                name="images"
                id="image10"
              />
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <Button className="bg-red-500 mx-1 my-2 hover:bg-red-600 text-white">
              <Link href="/dashboard/admin">Annuler</Link>
            </Button>
            <ButtonToast
              toastText={toastText}
              className="bg-orange-500 mx-1 my-2 hover:bg-orange-600 text-white"
            >
              Créer produit
            </ButtonToast>
          </CardFooter>
        </form>
      </Card>
    );
  } else {
    redirect("../../admin");
  }
}
