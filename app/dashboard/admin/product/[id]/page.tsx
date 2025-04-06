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
import Link from "next/link";
import { getProduct, updateProduct } from "@/lib/actionsProducts";
import ButtonToast from "@/app/components/ButtonToast";

interface Params {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  images: string;
  weight: number;
}

interface UpdatePageProps {
  params: Params;
}

export default async function CreatePage({ params }: UpdatePageProps) {
  const product = await getProduct(params.id);

  console.log(product);

  const toastText = "Le produit a été modifié";

  return (
    <Card>
      <form action={updateProduct}>
        <Input type="hidden" value={product?.id} id="id" name="id" />
        <CardHeader>
          <CardTitle>Modification</CardTitle>
          <CardDescription>
            Modifier votre Produit puis sauvegarder
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-5">
          <div className="gap-y-2 flex flex-col">
            <Label htmlFor="title">Titre</Label>
            <Input
              defaultValue={product?.title as string}
              placeholder="Titre de votre produit"
              type="text"
              name="title"
              id="title"
            />
          </div>
          <div className="gap-y-2 flex flex-col">
            <Label htmlFor="description">Description</Label>
            <Textarea
              defaultValue={product?.description as string}
              placeholder="Description de votre produit"
              name="description"
              id="description"
            />
          </div>
          <div className="gap-y-2 flex flex-col">
            <Label htmlFor="category">Catégorie du produit</Label>
            <Textarea
              defaultValue={product?.category as string}
              placeholder="catégorie du produit"
              required
              name="category"
              id="category"
            />
          </div>
          <div className="gap-y-2 flex flex-col">
            <Label htmlFor="country">Pays du produit</Label>
            <Textarea
              defaultValue={product?.country as string}
              placeholder="Pays du produit"
              required
              name="country"
              id="country"
            />
          </div>
          <div className="gap-y-2 flex flex-col">
            <Label htmlFor="locality">Localité du produit</Label>
            <Textarea
              defaultValue={product?.locality as string}
              placeholder="Localité du produit"
              required
              name="locality"
              id="locality"
            />
          </div>
          <div className="gap-y-2 flex flex-col">
            <Label htmlFor="period">Ere du produit</Label>
            <Textarea
              defaultValue={product?.period as string}
              placeholder="Ere du produit"
              required
              name="period"
              id="period"
            />
          </div>
          <div className="gap-y-2 flex flex-col">
            <Label htmlFor="stages">Etage du produit</Label>
            <Textarea
              defaultValue={product?.stages as string}
              placeholder="Etage du produit"
              required
              name="stages"
              id="stages"
            />
          </div>

          <div className="gap-y-2 flex flex-col">
            <Label htmlFor="price">Prix</Label>
            <Input
              defaultValue={product?.price as number}
              type="number"
              name="price"
              id="price"
            />
          </div>
          <div className="gap-y-2 flex flex-col">
            <Label htmlFor="stock">stock</Label>
            <Input
              defaultValue={product?.stock as number}
              type="number"
              name="stock"
              id="stock"
            />
          </div>
          <div className="gap-y-2 flex flex-col">
            <Label htmlFor="weight">Poids en GRAMMES</Label>
            <Input
              defaultValue={product?.weight as number}
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
              defaultValue={product?.images[0] as string}
            />
            <Input
              placeholder="Lien de l'image 2"
              type="text"
              name="images"
              id="image2"
              defaultValue={product?.images[1] as string}
            />
            <Input
              placeholder="Lien de l'image 3"
              type="text"
              name="images"
              id="image3"
              defaultValue={product?.images[2] as string}
            />
            <Input
              placeholder="Lien de l'image 4"
              type="text"
              name="images"
              id="image4"
              defaultValue={product?.images[3] as string}
            />
            <Input
              placeholder="Lien de l'image 5"
              type="text"
              name="images"
              id="image5"
              defaultValue={product?.images[4] as string}
            />
            <Input
              placeholder="Lien de l'image 6"
              type="text"
              name="images"
              id="image6"
              defaultValue={product?.images[5] as string}
            />
            <Input
              placeholder="Lien de l'image 7"
              type="text"
              name="images"
              id="image7"
              defaultValue={product?.images[6] as string}
            />
            <Input
              placeholder="Lien de l'image 8"
              type="text"
              name="images"
              id="image8"
              defaultValue={product?.images[7] as string}
            />
            <Input
              placeholder="Lien de l'image 9"
              type="text"
              name="images"
              id="image9"
              defaultValue={product?.images[8] as string}
            />
            <Input
              placeholder="Lien de l'image 10"
              type="text"
              name="images"
              id="image10"
              defaultValue={product?.images[9] as string}
            />
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button className="bg-red-500 mx-1 my-2 hover:bg-red-600 text-white">
            <Link href="/dashboard/admin">Annuler</Link>
          </Button>
          <ButtonToast
            toastText={toastText}
            type="submit"
            className="bg-orange-500 mx-1 my-2 hover:bg-orange-600 text-white"
          >
            {" "}
            Modifier
          </ButtonToast>
        </CardFooter>
      </form>
    </Card>
  );
}
