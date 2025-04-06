"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import BlogFilter from "@/app/components/blog/BlogFilter";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Globe, Clock, Tag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Types for improved type safety
interface BlogImage {
  id: string;
  locale: string;
  height: number;
  size: number;
  width: number;
  url: string;
}

interface BlogPost {
  slug: string;
  date: string;
  id: string;
  title: string;
  coverImage: BlogImage;
  tag: string;
  excerpt: string;
}

interface GetPostsProps {
  posts: Array<{
    localizations: BlogPost[];
  }>;
}

const TAGS = ["Salon", "Collection", "Fouille", "Gisement", "Excavation"];

export default function GetPosts({ posts = [] }: GetPostsProps) {
  const [filter, setFilter] = useState("");
  const [language, setLanguage] = useState("english");

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const resetFilter = () => {
    setFilter("");
  };

  // Prepare posts based on language
  const englishPosts = useMemo(
    () => posts.map((post) => post.localizations[0]),
    [posts]
  );

  const frenchPosts = useMemo(
    () => posts.map((post) => post.localizations[1]),
    [posts]
  );

  const currentPosts = useMemo(
    () => (language === "english" ? englishPosts : frenchPosts),
    [language, englishPosts, frenchPosts]
  );

  // Apply filtering
  const filteredPosts = useMemo(
    () =>
      filter
        ? currentPosts.filter((post) => post.tag === filter)
        : currentPosts,
    [filter, currentPosts]
  );

  const toggleLanguage = () => {
    setLanguage(language === "english" ? "french" : "english");
  };

  return (
    <>
      <div className="container px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Blog</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            {language === "english" ? "Articles" : "Articles"}
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <BlogFilter
              options={TAGS}
              onFilterChange={handleFilterChange}
              currentFilter={filter}
              onReset={resetFilter}
            />

            <Button
              onClick={toggleLanguage}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              {language === "english" ? "Français" : "English"}
            </Button>
          </div>
        </div>

        {filter && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground">
              Filtré par: <span className="font-medium">{filter}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilter}
                className="ml-2 h-6 px-2"
              >
                Effacer
              </Button>
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            key={`${language}-${filter}`}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post: BlogPost) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    href={`/dashboard/blog/${post.slug}`}
                    className="block h-full transition-all"
                  >
                    <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px]">
                      <div className="aspect-w-16 aspect-h-9 relative h-48">
                        <Image
                          src={post.coverImage?.url || "/placeholder-image.jpg"}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                      </div>

                      <CardHeader className="p-4">
                        <CardTitle className="line-clamp-2 text-lg font-bold">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mt-2">
                          {post.excerpt}
                        </CardDescription>
                      </CardHeader>

                      <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          <span>{post.tag}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <time dateTime={post.date}>{post.date}</time>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center py-12">
                <p className="text-muted-foreground text-center">
                  Aucun article trouvé pour ce filtre.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
