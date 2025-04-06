import type React from "react";
import ButtonSignOut from "@/app/components/ButtonSignOut";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import Cart from "@/app/components/cart/Cart";
import { createEmptyCart, getCart } from "@/lib/actionsCart";
import { auth, currentUser } from "@clerk/nextjs/server";
import { addUserToDatabase, getUserFromDatabase } from "@/lib/userAction";
import DashboardNav from "../components/navBar/DashboardNav";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  // Ne pas rediriger, mais capturer l'absence d'authentification
  // pour désactiver certaines fonctionnalités

  let userData = null;
  let user = null;

  if (userId) {
    user = await currentUser();

    if (user) {
      const dbUser = await getUserFromDatabase(userId);

      if (!dbUser) {
        const fullName = user.firstName + " " + user.lastName || "";
        const email = user.emailAddresses[0]?.emailAddress || "";
        const image = user.imageUrl || "";
        await addUserToDatabase(userId, fullName, email, image);
      }

      const data = await getUserFromDatabase(userId);

      if (data) {
        let cart;
        try {
          cart = await getCart(data.id);
        } catch (error) {
          console.error("Error fetching cart:", error);
          cart = await createEmptyCart(data.id);
        }

        // Préparer les données utilisateur avec le panier
        userData = {
          ...data,
          cart: cart || { cartItems: [] },
        };

        if (!data.stripeCustomerId) {
          const stripeCustomer = await stripe.customers.create({
            email: data.email,
          });

          await prisma.user.update({
            where: { id: data.id },
            data: { stripeCustomerId: stripeCustomer.id },
          });
        }
      }
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Passer userData à DashboardNav, même s'il est null */}
      <DashboardNav user={userData} />
      <main className="flex-1 p-4 ml-[60px]">
        <div className="flex justify-end mb-4">
          {userId ? <ButtonSignOut /> : null}
          {/* Passer le statut d'authentification au composant Cart */}
          <Cart user={userData} isAuthenticated={!!userId} />
        </div>
        {children}
      </main>
    </div>
  );
}
