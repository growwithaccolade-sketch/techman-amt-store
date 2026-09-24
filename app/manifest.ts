import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TechMan AMT",
    short_name: "TechMan AMT",
    description: "Phones, gadgets, creator tools and everyday technology.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f7f3",
    theme_color: "#0a0d12",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
