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
    id: 1,
    slug: "iphone-16-pro-max-256gb",
    name: "iPhone 16 Pro Max 256GB",
    brand: "Apple",
    category: "Phones",
    price: 2299000,
    oldPrice: 2499000,
    badge: "Bestseller",
    rating: 0,
    reviews: 0,
    stock: 8,
    condition: "New",
    warranty: "1 year seller warranty",
    image: "https://storage.googleapis.com/mobileup-prod-public/mupdomain-images/smartphones/iphone-16-pro-max-esim-desert-titanium.png",
    blurb: "6.9-inch Pro display, A18 Pro performance and 256GB storage.",
    highlights: ["6.9-inch Super Retina XDR display", "A18 Pro chip", "256GB storage", "USB-C and MagSafe"],
    specs: {
      Display: "6.9-inch Super Retina XDR",
      Chip: "A18 Pro",
      Storage: "256GB",
      Finish: "Desert Titanium",
      Connectivity: "5G, Wi-Fi, Bluetooth",
      Condition: "Brand new"
    }
  },
  {
    id: 2,
    slug: "samsung-galaxy-s25-ultra-256gb",
    name: "Galaxy S25 Ultra 256GB",
    brand: "Samsung",
    category: "Phones",
    price: 1849000,
    oldPrice: 1999000,
    badge: "Featured",
    rating: 0,
    reviews: 0,
    stock: 11,
    condition: "New",
    warranty: "1 year seller warranty",
    image: "https://www.tek4life.pt/media/catalog/product/cache/2/image/1800x/6b9ffbf72458f4fd2d3cb995d92e8889/s/m/smartphone_samsung_s25_ultra_s938_5g_12gb512gb_dual_sim_titanium_gray_5_.png",
    blurb: "6.9-inch Galaxy flagship with S Pen, 256GB storage and titanium frame.",
    highlights: ["6.9-inch Dynamic AMOLED 2X", "Integrated S Pen", "256GB storage", "Titanium frame"],
    specs: {
      Display: "6.9-inch Dynamic AMOLED 2X",
      Storage: "256GB",
      Color: "Titanium Gray",
      SIM: "Dual SIM",
      Connectivity: "5G, Wi-Fi, Bluetooth",
      Condition: "Brand new"
    }
  },
  {
    id: 3,
    slug: "macbook-air-m4-13-inch",
    name: "MacBook Air M4 13-inch",
    brand: "Apple",
    category: "Laptops",
    price: 2395000,
    badge: "New",
    rating: 0,
    reviews: 0,
    stock: 5,
    condition: "New",
    warranty: "1 year seller warranty",
    image: "https://kream-phinf.pstatic.net/MjAyNTA3MzBfMjc4/MDAxNzUzODYzMDc0ODUw.8nGAmtxwaqvsa7JmeBCe5zjJn37ELTz7PrgOTeXj5QAg.oXIiE3KshI8hbhI1o2JVply86Pmkd5i0zJ46QCLdngQg.PNG/a_f8fcf891ad6f43e789ec93bd51b24723.png",
    blurb: "13-inch MacBook Air with M4 performance in a thin fanless design.",
    highlights: ["Apple M4 chip", "13-inch class display", "Fanless design", "USB-C and MagSafe"],
    specs: {
      Display: "13-inch class",
      Chip: "Apple M4",
      Platform: "macOS",
      Finish: "Silver",
      Condition: "Brand new"
    }
  },
  {
    id: 4,
    slug: "sony-wh-1000xm5",
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Audio",
    price: 575000,
    oldPrice: 625000,
    rating: 0,
    reviews: 0,
    stock: 14,
    condition: "New",
    warranty: "6 months seller warranty",
    image: "https://i.ebayimg.com/images/g/fv0AAeSwumNpiqP6/s-l1200.jpg",
    blurb: "Wireless over-ear headphones with active noise cancellation.",
    highlights: ["Active noise cancellation", "Wireless over-ear design", "USB-C charging", "Built-in microphones"],
    specs: {
      Type: "Over-ear headphones",
      Connection: "Bluetooth",
      Charging: "USB-C",
      Color: "Black",
      Condition: "Brand new"
    }
  },
  {
    id: 5,
    slug: "anker-737-power-bank",
    name: "Anker 737 Power Bank",
    brand: "Anker",
    category: "Accessories",
    price: 185000,
    badge: "Staff pick",
    rating: 0,
    reviews: 0,
    stock: 19,
    condition: "New",
    warranty: "6 months seller warranty",
    image: "https://s.topratgeber24.de/bilder/6943b619b9cf978be80875b6/e1280/anker-737-power-bank.jpeg",
    blurb: "24,000mAh power bank with high-output USB-C charging.",
    highlights: ["24,000mAh capacity", "Up to 140W USB-C output", "Digital power display", "2 USB-C and 1 USB-A port"],
    specs: {
      Capacity: "24,000mAh",
      Output: "Up to 140W",
      Ports: "2 USB-C, 1 USB-A",
      Display: "Digital status display",
      Condition: "Brand new"
    }
  },
  {
    id: 6,
    slug: "hollyland-lark-m2-wireless-mic",
    name: "Hollyland Lark M2 Wireless Mic",
    brand: "Hollyland",
    category: "Creator Tools",
    price: 235000,
    rating: 0,
    reviews: 0,
    stock: 9,
    condition: "New",
    warranty: "6 months seller warranty",
    image: "https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/MTA-146659433/hollyland_jpc_kemang_hollyland_lark_m2_duo_wireless_microphone_camera_dual_mic_hp_lightning_type_c_combo_garansi_resmi_full01_oav8b05x.jpg",
    blurb: "Compact dual wireless microphone kit for phones and cameras.",
    highlights: ["Dual wireless transmitters", "Compact charging case", "Phone and camera support", "Clip-on microphone design"],
    specs: {
      Type: "Wireless microphone kit",
      Transmitters: "2",
      Use: "Phone and camera content",
      Case: "Charging case included",
      Condition: "Brand new"
    }
  },
  {
    id: 7,
    slug: "logitech-mx-master-3s",
    name: "Logitech MX Master 3S",
    brand: "Logitech",
    category: "Accessories",
    price: 185000,
    rating: 0,
    reviews: 0,
    stock: 16,
    condition: "New",
    warranty: "6 months seller warranty",
    image: "https://computermania.co.za/cdn/shop/files/master_3s.4.jpg?v=1694695210",
    blurb: "Ergonomic wireless mouse with 8K DPI tracking and MagSpeed scrolling.",
    highlights: ["8K DPI sensor", "MagSpeed scroll wheel", "Quiet Clicks", "Multi-device workflow"],
    specs: {
      Type: "Wireless mouse",
      Sensor: "Up to 8K DPI",
      Scrolling: "MagSpeed",
      Color: "Graphite",
      Condition: "Brand new"
    }
  },
  {
    id: 8,
    slug: "jbl-charge-5",
    name: "JBL Charge 5",
    brand: "JBL",
    category: "Audio",
    price: 245000,
    oldPrice: 279000,
    badge: "Deal",
    rating: 0,
    reviews: 0,
    stock: 13,
    condition: "New",
    warranty: "6 months seller warranty",
    image: "https://cdn.panacompu.com/cdn-img/pv/jbl-charge-5-front-view-black.jpg?fixedwidthheight=false&height=780&width=780",
    blurb: "Portable Bluetooth speaker with long battery life and built-in power bank.",
    highlights: ["Bluetooth audio", "Up to 20 hours of playtime", "Built-in power bank", "IP67 water and dust resistance"],
    specs: {
      Type: "Portable Bluetooth speaker",
      Battery: "Up to 20 hours",
      Protection: "IP67",
      Color: "Black",
      Condition: "Brand new"
    }
  }
];

export const money = (value: number) => `₦${value.toLocaleString("en-NG")}`;
export const getProduct = (slug: string) => products.find((product) => product.slug === slug);
