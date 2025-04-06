import GetPosts from "@/app/components/blog/GetPosts";
import Loading from "@/app/components/Loading";
import { GraphQLClient } from "graphql-request";
import { Metadata } from "next";
import { Suspense } from "react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Paleolitho/blog",
  description:
    "Official Blog of Paleolitho where you can find articles about Trilobites and Shells.",
};

const getPosts = async () => {
  const hygraph = new GraphQLClient(
    "https://api-eu-west-2.hygraph.com/v2/clkp6kxt31b6x01ta51b202ki/master"
  );

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
  );

  return posts;
};

export default async function Home() {
  const posts = await getPosts();

  console.log("les posts", posts);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Suspense fallback={<Loading />}>
        <GetPosts posts={posts} />
      </Suspense>
    </div>
  );
}
