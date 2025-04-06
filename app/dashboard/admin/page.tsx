import { getAllProducts } from "@/lib/actionsProducts";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { File } from "lucide-react";
import { FilePenLine } from "lucide-react";
import DeleteButtonProduct from "@/app/components/DeleteButtonProduct";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { auth } from "@clerk/nextjs/server";
import { getUserFromDatabase } from "@/lib/userAction";

export default async function page() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await getUserFromDatabase(userId); // Get from YOUR DB (again, now with stripeCustomerId)

  const data = await getAllProducts();

  if (!user) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    return <div>Please sign in</div>;
  }

  if (user.role === "ADMIN") {
    return (
      <section className="grid items-start gap-y-8">
        <div className="flex md:items-center md:justify-between flex-col md:flex-row px-2">
          <div className="grid gap-1">
            <h2 className="text-3xl uppercase font-black">Produits</h2>
            <p className="text-lg text-muted-foreground">
              Observez tout vos produits
            </p>
            <div className="w-12 h-[1px] bg-black dark:bg-white my-2 mx-1"></div>
          </div>
          <Button asChild>
            <Link href="/dashboard/admin/createProduct">Créer un produit</Link>
          </Button>
        </div>
        {data.length < 1 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-3 animate-in fade-in-50">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-orange-500 bg-opacity-20 mb-4">
              <File className="text-orange-900" />
            </div>
            <p className="text-lg text-white">Vous n&apos;avez aucun produit</p>
            <p className="text-muted-foreground text-sm">
              Commencez des maintenant à créer des produits via notre
              application
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white mt-4 ">
              <Link href="/dashboard/admin/createProduct">
                Créer un nouveau produit
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <Table>
              <TableCaption>A list of your products.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Name</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-center">Prix</TableHead>
                  <TableHead className="text-right">
                    Modifier / Supprimer
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="text-center">{item.stock}</TableCell>
                    <TableCell className="text-center">
                      {item.price + " €"}
                    </TableCell>
                    <TableCell className=" flex justify-end items-center space-x-2">
                      <Button
                        asChild
                        type="button"
                        className="bg-yellow-500 hover:bg-yellow-600 text-white "
                      >
                        <Link href={`admin/product/${item.id}`}>
                          <FilePenLine className="w-4 h-4" />
                        </Link>
                      </Button>
                      <DeleteButtonProduct id={item.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell colSpan={2} className="text-center">
                    {data.length}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </section>
    );
  } else {
    redirect("../admin");
  }
}
