import type { Metadata } from "next";
import Link from "next/link";
import CommerceHeader from "@/components/commerce-header";
import { articles } from "@/lib/articles";

export const metadata: Metadata = { title: "Tech Insights", description: "Practical technology buying guides and creator tips from TechMan AMT." };

export default function BlogPage() {
  return <><CommerceHeader/><main className="blogPage shell"><section className="catalogHero"><span className="kicker">TECHMAN INSIGHTS</span><h1>Buy with more context.</h1><p>Guides focused on the decisions behind the purchase: use case, compatibility, workflow and total setup cost.</p></section><div className="blogGrid">{articles.map((article, index) => <Link className="blogCard" href={`/blog/${article.slug}`} key={article.slug}><span>0{index + 1} · {article.category}</span><h2>{article.title}</h2><p>{article.excerpt}</p><b>{article.readTime}</b></Link>)}</div></main></>;
}
