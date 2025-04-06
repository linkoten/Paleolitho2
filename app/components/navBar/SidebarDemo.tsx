"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  NotebookPen,
  Settings,
  CreditCard,
  HomeIcon as House,
  UserIcon,
} from "lucide-react";
import Favicon from "@/public/favicon.png";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

export function SidebarDemo({ user }: { user: any }) {
  // Gestion sécurisée de l'email et du rôle de l'utilisateur
  const userEmail = user?.email || "Anonyme";
  const userRole = user?.role || "USER";

  const links = [
    {
      label: "Home",
      href: "/dashboard/home",
      icon: (
        <House className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Shop",
      href: "/dashboard/shop",
      icon: (
        <CreditCard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Blog",
      href: "/dashboard/blog",
      icon: (
        <NotebookPen className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    ...(userRole === "ADMIN"
      ? [
          {
            label: "Admin",
            href: "/dashboard/admin",
            icon: (
              <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
          },
        ]
      : []),
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "h-full transition-all duration-300 ease-in-out",
        open ? "w-fit" : "w-16",
        "bg-gray-100 dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700"
      )}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="flex flex-col justify-between h-full py-4">
          <div className="flex flex-col flex-1 overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 pl-2 flex flex-col space-y-4">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: userEmail,
                href: "#",
                icon: user?.image ? (
                  <Image
                    src={user.image}
                    className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ) : (
                  <div className="h-7 w-7 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/dashboard/shop"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image
        src={Favicon || "/placeholder.svg"}
        height={512}
        width={512}
        alt="Favicon Paleolitho"
        className="h-8 w-10 dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Paleolitho
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/dashboard/shop"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image
        src={Favicon || "/placeholder.svg"}
        height={512}
        width={512}
        alt="Favicon Paleolitho"
        className="h-8 w-10 dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"
      />
    </Link>
  );
};
