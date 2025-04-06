import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { BadgeCheck, AlertTriangle } from "lucide-react";
import { getCart, emptyCart } from "@/lib/actionsCart";
import { decrementProductStock } from "@/lib/actionsProducts";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserFromDatabase } from "@/lib/userAction";
import { prisma } from "@/lib/db";

export default async function SuccessPage() {
  const { userId } = await auth();
  let orderSuccess = true;

  if (!userId) {
    redirect("/");
  }

  const user = await getUserFromDatabase(userId);
  const cart = await getCart(user?.id as string);
  const cartItems = cart?.cartItems;

  if (cartItems && cartItems.length > 0) {
    try {
      // Calculer le montant total de la commande
      const totalAmount = cartItems.reduce(
        (sum: any, item: any) => sum + item.product.price * item.quantity,
        0
      );

      // Formater les produits pour le stockage JSON
      const productsJSON = cartItems.map((item) => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images?.[0] || null,
      }));

      // Créer l'order dans la base de données
      const order = await prisma.order.create({
        data: {
          userId: user?.id as string,
          email: user?.email as string,
          amount: totalAmount,
          status: "paid",
          products: JSON.stringify(productsJSON), // Stocker les produits comme JSON
          items: {
            create: cartItems.map((item) => ({
              productId: item.product.id,
              quantity: item.quantity,
              priceAtPurchase: item.product.price,
            })),
          },
        },
      });

      console.log("Order créée avec succès:", order.id);

      // Mettre à jour le stock et vider le panier
      for (const product of cartItems) {
        const productId = product.product.id;
        const quantity = product.quantity;
        await decrementProductStock(productId, quantity);
      }

      await emptyCart(user?.id as string);
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      orderSuccess = false;
    }
  }

  return (
    <section className="w-full h-screen pt-20 text-center">
      <Card className="w-[400px] mx-auto p-4">
        {orderSuccess ? (
          <>
            <BadgeCheck className="text-8xl mb-3 text-green-500 text-center w-full" />
            <h1 className="text-xl font-black mb-2 text-center uppercase">
              Paiement réussi !
            </h1>
            <p className="text-muted-foreground text-sm mb-2">
              Félicitation, votre achat a bien été effectué !
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Un récapitulatif de votre commande vous a été envoyé par email.
            </p>
          </>
        ) : (
          <>
            <AlertTriangle className="text-8xl mb-3 text-amber-500 text-center w-full" />
            <h1 className="text-xl font-black mb-2 text-center uppercase">
              Paiement traité
            </h1>
            <p className="text-muted-foreground text-sm mb-2">
              Votre paiement a été accepté, mais nous avons rencontré un
              problème avec votre commande.
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Notre équipe a été notifiée et va traiter votre commande
              manuellement.
            </p>
          </>
        )}
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
          <Link href="/dashboard/shop">Retour sur le Dashboard</Link>
        </Button>
      </Card>
    </section>
  );
}
