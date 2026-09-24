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
  return { title: name, description: `Shop ${name} from TechMan AMT.` };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const requested = fromSlug(slug);
  const catalog = await getStoreCatalog();
  const actual = catalog.find((p) => p.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug)?.category || requested;
  return <><CommerceHeader/><CatalogBrowser title={actual} intro={`Browse available ${actual.toLowerCase()} and compare current pricing, stock and product condition.`} initialCategory={actual}/></>;
}
