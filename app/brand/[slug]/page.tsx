import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import CatalogBrowser from "@/components/catalog-browser";
import { getStoreCatalog } from "@/lib/catalog";

function fromSlug(slug: string) {
  return slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = fromSlug(slug);
  return { title: name, description: `Browse ${name} products available through TechMan AMT.` };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const catalog = await getStoreCatalog();
  const actual = catalog.find((p) => p.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug)?.brand || fromSlug(slug);
  return <><CommerceHeader/><CatalogBrowser title={actual} intro={`Explore current ${actual} products, pricing and stock in the TechMan AMT catalog.`} initialBrand={actual}/></>;
}
