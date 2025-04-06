import type React from "react";
import ButtonSignOut from "@/app/components/ButtonSignOut";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import Cart from "@/app/components/cart/Cart";
import { createEmptyCart, getCart } from "@/lib/actionsCart";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { addUserToDatabase, getUserFromDatabase } from "@/lib/userAction";
import DashboardNav from "../components/navBar/DashboardNav";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await currentUser();

  if (!user) {
    return <div>Please sign in</div>;
  }

  const dbUser = await getUserFromDatabase(userId); // Get from YOUR DB

  if (!dbUser) {
    // Check if user already exists in your DB
    const fullName = user.firstName + " " + user.lastName || "";
    const email = user.emailAddresses[0]?.emailAddress || ""; // Correct way to access email
    const image = user.imageUrl || "";
    await addUserToDatabase(userId, fullName, email, image);
  }

  const data = await getUserFromDatabase(userId); // Get from YOUR DB (again, now with stripeCustomerId)

  if (!data) return null; // Handle the case where the user is not in your DB

  let cart;
  try {
    cart = await getCart(data?.id as string);
  } catch (error) {
    console.error("Error fetching cart:", error);
    cart = await createEmptyCart(data?.id as string);
  }

  // Préparer les données utilisateur avec le panier pour le composant client
  const userData = {
    ...data,
    cart: cart || { cartItems: [] },
  };

  if (!data?.stripeCustomerId) {
    const stripeCustomer = await stripe.customers.create({
      email: data?.email as string,
    });

    await prisma.user.update({
      where: { id: data?.id as string },
      data: { stripeCustomerId: stripeCustomer.id as string },
    });
  }

  return (
    <div className="flex min-h-screen">
      <DashboardNav user={data} />
      <main className="flex-1 p-4 ml-[60px]">
        <div className="flex justify-end mb-4">
          <ButtonSignOut />
          <Cart user={userData} />
        </div>
        {children}
      </main>
    </div>
  );
}
