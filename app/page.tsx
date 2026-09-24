import Storefront from "@/components/storefront";
import { getEditablePage } from "@/lib/site-pages";

const fallback = {
  slug: "home",
  eyebrow: "TECHMAN AMT",
  title: "Technology,|properly selected.",
  intro: "Current phones, laptops, audio and creator tools. Clear specs, clear condition and delivery across Nigeria.",
  sections: [
    { title: "Need a product check or order help?", body: "Contact TechMan AMT for stock, compatibility, delivery and order questions." },
    { title: "New stock and selected offers.", body: "Occasional updates on arrivals, price changes and buying guides." }
  ]
};

export default async function Home() {
  const content = await getEditablePage("home", fallback);
  return <Storefront homeContent={content}/>;
}
