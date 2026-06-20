import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://clipvault.online";

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
        "/forgot-password/",
        "/health"
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
