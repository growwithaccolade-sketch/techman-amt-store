import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    deviceSizes: [360, 390, 430, 640, 768, 1024, 1280, 1440, 1920],
    imageSizes: [64, 96, 128, 160, 220, 320, 480],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "www.tek4life.pt" },
      { protocol: "https", hostname: "kream-phinf.pstatic.net" },
      { protocol: "https", hostname: "i.ebayimg.com" },
      { protocol: "https", hostname: "s.topratgeber24.de" },
      { protocol: "https", hostname: "www.static-src.com" },
      { protocol: "https", hostname: "computermania.co.za" },
      { protocol: "https", hostname: "cdn.panacompu.com" }
    ]
  }
};

export default nextConfig;
