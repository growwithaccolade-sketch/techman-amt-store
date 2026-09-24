import Link from "next/link";

export default function BrandLogo({ light = false, href = "/" }: { light?: boolean; href?: string }) {
  return <Link href={href} className="brandLogo" aria-label="TechMan AMT home">
    <img src={light ? "/techman-amt-logo-light.svg" : "/techman-amt-logo.svg"} alt="TechMan AMT"/>
  </Link>;
}
