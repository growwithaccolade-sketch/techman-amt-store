import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import CatalogBrowser from "@/components/catalog-browser";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  return <><CommerceHeader/><CatalogBrowser title={q ? `Search results for “${q}”` : "Search the store"} intro="Search across the current live catalog." initialQuery={q}/></>;
}
