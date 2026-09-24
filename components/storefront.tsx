"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, ChevronRight, Heart, Menu, Search, ShieldCheck, ShoppingBag, Sparkles, Star, Truck, X, Zap } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { money } from "@/lib/products";
import { whatsappUrl } from "@/lib/site";

const categories = ["All", "Phones", "Laptops", "Audio", "Accessories", "Creator Tools"];

export default function Storefront() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { catalog, lines, totalItems, addItem } = useCart();
  const supportLink = whatsappUrl("Hello TechMan AMT, I need help choosing the right tech product.");

  const visibleProducts = useMemo(() => catalog.filter((p) => {
    const inCategory = category === "All" || p.category === category;
    const q = query.toLowerCase().trim();
    const matches = !q || `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q);
    return inCategory && matches;
  }), [catalog, query, category]);

  const toggleWish = (id: number) => setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <main>
      <div className="announcement"><span>⚡ Hot tech deals live now</span><span>Nationwide delivery across Nigeria</span><span>Secure checkout + human support</span></div>
      <header className="nav shell">
        <Link href="/" className="brand"><span className="brandMark">T</span><span>TECHMAN <b>AMT</b></span></Link>
        <nav className="desktopNav"><a href="#shop">Shop</a><a href="#deals">Deals</a><a href="#creator">Creator Tools</a><a href="#insights">Tech Insights</a></nav>
        <div className="navActions"><button className="iconBtn" aria-label="Search" onClick={() => document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}><Search size={19}/></button><button className="iconBtn badgeWrap" aria-label="Wishlist"><Heart size={19}/>{wishlist.length > 0 && <span className="count">{wishlist.length}</span>}</button><Link className="cartBtn" href="/cart"><ShoppingBag size={18}/> Cart <span>{totalItems}</span></Link><button className="menuBtn" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu/></button></div>
      </header>

      {mobileOpen && <div className="mobileMenu"><button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X/></button><a href="#shop" onClick={()=>setMobileOpen(false)}>Shop</a><a href="#deals" onClick={()=>setMobileOpen(false)}>Deals</a><a href="#creator" onClick={()=>setMobileOpen(false)}>Creator Tools</a><a href="#insights" onClick={()=>setMobileOpen(false)}>Tech Insights</a><Link href="/cart" onClick={()=>setMobileOpen(false)}>Cart ({totalItems})</Link></div>}

      <section className="hero shell">
        <div className="heroCopy">
          <div className="eyebrow"><Sparkles size={15}/> Tech worth your money</div>
          <h1>Better tech.<br/><span>Smarter upgrades.</span></h1>
          <p>Original phones, laptops, creator gear and everyday gadgets selected to help you work smarter, create better and stay connected.</p>
          <div className="heroCtas"><a className="primaryBtn" href="#shop">Shop latest tech <ArrowRight size={18}/></a><a className="secondaryBtn" href="#deals">See today&apos;s deals</a></div>
          <div className="trustMini"><span><Check size={15}/> Clear product condition</span><span><Check size={15}/> Secure buying flow</span><span><Check size={15}/> Human support</span></div>
        </div>
        <div className="heroVisual">
          <div className="glow"></div>
          <Image className="heroImage" src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=90" alt="Premium smartphone" width={900} height={900} priority />
          <div className="floatingCard top"><span>NEW DROP</span><strong>Flagship phones</strong><small>Built for camera, speed and all-day use</small></div>
          <div className="floatingCard bottom"><Zap size={18}/><div><strong>Nationwide delivery</strong><small>Confirm delivery before payment</small></div></div>
        </div>
      </section>

      <section className="trustBar shell">
        <div><ShieldCheck/><span><b>Buy with confidence</b><small>Clear condition, warranty & support</small></span></div>
        <div><Truck/><span><b>Nationwide delivery</b><small>Delivery options shown before payment</small></span></div>
        <div><Zap/><span><b>Fast support</b><small>Need help choosing? Ask a real person</small></span></div>
      </section>

      <section className="categorySection shell">
        <div className="sectionHead"><div><span className="kicker">SHOP YOUR WAY</span><h2>Find the right tech faster.</h2></div><p>Start with what you need, then narrow by budget, brand and use case.</p></div>
        <div className="categoryGrid">
          {[["Phones","Camera, battery, gaming"],["Laptops","Work, school, creative"],["Creator Tools","Mic, lights, tripods"],["Audio","Earbuds, speakers, ANC"],["Accessories","Power, cases, hubs"],["Digital Tools","Templates, guides, AI"]].map(([name,desc],i)=><button key={name} onClick={()=>{setCategory(categories.includes(name)?name:"All");document.getElementById("shop")?.scrollIntoView({behavior:"smooth"})}} className="categoryCard"><span className="categoryNumber">0{i+1}</span><div><h3>{name}</h3><p>{desc}</p></div><ChevronRight/></button>)}
        </div>
      </section>

      <section id="deals" className="dealSection">
        <div className="shell dealInner"><div><span className="dealLabel">TECH DEAL OF THE WEEK</span><h2>Build a better setup, for less.</h2><p>Pair the right laptop, productivity mouse and power accessories instead of buying random gear that does not work together.</p><div className="dealPrice"><strong>Build your own setup</strong><span>See live product pricing before checkout</span></div><a href="#shop" className="lightBtn">Start your setup <ArrowRight size={17}/></a></div><div className="dealCards"><div className="miniProduct"><Image src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=85" alt="Laptop" width={420} height={320}/><b>Laptop</b></div><span>+</span><div className="miniProduct"><Image src="https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=85" alt="Mouse" width={420} height={320}/><b>Mouse</b></div></div></div>
      </section>

      <section id="shop" className="shopSection shell">
        <div className="sectionHead shopHead"><div><span className="kicker">TRENDING RIGHT NOW</span><h2>Tech people are buying.</h2></div><div className="searchBox"><Search size={18}/><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search phones, laptops, creator gear..."/></div></div>
        <div className="filterRow">{categories.map((c)=><button key={c} onClick={()=>setCategory(c)} className={category===c?"active":""}>{c}</button>)}</div>
        <div className="productGrid">
          {visibleProducts.map((p)=>{
            const inCart = lines.some((line) => line.id === p.id);
            return <article className="productCard" key={p.id}>
              <div className="productImageWrap">{p.badge && <span className="productBadge">{p.badge}</span>}<button className={`wishBtn ${wishlist.includes(p.id)?"on":""}`} onClick={()=>toggleWish(p.id)} aria-label="Add to wishlist"><Heart size={18} fill={wishlist.includes(p.id)?"currentColor":"none"}/></button><Link href={`/product/${p.slug}`}><Image className="productImage" src={p.image} alt={p.name} width={700} height={700} unoptimized/></Link></div>
              <div className="productInfo"><span className="brandName">{p.brand}</span><Link href={`/product/${p.slug}`}><h3>{p.name}</h3></Link><p>{p.blurb}</p><div className="rating"><Star size={14} fill="currentColor"/> {p.rating} <span>({p.reviews})</span></div><div className="priceLine"><strong>{money(p.price)}</strong>{p.oldPrice && <del>{money(p.oldPrice)}</del>}</div><button className={`addBtn ${inCart?"added":""}`} onClick={()=>addItem(p.id)}>{inCart?"Add another":"Add to cart"} <ShoppingBag size={17}/></button><Link className="viewProduct" href={`/product/${p.slug}`}>View details <ArrowRight size={14}/></Link></div>
            </article>;
          })}
        </div>
        {visibleProducts.length === 0 && <div className="emptyState"><Search size={38}/><h3>No matching tech yet.</h3><p>Try a different product, brand or category.</p><button onClick={()=>{setQuery("");setCategory("All")}}>Clear filters</button></div>}
      </section>

      <section id="creator" className="creator shell"><div className="creatorMedia"><Image src="https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=1200&q=90" alt="Creator recording setup" width={900} height={780}/></div><div className="creatorCopy"><span className="kicker">CREATOR TOOLS</span><h2>Make content that sounds and looks expensive.</h2><p>You do not need a full studio to make better content. Start with clear audio, stable framing and dependable lighting.</p><div className="creatorList"><span><Check/> Wireless microphones</span><span><Check/> Tripods & phone rigs</span><span><Check/> Lighting & streaming gear</span><span><Check/> Storage & power</span></div><a href="#shop" className="primaryBtn">Shop creator gear <ArrowRight size={18}/></a></div></section>

      <section id="insights" className="insights shell"><div className="sectionHead"><div><span className="kicker">TECHMAN INSIGHTS</span><h2>Buy with more confidence.</h2></div><p>Useful buying guides that help customers understand what they are paying for.</p></div><div className="articleGrid">{[["Best phones under ₦500,000","What to prioritize if you want strong battery, camera and everyday performance."],["Laptop buying guide","How much RAM, storage and processing power you actually need for work."],["Creator starter setup","The few pieces of gear that make the biggest difference when starting content."]].map(([title,desc],i)=><article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{desc}</p><a href="#shop">Explore recommended tech <ArrowRight size={16}/></a></article>)}</div></section>

      <section className="newsletter"><div className="shell newsletterInner"><div><span className="kicker">FIRST ACCESS</span><h2>Get the deals worth opening.</h2><p>Product drops, useful buying guides and offers without inbox noise.</p></div><form onSubmit={(e)=>e.preventDefault()}><input type="email" required placeholder="Your email address"/><button>Join TechMan AMT <ArrowRight size={17}/></button></form></div></section>

      <footer className="footer"><div className="shell footerGrid"><div><Link href="/" className="brand footerBrand"><span className="brandMark">T</span><span>TECHMAN <b>AMT</b></span></Link><p>Phones, gadgets and creator tech chosen for how people actually work, create and live.</p></div><div><b>Shop</b><a href="#shop">Phones</a><a href="#shop">Laptops</a><a href="#creator">Creator Tools</a><a href="#deals">Deals</a></div><div><b>Help</b><Link href="/cart">Your cart</Link><Link href="/checkout">Checkout</Link><Link href="/track-order">Track order</Link><span>Delivery & warranty pages coming next</span></div><div><b>Talk to us</b>{supportLink ? <a className="whatsappLink" href={supportLink} target="_blank" rel="noreferrer">Chat on WhatsApp</a> : <span>WhatsApp contact is being configured</span>}</div></div><div className="shell copyright"><span>© 2026 TechMan AMT. All rights reserved.</span><span>Built for conversion, trust and scale.</span></div></footer>

      {supportLink && <a className="floatingWhatsApp" href={supportLink} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">WA</a>}
    </main>
  );
}
