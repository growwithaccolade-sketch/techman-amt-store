import type { Metadata } from "next";
import InfoPage from "@/components/info-page";

export const metadata: Metadata = { title: "Returns", description: "TechMan AMT returns information." };

export default function ReturnsPage() {
  return <InfoPage eyebrow="RETURNS" title="Clear return rules protect both sides." intro="Return eligibility depends on the product category, condition, packaging state and the reason for the request. Confirm the applicable terms before purchase." sections={[
    { title: "Report problems quickly", body: "If an item arrives damaged, materially different from the confirmed order or appears faulty, contact support promptly with the order reference and clear photos or video where useful." },
    { title: "Keep packaging and accessories", body: "Do not discard packaging, included accessories, labels or proof of purchase while a return or warranty issue is being reviewed." },
    { title: "Change-of-mind returns", body: "Eligibility for a non-fault return should be stated for the specific product before payment. Opened devices, activated software and some hygiene-sensitive accessories may have additional restrictions." }
  ]}/>;
}
