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

const categoryMeta = [
  { name: "Phones", copy: "Apple, Samsung and Android phones.", icon: Smartphone },
  { name: "Laptops", copy: "MacBooks and Windows laptops.", icon: Laptop },
  { name: "Creator Tools", copy: "Microphones, lighting, rigs and storage.", icon: Mic2 },
  { name: "Audio", copy: "Headphones, earbuds and speakers.", icon: Headphones },
  { name: "Accessories", copy: "Chargers, power banks, mice and hubs.", icon: Zap },
];

const filters = ["All", "Phones", "Laptops", "Audio", "Accessories", "Creator Tools"];

export default function Storefront() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { catalog, settings, lines, wishlist, totalItems, addItem, toggleWishlist } = useCart();

  const supportLink = makeWhatsappUrl(
    settings.whatsappNumber,
    "Hello TechMan AMT, I need help choosing the right tech product."
  );

  const visibleProducts = useMemo(
    () =>
      catalog.filter((product) => {
        const inCategory = category === "All" || product.category === category;
        const q = query.toLowerCase().trim();
        const matches =
          !q ||
          `${product.name} ${product.brand} ${product.category} ${product.blurb}`
            .toLowerCase()
            .includes(q);
        return inCategory && matches;
      }),
    [catalog, query, category]
  );

  const heroProducts = catalog.slice(0, 3);
  const primaryHero = heroProducts[0];
  const secondaryHero = heroProducts[1];
  const tertiaryHero = heroProducts[2];
  const creatorProduct = catalog.find((product) => product.category === "Creator Tools");

  const productForCategory = (name: string) =>
    catalog.find((product) => product.category === name) || catalog[0];

  return (
    <main className="siteFrame">
      <div className="announcement premiumAnnouncement">
        <span>{settings.announcementText || "Phones, laptops, audio and creator tools"}</span>
        <span className="announcementDesktop">Delivery across Nigeria · Order support</span>
      </div>

      <header className="nav shell premiumNav">
        <Link href="/" className="brand premiumBrand">
          <span className="brandMark">T</span>
          <span>TECHMAN <b>AMT</b></span>
        </Link>

        <nav className="desktopNav premiumDesktopNav">
          <Link href="/shop">Shop</Link>
          <a href="#collections">Collections</a>
          <a href="#featured">Featured</a>
          <Link href="/blog">Guides</Link>
          <Link href="/corporate">Bulk Orders</Link>
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
            <Link href="/" className="brand premiumBrand" onClick={() => setMobileOpen(false)}>
              <span className="brandMark">T</span><span>TECHMAN <b>AMT</b></span>
            </Link>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X/></button>
          </div>
          <nav>
            <Link href="/shop" onClick={() => setMobileOpen(false)}>Shop <ArrowUpRight/></Link>
            <a href="#collections" onClick={() => setMobileOpen(false)}>Collections <ArrowUpRight/></a>
            <Link href="/blog" onClick={() => setMobileOpen(false)}>Buying Guides <ArrowUpRight/></Link>
            <Link href="/trade-in" onClick={() => setMobileOpen(false)}>Trade In <ArrowUpRight/></Link>
            <Link href="/corporate" onClick={() => setMobileOpen(false)}>Bulk Orders <ArrowUpRight/></Link>
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
          <div className="heroOverline">TECHMAN AMT</div>
          <h1>Technology,<br/><span>properly selected.</span></h1>
          <p>
            Phones, laptops, creator gear and everyday gadgets selected around
            how you actually work, create and live.
          </p>
          <div className="premiumHeroCtas">
            <Link className="primaryBtn heroPrimary" href="/shop">Shop products <ArrowRight size={17}/></Link>
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
              <div className="heroStageBadge">FEATURED</div>
              <ProductImage src={primaryHero.image} alt={primaryHero.name} brand={primaryHero.brand} sizes="(max-width: 900px) 92vw, 46vw" priority/>
              <div className="heroStageOverlay">
                <span>{primaryHero.brand}</span>
                <strong>{primaryHero.name}</strong>
                <b>{money(primaryHero.price)}</b>
              </div>
            </Link>
          )}

          <div className="heroStageRail">
            {secondaryHero && (
              <Link href={`/product/${secondaryHero.slug}`} className="heroMiniCard">
                <ProductImage src={secondaryHero.image} alt={secondaryHero.name} brand={secondaryHero.brand} sizes="220px"/>
                <div><span>{secondaryHero.category}</span><strong>{secondaryHero.name}</strong></div>
              </Link>
            )}
            {tertiaryHero && (
              <Link href={`/product/${tertiaryHero.slug}`} className="heroMiniCard">
                <ProductImage src={tertiaryHero.image} alt={tertiaryHero.name} brand={tertiaryHero.brand} sizes="220px"/>
                <div><span>{tertiaryHero.category}</span><strong>{tertiaryHero.name}</strong></div>
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="brandRail shell" aria-label="Popular brands">
        <span>APPLE</span><span>SAMSUNG</span><span>ANKER</span><span>SONY</span><span>LOGITECH</span><span>HOLLYLAND</span><span>JBL</span>
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
            <span className="dealLabel">THE SMART SETUP</span>
            <h2>Buy the setup.<br/>Not random gadgets.</h2>
            <p>
              Start with the main device, then add only the accessories that
              improve how you work, create or travel.
            </p>
            <Link href="/shop" className="lightBtn">Browse accessories <ArrowRight size={17}/></Link>
          </div>
          <div className="dealFeatureStack">
            {catalog.slice(2, 5).map((product, index) => (
              <Link href={`/product/${product.slug}`} className="dealFeatureItem" key={product.id}>
                <span>0{index + 1}</span>
                <div className="dealFeatureMedia"><ProductImage src={product.image} alt={product.name} brand={product.brand} sizes="150px"/></div>
                <div><small>{product.brand}</small><strong>{product.name}</strong><b>{money(product.price)}</b></div>
                <ArrowUpRight size={18}/>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="featured" className="featuredSection shell">
        <div className="premiumSectionHead featuredHead">
          <div><span className="kicker">PRODUCTS</span><h2>Current stock.</h2></div>
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
          {visibleProducts.map((product) => {
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
                    <strong>{money(product.price)}</strong>
                    {product.oldPrice && <del>{money(product.oldPrice)}</del>}
                  </div>
                  <div className="premiumCardActions">
                    <button
                      className={`premiumAddButton ${inCart ? "added" : ""}`}
                      onClick={() => addItem(product.id)}
                      disabled={product.stock <= 0}
                    >
                      <ShoppingBag size={16}/>
                      {product.stock <= 0 ? "Out of stock" : inCart ? "Add another" : "Add to cart"}
                    </button>
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
          <h2>The important details are visible before checkout.</h2>
          <p>
            Clear product condition, useful context, delivery transparency and
            real support before you spend.
          </p>
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
          <span className="kicker">CREATE BETTER</span>
          <h2>Better content starts before the camera rolls.</h2>
          <p>Clean audio, stable framing and dependable power usually matter more than buying another random accessory.</p>
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

      <section className="newsletter premiumNewsletter">
        <div className="shell premiumNewsletterInner">
          <div>
            <span className="kicker">FIRST ACCESS</span>
            <h2>Useful drops. No inbox noise.</h2>
            <p>New products, buying guides and offers worth opening.</p>
          </div>
          <NewsletterForm/>
        </div>
      </section>

      <footer className="footer premiumFooter">
        <div className="shell premiumFooterTop">
          <div className="footerBrandBlock">
            <Link href="/" className="brand premiumBrand"><span className="brandMark">T</span><span>TECHMAN <b>AMT</b></span></Link>
            <p>Phones, laptops, audio, accessories and creator tools.</p>
          </div>
          <div><b>Shop</b><Link href="/shop?category=Phones">Phones</Link><Link href="/shop?category=Laptops">Laptops</Link><Link href="/shop?category=Creator%20Tools">Creator Tools</Link><Link href="/shop">All Products</Link></div>
          <div><b>Help</b><Link href="/track-order">Track order</Link><Link href="/delivery">Delivery</Link><Link href="/returns">Returns</Link><Link href="/warranty">Warranty</Link></div>
          <div><b>Company</b><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/trade-in">Trade In</Link><Link href="/corporate">Bulk Orders</Link></div>
          <div><b>Support</b>{supportLink ? <a className="whatsappLink" href={supportLink} target="_blank" rel="noreferrer">WhatsApp support</a> : <span>WhatsApp being configured</span>}<Link href="/faq">FAQs</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
        </div>
        <div className="shell copyright premiumCopyright"><span>© 2026 TechMan AMT</span><span>Phones, laptops, audio and creator tools.</span></div>
      </footer>

      <nav className="mobileDock" aria-label="Mobile navigation">
        <Link href="/"><span className="dockIcon"><Home size={18}/></span><small>Home</small></Link>
        <Link href="/shop"><span className="dockIcon"><Search size={18}/></span><small>Shop</small></Link>
        <Link href="/wishlist" className="dockBadge"><span className="dockIcon"><Heart size={18}/></span><small>Saved</small>{wishlist.length > 0 && <em>{wishlist.length}</em>}</Link>
        <Link href="/cart" className="dockBadge"><span className="dockIcon"><ShoppingBag size={18}/></span><small>Cart</small>{totalItems > 0 && <em>{totalItems}</em>}</Link>
      </nav>

      {supportLink && <a className="floatingWhatsApp premiumWhatsapp" href={supportLink} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">WA</a>}
    </main>
  );
}
