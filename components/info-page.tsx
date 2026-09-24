import CommerceHeader from "@/components/commerce-header";
import Link from "next/link";

export type InfoSection = { title: string; body: string; points?: string[] };

export default function InfoPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: string; sections: InfoSection[] }) {
  return (
    <>
      <CommerceHeader/>
      <main className="infoPage shell">
        <section className="infoHero"><span className="kicker">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></section>
        <div className="infoLayout">
          <article className="infoContent">{sections.map((section) => <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p>{section.points?.length ? <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul> : null}</section>)}</article>
          <aside className="infoAside"><span className="kicker">NEED HELP?</span><h3>Talk to TechMan AMT before you buy.</h3><p>If a product detail, delivery option or warranty term is unclear, confirm it before payment.</p><Link className="primaryBtn" href="/#shop">Browse products</Link><Link className="secondaryAction" href="/track-order">Track an order</Link></aside>
        </div>
      </main>
    </>
  );
}
