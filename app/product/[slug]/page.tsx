import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, PackageCheck, ShieldCheck, Star, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import CommerceHeader from "@/components/commerce-header";
import ProductActions from "@/components/product-actions";
import ReviewForm from "@/components/review-form";
import { getStoreCatalog, getStoreProduct } from "@/lib/catalog";
import { money, products as demoProducts } from "@/lib/products";
import { getApprovedReviews } from "@/lib/reviews";

export function generateStaticParams() {
  return demoProducts.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getStoreProduct(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.blurb,
    openGraph: {
      title: product.name,
      description: product.blurb,
      images: product.image ? [{ url: product.image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getStoreProduct(slug);
  if (!product) notFound();

  const [catalog, reviews] = await Promise.all([getStoreCatalog(), getApprovedReviews(product.id)]);
  const related = catalog.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 3);
  const averageRating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [product.image],
    description: product.blurb,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      priceCurrency: "NGN",
      price: product.price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    ...(reviews.length ? {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: Number(averageRating.toFixed(1)),
        reviewCount: reviews.length,
      },
    } : {}),
  };

  return (
    <>
      <CommerceHeader/>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}/>
      <main className="productPage shell">
        <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/#shop">{product.category}</Link><span>/</span><b>{product.name}</b></div>
        <section className="productHero">
          <div className="productGallery"><Image src={product.image} alt={product.name} width={1000} height={1000} priority unoptimized/></div>
          <div className="productDetail">
            <span className="brandName">{product.brand} · {product.condition}</span>
            <h1>{product.name}</h1>
            {reviews.length > 0 && <div className="detailRating"><Star size={16} fill="currentColor"/> {averageRating.toFixed(1)} <span>({reviews.length} verified {reviews.length === 1 ? "review" : "reviews"})</span></div>}
            <p className="detailBlurb">{product.blurb}</p>
            <div className="detailPrice"><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}</div>
            {product.oldPrice && product.oldPrice > product.price && <p className="savings">You save {money(product.oldPrice - product.price)}</p>}
            <div className="stockLine"><PackageCheck size={18}/><b>{product.stock > 0 ? "In stock" : "Out of stock"}</b><span>{product.stock > 0 ? `${product.stock} units available` : "Check back soon"}</span></div>
            {product.highlights.length > 0 && <div className="benefitList">{product.highlights.map((item) => <span key={item}><Check size={17}/>{item}</span>)}</div>}
            {product.stock > 0 ? <ProductActions id={product.id} name={product.name} price={money(product.price)}/> : <div className="setupNotice">This item is currently out of stock. Contact support for restock timing.</div>}
            <div className="purchaseTrust"><span><ShieldCheck size={18}/><b>{product.warranty}</b></span><span><Truck size={18}/><b>Nationwide delivery options</b></span></div>
          </div>
        </section>

        <section className="specSection">
          <div><span className="kicker">BUY WITH CONTEXT</span><h2>What you should know.</h2><p>Clear essentials before you spend. Final package contents and exact regional specifications should be confirmed before payment.</p></div>
          <div className="specTable">{Object.keys(product.specs).length ? Object.entries(product.specs).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>) : <div><span>Product details</span><strong>Ask TechMan AMT for full specifications</strong></div>}</div>
        </section>

        <section className="reviewsSection">
          <div className="sectionHead"><div><span className="kicker">CUSTOMER REVIEWS</span><h2>Verified purchase feedback.</h2></div><p>Reviews only appear after a paid order is matched to this product and the submission is approved.</p></div>
          <div className="reviewsLayout">
            <div className="reviewList">
              {reviews.length ? reviews.map((review) => <article className="reviewCard" key={review.id}>
                <div className="reviewTop"><div className="reviewStars">{[1,2,3,4,5].map((value)=><Star key={value} size={15} fill={value <= review.rating ? "currentColor" : "none"}/>)}</div>{review.verifiedPurchase && <span>Verified purchase</span>}</div>
                {review.title && <h3>{review.title}</h3>}
                <p>{review.body}</p>
                <small>{review.displayName} · {new Date(review.createdAt).toLocaleDateString("en-NG")}</small>
              </article>) : <div className="reviewEmpty"><h3>No approved reviews yet.</h3><p>Be among the first verified buyers to leave useful feedback.</p></div>}
            </div>
            <ReviewForm productId={product.id} productName={product.name}/>
          </div>
        </section>

        {related.length > 0 && <section className="relatedSection"><div className="sectionHead"><div><span className="kicker">KEEP LOOKING</span><h2>More in {product.category}.</h2></div></div><div className="relatedGrid">{related.map((item) => <Link className="relatedCard" key={item.id} href={`/product/${item.slug}`}><Image src={item.image} alt={item.name} width={520} height={420} unoptimized/><span className="brandName">{item.brand}</span><h3>{item.name}</h3><strong>{money(item.price)}</strong></Link>)}</div></section>}
      </main>
    </>
  );
}
