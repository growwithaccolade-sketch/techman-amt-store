import type { Metadata } from "next";
import InfoPage from "@/components/info-page";

export const metadata: Metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return <InfoPage eyebrow="REFUNDS" title="Refunds should follow the actual transaction." intro="Approved refunds depend on the payment method, return outcome and reason for the refund." sections={[
    { title: "Approved refunds", body: "Where a refund is approved, the store should document the order reference, amount and original payment method before processing." },
    { title: "Processing time", body: "The time for money to appear after a processed refund can depend on the payment provider and customer's bank. Do not promise a fixed timeline unless the provider supports it." },
    { title: "Partial refunds", body: "Where appropriate and agreed, a refund may apply to part of an order rather than the entire purchase." }
  ]}/>;
}
