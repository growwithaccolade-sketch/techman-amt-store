# TechMan AMT Store

Premium Next.js ecommerce foundation for phones, laptops, gadgets, creator tools and digital technology products.

## What is implemented

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
```

in the Supabase SQL editor or through your migration workflow.

The migrations create the product catalog, orders, order items, inventory movements, editable store settings and sales lead inbox. Migration 003 also adds idempotent paid-order inventory handling so repeated payment callbacks cannot double-decrement stock.

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
