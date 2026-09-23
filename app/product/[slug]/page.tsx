import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, PackageCheck, ShieldCheck, Star, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import CommerceHeader from "@/components/commerce-header";
import ProductActions from "@/components/product-actions";
import { getProduct, money, products } from "@/lib/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found | TechMan AMT" };
  return {
    title: `${product.name} | TechMan AMT`,
    description: product.blurb,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products.filter((item) => item.id !== product.id && item.category === product.category).slice(0, 3);

  return (
    <>
      <CommerceHeader/>
      <main className="productPage shell">
        <div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><Link href="/#shop">{product.category}</Link><span>/</span><b>{product.name}</b></div>
        <section className="productHero">
          <div className="productGallery"><Image src={product.image} alt={product.name} width={1000} height={1000} priority/></div>
          <div className="productDetail">
            <span className="brandName">{product.brand} · {product.condition}</span>
            <h1>{product.name}</h1>
            <div className="detailRating"><Star size={16} fill="currentColor"/> {product.rating} <span>({product.reviews} reviews)</span></div>
            <p className="detailBlurb">{product.blurb}</p>
            <div className="detailPrice"><strong>{money(product.price)}</strong>{product.oldPrice && <del>{money(product.oldPrice)}</del>}</div>
            {product.oldPrice && <p className="savings">You save {money(product.oldPrice - product.price)}</p>}
            <div className="stockLine"><PackageCheck size={18}/><b>{product.stock > 0 ? "In stock" : "Out of stock"}</b><span>{product.stock > 0 ? `${product.stock} units available` : "Check back soon"}</span></div>
            <div className="benefitList">{product.highlights.map((item) => <span key={item}><Check size={17}/>{item}</span>)}</div>
            <ProductActions id={product.id} name={product.name} price={money(product.price)}/>
            <div className="purchaseTrust"><span><ShieldCheck size={18}/><b>{product.warranty}</b></span><span><Truck size={18}/><b>Nationwide delivery options</b></span></div>
          </div>
        </section>

        <section className="specSection">
          <div><span className="kicker">BUY WITH CONTEXT</span><h2>What you should know.</h2><p>Clear essentials before you spend. Final package contents and exact regional specifications should be confirmed before payment.</p></div>
          <div className="specTable">{Object.entries(product.specs).map(([key, value]) => <div key={key}><span>{key}</span><strong>{value}</strong></div>)}</div>
        </section>

        {related.length > 0 && <section className="relatedSection"><div className="sectionHead"><div><span className="kicker">KEEP LOOKING</span><h2>More in {product.category}.</h2></div></div><div className="relatedGrid">{related.map((item) => <Link className="relatedCard" key={item.id} href={`/product/${item.slug}`}><Image src={item.image} alt={item.name} width={520} height={420}/><span className="brandName">{item.brand}</span><h3>{item.name}</h3><strong>{money(item.price)}</strong></Link>)}</div></section>}
      </main>
    </>
  );
}
