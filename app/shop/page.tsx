import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import CatalogBrowser from "@/components/catalog-browser";

export const metadata: Metadata = { title: "Shop", description: "Browse TechMan AMT phones, laptops, gadgets, creator tools and accessories." };

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string; brand?: string }> }) {
  const params = await searchParams;
  return <><CommerceHeader/><CatalogBrowser initialQuery={params.q || ""} initialCategory={params.category || "All"} initialBrand={params.brand || "All"}/></>;
}
