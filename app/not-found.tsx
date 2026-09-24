import Link from "next/link";

export default function NotFound() {
  return <main className="emptyCart shell"><span className="kicker">404</span><h1>That page is not in the shop.</h1><p>The product may have moved, been removed or the link may be incorrect.</p><Link className="primaryBtn" href="/">Back to TechMan AMT</Link></main>;
}
