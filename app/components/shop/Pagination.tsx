"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { generatePagination } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  // Create URL for page navigation
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Generate pagination array
  const allPages = generatePagination(currentPage, totalPages);

  // If there's only one page, don't show pagination
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Pagination" className="flex justify-center">
      <ul className="flex items-center gap-1">
        <li>
          <PaginationArrow
            direction="prev"
            href={createPageURL(currentPage - 1)}
            isDisabled={currentPage <= 1}
          />
        </li>

        {allPages.map((page, index) => {
          let position: "first" | "last" | "middle" | "single" | undefined;

          if (index === 0) position = "first";
          if (index === allPages.length - 1) position = "last";
          if (allPages.length === 1) position = "single";
          if (page === "...") position = "middle";

          return (
            <li key={page}>
              <PaginationNumber
                page={page}
                href={createPageURL(page)}
                isActive={currentPage === page}
                position={position}
              />
            </li>
          );
        })}

        <li>
          <PaginationArrow
            direction="next"
            href={createPageURL(currentPage + 1)}
            isDisabled={currentPage >= totalPages}
          />
        </li>
      </ul>
    </nav>
  );
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string;
  href: string;
  isActive: boolean;
  position?: "first" | "last" | "middle" | "single";
}) {
  // For ellipsis
  if (page === "...") {
    return (
      <div className="flex h-9 w-9 items-center justify-center">
        <MoreHorizontal className="h-4 w-4" />
        <span className="sr-only">Plus de pages</span>
      </div>
    );
  }

  // For page numbers
  return isActive ? (
    <div
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-medium"
      )}
      aria-current="page"
    >
      {page}
    </div>
  ) : (
    <Link
      href={href}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border text-sm transition-colors hover:bg-muted"
      )}
    >
      {page}
      <span className="sr-only">Page {page}</span>
    </Link>
  );
}

function PaginationArrow({
  direction,
  href,
  isDisabled,
}: {
  direction: "prev" | "next";
  href: string;
  isDisabled?: boolean;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  const label = direction === "prev" ? "Page précédente" : "Page suivante";

  if (isDisabled) {
    return (
      <Button
        variant="outline"
        size="icon"
        disabled
        className="h-9 w-9 cursor-not-allowed opacity-50"
      >
        <Icon className="h-4 w-4" />
        <span className="sr-only">{label}</span>
      </Button>
    );
  }

  return (
    <Button variant="outline" size="icon" asChild className="h-9 w-9">
      <Link href={href}>
        <Icon className="h-4 w-4" />
        <span className="sr-only">{label}</span>
      </Link>
    </Button>
  );
}
