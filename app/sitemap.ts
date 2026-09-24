import type { MetadataRoute } from "next";
import { getStoreCatalog } from "@/lib/catalog";
import { articles } from "@/lib/articles";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://techmanamt.example";
  const catalog = await getStoreCatalog();
  const staticRoutes = ["", "/shop", "/about", "/contact", "/delivery", "/returns", "/warranty", "/faq", "/track-order", "/trade-in", "/device-request", "/corporate", "/blog", "/privacy", "/terms", "/refund-policy"];

  return [
    ...staticRoutes.map((path) => ({ url: `${base}${path}`, changeFrequency: path === "" ? "daily" as const : "monthly" as const, priority: path === "" ? 1 : .5 })),
    ...catalog.map((product) => ({ url: `${base}/product/${product.slug}`, changeFrequency: "weekly" as const, priority: .8 })),
    ...articles.map((article) => ({ url: `${base}/blog/${article.slug}`, changeFrequency: "monthly" as const, priority: .65 })),
  ];
}
