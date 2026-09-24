import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import { getStoreSettings } from "@/lib/store-settings";
import { makeWhatsappUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Contact", description: "Contact TechMan AMT for product and order support." };

export default async function ContactPage() {
  const settings = await getStoreSettings();
  const wa = makeWhatsappUrl(settings.whatsappNumber, "Hello TechMan AMT, I need help with a product or order.");

  return <><CommerceHeader/><main className="infoPage shell contactPage"><section className="infoHero contactHero"><span className="kicker">CONTACT TECHMAN AMT</span><h1>Talk to us.</h1><p>Questions about stock, compatibility, delivery, bulk orders or an existing order? Use the channel that works for you.</p></section><div className="contactCards"><article><span className="kicker">WHATSAPP</span><h2>WhatsApp</h2><p>{wa ? "Message the store for product and order support." : "The business WhatsApp number has not been configured yet."}</p>{wa && <a className="primaryBtn" href={wa} target="_blank" rel="noreferrer">Open WhatsApp</a>}</article><article><span className="kicker">EMAIL</span><h2>Email</h2><p>{settings.supportEmail || "The public store email has not been configured yet."}</p>{settings.supportEmail && <a className="secondaryAction" href={`mailto:${settings.supportEmail}`}>Send email</a>}</article><article><span className="kicker">ORDER HELP</span><h2>Track an order</h2><p>Use your order reference and checkout email to view the recorded status.</p><a className="secondaryAction" href="/track-order">Track order</a></article></div></main></>;
}
