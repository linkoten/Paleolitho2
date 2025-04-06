import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { gentium_book_plus, inter } from "./components/font";

import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Nav from "./components/navBar/Nav";
import Reg from "@/public/Reg.jpg";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Paleolitho",
  description:
    "A Fossil E-Commerce Website, you will find Rare and Uniques Trilobites and Shells from Morroco and France.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${gentium_book_plus.className} relative`}>
          <div
            className="fixed inset-0 bg-cover bg-center -z-10 opacity-20"
            style={{ backgroundImage: `url(${Reg.src})` }}
          ></div>
          <Toaster />

          <Nav />

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
