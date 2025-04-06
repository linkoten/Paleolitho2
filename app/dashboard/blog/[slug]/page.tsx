import React, { Suspense } from "react";
import { RichText } from "@graphcms/rich-text-react-renderer";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { getPost } from "@/lib/actionsPost";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Loading from "@/app/components/Loading";
import { Metadata } from "next";

export const revalidate = 60;

const renderers = {
  h1: ({ children }: any) => (
    <h1 className="text-blue-700 my-2 mb-4  text-center text-3xl font-bold   md:text-4xl lg:text-5xl">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="  text-blue-700 my-4 mb-4 text-center text-2xl font-bold  md:text-3xl lg:text-4xl">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="  text-blue-700 my-4 mb-4 text-center text-xl font-bold  md:text-3xl lg:text-3xl">
      {children}
    </h3>
  ),
  h4: ({ children }: any) => (
    <h4 className=" text-blue-700 my-2 text-center text-xl font-bold">
      {children}
    </h4>
  ),
  h5: ({ children }: any) => (
    <h5 className=" text-blue-700 my-2 text-base font-bold md:text-xl">
      {children}
    </h5>
  ),
  table: ({ children }: any) => <Table className=" my-10">{children}</Table>,
  table_head: ({ children }: any) => (
    <TableHeader className=" bg-color-secondary text-base ">
      {children}
    </TableHeader>
  ),
  table_row: ({ children }: any) => (
    <TableRow className=" hover:bg-base-300 ">{children}</TableRow>
  ),
  table_cell: ({ children }: any) => (
    <TableCell className=" border-y text-center text-2xs">{children}</TableCell>
  ),
  table_header_cell: ({ children }: any) => (
    <TableHead className="text-center">{children}</TableHead>
  ),
  h6: ({ children }: any) => (
    <h6 className=" text-large -color my-2 font-bold text-third-color">
      {children}
    </h6>
  ),
  p: ({ children }: any) => (
    <p className=" -color  my-4  text-xs  text-fifth-color">{children}</p>
  ),
  ul: ({ children }: any) => (
    <ul className=" -color  my-4  list-disc text-lg  text-fifth-color">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className=" -color  my-4  list-decimal text-lg  text-fifth-color">
      {children}
    </ol>
  ),
  li: ({ children }: any) => <li className="   text-red-800">{children}</li>,
  code: ({ children }: any) => (
    <code className=" bg-gray-800  -color rounded-md bg-base-300 p-2 text-sm">
      {children}
    </code>
  ),
  code_block: ({ children }: any) => (
    <pre className="bg-gray-800  -color overflow-y-scroll rounded-md bg-base-300 p-2 text-sm">
      {children}
    </pre>
  ),
  a: ({ href }: any) => (
    <a
      className="link:text-color-primary -color my-4 text-lg text-link-color underline"
      href={href}
    ></a>
  ),
  img: ({ src, title }: any) => (
    <Image
      width={600}
      height={200}
      src={src}
      className="flex mx-auto py-2 gap-2"
      alt={title}
    />
  ),
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const post = await getPost(params.slug);
  return {
    title: post?.title,
    description: post?.title,
  };
}

export default async function page({ params }: any) {
  const post = await getPost(params.slug);

  console.log("Je suis le post", post, params);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/blog">Blog</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Suspense fallback={<Loading />}>
        <RichText content={post.content.json.children} renderers={renderers} />
      </Suspense>
    </>
  );
}

/*

{"type":"doc","content":[{"type":"paragraph","content":[{"text":"Test","type":"text"}]},{"type":"table","content":[{"type":"tableRow","content":[{"type":"tableHeader","attrs":{"colspan":1,"rowspan":1,"colwidth":null},"content":[{"type":"paragraph","content":[{"text":"Test 1","type":"text"}]}]},{"type":"tableHeader","attrs":{"colspan":1,"rowspan":1,"colwidth":null},"content":[{"type":"paragraph","content":[{"text":"Test 2","type":"text"}]}]},{"type":"tableHeader","attrs":{"colspan":1,"rowspan":1,"colwidth":null},"content":[{"type":"paragraph","content":[{"text":"Test 3","type":"text"}]}]}]},{"type":"tableRow","content":[{"type":"tableCell","attrs":{"colspan":1,"rowspan":1,"colwidth":null},"content":[{"type":"paragraph","content":[{"text":"Petit test 1","type":"text"}]}]},{"type":"tableCell","attrs":{"colspan":1,"rowspan":1,"colwidth":null},"content":[{"type":"paragraph","content":[{"text":"Petit test 2","type":"text"}]}]},{"type":"tableCell","attrs":{"colspan":1,"rowspan":1,"colwidth":null},"content":[{"type":"paragraph","content":[{"text":"Petit test 3","type":"text"}]}]}]},{"type":"tableRow","content":[{"type":"tableCell","attrs":{"colspan":1,"rowspan":1,"colwidth":null},"content":[{"type":"paragraph","content":[{"text":"Petit test 4","type":"text"}]}]},{"type":"tableCell","attrs":{"colspan":1,"rowspan":1,"colwidth":null},"content":[{"type":"paragraph","content":[{"text":"Petit test 5","type":"text"}]}]},{"type":"tableCell","attrs":{"colspan":1,"rowspan":1,"colwidth":null},"content":[{"type":"paragraph","content":[{"text":"Petit test 6","type":"text"}]}]}]}]}]}

*/
