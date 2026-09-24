# TechMan AMT Store

Premium Next.js ecommerce foundation for phones, laptops, gadgets, creator tools and digital technology products.

## What is implemented

- Customer email/password accounts with Supabase SSR auth
- Optional Google OAuth through Supabase
- Password recovery and protected account/order-history area
- Server-validated coupons and promotion management
- Verified-purchase review submission and admin moderation
- Sales analytics, customer value and marketing operations dashboards
- Admin-managed Nigeria delivery pricing with checkout quoting
- Supabase Storage product image uploads
- Transactional paid-order and fulfilment status email support through Resend

- Live Supabase-backed catalog with demo fallback
- Admin product CRUD, stock control and visibility toggles
- Admin order fulfilment and internal notes
- Admin sales-lead inbox for trade-ins, sourcing requests and bulk quotes
- Editable public store settings for WhatsApp, email, announcement and delivery threshold
- Full shop, category, brand and search routes
- Trade-in, device request and corporate quote forms
- Tech Insights buying-guide blog

- Premium responsive storefront
- Product search and category filtering
- Individual product detail pages
- Persistent browser cart
- Cart quantity management
- Checkout form
- Paystack-ready server-side payment initialization
- Paystack transaction verification
- HMAC-SHA512 webhook signature verification
- Supabase order and inventory schema with RLS enabled
- Private order tracking by order reference + checkout email
- Environment-configured WhatsApp ordering
- Protected `/admin` foundation using an HTTP-only server cookie
- GitHub Actions build verification

## Stack

- Next.js App Router
- React + TypeScript
- Supabase/Postgres
- Paystack
- Lucide icons
- Vercel-ready architecture

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Then open http://localhost:3000.

## Environment variables

Copy `.env.example` and configure:

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_STORE_EMAIL=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

PAYSTACK_SECRET_KEY=

RESEND_API_KEY=
RESEND_FROM_EMAIL=

ADMIN_ACCESS_KEY=
```

Never expose `SUPABASE_SERVICE_ROLE_KEY`, `PAYSTACK_SECRET_KEY` or `ADMIN_ACCESS_KEY` to browser code.

## Supabase setup

Create a Supabase project, then run:

```
supabase/migrations/001_commerce.sql
supabase/migrations/002_admin_catalog.sql
supabase/migrations/003_idempotent_inventory.sql
supabase/migrations/004_store_settings.sql
supabase/migrations/005_sales_leads.sql
supabase/migrations/006_newsletter.sql
supabase/migrations/007_promotions.sql
supabase/migrations/008_verified_reviews.sql
supabase/migrations/009_customer_accounts.sql
supabase/migrations/010_product_image_storage.sql
supabase/migrations/011_delivery_zones.sql
supabase/migrations/012_order_notifications.sql
supabase/migrations/013_admin_staff_and_pages.sql
supabase/migrations/014_catalog_expansion_2026.sql
```

in the Supabase SQL editor or through your migration workflow.

The migrations create the product catalog, orders, inventory movements, store settings, sales leads, newsletter subscribers, coupons, verified reviews, customer profiles, product image storage, delivery zones and notification state. Paid-order inventory and coupon usage are idempotent so repeated payment callbacks do not double-consume stock or promotion usage.

RLS is enabled. Public clients only receive read access to active products. Order and inventory access is intentionally kept server-side.

## Paystack setup

Set `PAYSTACK_SECRET_KEY` on the server.

Configure the Paystack webhook URL as:

```
https://YOUR-DOMAIN.com/api/payments/webhook
```

Successful online payments are verified against the server-created order amount before an order is marked paid.

## Admin

Route:

```
/admin
```

Set a long random `ADMIN_ACCESS_KEY` in the hosting environment. This is a secure project foundation, but the intended production upgrade is Supabase Auth with role-based staff permissions and MFA.

## Order tracking

Customers can visit:

```
/track-order
```

They must provide both their order reference and the same email used at checkout.

## CI

Every push to `main` runs:

```bash
npm install
npm run build
```

through GitHub Actions.

## Deployment

The project is structured for Vercel. Import this GitHub repository into Vercel, configure the environment variables above, then deploy. Set `NEXT_PUBLIC_SITE_URL` to the final production origin before enabling live payments.

## Before accepting real payments

1. Apply the Supabase migration.
2. Configure all production environment variables.
3. Add the real TechMan AMT WhatsApp number and store email.
4. Use Paystack test mode first.
5. Confirm the payment callback and webhook work end-to-end.
6. Replace demo catalog data with verified inventory and specifications.
7. Upgrade staff authentication to Supabase Auth before giving multiple staff members admin access.
8. Optionally run `supabase/seed.sql` to load the starter catalog into a new database.
9. Enable email/password Auth in Supabase and configure Google OAuth only if you want Google login.
10. Add your production site URL to Supabase Auth redirect URLs.
11. Create and verify the sending domain in Resend before setting `RESEND_FROM_EMAIL`.
12. Configure delivery zones in `/admin/delivery` before relying on online delivery totals.
13. Test coupons, delivery, webhook inventory, email and account recovery using test-mode payments before switching Paystack to live keys.

## Admin access

The owner login uses `ADMIN_USERNAME`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` when configured. Staff accounts are created from `/admin/staff` and stored as one-way password hashes after migration 013 is applied. Page content can be edited under `/admin/pages`; products, images, highlights and specifications remain editable under `/admin/products`.
