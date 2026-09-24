import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import LeadForm from "@/components/lead-form";

export const metadata: Metadata = { title: "Request a Device", description: "Ask TechMan AMT to source a device or gadget not currently listed." };

export default function DeviceRequestPage() {
  return <><CommerceHeader/><main className="leadPage shell"><section className="leadHero"><span className="kicker">CAN'T FIND IT?</span><h1>Tell us what you are looking for.</h1><p>Submit the exact device or setup you want. The request gives the sales team enough context to check sourcing options.</p></section><div className="leadLayout"><div className="leadPitch"><h2>Specific requests get better answers.</h2><p>Include model, storage, colour, condition preference and budget where they matter.</p></div><LeadForm type="device_request" submitLabel="Request this device" fields={[
    { name: "product", label: "Product or device name", required: true, placeholder: "Samsung Galaxy..." },
    { name: "specification", label: "Preferred specification", type: "textarea", placeholder: "Storage, RAM, colour, new or UK used..." },
    { name: "budget", label: "Budget in ₦", type: "number", placeholder: "Optional" },
    { name: "timeline", label: "When do you need it?", placeholder: "This week, this month..." }
  ]}/></div></main></>;
}
