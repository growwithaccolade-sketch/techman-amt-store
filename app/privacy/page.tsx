import type { Metadata } from "next";
import InfoPage from "@/components/info-page";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return <InfoPage eyebrow="PRIVACY" title="How customer information is handled." intro="This page provides the store's current privacy framework and should be reviewed with appropriate legal counsel before a full commercial launch." sections={[
    { title: "Information collected", body: "Checkout and support workflows can collect contact details, delivery information, order data and technical information required to operate the service." },
    { title: "Why it is used", body: "Information is used to process orders, provide support, prevent abuse, communicate fulfilment updates and improve store operations." },
    { title: "Payments", body: "Payment credentials are handled by configured payment providers rather than stored directly in the storefront." },
    { title: "Retention and access", body: "Operational records should be retained only as long as required for legitimate business, accounting, support and legal purposes, with access limited to authorized staff." }
  ]}/>;
}
