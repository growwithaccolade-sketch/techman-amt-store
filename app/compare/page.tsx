import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import ComparePageClient from "@/components/compare-page";

export const metadata: Metadata = { title: "Compare Products", robots: { index: false, follow: false } };

export default function ComparePage() {
  return <><CommerceHeader/><ComparePageClient/></>;
}
