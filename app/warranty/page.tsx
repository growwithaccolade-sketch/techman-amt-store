import type { Metadata } from "next";
import InfoPage from "@/components/info-page";
import { getEditablePage } from "@/lib/site-pages";

export const metadata: Metadata = { title: "Warranty" };

const fallback = {
  "slug": "warranty",
  "eyebrow": "WARRANTY",
  "title": "Know what is covered before you buy.",
  "intro": "Warranty terms are product-specific. The product page or sales confirmation should state the applicable warranty before payment.",
  "sections": [
    {
      "title": "Seller or manufacturer warranty",
      "body": "Coverage may come from TechMan AMT, a distributor or the manufacturer depending on the item. The responsible warranty provider and duration should be confirmed on the order."
    },
    {
      "title": "What warranty usually addresses",
      "body": "Warranty generally focuses on qualifying manufacturing or functional faults. Accidental damage, liquid damage, misuse and unauthorized repairs are commonly excluded unless a specific protection plan says otherwise."
    },
    {
      "title": "Making a claim",
      "body": "Keep your order reference, proof of purchase and device identifiers. Support may request diagnostics, photos or an inspection before a resolution is approved."
    }
  ]
};

export default async function Page() {
  const page = await getEditablePage("warranty", fallback);
  return <InfoPage eyebrow={page.eyebrow} title={page.title} intro={page.intro} sections={page.sections}/>;
}
