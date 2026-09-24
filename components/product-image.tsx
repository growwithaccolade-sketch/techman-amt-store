"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProductImage({
  src,
  alt,
  brand,
  className,
  sizes,
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

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (failed || !src) {
    return (
      <div className="productImageFallback" role="img" aria-label={alt}>
        <span>{brand || "TechMan AMT"}</span>
        <strong>{alt}</strong>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
