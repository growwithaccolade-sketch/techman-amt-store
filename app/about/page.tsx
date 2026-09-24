import type { Metadata } from "next";
import InfoPage from "@/components/info-page";
import { getEditablePage } from "@/lib/site-pages";

export const metadata: Metadata = { title: "About" };

const fallback = {
  "slug": "about",
  "eyebrow": "ABOUT TECHMAN AMT",
  "title": "Tech buying should feel clearer.",
  "intro": "TechMan AMT is being built as a practical place to discover, compare and buy phones, gadgets, creator tools and everyday technology without unnecessary confusion.",
  "sections": [
    {
      "title": "What we care about",
      "body": "Good ecommerce is more than putting products in a grid. Customers need clear product condition, useful explanations, realistic delivery information and access to support when the purchase deserves a conversation."
    },
    {
      "title": "Who we serve",
      "body": "The store is designed for individuals, creators, students, professionals and growing businesses looking for technology that fits a real use case and budget."
    },
    {
      "title": "How we want to sell",
      "body": "We aim to use transparent product information, genuine offers and clear support rather than fake urgency, fake reviews or invented achievements."
    }
  ]
};

export default async function Page() {
  const page = await getEditablePage("about", fallback);
  return <InfoPage eyebrow={page.eyebrow} title={page.title} intro={page.intro} sections={page.sections}/>;
}
