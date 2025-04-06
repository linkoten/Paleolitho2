"use server";
import { prisma } from "@/lib/db";
import { getStripeSession } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { getUserFromDatabase } from "./userAction";

export const getDataStripeUser = async (userId: string) => {
  const data = await prisma.subscription.findUnique({
    where: {
      userId: userId,
    },
    select: {
      status: true,
      user: {
        select: {
          stripeCustomerId: true,
        },
      },
    },
  });

  return data;
};

export const createSubscription = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await getUserFromDatabase(userId);

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user?.id,
    },
    select: {
      stripeCustomerId: true,
    },
  });

  const subscriptionUrl = await getStripeSession({
    customerId: dbUser?.stripeCustomerId as string,
    domainUrl: process.env.DOMAIN_URL as string,
    priceId: process.env.STRIPE_API_ID as string,
  });

  return redirect(subscriptionUrl);
};

export const createCustomerPortal = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const user = await getUserFromDatabase(userId);
  const session = await stripe.billingPortal.sessions.create({
    customer: user?.stripeCustomerId as string,
    return_url: "http://localhost:3000/dashboard/payment",
  });
  return redirect(session.url);
};

export const multipleShippingOptions = async () => {};
