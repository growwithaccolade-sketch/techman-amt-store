import type { Metadata } from "next";
import InfoPage from "@/components/info-page";

export const metadata: Metadata = { title: "Delivery Information", description: "How TechMan AMT delivery and fulfilment works." };

export default function DeliveryPage() {
  return <InfoPage eyebrow="DELIVERY" title="Know the delivery plan before payment." intro="Delivery cost and timing can vary by product, location and courier availability. We confirm the available option before final fulfilment." sections={[
    { title: "Nationwide delivery", body: "TechMan AMT is structured to support delivery across Nigeria. The exact courier, fee and estimated delivery window should be confirmed for your order before dispatch." },
    { title: "Local delivery and pickup", body: "Where same-day delivery or pickup is available, the option should only be shown after the store has configured the relevant location and operating rules." },
    { title: "Tracking", body: "Orders created through the online checkout receive a reference that can be checked on the order tracking page using the same checkout email address." },
    { title: "Before dispatch", body: "High-value orders may require payment verification and contact confirmation before a device leaves fulfilment." }
  ]}/>;
}
