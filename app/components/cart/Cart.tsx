"use client"; // Changer "use server" en "use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { deleteFromCard } from "@/lib/actionsCart";
import Image from "next/image";
import Checkout from "./Checkout";
import ButtonToast from "../ButtonToast";
import Link from "next/link";

export default function Cart({ user }: { user: any }) {
  let totalPrice = 0;
  if (user.cart?.cartItems) {
    console.log(user.cart?.cartItems);
    totalPrice = user.cart.cartItems.reduce((acc: any, item: any) => {
      if (item.product && item.product.price) {
        return acc + item.product.price * item.quantity;
      } else {
        return acc; // Handle missing product price gracefully
      }
    }, 0);
  }

  return (
    <Sheet>
      <SheetTrigger className="flex">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6 hover:text-orange-600 hover:scale-110"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
        <div>{user.cart?.cartItems ? user.cart.cartItems.length : 0}</div>
      </SheetTrigger>
      <SheetContent className="overflow-auto">
        <SheetHeader>
          <SheetTitle>Votre panier</SheetTitle>
          <SheetDescription>Articles dans votre panier</SheetDescription>
          <div className="mt-16">
            <div className="flow-root">
              <ul role="list" className="divide-gray-200 my-6 divide-y">
                {user.cart?.cartItems && user.cart.cartItems.length > 0 ? (
                  user.cart.cartItems.map((item: any) => (
                    <li key={item.id} className="flex py-6">
                      {item.product && item.product.images && (
                        <div className="border-gray-200 relative size-24 flex-shrink-0 overflow-hidden rounded-md border">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.title as string}
                            fill
                            className="h-full w-full object-cover object-center fill"
                            sizes="auto"
                          />
                        </div>
                      )}

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300 text-zinc-700 dark:text-zinc-300 flex justify-between hover:bg-base-200 text-xs font-bold">
                            <h3 className="w-3/4">
                              {item.product &&
                                item.product.id &&
                                item.product.title && (
                                  <Link
                                    href={`/dashboard/shop/${item.product.id}`}
                                  >
                                    {item.product.title}
                                  </Link>
                                )}
                            </h3>
                            <div className="ml-2 w-1/4">
                              {item.product.price * item.quantity} €
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="text-gray-500">
                            Qty {item.quantity}
                          </div>
                          <form action={deleteFromCard}>
                            <input
                              type="hidden"
                              name="cartId"
                              defaultValue={user.cart.id}
                            />
                            <input
                              type="hidden"
                              name="productId"
                              defaultValue={item.product.id}
                            />
                            <ButtonToast
                              toastText="Le produit a été retiré du panier"
                              variant={"outline"}
                              type="submit"
                            >
                              Delete
                            </ButtonToast>
                          </form>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    Votre panier est vide
                  </div>
                )}
              </ul>
              {user.cart?.cartItems && user.cart.cartItems.length > 0 && (
                <div className="border-gray-200 border-t px-4 py-6 sm:px-6">
                  <div className="text-gray-900 flex justify-between text-base font-medium">
                    <p>Subtotal</p>
                    <p>{totalPrice.toFixed(2)} €</p>
                  </div>
                  <p className="text-gray-500 mt-0.5 text-sm">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <Checkout user={user} />
                </div>
              )}
            </div>
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
