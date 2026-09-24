insert into public.products
(external_id, slug, name, brand, category, price_ngn, old_price_ngn, stock, image_url, blurb, badge, warranty, condition, highlights, specs, active)
values
(1,'iphone-16-pro-max-256gb','iPhone 16 Pro Max 256GB','Apple','Phones',2299000,2499000,8,'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=90','Flagship performance, pro camera power and all-day battery.','Bestseller','1 year seller warranty','New','["Pro-grade camera system","Premium build","All-day battery performance","Fast USB-C connectivity"]','{"Storage":"256GB","Connectivity":"5G, Wi-Fi, Bluetooth","Condition":"Brand new"}',true),
(2,'samsung-galaxy-s25-ultra-256gb','Galaxy S25 Ultra 256GB','Samsung','Phones',1849000,1999000,11,'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=90','Big-screen Android power for work, gaming and content.','Hot','1 year seller warranty','New','["Flagship Android performance","Large high-refresh display","Advanced multi-camera system","Built-in productivity features"]','{"Storage":"256GB","Connectivity":"5G, Wi-Fi, Bluetooth","Condition":"Brand new"}',true),
(3,'macbook-air-m4-13-inch','MacBook Air M4 13-inch','Apple','Laptops',2395000,null,5,'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=90','Thin, quiet and fast enough for serious everyday work.','New','1 year seller warranty','New','["Portable all-day design","Fast Apple silicon performance","Silent operation","Excellent for work and study"]','{"Display":"13-inch class","Platform":"macOS","Condition":"Brand new"}',true),
(4,'sony-wh-1000xm5','Sony WH-1000XM5','Sony','Audio',575000,625000,14,'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=90','Premium noise cancelling for focus, travel and deep listening.',null,'6 months seller warranty','New','["Active noise cancellation","Comfortable over-ear design","Wireless listening","Built for calls and focus"]','{"Type":"Over-ear","Connection":"Wireless","Charging":"USB-C"}',true),
(5,'anker-737-power-bank','Anker 737 Power Bank','Anker','Accessories',185000,null,19,'https://images.unsplash.com/photo-1609592806596-b43bada2f2eb?auto=format&fit=crop&w=1200&q=90','High-capacity power for phones, tablets and USB-C laptops.','Staff Pick','6 months seller warranty','New','["High-capacity portable power","USB-C fast charging","Laptop-compatible output","Travel-friendly setup"]','{"Type":"Power bank","Use":"Phones, tablets, laptops"}',true),
(6,'hollyland-lark-m2-wireless-mic','Hollyland Lark M2 Wireless Mic','Hollyland','Creator Tools',235000,null,9,'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=90','Clean wireless audio for TikTok, YouTube and interviews.',null,'6 months seller warranty','New','["Compact wireless audio","Creator-friendly setup","Portable charging case","Great for interviews"]','{"Type":"Wireless microphone","Use":"Phone and camera content"}',true),
(7,'logitech-mx-master-3s','Logitech MX Master 3S','Logitech','Accessories',185000,null,16,'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=90','Precision control built for creators, coders and power users.',null,'6 months seller warranty','New','["Ergonomic productivity shape","Precision scrolling","Multi-device workflow","Quiet clicks"]','{"Type":"Wireless mouse","Use":"Work and creative productivity"}',true),
(8,'jbl-charge-5','JBL Charge 5','JBL','Audio',245000,279000,13,'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1200&q=90','Portable room-filling sound with a battery that lasts.','Deal','6 months seller warranty','New','["Portable wireless audio","Strong battery life","Durable outdoor-ready form","Powerful everyday sound"]','{"Type":"Portable speaker","Connection":"Bluetooth"}',true)
on conflict (external_id) do update set
slug=excluded.slug,
name=excluded.name,
brand=excluded.brand,
category=excluded.category,
price_ngn=excluded.price_ngn,
old_price_ngn=excluded.old_price_ngn,
stock=excluded.stock,
image_url=excluded.image_url,
blurb=excluded.blurb,
badge=excluded.badge,
warranty=excluded.warranty,
condition=excluded.condition,
highlights=excluded.highlights,
specs=excluded.specs,
active=excluded.active,
updated_at=now();
