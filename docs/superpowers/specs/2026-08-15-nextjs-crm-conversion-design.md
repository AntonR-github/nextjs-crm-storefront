# htc-israel: static site → Next.js + CRM storefront

Status: approved by user 2026-08-15. Ready for implementation planning.

## Context

`htc-israel` currently exists only as a built static output (`dist/client/*.html` +
`styles.css`/`premium-commerce.css` + vanilla JS) — no framework source, no git repo. It's a
Hebrew RTL (`dir="rtl"`) storefront for hair clippers/trimmers/shavers (brand: HTC), with a
custom premium dark/gold design system (~4,100 lines of hand-written CSS), a `localStorage`
cart, and a checkout flow that currently just links to a contact form (no real payment).

This spec converts it into a Next.js (App Router) storefront that follows the same
CRM-integrated architecture as every other site in this workspace (`xvape`, `polarizedx`),
per `B2BCRM/docs/adding-new-sites.md`.

The 6 products currently on the site (AT-799, AT-735, AT-599, AT-570, AT-158, GT-667) are
**placeholder/example content for the design**, not a locked catalog — they get created in CRM
so the storefront is functional, but whoever owns the real catalog can replace them later via
CRM admin without a code change.

## Non-goals

- No CRM schema changes. Nothing here requires a Prisma migration on the shared production
  database.
- No "compare-at price" wired to CRM. The discount pricing shown on cards/product pages
  (₪349 struck through ₪399, etc.) is a **frontend-only design treatment** — a local static
  data file in the Next.js repo, same as today's `product-page.js` `regularPrices` object. It
  is not fetched from or managed in CRM.
- No blog, no favorites, no Supabase — not present in the source site, not requested.
- No automated test framework (matches workspace convention — manual dev-server verification).

## Architecture

- New standalone repo at `c:\Users\anton\Desktop\b2b\htc-israel`, own Vercel project, dev port
  **3004** (xvape=3001, polarizedx=3002, upscale=3003 are taken).
- Next.js (App Router) + TypeScript + React, matching the version pins used in `xvape`/`polarizedx`.
- **No Tailwind.** The source CSS is a mature, fully custom system, not utility-based. Porting it
  to Tailwind would be a high-risk rewrite for no visual gain. `styles.css` +
  `premium-commerce.css` are ported near-verbatim into `app/globals.css` (asset URLs adjusted for
  Next.js), and components are built against the existing class names (`.product-card`,
  `.hero__grid`, `.cart-item`, etc.) to preserve pixel-level fidelity.
- CRM integration follows `adding-new-sites.md` exactly: a new Site registered in B2BCRM admin
  (slug TBD, e.g. `htc-israel`), `CRM_URL`/`CRM_API_KEY`/`CRM_SITE_SLUG`/`REVALIDATE_SECRET` in
  `.env.local`, image host whitelisting in `next.config.ts`, `/api/revalidate` route.
- **Hyp Pay**: reuses polarizedx's terminal (`HYP_MASOF`/`HYP_KEY`/`HYP_PASSP` copied from its
  env vars) — same merchant account, per user instruction. Order totals still computed
  server-side in the checkout route from CRM product data, never trusted from the client.
- Payper inventory sync: CRM-side only, no storefront code — same as every other site. Category
  names set in CRM admin when/if Payper is connected for this site.

## CRM data model mapping

- 3 `Category` rows: clipper (מכונת תספורת), trimmer (טרימר), shaver (מגלח).
- 6 `Product` rows (handle = lowercase SKU, e.g. `at-799`), fields populated from the current
  static data (`product-catalog.json`, `product-page.js`'s `catalog`/`productSpecs`/`productStories`):
  `name`, `price`, `description`, `image`, `images[]`, `cardFeatures[]`, `features[]`,
  `specsRaw`, `faqRaw`, `inTheBox`, `warrantyInfo`, `categoryOrder`.
- `barcode` values from `product-catalog.json` → CRM `gtin`.
- Editorial/story content (per-model headline/body/benefits from `product-page.js`'s
  `productStories`) and compare-at prices are **not** CRM fields — they live in a local
  `lib/product-content.ts` in the Next.js repo, keyed by handle, same non-CRM treatment as the
  pricing note above.

## Routes

| Route | Source | Notes |
|---|---|---|
| `/` | `index.html` | Hero, benefits, product grid, brand story, service section |
| `/shop` | `shop.html` | Full catalog, category filter (`finder-card` logic) |
| `/shop/[handle]` | `product-*.html` ×6 | Dynamic product detail (gallery, qty stepper, specs, FAQ, related) |
| `/compare` | `compare.html` + `compare.js` | Selectable comparison cards + spec table, presets |
| `/cart` | (new) | Full cart page; slide-out panel is kept too, for parity with current UX |
| `/checkout` | (new) | Real Hyp Pay checkout, replaces "redirect to contact.html" |
| `/payment/success`, `/payment/failure` | (new) | Post-payment landing pages |
| `/contact` | `contact.html` | Lead form → CRM `POST /submit` (replaces the current `mailto:` hack) |
| `/shipping`, `/terms`, `/privacy`, `/accessibility`, `/warranty` | same-named `.html` | Static content, ported near-verbatim |
| `/api/hyp-checkout` | (new) | Copied pattern from `xvape/app/api/hyp-checkout/route.ts` |
| `/api/confirm-order` | (new) | Copied pattern from `xvape/app/api/confirm-order` |
| `/api/revalidate` | (new) | Standard revalidate receiver per `adding-new-sites.md` §6 |

`AT-018` and `AT-630`, which exist in `product-page.js`'s data object but are not linked from
anywhere on the live site, are dropped — not migrated as products.

## Data fetching

`lib/products.ts`: `getProducts()` fetches CRM `GET /api/{slug}/products` (public, no key,
`revalidate: 60`), falling back to a local static product list on error/empty response — same
resilience pattern as `xvape/lib/products.ts`. Categories similarly via `GET /categories`.

## Cart & client state

`CartContext` (React context + `localStorage` persistence, same shape/keys as the current
`app.js` state) replaces the vanilla-JS cart. `Cart` slide-out and the new `/cart` page both
read from it.

## Component breakdown (vanilla JS → React)

| Current | Becomes |
|---|---|
| Cart logic in `app.js` | `CartContext` + `Cart` slide-out component |
| Accessibility widget | `AccessibilityWidget` (font size / contrast / reduced motion, still `localStorage`) |
| Cookie consent banner | `CookieConsent` component |
| WhatsApp float button | `WhatsAppButton` (static link, no CRM data) |
| Scroll-reveal (`IntersectionObserver`) | `useReveal` hook applied to sections |
| Mobile nav toggle | state inside `Navbar` |
| Utility ticker/marquee | `UtilityBar` component |
| `compare.js` selection state | state inside `CompareClient` (client component, mirrors xvape's `CompareClient.tsx`) |
| `product-page.js` per-model rendering | `ProductDetail` component + `lib/product-content.ts` |

## Testing / verification

No automated test framework, matching workspace convention. Verification is manual: run the dev
server on port 3004, walk every route in the browser (RTL rendering, cart add/remove/undo,
category filter, compare tool, contact form submission against CRM, checkout through Hyp once
credentials are available), and confirm no regressions against the current static site's
behavior.

## Go-live checklist (from `adding-new-sites.md`, adapted)

- [ ] Site created in CRM (slug, `apiKey`, `revalidateSecret` copied)
- [ ] 3 categories + 6 products created in CRM (placeholder content, editable later)
- [ ] `revalidateUrl` on the Site points at the production storefront URL once deployed
- [ ] `.env.local` configured; same vars set in Vercel with production values
- [ ] No secret behind a `NEXT_PUBLIC_` prefix
- [ ] Image hosts whitelisted in `next.config.ts`
- [ ] Hyp Pay env vars copied from polarizedx; checkout totals computed server-side
- [ ] git repo initialized for htc-israel, pushed to its own remote, own Vercel project created
