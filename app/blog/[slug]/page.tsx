import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CommerceHeader from "@/components/commerce-header";
import { articles, getArticle } from "@/lib/articles";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article not found" };
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return <><CommerceHeader/><main className="articlePage shell"><div className="articleIntro"><Link href="/blog">Tech Insights</Link><span className="kicker">{article.category} · {article.readTime}</span><h1>{article.title}</h1><p>{article.excerpt}</p></div><article className="articleBody">{article.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}<div className="articleCta"><span className="kicker">READY TO SHOP?</span><h2>Use the guide, then compare the actual products.</h2><Link className="primaryBtn" href="/shop">Browse the live catalog</Link></div></article></main></>;
}
