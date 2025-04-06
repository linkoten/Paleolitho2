"use server";

import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { GraphQLClient } from 'graphql-request'


export const createPost = async (formData: FormData) => {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const coverImage = formData.get("coverImage") as string;
  const excerpt = formData.get("excerpt") as string;

  if (!title || !content || !coverImage || !excerpt) {
    throw new Error("Invalid form data");
  }

  await prisma.post.create({
    data: {
      title,
      content,
      coverImage,
      excerpt,
    },
  });
  redirect("/dashboard/blog");
};

export const getAllPosts = async () => {
  const data = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return data;
};

const hygraph = new GraphQLClient(
  'https://api-eu-west-2.hygraph.com/v2/clkp6kxt31b6x01ta51b202ki/master'
)

export const getPost = async (params: any) => {
  const { post }: any = await hygraph.request(
    `query PostPageQuery($slug: String!)  {
      post (where: { slug: $slug }) {
        slug
        title
        date
        tag
        
        content {
          json
          
        }
        carte {
          latitude
          longitude
        }
        localizations(includeCurrent: true) {
        slug
        title
        date
        tag
        markerInformation
        content {
          json

        }
        carte {
          latitude
          longitude
        }
      }
      }
    }`, 
    
    {
      slug: params,
      next: { revalidate: 60 }
    },
    
  )

  return post
}

export const getPosts = async () => {
  const hygraph = new GraphQLClient(
    'https://api-eu-west-2.hygraph.com/v2/clkp6kxt31b6x01ta51b202ki/master'
  )

  const { posts }: any = await hygraph.request(
    `{
      posts (locales: [en, fr]) {
        localizations(includeCurrent: true) {
          title
          slug
          date
          excerpt
          id
          tag
          coverImage {
            id
            locale
            height
            size
            width
            url
          }
        }
      }
    }`
  )

  return posts
}

const ITEMS_PER_PAGE = 12;

export async function fetchFilteredPages(
  query: string,
  currentPage: number,

) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: ITEMS_PER_PAGE,
      skip: offset,
    });

    return posts;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchPostsPages(
  query: string,

) {
  try {
    const count = await prisma.post.count({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { excerpt: { contains: query, mode: "insensitive" } },
        ],
      },
    });
    const totalPages = Math.ceil(count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Error updating product:", error);
  }
}
