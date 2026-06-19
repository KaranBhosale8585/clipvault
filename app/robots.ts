import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://clipvault.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/verify/",
        "/dashboard/",
        "/history/",
        "/unlimited-access/",
        "/forgot-password/"
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
