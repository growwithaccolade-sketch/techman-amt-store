import CommerceHeader from "@/components/commerce-header";
import OrderTracking from "@/components/order-tracking";

export default async function TrackOrderPage({ searchParams }: { searchParams: Promise<{ reference?: string }> }) {
  const { reference = "" } = await searchParams;
  return <><CommerceHeader/><OrderTracking initialReference={reference}/></>;
}
