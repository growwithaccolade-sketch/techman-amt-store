export type Product = {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  rating: number;
  reviews: number;
  image: string;
  blurb: string;
  stock: number;
  warranty: string;
  condition: "New" | "UK Used";
  highlights: string[];
  specs: Record<string, string>;
};

export const products: Product[] = [
  {
    id: 1, slug: "iphone-16-pro-max-256gb", name: "iPhone 16 Pro Max 256GB", brand: "Apple", category: "Phones",
    price: 2299000, oldPrice: 2499000, badge: "Bestseller", rating: 4.9, reviews: 128, stock: 8, condition: "New", warranty: "1 year seller warranty",
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=90",
    blurb: "Flagship performance, pro camera power and all-day battery.",
    highlights: ["Pro-grade camera system", "Premium titanium build", "All-day battery performance", "Fast USB-C connectivity"],
    specs: { Display: "Large Super Retina XDR display", Storage: "256GB", Connectivity: "5G, Wi‑Fi, Bluetooth", Condition: "Brand new" }
  },
  {
    id: 2, slug: "samsung-galaxy-s25-ultra-256gb", name: "Galaxy S25 Ultra 256GB", brand: "Samsung", category: "Phones",
    price: 1849000, oldPrice: 1999000, badge: "Hot", rating: 4.8, reviews: 94, stock: 11, condition: "New", warranty: "1 year seller warranty",
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=90",
    blurb: "Big-screen Android power for work, gaming and content.",
    highlights: ["Flagship Android performance", "Large high-refresh display", "Advanced multi-camera system", "Built-in productivity features"],
    specs: { Display: "Large AMOLED display", Storage: "256GB", Connectivity: "5G, Wi‑Fi, Bluetooth", Condition: "Brand new" }
  },
  {
    id: 3, slug: "macbook-air-m4-13-inch", name: "MacBook Air M4 13-inch", brand: "Apple", category: "Laptops",
    price: 2395000, badge: "New", rating: 4.9, reviews: 71, stock: 5, condition: "New", warranty: "1 year seller warranty",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=90",
    blurb: "Thin, quiet and fast enough for serious everyday work.",
    highlights: ["Portable all-day design", "Fast Apple silicon performance", "Silent fanless operation", "Excellent for work and study"],
    specs: { Display: "13-inch class", Processor: "Apple silicon", Platform: "macOS", Condition: "Brand new" }
  },
  {
    id: 4, slug: "sony-wh-1000xm5", name: "Sony WH-1000XM5", brand: "Sony", category: "Audio",
    price: 575000, oldPrice: 625000, rating: 4.8, reviews: 203, stock: 14, condition: "New", warranty: "6 months seller warranty",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=90",
    blurb: "Premium noise cancelling for focus, travel and deep listening.",
    highlights: ["Active noise cancellation", "Comfortable over-ear design", "Wireless listening", "Built for calls and focus"],
    specs: { Type: "Over-ear", Connection: "Wireless", Charging: "USB-C", Condition: "Brand new" }
  },
  {
    id: 5, slug: "anker-737-power-bank", name: "Anker 737 Power Bank", brand: "Anker", category: "Accessories",
    price: 185000, badge: "Staff Pick", rating: 4.7, reviews: 116, stock: 19, condition: "New", warranty: "6 months seller warranty",
    image: "https://images.unsplash.com/photo-1609592806596-b43bada2f2eb?auto=format&fit=crop&w=1200&q=90",
    blurb: "High-capacity power for phones, tablets and USB-C laptops.",
    highlights: ["High-capacity portable power", "USB-C fast charging", "Laptop-compatible output", "Travel-friendly setup"],
    specs: { Type: "Power bank", Ports: "USB-C / USB", Use: "Phones, tablets, laptops", Condition: "Brand new" }
  },
  {
    id: 6, slug: "hollyland-lark-m2-wireless-mic", name: "Hollyland Lark M2 Wireless Mic", brand: "Hollyland", category: "Creator Tools",
    price: 235000, rating: 4.8, reviews: 65, stock: 9, condition: "New", warranty: "6 months seller warranty",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=90",
    blurb: "Clean wireless audio for TikTok, YouTube and interviews.",
    highlights: ["Compact wireless audio", "Creator-friendly setup", "Portable charging case", "Great for interviews and short-form content"],
    specs: { Type: "Wireless microphone", Use: "Phone and camera content", Form: "Compact clip-on", Condition: "Brand new" }
  },
  {
    id: 7, slug: "logitech-mx-master-3s", name: "Logitech MX Master 3S", brand: "Logitech", category: "Accessories",
    price: 185000, rating: 4.8, reviews: 149, stock: 16, condition: "New", warranty: "6 months seller warranty",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=90",
    blurb: "Precision control built for creators, coders and power users.",
    highlights: ["Ergonomic productivity shape", "Precision scrolling", "Multi-device workflow", "Quiet clicks"],
    specs: { Type: "Wireless mouse", Use: "Work and creative productivity", Connection: "Wireless", Condition: "Brand new" }
  },
  {
    id: 8, slug: "jbl-charge-5", name: "JBL Charge 5", brand: "JBL", category: "Audio",
    price: 245000, oldPrice: 279000, badge: "Deal", rating: 4.7, reviews: 184, stock: 13, condition: "New", warranty: "6 months seller warranty",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1200&q=90",
    blurb: "Portable room-filling sound with a battery that lasts.",
    highlights: ["Portable wireless audio", "Strong battery life", "Durable outdoor-ready form", "Powerful everyday sound"],
    specs: { Type: "Portable speaker", Connection: "Bluetooth", Charging: "USB", Condition: "Brand new" }
  }
];

export const money = (value: number) => `₦${value.toLocaleString("en-NG")}`;
export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
