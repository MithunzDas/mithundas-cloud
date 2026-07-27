import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mithundas.cloud";

  const routes = [
    "",
    "/systems",
    "/demo",
    "/case-studies",
    "/process",
    "/insights",
    "/contact",
    "/privacy",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/systems" || route === "/contact" ? 0.8 : 0.6,
  }));
}
