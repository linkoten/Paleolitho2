import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/dashboard/shop",
          "/dashboard/shop/*",
          "/dashboard/blog",
          "/dashboard/blog/*",
        ],
      },
      {
        userAgent: "*",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://www.paleolitho.com/sitemap.xml",
  };
}
