"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  Headphones,
  Heart,
  Home,
  Laptop,
  Menu,
  Mic2,
  MessageCircle,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Truck,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { money } from "@/lib/products";
import { makeWhatsappUrl } from "@/lib/site";
import NewsletterForm from "@/components/newsletter-form";
import ProductImage from "@/components/product-image";
import BrandLogo from "@/components/brand-logo";
import type { EditablePage } from "@/lib/site-pages";

const categoryMeta = [
  { name: "Phones", copy: "Apple, Samsung and Android phones.", icon: Smartphone },
  { name: "Laptops", copy: "MacBooks and Windows laptops.", icon: Laptop },
  { name: "Creator Tools", copy: "Microphones, lighting, rigs and storage.", icon: Mic2 },
  { name: "Audio", copy: "Headphones, earbuds and speakers.", icon: Headphones },
  { name: "Accessories", copy: "Chargers, power banks, mice and hubs.", icon: Zap },
];

const filters = ["All", "Phones", "Laptops", "Audio", "Accessories", "Creator Tools"];

const trendingSlugs = [
  "iphone-18-pro-max-256gb",
  "iphone-18-pro-256gb",
  "galaxy-s26-ultra-512gb",
  "airpods-5",
  "apple-watch-ultra-4",
  "iphone-16-pro-max-256gb",
  "samsung-galaxy-s25-ultra-256gb",
  "macbook-air-m4-13-inch",
  "hollyland-lark-m2-wireless-mic",
];

const priceLabel = (price: number) => price > 0 ? money(price) : "Price on request";

export default function Storefront({ homeContent }: { homeContent?: EditablePage }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { catalog, settings, lines, wishlist, totalItems, addItem, toggleWishlist } = useCart();

  const supportLink = makeWhatsappUrl(
    settings.whatsappNumber,
    "Hello TechMan AMT, I need help choosing the right tech product."
  );

  const visibleProducts = useMemo(() => {
    const filtered = catalog.filter((product) => {
      const inCategory = category === "All" || product.category === category;
      const q = query.toLowerCase().trim();
      const matches =
        !q ||
        `${product.name} ${product.brand} ${product.category} ${product.blurb}`
          .toLowerCase()
          .includes(q);
      return inCategory && matches;
    });

    return [...filtered].sort((a, b) => {
      const ai = trendingSlugs.indexOf(a.slug);
      const bi = trendingSlugs.indexOf(b.slug);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.id - b.id;
    });
  }, [catalog, query, category]);

  const heroProducts = trendingSlugs
    .map((slug) => catalog.find((product) => product.slug === slug))
    .filter(Boolean)
    .slice(0, 3) as typeof catalog;
  const primaryHero = heroProducts[0];
  const secondaryHero = heroProducts[1];
  const tertiaryHero = heroProducts[2];
  const creatorProduct = catalog.find((product) => product.category === "Creator Tools");
  const heroTitle = (homeContent?.title || "Technology,|properly selected.").split("|");
  const contactSection = homeContent?.sections?.[0];
  const newsletterSection = homeContent?.sections?.[1];

  const productForCategory = (name: string) =>
    catalog.find((product) => product.category === name) || catalog[0];

  return (
    <main className="siteFrame">
      <div className="announcement premiumAnnouncement">
        <span>{settings.announcementText || "Phones, laptops, audio and creator tools"}</span>
        <span className="announcementDesktop">Delivery across Nigeria · Order support</span>
      </div>

      <header className="nav shell premiumNav">
        <BrandLogo/>

        <nav className="desktopNav premiumDesktopNav">
          <Link className="current" aria-current="page" href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <a href="#collections">Collections</a>
          <Link href="/blog">Guides</Link>
          <Link href="/contact">Contact</Link>
        </nav>

        <div className="navActions premiumNavActions">
          <button
            className="iconBtn navSearchButton"
            aria-label="Search products"
            onClick={() => document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })}
          >
            <Search size={18}/>
          </button>
          <Link className="iconBtn" aria-label="Account" href="/account"><UserRound size={18}/></Link>
          <Link className="iconBtn badgeWrap" aria-label="Wishlist" href="/wishlist">
            <Heart size={18}/>
            {wishlist.length > 0 && <span className="count">{wishlist.length}</span>}
          </Link>
          <Link className="cartBtn premiumCartBtn" href="/cart">
            <ShoppingBag size={17}/>
            <span className="cartLabel">Cart</span>
            <em>{totalItems}</em>
          </Link>
          <button className="menuBtn" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu/></button>
        </div>
      </header>

      {mobileOpen && (
        <div className="mobileMenu premiumMobileMenu">
          <div className="mobileMenuTop">
            <BrandLogo/>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X/></button>
          </div>
          <nav>
            <Link href="/" onClick={() => setMobileOpen(false)}>Home <ArrowUpRight/></Link>
            <Link href="/shop" onClick={() => setMobileOpen(false)}>Shop <ArrowUpRight/></Link>
            <a href="#collections" onClick={() => setMobileOpen(false)}>Collections <ArrowUpRight/></a>
            <Link href="/blog" onClick={() => setMobileOpen(false)}>Guides <ArrowUpRight/></Link>
            <Link href="/contact" onClick={() => setMobileOpen(false)}>Contact <ArrowUpRight/></Link>
          </nav>
          <div className="mobileMenuUtilities">
            <Link href="/account" onClick={() => setMobileOpen(false)}>Account</Link>
            <Link href="/wishlist" onClick={() => setMobileOpen(false)}>Wishlist ({wishlist.length})</Link>
            <Link href="/track-order" onClick={() => setMobileOpen(false)}>Track Order</Link>
          </div>
        </div>
      )}

      <section className="premiumHero shell">
        <div className="premiumHeroCopy">
          <div className="heroOverline">{homeContent?.eyebrow || "TECHMAN AMT"}</div><h1>{heroTitle[0]}{heroTitle[1] && <><br/><span>{heroTitle[1]}</span></>}</h1><p>{homeContent?.intro || "Current phones, laptops, audio and creator tools. Clear specs, clear condition and delivery across Nigeria."}</p>
          <div className="premiumHeroCtas">
            <Link className="primaryBtn heroPrimary" href="/shop">Shop available stock <ArrowRight size={17}/></Link>
            <Link className="textCta" href="/device-request">Request a device <ArrowUpRight size={16}/></Link>
          </div>
          <div className="heroProof">
            <span><BadgeCheck size={16}/> Condition and warranty shown</span>
            <span><Truck size={16}/> Delivery across Nigeria</span>
            <span><ShieldCheck size={16}/> Secure checkout</span>
          </div>
        </div>

        <div className="heroStage">
          {primaryHero && (
            <Link href={`/product/${primaryHero.slug}`} className="heroStageMain">
              <div className="heroStageBadge">NEW 2026</div>
              <ProductImage src={primaryHero.image} alt={primaryHero.name} brand={primaryHero.brand} sizes="(max-width: 900px) 92vw, 46vw" priority/>
              <div className="heroStageOverlay">
                <span>{primaryHero.brand}</span>
                <strong>{primaryHero.name}</strong>
                <b>{priceLabel(primaryHero.price)}</b>
              </div>
            </Link>
          )}

          <div className="heroStageRail">
            {secondaryHero && (
              <Link href={`/product/${secondaryHero.slug}`} className="heroMiniCard">
                <ProductImage src={secondaryHero.image} alt={secondaryHero.name} brand={secondaryHero.brand} sizes="220px" priority/>
                <div><span>{secondaryHero.category}</span><strong>{secondaryHero.name}</strong></div>
              </Link>
            )}
            {tertiaryHero && (
              <Link href={`/product/${tertiaryHero.slug}`} className="heroMiniCard">
                <ProductImage src={tertiaryHero.image} alt={tertiaryHero.name} brand={tertiaryHero.brand} sizes="220px" priority/>
                <div><span>{tertiaryHero.category}</span><strong>{tertiaryHero.name}</strong></div>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="brandRail shell" aria-label="Popular brands">
        <span>APPLE</span><span>SAMSUNG</span><span>GOOGLE</span><span>SONY</span><span>DJI</span><span>NINTENDO</span><span>ANKER</span>
      </section>

      <section id="collections" className="collectionSection shell">
        <div className="premiumSectionHead">
          <div><span className="kicker">CATEGORIES</span><h2>Find the right category quickly.</h2></div>
          <Link href="/shop" className="sectionLink">View all products <ArrowUpRight size={16}/></Link>
        </div>

        <div className="collectionBento">
          {categoryMeta.map((item, index) => {
            const product = productForCategory(item.name);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={`/shop?category=${encodeURIComponent(item.name)}`}
                className={`collectionTile collectionTile${index + 1}`}
              >
                <div className="collectionTileTop"><Icon size={18}/><span>0{index + 1}</span></div>
                <div className="collectionTileCopy">
                  <h3>{item.name}</h3>
                  <p>{item.copy}</p>
                </div>
                {product && <ProductImage src={product.image} alt={product.name} brand={product.brand} sizes="(max-width: 760px) 94vw, 33vw"/>}
                <ArrowUpRight className="collectionArrow" size={20}/>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="premiumDeal">
        <div className="shell premiumDealInner">
          <div className="premiumDealCopy">
            <span className="dealLabel">MATCHED ACCESSORIES</span>
            <h2>Complete the setup.</h2>
            <p>Add the power, audio, storage and input gear that fits the main device.</p>
            <Link href="/shop" className="lightBtn">Browse accessories <ArrowRight size={17}/></Link>
          </div>
          <div className="dealFeatureStack">
            {catalog.slice(2, 5).map((product, index) => (
              <Link href={`/product/${product.slug}`} className="dealFeatureItem" key={product.id}>
                <span>0{index + 1}</span>
                <div className="dealFeatureMedia"><ProductImage src={product.image} alt={product.name} brand={product.brand} sizes="150px"/></div>
                <div><small>{product.brand}</small><strong>{product.name}</strong><b>{priceLabel(product.price)}</b></div>
                <ArrowUpRight size={18}/>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="featured" className="featuredSection shell">
        <div className="premiumSectionHead featuredHead">
          <div><span className="kicker">NEW & TRENDING 2026</span><h2>Latest launches and current bestsellers.</h2></div>
          <div className="featuredSearch">
            <Search size={17}/>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search the collection"/>
          </div>
        </div>

        <div className="filterRow premiumFilterRow">
          {filters.map((item) => (
            <button key={item} onClick={() => setCategory(item)} className={category === item ? "active" : ""}>{item}</button>
          ))}
        </div>

        <div className="premiumProductGrid">
          {visibleProducts.slice(0, 9).map((product) => {
            const inCart = lines.some((line) => line.id === product.id);
            return (
              <article className="premiumProductCard" key={product.id}>
                <div className="premiumProductMedia">
                  {product.badge && <span className="productBadge">{product.badge}</span>}
                  <button
                    className={`wishBtn ${wishlist.includes(product.id) ? "on" : ""}`}
                    onClick={() => toggleWishlist(product.id)}
                    aria-label="Save product"
                  >
                    <Heart size={17} fill={wishlist.includes(product.id) ? "currentColor" : "none"}/>
                  </button>
                  <Link href={`/product/${product.slug}`}>
                    <ProductImage src={product.image} alt={product.name} brand={product.brand} sizes="(max-width: 720px) 92vw, (max-width: 1100px) 46vw, 31vw"/>
                  </Link>
                </div>

                <div className="premiumProductBody">
                  <div className="productMetaLine"><span>{product.brand}</span><span>{product.category}</span></div>
                  <Link href={`/product/${product.slug}`}><h3>{product.name}</h3></Link>
                  <p>{product.blurb}</p>
                  <div className="premiumPriceLine">
                    <strong>{priceLabel(product.price)}</strong>
                    {product.oldPrice && <del>{money(product.oldPrice)}</del>}
                  </div>
                  <div className={product.price <= 0 ? "premiumStock request" : product.stock > 0 ? "premiumStock" : "premiumStock out"}>
                    {product.price <= 0 ? "Availability on request" : product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                  </div>
                  <div className="premiumCardActions">
                    {product.price <= 0 ? (
                      <Link className="premiumAddButton requestButton" href={`/device-request?product=${encodeURIComponent(product.name)}`}>
                        Request price
                      </Link>
                    ) : (
                      <button
                        className={`premiumAddButton ${inCart ? "added" : ""}`}
                        onClick={() => addItem(product.id)}
                        disabled={product.stock <= 0}
                      >
                        <ShoppingBag size={16}/>
                        {product.stock <= 0 ? "Out of stock" : inCart ? "Add another" : "Add to cart"}
                      </button>
                    )}
                    <Link className="premiumDetailButton" href={`/product/${product.slug}`} aria-label={`View ${product.name}`}><ArrowUpRight size={18}/></Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {visibleProducts.length === 0 && (
          <div className="emptyState premiumEmptyState">
            <Search size={34}/><h3>No match yet.</h3><p>Try another product, brand or category.</p>
            <button onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button>
          </div>
        )}
      </section>

      <section className="whySection shell">
        <div className="whyLead">
          <span className="kicker">WHY TECHMAN AMT</span>
          <h2>Buy with the details upfront.</h2>
          <p>See product condition, warranty, stock, delivery and specifications before payment.</p>
        </div>
        <div className="whyGrid">
          <article><span>01</span><ShieldCheck/><h3>Product details</h3><p>Condition, warranty and key specifications are shown on the product page.</p></article>
          <article><span>02</span><Truck/><h3>Delivery pricing</h3><p>Delivery is calculated before online payment where a rate is configured.</p></article>
          <article><span>03</span><BadgeCheck/><h3>Verified reviews</h3><p>Verified purchase reviews are tied to paid orders before publication.</p></article>
        </div>
      </section>

      <section id="creator" className="editorialSection shell">
        <div className="editorialMedia">
          {creatorProduct && <ProductImage src={creatorProduct.image} alt={creatorProduct.name} brand={creatorProduct.brand} sizes="(max-width: 900px) 94vw, 55vw"/>}
          <span className="editorialTag">CREATOR TOOLS</span>
        </div>
        <div className="editorialCopy">
          <span className="kicker">CREATOR TOOLS</span>
          <h2>Build a reliable production kit.</h2>
          <p>Wireless audio, power, storage and support gear for mobile video, interviews and streaming.</p>
          <div className="editorialChecklist">
            <span><Check/> Wireless microphones</span>
            <span><Check/> Tripods & phone rigs</span>
            <span><Check/> Lighting & streaming gear</span>
            <span><Check/> Storage & power</span>
          </div>
          <Link href="/shop?category=Creator%20Tools" className="primaryBtn">Shop creator gear <ArrowRight size={17}/></Link>
        </div>
      </section>

      <section className="insights premiumInsights shell">
        <div className="premiumSectionHead">
          <div><span className="kicker">BUYING GUIDES</span><h2>Useful product guides.</h2></div>
          <Link href="/blog" className="sectionLink">See all guides <ArrowUpRight size={16}/></Link>
        </div>

        <div className="insightGrid">
          {[
            ["01", "Buying Guide", "How to choose a phone for content creation", "Camera, storage, battery and creator workflow.", "/blog/how-to-choose-a-phone-for-content-creation"],
            ["02", "Buying Guide", "Laptop buying guide for work and school", "Choose specs around the work you actually do.", "/blog/laptop-buying-guide-for-work-school-and-creative-use"],
            ["03", "Creator Tips", "A creator’s starter guide to better audio", "Improve clarity before buying more camera gear.", "/blog/creator-audio-starter-guide"],
          ].map(([index, type, title, copy, href]) => (
            <Link href={href} className="insightCard" key={title}>
              <div><span>{index}</span><small>{type}</small></div>
              <h3>{title}</h3>
              <p>{copy}</p>
              <b>Read guide <ArrowUpRight size={15}/></b>
            </Link>
          ))}
        </div>
      </section>

      <section className="homeContactBand shell">
        <div className="homeContactCopy">
          <span className="kicker">CONTACT</span>
          <h2>{contactSection?.title || "Need a product check or order help?"}</h2><p>{contactSection?.body || "Contact TechMan AMT for stock, compatibility, delivery and order questions."}</p>
        </div>
        <div className="homeContactActions">
          <Link className="contactPrimary" href="/contact">Contact us <ArrowRight size={17}/></Link>
          {supportLink && <a className="contactSecondary" href={supportLink} target="_blank" rel="noreferrer"><MessageCircle size={17}/> WhatsApp</a>}
          <Link className="contactSecondary" href="/track-order">Track order</Link>
        </div>
      </section>

      <section className="newsletter premiumNewsletter">
        <div className="shell premiumNewsletterInner">
          <div>
            <span className="kicker">STOCK UPDATES</span>
            <h2>{newsletterSection?.title || "New stock and selected offers."}</h2><p>{newsletterSection?.body || "Occasional updates on arrivals, price changes and buying guides."}</p>
          </div>
          <NewsletterForm/>
        </div>
      </section>

      <nav className="mobileDock" aria-label="Mobile navigation">
        <Link href="/"><span className="dockIcon"><Home size={18}/></span><small>Home</small></Link>
        <Link href="/shop"><span className="dockIcon"><Search size={18}/></span><small>Shop</small></Link>
        <Link href="/contact"><span className="dockIcon"><MessageCircle size={18}/></span><small>Contact</small></Link>
        <Link href="/cart" className="dockBadge"><span className="dockIcon"><ShoppingBag size={18}/></span><small>Cart</small>{totalItems > 0 && <em>{totalItems}</em>}</Link>
      </nav>

      {supportLink && <a className="floatingWhatsApp premiumWhatsapp" href={supportLink} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">WA</a>}
    </main>
  );
}
