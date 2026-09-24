"use client";

import { useEffect, useMemo, useState } from "react";

const brandPalettes: Record<string, [string, string, string]> = {
  Apple: ["#3157ff", "#7556ff", "#edf3ff"],
  Samsung: ["#1428a0", "#3157ff", "#eef2ff"],
  Google: ["#34a853", "#4285f4", "#effaf4"],
  Sony: ["#111827", "#7c3aed", "#f4f1ff"],
  Anker: ["#0f172a", "#14b8a6", "#ecfeff"],
  Hollyland: ["#111827", "#f97316", "#fff7ed"],
  Logitech: ["#111827", "#00b8fc", "#effbff"],
  JBL: ["#111827", "#f97316", "#fff4ed"],
  OnePlus: ["#991b1b", "#ef4444", "#fef2f2"],
  Xiaomi: ["#ea580c", "#fb923c", "#fff7ed"],
  ASUS: ["#111827", "#a855f7", "#faf5ff"],
  Dell: ["#075985", "#0ea5e9", "#f0f9ff"],
  Lenovo: ["#111827", "#ef4444", "#fef2f2"],
  HP: ["#075985", "#38bdf8", "#f0f9ff"],
  Bose: ["#111827", "#52525b", "#f4f4f5"],
  Marshall: ["#78350f", "#d97706", "#fffbeb"],
  DJI: ["#111827", "#06b6d4", "#ecfeff"],
  "RØDE": ["#111827", "#eab308", "#fefce8"],
  Insta360: ["#111827", "#22c55e", "#f0fdf4"],
  Elgato: ["#111827", "#7c3aed", "#f5f3ff"],
  UGREEN: ["#14532d", "#22c55e", "#f0fdf4"],
  Nintendo: ["#991b1b", "#ef4444", "#fef2f2"],
};

function ProductFallback({ alt, brand }: { alt: string; brand?: string }) {
  const [dark, accent, pale] = brandPalettes[brand || ""] || ["#111827", "#3157ff", "#f8fafc"];
  const initials = useMemo(
    () => alt.split(/\s+/).filter(Boolean).slice(0, 3).map((part) => part[0]).join("").toUpperCase(),
    [alt]
  );

  return (
    <div
      className="productArtworkFallback"
      role="img"
      aria-label={alt}
      style={{
        background: `linear-gradient(145deg, ${pale} 0%, #ffffff 72%)`,
        ["--fallback-accent" as string]: accent,
        ["--fallback-dark" as string]: dark,
      }}
    >
      <div className="productArtworkGlow"/>
      <div className="productArtworkBrand">{brand || "TechMan AMT"}</div>
      <div className="productArtworkGlyph" aria-hidden="true"><span>{initials}</span></div>
      <div className="productArtworkCopy">
        <strong>{alt}</strong>
        <span>TechMan AMT</span>
      </div>
    </div>
  );
}

export default function ProductImage({
  src,
  alt,
  brand,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  brand?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);

  if (!src) return <ProductFallback alt={alt} brand={brand}/>;

  return (
    <div className="productImageStack">
      <ProductFallback alt={alt} brand={brand}/>
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          referrerPolicy="no-referrer"
          className={`productRemoteImage ${loaded ? "isLoaded" : ""} ${className || ""}`}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
