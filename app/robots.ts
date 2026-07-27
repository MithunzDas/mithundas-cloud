import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mithundas.cloud";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/admin/", "/api/webhooks/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
