import type { Metadata } from "next";
import InfoPage from "@/components/info-page";

export const metadata: Metadata = { title: "FAQ", description: "Common questions about shopping with TechMan AMT." };

export default function FaqPage() {
  return <InfoPage eyebrow="FAQ" title="Answers before you spend." intro="The store is designed to make important buying information easy to find. For anything product-specific, confirm with support before payment." sections={[
    { title: "Do you deliver across Nigeria?", body: "The platform supports nationwide delivery. Exact pricing, timing and courier availability depend on the destination and product." },
    { title: "Can I order through WhatsApp?", body: "Yes when the store WhatsApp number is configured. Product and checkout flows can generate an order message with the relevant item details." },
    { title: "How do I track an order?", body: "Open the Track Order page and enter the order reference together with the same email address used at checkout." },
    { title: "Are products new or UK used?", body: "Condition is displayed per product. Never assume the condition from price alone." },
    { title: "Can businesses buy in bulk?", body: "Bulk and corporate ordering is part of the intended store workflow. Until the dedicated quote form is live, contact support with the product, quantity and delivery location." }
  ]}/>;
}
