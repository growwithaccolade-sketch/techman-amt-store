import type { Metadata } from "next";
import CommerceHeader from "@/components/commerce-header";
import WishlistPageClient from "@/components/wishlist-page";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false, follow: false } };

export default function WishlistPage() {
  return <><CommerceHeader/><WishlistPageClient/></>;
}
