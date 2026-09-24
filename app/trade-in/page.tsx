import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import LeadForm from "@/components/lead-form";

export const metadata: Metadata = { title: "Trade In Your Device", description: "Submit a device for TechMan AMT trade-in review." };

export default function TradeInPage() {
  return <><CommerceHeader/><main className="leadPage shell"><section className="leadHero"><span className="kicker">TRADE IN</span><h1>Your old device may still have value.</h1><p>Tell us what you have and its current condition. This form is a request for assessment, not a guaranteed valuation.</p></section><div className="leadLayout"><div className="leadPitch"><h2>Help us price it properly.</h2><p>Accurate model, storage and condition details reduce back-and-forth. Final value may require physical inspection.</p></div><LeadForm type="trade_in" submitLabel="Submit trade-in request" fields={[
    { name: "brand", label: "Brand", required: true, placeholder: "Apple, Samsung, Tecno..." },
    { name: "model", label: "Model", required: true, placeholder: "iPhone 14 Pro" },
    { name: "storage", label: "Storage", placeholder: "256GB" },
    { name: "condition", label: "Overall condition", type: "select", required: true, options: ["Excellent", "Good", "Fair", "Damaged"] },
    { name: "screen", label: "Screen condition", type: "select", options: ["Clean", "Minor scratches", "Cracked", "Not working"] },
    { name: "battery", label: "Battery / performance notes", type: "textarea", placeholder: "Battery health, charging issues, repairs..." },
    { name: "expected_price", label: "Expected price in ₦", type: "number", placeholder: "Optional" }
  ]}/></div></main></>;
}
