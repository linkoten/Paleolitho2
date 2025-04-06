"use client";

import Logo from "@/public/Paleolitho4.png";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Nav() {
  // Configuration de l'apparence personnalisée pour SignInButton
  const signInAppearance = {
    elements: {
      rootBox: "group",
      card: "bg-zinc-100 dark:bg-zinc-800",
      formButtonPrimary:
        "bg-orange-500 hover:bg-orange-600 text-white transition-all duration-200",
      // Personnalisation du bouton SignIn lui-même
      userButtonBox: "group-hover:scale-105 transition-transform duration-200",
      userButtonTrigger:
        "group-hover:shadow-md transition-all duration-200 group-hover:brightness-110",
    },
  };

  return (
    <nav className="max-w-[1200px] w-full mx-auto h-[80px] flex items-center justify-between p-5 border-b border-gray-300">
      <div>
        <Link href="/">
          <Image
            width={200}
            height={30}
            src={Logo}
            className="w-auto h-16"
            alt="Paleolitho"
            priority
          />
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Link
            href="/dashboard/home"
            className="hover:text-orange-500 transition-colors duration-200"
          >
            Home
          </Link>
        </div>
        <div className="group">
          <SignedOut>
            <SignInButton mode="modal" appearance={signInAppearance}>
              <button
                className="px-4 py-2 rounded-md bg-orange-500 text-white font-medium 
                hover:bg-orange-600 hover:scale-105 transition-all duration-200 
                hover:shadow-md active:scale-95"
              >
                Se connecter
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={signInAppearance} />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
