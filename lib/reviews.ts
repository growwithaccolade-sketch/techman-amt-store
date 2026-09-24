import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";

export type PublicReview = {
  id: string;
  displayName: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: boolean;
  createdAt: string;
};

export async function getApprovedReviews(productId: number): Promise<PublicReview[]> {
  if (!commerceBackendConfigured()) return [];

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from("product_reviews")
      .select("id,display_name,rating,title,body,verified_purchase,created_at")
      .eq("product_external_id", productId)
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) return [];
    return (data ?? []).map((review) => ({
      id: review.id,
      displayName: review.display_name,
      rating: Number(review.rating),
      title: review.title || "",
      body: review.body,
      verifiedPurchase: Boolean(review.verified_purchase),
      createdAt: review.created_at,
    }));
  } catch {
    return [];
  }
}
