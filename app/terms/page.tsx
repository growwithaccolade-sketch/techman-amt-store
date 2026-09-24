import type { Metadata } from "next";
import InfoPage from "@/components/info-page";
import { getEditablePage } from "@/lib/site-pages";

export const metadata: Metadata = { title: "Terms" };

const fallback = {
  "slug": "terms",
  "eyebrow": "TERMS",
  "title": "The rules for using the store.",
  "intro": "These general terms describe the intended transaction framework and should be professionally reviewed before production launch.",
  "sections": [
    {
      "title": "Product information",
      "body": "TechMan AMT aims to keep descriptions, condition, price and availability accurate. Material order details should be confirmed before fulfilment."
    },
    {
      "title": "Orders and payment",
      "body": "An order may require stock, payment and delivery verification before final acceptance. Failed or unverified payments do not create a paid order."
    },
    {
      "title": "Pricing errors",
      "body": "Obvious technical or data-entry errors may require correction before fulfilment. Customers should be notified rather than silently charged a different amount."
    },
    {
      "title": "Acceptable use",
      "body": "Users must not abuse checkout, payment, account, support or administrative systems or attempt unauthorized access."
    }
  ]
};

export default async function Page() {
  const page = await getEditablePage("terms", fallback);
  return <InfoPage eyebrow={page.eyebrow} title={page.title} intro={page.intro} sections={page.sections}/>;
}
