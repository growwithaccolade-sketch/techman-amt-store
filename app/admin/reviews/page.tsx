import { redirect } from "next/navigation";
import AdminNav from "@/components/admin-nav";
import { hasAdminSession } from "@/app/admin/actions";
import { commerceBackendConfigured, getSupabaseAdmin } from "@/lib/supabase/admin";
import { deleteReview, setReviewApproval } from "./actions";

type ReviewRow = {
  id: string;
  product_external_id: number;
  display_name: string;
  email: string;
  rating: number;
  title?: string | null;
  body: string;
  verified_purchase: boolean;
  approved: boolean;
  created_at: string;
};

export default async function AdminReviewsPage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  if (!(await hasAdminSession())) redirect("/admin");
  const { error, success } = await searchParams;
  const backend = commerceBackendConfigured();
  let reviews: ReviewRow[] = [];

  if (backend) {
    const supabase = getSupabaseAdmin();
    const result = await supabase.from("product_reviews").select("*").order("created_at", { ascending: false }).limit(100);
    reviews = (result.data ?? []) as ReviewRow[];
  }

  return <main className="adminShell">
    <AdminNav active="reviews"/>
    <section className="adminMain">
      <div className="adminTop"><div><span className="kicker">TRUST</span><h1>Review Moderation</h1></div><a className="secondaryAction" href="/shop">View storefront</a></div>
      {!backend && <div className="adminNotice warning">Connect Supabase and apply migration 008 before review moderation can work.</div>}
      {error && <div className="adminNotice error">Could not update review: {error}</div>}
      {success && <div className="adminNotice success">Review moderation updated.</div>}

      <section className="adminCard adminOrdersCard">
        <div className="adminListHead"><div><span className="kicker">RECENT SUBMISSIONS</span><h2>{reviews.length} reviews</h2></div><span>Verified purchase status is determined by paid order matching</span></div>
        {!backend ? <div className="adminEmpty"><h3>Review moderation is waiting for the database.</h3></div> :
        reviews.length === 0 ? <div className="adminEmpty"><h3>No reviews submitted yet.</h3></div> :
        <div className="reviewAdminList">{reviews.map((review) => <article className="reviewAdminCard" key={review.id}>
          <div className="reviewAdminTop"><div><strong>{review.display_name}</strong><span>{review.email}</span></div><div><b>{review.rating}/5</b><em className={review.approved ? "statusLive" : "statusOff"}>{review.approved ? "Published" : "Pending"}</em></div></div>
          {review.title && <h3>{review.title}</h3>}
          <p>{review.body}</p>
          <div className="reviewAdminMeta"><span>Product ID {review.product_external_id}</span><span>{review.verified_purchase ? "Verified purchase" : "Unverified"}</span><span>{new Date(review.created_at).toLocaleString("en-NG")}</span></div>
          <div className="reviewAdminActions">
            <form action={setReviewApproval}><input type="hidden" name="id" value={review.id}/><input type="hidden" name="productId" value={review.product_external_id}/><input type="hidden" name="approved" value={review.approved ? "false" : "true"}/><button className="primaryAction">{review.approved ? "Hide review" : "Approve review"}</button></form>
            <form action={deleteReview}><input type="hidden" name="id" value={review.id}/><button className="dangerButton">Delete</button></form>
          </div>
        </article>)}</div>}
      </section>
    </section>
  </main>;
}
