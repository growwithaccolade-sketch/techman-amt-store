import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import { getStoreSettings } from "@/lib/store-settings";
import { makeWhatsappUrl } from "@/lib/site";
import { getEditablePage } from "@/lib/site-pages";

export const metadata: Metadata = { title: "Contact", description: "Contact TechMan AMT for product and order support." };

const fallback = {
  slug: "contact",
  eyebrow: "CONTACT TECHMAN AMT",
  title: "Talk to us.",
  intro: "Questions about stock, compatibility, delivery, bulk orders or an existing order? Use the channel that works for you.",
  sections: [
    { title: "WhatsApp", body: "Message the store for product and order support." },
    { title: "Email", body: "Send product, order or business enquiries by email." },
    { title: "Track an order", body: "Use your order reference and checkout email to view the recorded status." }
  ]
};

export default async function ContactPage() {
  const [settings, page] = await Promise.all([getStoreSettings(), getEditablePage("contact", fallback)]);
  const wa = makeWhatsappUrl(settings.whatsappNumber, "Hello TechMan AMT, I need help with a product or order.");
  const whatsapp = page.sections[0] || fallback.sections[0];
  const email = page.sections[1] || fallback.sections[1];
  const tracking = page.sections[2] || fallback.sections[2];

  return <><CommerceHeader/><main className="infoPage shell contactPage">
    <section className="infoHero contactHero"><span className="kicker">{page.eyebrow}</span><h1>{page.title}</h1><p>{page.intro}</p><small className="contactLocation">{settings.locationLabel}</small></section>
    <div className="contactCards">
      <article><span className="kicker">WHATSAPP</span><h2>{whatsapp.title}</h2><p>{wa ? whatsapp.body : "The business WhatsApp number has not been configured yet."}</p>{wa && <a className="primaryBtn" href={wa} target="_blank" rel="noreferrer">Open WhatsApp</a>}</article>
      <article><span className="kicker">EMAIL</span><h2>{email.title}</h2><p>{settings.supportEmail || email.body}</p>{settings.supportEmail && <a className="secondaryAction" href={`mailto:${settings.supportEmail}`}>Send email</a>}</article>
      <article><span className="kicker">ORDER HELP</span><h2>{tracking.title}</h2><p>{tracking.body}</p><a className="secondaryAction" href="/track-order">Track order</a></article>
    </div>
  </main></>;
}
