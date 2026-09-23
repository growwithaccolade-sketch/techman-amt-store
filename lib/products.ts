export type Product = {
  id: number;
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
};

export const products: Product[] = [
  { id: 1, name: "iPhone 16 Pro Max 256GB", brand: "Apple", category: "Phones", price: 2299000, oldPrice: 2499000, badge: "Bestseller", rating: 4.9, reviews: 128, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=900&q=85", blurb: "Flagship performance, pro camera power and all-day battery." },
  { id: 2, name: "Galaxy S25 Ultra 256GB", brand: "Samsung", category: "Phones", price: 1849000, oldPrice: 1999000, badge: "Hot", rating: 4.8, reviews: 94, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=85", blurb: "Big-screen Android power for work, gaming and content." },
  { id: 3, name: "MacBook Air M4 13-inch", brand: "Apple", category: "Laptops", price: 2395000, badge: "New", rating: 4.9, reviews: 71, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=85", blurb: "Thin, quiet and fast enough for serious everyday work." },
  { id: 4, name: "Sony WH-1000XM5", brand: "Sony", category: "Audio", price: 575000, oldPrice: 625000, rating: 4.8, reviews: 203, image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85", blurb: "Premium noise cancelling for focus, travel and deep listening." },
  { id: 5, name: "Anker 737 Power Bank", brand: "Anker", category: "Accessories", price: 185000, badge: "Staff Pick", rating: 4.7, reviews: 116, image: "https://images.unsplash.com/photo-1609592806596-b43bada2f2eb?auto=format&fit=crop&w=900&q=85", blurb: "High-capacity power for phones, tablets and USB-C laptops." },
  { id: 6, name: "Hollyland Lark M2 Wireless Mic", brand: "Hollyland", category: "Creator Tools", price: 235000, rating: 4.8, reviews: 65, image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=85", blurb: "Clean wireless audio for TikTok, YouTube and interviews." },
  { id: 7, name: "Logitech MX Master 3S", brand: "Logitech", category: "Accessories", price: 185000, rating: 4.8, reviews: 149, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=85", blurb: "Precision control built for creators, coders and power users." },
  { id: 8, name: "JBL Charge 5", brand: "JBL", category: "Audio", price: 245000, oldPrice: 279000, badge: "Deal", rating: 4.7, reviews: 184, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85", blurb: "Portable room-filling sound with a battery that lasts." }
];

export const money = (value: number) => `₦${value.toLocaleString("en-NG")}`;
