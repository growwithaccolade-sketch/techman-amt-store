import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import LeadForm from "@/components/lead-form";

export const metadata: Metadata = { title: "Corporate & Bulk Orders", description: "Request a TechMan AMT bulk technology quote." };

export default function CorporatePage() {
  return <><CommerceHeader/><main className="leadPage shell"><section className="leadHero"><span className="kicker">BULK & CORPORATE</span><h1>Buying technology for a team?</h1><p>Send the quantity, product requirements, budget and delivery timeline. The quote team can respond with the options that actually fit the request.</p></section><div className="leadLayout"><div className="leadPitch"><h2>Built for serious purchasing.</h2><p>Useful for companies, schools, agencies, creator teams and organisations buying multiple devices or accessories.</p></div><LeadForm type="corporate_quote" submitLabel="Request bulk quote" fields={[
    { name: "organization", label: "Organisation name", required: true },
    { name: "products", label: "Products required", type: "textarea", required: true, placeholder: "e.g. 20 laptops, 20 mice, 10 power banks" },
    { name: "quantity", label: "Estimated total quantity", type: "number", required: true },
    { name: "budget", label: "Budget in ₦", type: "number" },
    { name: "timeline", label: "Required timeline", placeholder: "e.g. within 2 weeks" },
    { name: "notes", label: "Other requirements", type: "textarea", placeholder: "Delivery location, preferred brands, warranty needs..." }
  ]}/></div></main></>;
}
