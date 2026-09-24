insert into public.products
(external_id, slug, name, brand, category, price_ngn, old_price_ngn, stock, image_url, blurb, badge, warranty, condition, highlights, specs, active)
values
(1,'iphone-16-pro-max-256gb','iPhone 16 Pro Max 256GB','Apple','Phones',2299000,2499000,8,'https://storage.googleapis.com/mobileup-prod-public/mupdomain-images/smartphones/iphone-16-pro-max-esim-desert-titanium.png','6.9-inch Pro display, A18 Pro performance and 256GB storage.','Bestseller','1 year seller warranty','New','["Pro-grade camera system","Premium build","All-day battery performance","Fast USB-C connectivity"]','{"Storage":"256GB","Connectivity":"5G, Wi-Fi, Bluetooth","Condition":"Brand new"}',true),
(2,'samsung-galaxy-s25-ultra-256gb','Galaxy S25 Ultra 256GB','Samsung','Phones',1849000,1999000,11,'https://www.tek4life.pt/media/catalog/product/cache/2/image/1800x/6b9ffbf72458f4fd2d3cb995d92e8889/s/m/smartphone_samsung_s25_ultra_s938_5g_12gb512gb_dual_sim_titanium_gray_5_.png','6.9-inch Galaxy flagship with S Pen, 256GB storage and titanium frame.','Featured','1 year seller warranty','New','["Flagship Android performance","Large high-refresh display","Advanced multi-camera system","Built-in productivity features"]','{"Storage":"256GB","Connectivity":"5G, Wi-Fi, Bluetooth","Condition":"Brand new"}',true),
(3,'macbook-air-m4-13-inch','MacBook Air M4 13-inch','Apple','Laptops',2395000,null,5,'https://kream-phinf.pstatic.net/MjAyNTA3MzBfMjc4/MDAxNzUzODYzMDc0ODUw.8nGAmtxwaqvsa7JmeBCe5zjJn37ELTz7PrgOTeXj5QAg.oXIiE3KshI8hbhI1o2JVply86Pmkd5i0zJ46QCLdngQg.PNG/a_f8fcf891ad6f43e789ec93bd51b24723.png','13-inch MacBook Air with M4 performance in a thin fanless design.','New','1 year seller warranty','New','["Portable all-day design","Fast Apple silicon performance","Silent operation","Excellent for work and study"]','{"Display":"13-inch class","Platform":"macOS","Condition":"Brand new"}',true),
(4,'sony-wh-1000xm5','Sony WH-1000XM5','Sony','Audio',575000,625000,14,'https://i.ebayimg.com/images/g/fv0AAeSwumNpiqP6/s-l1200.jpg','Wireless over-ear headphones with active noise cancellation.',null,'6 months seller warranty','New','["Active noise cancellation","Comfortable over-ear design","Wireless listening","Built for calls and focus"]','{"Type":"Over-ear","Connection":"Wireless","Charging":"USB-C"}',true),
(5,'anker-737-power-bank','Anker 737 Power Bank','Anker','Accessories',185000,null,19,'https://s.topratgeber24.de/bilder/6943b619b9cf978be80875b6/e1280/anker-737-power-bank.jpeg','24,000mAh power bank with high-output USB-C charging.','Staff pick','6 months seller warranty','New','["High-capacity portable power","USB-C fast charging","Laptop-compatible output","Travel-friendly setup"]','{"Type":"Power bank","Use":"Phones, tablets, laptops"}',true),
(6,'hollyland-lark-m2-wireless-mic','Hollyland Lark M2 Wireless Mic','Hollyland','Creator Tools',235000,null,9,'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/catalog-image/MTA-146659433/hollyland_jpc_kemang_hollyland_lark_m2_duo_wireless_microphone_camera_dual_mic_hp_lightning_type_c_combo_garansi_resmi_full01_oav8b05x.jpg','Compact dual wireless microphone kit for phones and cameras.',null,'6 months seller warranty','New','["Compact wireless audio","Creator-friendly setup","Portable charging case","Great for interviews"]','{"Type":"Wireless microphone","Use":"Phone and camera content"}',true),
(7,'logitech-mx-master-3s','Logitech MX Master 3S','Logitech','Accessories',185000,null,16,'https://computermania.co.za/cdn/shop/files/master_3s.4.jpg?v=1694695210','Ergonomic wireless mouse with 8K DPI tracking and MagSpeed scrolling.',null,'6 months seller warranty','New','["Ergonomic productivity shape","Precision scrolling","Multi-device workflow","Quiet clicks"]','{"Type":"Wireless mouse","Use":"Work and creative productivity"}',true),
(8,'jbl-charge-5','JBL Charge 5','JBL','Audio',245000,279000,13,'https://cdn.panacompu.com/cdn-img/pv/jbl-charge-5-front-view-black.jpg?fixedwidthheight=false&height=780&width=780','Portable Bluetooth speaker with long battery life and built-in power bank.','Deal','6 months seller warranty','New','["Portable wireless audio","Strong battery life","Durable outdoor-ready form","Powerful everyday sound"]','{"Type":"Portable speaker","Connection":"Bluetooth"}',true)
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
