import type { Metadata } from "next";
import InfoPage from "@/components/info-page";
import { getEditablePage } from "@/lib/site-pages";

export const metadata: Metadata = { title: "Faq" };

const fallback = {
  "slug": "faq",
  "eyebrow": "FAQ",
  "title": "Answers before you spend.",
  "intro": "The store is designed to make important buying information easy to find. For anything product-specific, confirm with support before payment.",
  "sections": [
    {
      "title": "Do you deliver across Nigeria?",
      "body": "The platform supports nationwide delivery. Exact pricing, timing and courier availability depend on the destination and product."
    },
    {
      "title": "Can I order through WhatsApp?",
      "body": "Yes when the store WhatsApp number is configured. Product and checkout flows can generate an order message with the relevant item details."
    },
    {
      "title": "How do I track an order?",
      "body": "Open the Track Order page and enter the order reference together with the same email address used at checkout."
    },
    {
      "title": "Are products new or UK used?",
      "body": "Condition is displayed per product. Never assume the condition from price alone."
    },
    {
      "title": "Can businesses buy in bulk?",
      "body": "Bulk and corporate ordering is supported. Use the corporate request form with the product, quantity and delivery location."
    }
  ]
};

export default async function Page() {
  const page = await getEditablePage("faq", fallback);
  return <InfoPage eyebrow={page.eyebrow} title={page.title} intro={page.intro} sections={page.sections}/>;
}
