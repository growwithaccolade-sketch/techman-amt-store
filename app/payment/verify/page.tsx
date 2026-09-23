import CommerceHeader from "@/components/commerce-header";
import PaymentVerification from "@/components/payment-verification";

export default async function VerifyPaymentPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const { reference = "" } = await searchParams;
  return <><CommerceHeader/><PaymentVerification reference={reference}/></>;
}
