# htc-israel Next.js + CRM Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the static `htc-israel` HTML/CSS site as a Next.js (App Router) storefront integrated with B2BCRM, matching the pattern used by `xvape` and `polarizedx`.

**Architecture:** Next.js 16 + TypeScript + React, custom global CSS (no Tailwind) ported near-verbatim from the source site to preserve visual fidelity, CRM-backed product/category/order data with a local static fallback, Hyp Pay checkout reusing polarizedx's terminal.

**Tech Stack:** Next.js 16.2.6, React 19.2.4, TypeScript 5.9.3, plain CSS (global stylesheet, no CSS framework), no automated test framework (manual dev-server verification, matching workspace convention).

**Spec:** `docs/superpowers/specs/2026-08-15-nextjs-crm-conversion-design.md`

## Global Constraints

- Dev port: **3004** (xvape=3001, polarizedx=3002, upscale=3003 are taken).
- No Tailwind — plain global CSS ported from `dist/client/styles.css` + `premium-commerce.css`.
- No CRM schema changes. Discount/compare-at pricing, product specs, FAQ copy, and editorial "story" content live in local files (`lib/product-content.ts`), never in CRM fields.
- CRM owns only commerce-critical fields: product name, price, images, category, handle.
- Hyp Pay: reuse polarizedx's terminal credentials (`HYP_MASOF`/`HYP_KEY`/`HYP_PASSP`) — same merchant account.
- No secret may be behind a `NEXT_PUBLIC_` prefix.
- Order totals are always computed server-side from CRM product data, never trusted from the client.
- No automated tests. Every task's verification step is manual: run `npm run dev` on port 3004 and check the page/route in a browser or via `curl`.
- All Hebrew copy is ported verbatim from the source HTML files under `dist/client/` — never paraphrased or re-translated.
- RTL throughout (`dir="rtl"`, `lang="he"`).

---

## Task 1: Scaffold the Next.js project

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `.gitignore`
- Create: `.env.local.example`
- Create: `next-env.d.ts`
- Create: `eslint.config.mjs`
- Create: `app/layout.tsx` (placeholder, replaced fully in Task 7/11)
- Create: `app/globals.css` (empty placeholder, filled in Task 3)
- Create: `app/page.tsx` (placeholder, replaced in Task 15)

**Interfaces:**
- Produces: a working `npm run dev` on port 3004, App Router structure other tasks build into.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "htc-israel",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3004",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "next": "16.2.6",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@types/node": "20.19.43",
    "@types/react": "19.2.17",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.6",
    "typescript": "5.9.3"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create `next-env.d.ts`**

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />
```

- [ ] **Step 4: Create `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.ducks.co.il" },
      { protocol: "https", hostname: "app.payper.co.il" },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 5: Create `eslint.config.mjs`**

```js
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

- [ ] **Step 6: Create `.gitignore`**

```
node_modules
.next
out
.env.local
.env*.local
npm-debug.log*
.DS_Store
*.tsbuildinfo
```

- [ ] **Step 7: Create `.env.local.example`**

```env
CRM_URL=http://localhost:3000
CRM_API_KEY=
CRM_SITE_SLUG=htc-israel
REVALIDATE_SECRET=

NEXT_PUBLIC_CRM_URL=http://localhost:3000
NEXT_PUBLIC_CRM_SITE_SLUG=htc-israel
NEXT_PUBLIC_SITE_URL=http://localhost:3004

# Reused from polarizedx — same merchant account
HYP_MASOF=
HYP_KEY=
HYP_PASSP=
```

- [ ] **Step 8: Create placeholder `app/globals.css`**

```css
body { margin: 0; }
```

- [ ] **Step 9: Create placeholder `app/layout.tsx`**

```tsx
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 10: Create placeholder `app/page.tsx`**

```tsx
export default function HomePage() {
  return <main>HTC ישראל</main>;
}
```

- [ ] **Step 11: Install dependencies**

Run: `npm install`
Expected: installs without error, creates `node_modules/` and `package-lock.json`.

- [ ] **Step 12: Verify dev server boots**

Run: `npm run dev` (in background/separate terminal), then `curl -s http://localhost:3004 | head -20`
Expected: HTML response containing `HTC ישראל`. Stop the dev server after confirming.

- [ ] **Step 13: Commit**

```bash
git add package.json tsconfig.json next.config.ts .gitignore .env.local.example next-env.d.ts eslint.config.mjs app/layout.tsx app/globals.css app/page.tsx package-lock.json
git commit -m "Scaffold Next.js project for htc-israel"
```

---

## Task 2: Copy static assets into public/

**Files:**
- Create: `public/assets/**` (copied from `dist/client/assets/**`)
- Create: `public/hero-home.jpg`
- Create: `public/service-barbershop.jpg`
- Create: `public/assets-htc-global.jpg`
- Create: `public/site.webmanifest`
- Create: `public/robots.txt`

**Interfaces:**
- Produces: every image path used by later tasks (`/assets/products/*.jpg`, `/assets/barbershop/*.jpg`, `/assets/brand/*.png`, `/assets/higgs/*.jpg`, `/assets/optimized/*.jpg`, `/hero-home.jpg`, `/service-barbershop.jpg`, `/assets-htc-global.jpg`).

- [ ] **Step 1: Copy the assets directory and root images**

Run (from the `htc-israel` project root):

```bash
mkdir -p public
cp -r dist/client/assets public/assets
cp dist/client/hero-home.jpg public/hero-home.jpg
cp dist/client/service-barbershop.jpg public/service-barbershop.jpg
cp dist/client/assets-htc-global.jpg public/assets-htc-global.jpg
cp dist/client/site.webmanifest public/site.webmanifest
cp dist/client/robots.txt public/robots.txt
```

- [ ] **Step 2: Remove build-tool-only files that leaked into `assets/`**

The source `assets/` folder contains bundler output not needed in a fresh Next.js build (`framework-*.js`, `index-*.js`, `index-*.css`, `layout-segment-context-*.js`, `rolldown-runtime-*.js` — leftover from the previous build tool). Remove them:

Run:
```bash
rm -f public/assets/framework-*.js public/assets/index-*.js public/assets/index-*.css public/assets/layout-segment-context-*.js public/assets/rolldown-runtime-*.js
```

- [ ] **Step 3: Verify the copy**

Run: `find public -maxdepth 3 -type d`
Expected: `public/assets/barbershop`, `public/assets/brand`, `public/assets/higgs`, `public/assets/optimized`, `public/assets/products` all present.

Run: `ls public/assets/products`
Expected: `at-158-single-v2.png`, `at-570-single-v2.png`, `at-599-official-clean.jpg`, `at-735-single-v2.png`, `at-799-single.jpg`, `gt-667-single-v2.png`.

- [ ] **Step 4: Commit**

```bash
git add public
git commit -m "Copy static product/brand assets into public/"
```

---

## Task 3: Port the global CSS design system

**Files:**
- Modify: `app/globals.css` (replace placeholder with full ported stylesheet)

**Interfaces:**
- Produces: every class name later components render against (`.site-header`, `.product-card`, `.cart`, `.hero`, `.footer`, `.legal-page`, `.compare-model-grid`, etc.) — this is the single source of visual truth for the whole port.

- [ ] **Step 1: Concatenate the two source stylesheets into `app/globals.css`**

Run (from the `htc-israel` project root):

```bash
cat dist/client/styles.css dist/client/premium-commerce.css > app/globals.css
```

- [ ] **Step 2: Fix relative `url()` references to be root-absolute**

The source CSS was served from the site root alongside the HTML, so its `url()` references are relative (`url("hero-home.jpg")`). In Next.js, `public/` files are served from `/`, so these need a leading slash. Fix the 5 distinct references (7 occurrences total):

Run:
```bash
sed -i \
  -e 's#url("hero-home\.jpg")#url("/hero-home.jpg")#g' \
  -e 's#url("service-barbershop\.jpg")#url("/service-barbershop.jpg")#g' \
  -e 's#url("assets/optimized/at735-dsc02940\.jpg")#url("/assets/optimized/at735-dsc02940.jpg")#g' \
  -e 's#url("assets/brand/htc-logo-white\.png")#url("/assets/brand/htc-logo-white.png")#g' \
  -e 's#url("assets/brand/htc-logo-black\.png")#url("/assets/brand/htc-logo-black.png")#g' \
  app/globals.css
```

- [ ] **Step 3: Verify no relative (non-data, non-external) `url()` references remain**

Run: `grep -n 'url("' app/globals.css | grep -v 'data:image' | grep -v 'url("/' `
Expected: no output (every remaining quoted `url("...")` either starts with `/` or is a `data:image` URI). The `@import url('https://fonts.googleapis.com/...')` line is fine as-is (external, not quoted with `"`).

- [ ] **Step 4: Wire `globals.css` into the root layout**

`app/layout.tsx` already has `import "./globals.css"` from Task 1 — no change needed here, just confirm it's still present.

- [ ] **Step 5: Verify visually**

Run: `npm run dev`, open `http://localhost:3004` in a browser.
Expected: dark hero background image loads (`hero-home.jpg`), Heebo font renders (Hebrew text looks like a humanist sans-serif, not the browser's default serif fallback), page background is the warm paper cream tone (`--paper: #f7f5f0`), no obviously broken/missing background images. Stop the dev server after confirming.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css
git commit -m "Port global CSS design system from static site"
```

---

## Task 4: Icon sprite component

**Files:**
- Create: `app/components/IconSprite.tsx`

**Interfaces:**
- Produces: `<IconSprite />` component rendering the hidden SVG `<symbol>` defs; consumed via `<svg><use href="#icon-lock"/></svg>` etc. by Navbar, UtilityBar, ProductCard, and other components.

- [ ] **Step 1: Create the component**

Ported verbatim from `dist/client/index.html`'s `<svg class="svg-sprite">` block (lines 175-184):

```tsx
export default function IconSprite() {
  return (
    <svg className="svg-sprite" aria-hidden="true">
      <symbol id="icon-lock" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></symbol>
      <symbol id="icon-truck" viewBox="0 0 24 24"><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></symbol>
      <symbol id="icon-shield" viewBox="0 0 24 24"><path d="M12 3 20 6v6c0 5-3.4 8-8 9-4.6-1-8-4-8-9V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></symbol>
      <symbol id="icon-bag" viewBox="0 0 24 24"><path d="M5 8h14l-1 13H6z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></symbol>
      <symbol id="icon-blade" viewBox="0 0 24 24"><path d="M4 6h16v5H4zM7 11v7M11 11v7M15 11v7M19 11v7"/></symbol>
      <symbol id="icon-grip" viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="4"/><path d="M10 7h4M10 11h4M10 15h4"/></symbol>
      <symbol id="icon-battery" viewBox="0 0 24 24"><rect x="3" y="6" width="17" height="12" rx="2"/><path d="M20 10h2v4h-2M11 8l-3 5h4l-2 4"/></symbol>
      <symbol id="icon-motor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4V2M12 22v-2M4 12H2M22 12h-2"/></symbol>
    </svg>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/IconSprite.tsx
git commit -m "Add SVG icon sprite component"
```

---

## Task 5: Cart context

**Files:**
- Create: `lib/constants.ts`
- Create: `app/context/CartContext.tsx`

**Interfaces:**
- Produces: `FREE_SHIPPING_THRESHOLD` (in `lib/constants.ts`, re-exported from `CartContext.tsx` so existing import sites keep working); `CartItem { id: string; name: string; price: number; quantity: number; image?: string }`, `useCart()` hook returning `{ items, addItem(item: Omit<CartItem,"quantity">, quantity?: number), removeItem(id), updateQuantity(id, quantity), clearCart(), total, count, toast: { message: string; actionLabel?: string; onAction?: () => void } | null, dismissToast(), isPanelOpen, openPanel(), closePanel() }`. Consumed by every component that touches the cart (Navbar, ProductCard, Cart panel, product detail page, cart page, checkout page) and by the server-side checkout route (Task 20), which needs `FREE_SHIPPING_THRESHOLD` too but cannot import it from a `"use client"` file — hence the shared constant lives in a plain `lib/` module, not only in the context file.

- [ ] **Step 1: Create `lib/constants.ts`**

```ts
export const FREE_SHIPPING_THRESHOLD = 299;
```

- [ ] **Step 2: Create `app/context/CartContext.tsx`**

```tsx
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { FREE_SHIPPING_THRESHOLD } from "../../lib/constants";

export { FREE_SHIPPING_THRESHOLD };

const STORAGE_KEY = "htc-israel-cart-v2";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Toast {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  toast: Toast | null;
  dismissToast: () => void;
  isPanelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

function loadCart(): CartItem[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];
    return saved.filter(
      (item): item is CartItem =>
        item && typeof item.id === "string" && typeof item.name === "string" &&
        Number(item.price) >= 0 && Number(item.quantity) > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const openPanel = () => setIsPanelOpen(true);
  const closePanel = () => setIsPanelOpen(false);
  const dismissToast = () => setToast(null);

  const addItem: CartContextType["addItem"] = (item, quantity = 1) => {
    const amount = Math.max(1, Math.floor(quantity));
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + amount } : i));
      }
      return [...prev, { ...item, quantity: amount }];
    });
    setToast({ message: `נוסף לסל: ${item.name}`, actionLabel: "לצפייה בסל", onAction: openPanel });
  };

  const removeItem = (id: string) => {
    const removed = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (removed) {
      setToast({
        message: "המוצר הוסר מהסל",
        actionLabel: "ביטול",
        onAction: () => setItems((prev) => [...prev, removed]),
      });
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) return removeItem(id);
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items, addItem, removeItem, updateQuantity, clearCart, total, count,
        toast, dismissToast, isPanelOpen, openPanel, closePanel,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/constants.ts app/context/CartContext.tsx
git commit -m "Add cart context with localStorage persistence"
```

---

## Task 6: Scroll-reveal component

**Files:**
- Create: `app/components/ScrollReveal.tsx`

**Interfaces:**
- Produces: `<ScrollReveal />`, a client component with no visible output, mounted once in the root layout (Task 11). Runs the same selector-based reveal-on-scroll behavior as the source site, so page components stay plain server components — no per-section refs or `"use client"` needed on the pages themselves.

Ported directly from `app.js` lines 329-347 and `info.js` lines 11-24 (which used the same technique with a slightly different selector list for the informational pages) — rather than a per-element hook, this queries the DOM once after mount using the original's selector strings and attaches one shared `IntersectionObserver`, exactly matching the source site's behavior:

- [ ] **Step 1: Create `app/components/ScrollReveal.tsx`**

```tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const REVEAL_SELECTOR = [
  "main > section:not(.hero)",
  ".product-card",
  ".why article",
  ".service__copy",
  ".service__photo",
  ".product-story > *",
  ".compare-model-grid article",
  ".faq details",
  ".inner-hero .shell",
  ".legal-page > *",
  ".contact-page > *",
  ".contact-trust",
  ".inner-footer",
].join(", ");

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    targets.forEach((element, index) => {
      element.classList.add("reveal");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 65}ms`);
    });

    if (!("IntersectionObserver" in window)) {
      targets.forEach((element) => element.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    targets.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
    // Re-run on every route change so newly-mounted page content gets revealed too.
  }, [pathname]);

  return null;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/ScrollReveal.tsx
git commit -m "Add scroll-reveal component"
```

---

## Task 7: Navbar, UtilityBar, WhatsApp button

**Files:**
- Create: `app/components/Navbar.tsx`
- Create: `app/components/UtilityBar.tsx`
- Create: `app/components/WhatsAppButton.tsx`

**Interfaces:**
- Consumes: `useCart()` from Task 5 (`count`, `openPanel`).
- Produces: `<Navbar />`, `<UtilityBar />`, `<WhatsAppButton />` (floating, mounted once in root layout) and `<WhatsAppContactLink />` (inline variant, consumed by the contact page in Task 23).

- [ ] **Step 1: Create `app/components/Navbar.tsx`**

Ported from `dist/client/index.html` lines 25-46, with mobile-menu state and active-link highlighting added:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";

const navLinks = [
  { href: "/", label: "דף הבית" },
  { href: "/shop", label: "החנות" },
  { href: "/compare", label: "השוואת דגמים" },
  { href: "/#service", label: "אחריות ושירות" },
  { href: "/contact", label: "צור קשר" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, openPanel } = useCart();
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="shell header__inner">
        <button
          className="icon-button menu-button"
          type="button"
          aria-label="פתיחת תפריט"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span></span><span></span><span></span>
        </button>
        <Link className="brand" href="/" aria-label="HTC ישראל, דף הבית">
          <b>HTC</b><small>ISRAEL</small>
        </Link>
        <nav className={`main-nav${menuOpen ? " is-open" : ""}`} id="mainNav" aria-label="ניווט ראשי">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          className={`cart-button${count > 0 ? " has-items" : ""}`}
          type="button"
          aria-label={count ? `פתיחת סל הקניות, ${count} פריטים` : "פתיחת סל הקניות"}
          onClick={openPanel}
        >
          <svg aria-hidden="true"><use href="#icon-bag" /></svg>
          <span>סל</span>
          <b>{count}</b>
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create `app/components/UtilityBar.tsx`**

Ported from `app.js`'s `utilityItems` array (lines 268-289) which replaces the static 3-item bar with a 5-item scrolling marquee (two duplicate sets, matching the `.utility-track`/`.utility-set` CSS animation):

```tsx
const utilityItems = [
  { label: "קנייה מאובטחת", path: <><path d="M7 10V8a5 5 0 0 1 10 0v2"/><rect x="5" y="10" width="14" height="11" rx="2"/></> },
  { label: "משלוח מהיר לכל הארץ", path: <><path d="M3 6h11v10H3z"/><path d="M14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></> },
  { label: "12 חודשי אחריות", path: <><path d="M12 3 4.5 6v5.5c0 4.6 3.1 7.8 7.5 9.5 4.4-1.7 7.5-4.9 7.5-9.5V6z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></> },
  { label: "יבואן רשמי בישראל", path: <><circle cx="12" cy="12" r="9"/><path d="M3.5 12h17M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></> },
  { label: "שירות לקוחות מקומי", path: <><path d="M4 13v-2a8 8 0 0 1 16 0v2"/><path d="M4 13h3v6H5a2 2 0 0 1-2-2v-2a2 2 0 0 1 1-2ZM20 13h-3v6h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-1-2Z"/><path d="M17 19c-1 1.3-2.7 2-5 2"/></> },
];

function UtilitySet({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div className="utility-set" aria-hidden={ariaHidden}>
      {utilityItems.map((item, index) => (
        <span className="utility-slide" key={index}>
          <svg viewBox="0 0 24 24" aria-hidden="true">{item.path}</svg>
          <b>{item.label}</b>
        </span>
      ))}
    </div>
  );
}

export default function UtilityBar() {
  return (
    <div className="utility" aria-label="יתרונות החנות">
      <div className="shell utility__inner">
        <div className="utility-track">
          <UtilitySet />
          <UtilitySet ariaHidden />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `app/components/WhatsAppButton.tsx`**

Ported from `app.js`'s `initWhatsAppContact` (lines 515-540):

```tsx
const WHATSAPP_URL =
  "https://wa.me/972587991094?text=%D7%A9%D7%9C%D7%95%D7%9D%20HTC%20%D7%99%D7%A9%D7%A8%D7%90%D7%9C%2C%20%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%A7%D7%91%D7%9C%20%D7%A4%D7%A8%D7%98%D7%99%D7%9D";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.4-4.2a8.5 8.5 0 1 1 15.6-4.6Z"/>
      <path d="M8.2 7.8c.3-.4.7-.4 1-.1l1.1 1.5c.2.3.2.6 0 .9l-.6.8c.8 1.6 2 2.8 3.6 3.6l.8-.7c.3-.2.6-.2.9 0l1.5 1.1c.3.2.3.7.1 1-.5.8-1.4 1.3-2.3 1.2-3.9-.5-7-3.5-7.4-7.4-.1-.7.4-1.5 1.3-1.9Z"/>
    </svg>
  );
}

export default function WhatsAppButton() {
  return (
    <a
      className="whatsapp-contact"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="יצירת קשר עם HTC ישראל בוואטסאפ"
    >
      <WhatsAppIcon />
      <span>WhatsApp</span>
    </a>
  );
}

export function WhatsAppContactLink() {
  return (
    <a className="contact-whatsapp" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
      <WhatsAppIcon />
      <span><b>WhatsApp</b><small>058-799-1094</small></span>
      <i aria-hidden="true">←</i>
    </a>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/components/Navbar.tsx app/components/UtilityBar.tsx app/components/WhatsAppButton.tsx
git commit -m "Add Navbar, UtilityBar, WhatsApp button components"
```

---

## Task 8: Footer, InnerHeader, InnerFooter

**Files:**
- Create: `app/components/Footer.tsx`
- Create: `app/components/InnerHeader.tsx`
- Create: `app/components/InnerFooter.tsx`

**Interfaces:**
- Produces: `<Footer />` (used on home/shop/compare/product pages), `<InnerHeader />` + `<InnerFooter />` (used on contact + the 5 legal pages, which share the simpler `.inner-header`/`.inner-footer` chrome from `contact.html`/`shipping.html`).

- [ ] **Step 1: Create `app/components/Footer.tsx`**

Ported from `dist/client/index.html` lines 157-165:

```tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer__grid">
        <div>
          <Link className="brand brand--footer" href="/"><b>HTC</b><small>ISRAEL</small></Link>
          <p>מכונות מקצועיות. שירות בישראל.</p>
        </div>
        <div>
          <h3>הקולקציה</h3>
          <Link href="/shop">לכל הדגמים</Link>
          <Link href="/compare">השוואת דגמים</Link>
        </div>
        <div>
          <h3>המותג</h3>
          <Link href="/#about">HTC בעולם</Link>
          <Link href="/#one-pro">האיכות המקצועית</Link>
          <Link href="/contact">לשותפים עסקיים</Link>
        </div>
        <div>
          <h3>שירות</h3>
          <Link href="/shipping">משלוחים</Link>
          <Link href="/shipping">החזרות והחלפות</Link>
          <Link href="/#service">אחריות</Link>
          <Link href="/contact">שאלות נפוצות</Link>
        </div>
      </div>
      <div className="shell footer__bottom">
        <span>© 2026 HTC ISRAEL · יבוא ושיווק: B2B MARKT LTD</span>
        <span>
          המרכבה 25, חולון · <Link href="/terms">תקנון</Link> ·{" "}
          <Link href="/privacy">מדיניות פרטיות</Link> ·{" "}
          <Link href="/accessibility">הצהרת נגישות</Link>
        </span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Create `app/components/InnerHeader.tsx`**

Ported from `dist/client/contact.html` line 2, adapted with React state for the mobile toggle (`info.js` lines 5-10) and active-link highlighting:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "דף הבית" },
  { href: "/shop", label: "המוצרים" },
  { href: "/compare", label: "השוואה" },
  { href: "/contact", label: "צור קשר" },
];

export default function InnerHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="inner-header">
      <div className="shell">
        <Link className="brand" href="/"><b>HTC</b><small>ISRAEL</small></Link>
        <nav id="infoNav" className={open ? "is-open" : undefined}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          id="infoMenuButton"
          type="button"
          aria-label="פתיחת תפריט"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create `app/components/InnerFooter.tsx`**

Ported from `dist/client/contact.html` line 6:

```tsx
import Link from "next/link";

export default function InnerFooter() {
  return (
    <footer className="inner-footer">
      <div className="shell">
        <Link className="brand brand--footer" href="/"><b>HTC</b><small>ISRAEL</small></Link>
        <nav>
          <Link href="/privacy">פרטיות</Link>
          <Link href="/terms">תקנון</Link>
          <Link href="/shipping">משלוחים</Link>
          <Link href="/accessibility">נגישות</Link>
          <Link href="/contact">צור קשר</Link>
        </nav>
        <span>© 2026 HTC ישראל</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/components/Footer.tsx app/components/InnerHeader.tsx app/components/InnerFooter.tsx
git commit -m "Add Footer, InnerHeader, InnerFooter components"
```

---

## Task 9: Accessibility widget

**Files:**
- Create: `app/components/AccessibilityWidget.tsx`

**Interfaces:**
- Produces: `<AccessibilityWidget />`, mounted once in the root layout (Task 11).

- [ ] **Step 1: Create `app/components/AccessibilityWidget.tsx`**

Ported from `app.js`'s `initAccessibilityWidget` (lines 92-165), converted from imperative DOM manipulation to React state + effects:

```tsx
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "htc-israel-a11y-v1";

interface A11yPrefs {
  fontSize: "normal" | "lg" | "xl";
  contrast: boolean;
  underlineLinks: boolean;
  reduceMotion: boolean;
}

const DEFAULT_PREFS: A11yPrefs = {
  fontSize: "normal",
  contrast: false,
  underlineLinks: false,
  reduceMotion: false,
};

const FONT_ORDER: A11yPrefs["fontSize"][] = ["normal", "lg", "xl"];
const FONT_NAMES: Record<A11yPrefs["fontSize"], string> = {
  normal: "רגיל",
  lg: "מוגדל",
  xl: "מוגדל מאוד",
};

function readPrefs(): A11yPrefs {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return stored && typeof stored === "object" ? { ...DEFAULT_PREFS, ...stored } : { ...DEFAULT_PREFS };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export default function AccessibilityWidget() {
  const [prefs, setPrefs] = useState<A11yPrefs>(DEFAULT_PREFS);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPrefs(readPrefs());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.classList.remove("a11y-font-lg", "a11y-font-xl");
    if (prefs.fontSize === "lg") root.classList.add("a11y-font-lg");
    if (prefs.fontSize === "xl") root.classList.add("a11y-font-xl");
    root.classList.toggle("a11y-contrast", prefs.contrast);
    root.classList.toggle("a11y-underline-links", prefs.underlineLinks);
    root.classList.toggle("a11y-reduce-motion", prefs.reduceMotion);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {}
  }, [prefs, hydrated]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("no-scroll");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("no-scroll");
    };
  }, [open]);

  const cycleFontSize = () => {
    const next = FONT_ORDER[(FONT_ORDER.indexOf(prefs.fontSize) + 1) % FONT_ORDER.length];
    setPrefs((p) => ({ ...p, fontSize: next }));
  };

  const toggle =
    (key: "contrast" | "underlineLinks" | "reduceMotion") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPrefs((p) => ({ ...p, [key]: event.target.checked }));
    };

  return (
    <div className="accessibility-widget">
      <button
        className="site-control accessibility-widget__trigger"
        type="button"
        aria-label="פתיחת הגדרות נגישות"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4.5" r="2.2"/><path d="M5 8.5h14M12 7v13M8 12l4 3 4-3M9 20l3-5 3 5"/></svg>
      </button>
      <div
        className="site-dialog-backdrop"
        hidden={!open}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      >
        <section className="site-dialog accessibility-widget__dialog" role="dialog" aria-modal="true" aria-labelledby="accessibilityTitle">
          <header>
            <div><small>HTC ISRAEL · ACCESS</small><h2 id="accessibilityTitle">הגדרות נגישות</h2></div>
            <button className="site-dialog__close" type="button" aria-label="סגירת הגדרות נגישות" onClick={() => setOpen(false)}>×</button>
          </header>
          <div className="site-dialog__body">
            <button className="accessibility-font-control" type="button" onClick={cycleFontSize}>
              <span>גודל טקסט</span><b>{FONT_NAMES[prefs.fontSize]}</b>
            </button>
            <label className="site-switch-row">
              <span><b>ניגודיות גבוהה</b><small>הגברת ההבדל בין טקסט לרקע</small></span>
              <input type="checkbox" checked={prefs.contrast} onChange={toggle("contrast")} /><i aria-hidden="true"></i>
            </label>
            <label className="site-switch-row">
              <span><b>הדגשת קישורים</b><small>קו תחתון ברור לכל הקישורים</small></span>
              <input type="checkbox" checked={prefs.underlineLinks} onChange={toggle("underlineLinks")} /><i aria-hidden="true"></i>
            </label>
            <label className="site-switch-row">
              <span><b>הפחתת אנימציות</b><small>עצירת תנועה ומעברים שאינם חיוניים</small></span>
              <input type="checkbox" checked={prefs.reduceMotion} onChange={toggle("reduceMotion")} /><i aria-hidden="true"></i>
            </label>
          </div>
          <footer>
            <a href="/accessibility">להצהרת הנגישות</a>
            <button className="accessibility-reset" type="button" onClick={() => setPrefs({ ...DEFAULT_PREFS })}>
              איפוס הגדרות
            </button>
          </footer>
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/AccessibilityWidget.tsx
git commit -m "Add accessibility preferences widget"
```

---

## Task 10: Cookie consent

**Files:**
- Create: `app/components/CookieConsent.tsx`

**Interfaces:**
- Produces: `<CookieConsent />`, mounted once in the root layout (Task 11).

- [ ] **Step 1: Create `app/components/CookieConsent.tsx`**

Ported from `app.js`'s `initCookieConsent` (lines 180-248):

```tsx
"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "htc-israel-cookie-consent-v1";

interface CookiePrefs {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const DEFAULT_PREFS: CookiePrefs = {
  necessary: true,
  functional: true,
  analytics: false,
  marketing: false,
};

function readStored(): CookiePrefs | null {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return stored && typeof stored === "object" ? { ...DEFAULT_PREFS, ...stored } : null;
  } catch {
    return null;
  }
}

function updateGoogleConsent(prefs: CookiePrefs) {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("consent", "update", {
    security_storage: "granted",
    functionality_storage: prefs.functional ? "granted" : "denied",
    personalization_storage: prefs.functional ? "granted" : "denied",
    analytics_storage: prefs.analytics ? "granted" : "denied",
    ad_storage: prefs.marketing ? "granted" : "denied",
    ad_user_data: prefs.marketing ? "granted" : "denied",
    ad_personalization: prefs.marketing ? "granted" : "denied",
  });
}

export default function CookieConsent() {
  const [hydrated, setHydrated] = useState(false);
  const [saved, setSaved] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>(DEFAULT_PREFS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draft, setDraft] = useState<CookiePrefs>(DEFAULT_PREFS);

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setPrefs(stored);
      setSaved(true);
      updateGoogleConsent(stored);
    }
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const save = (next: Partial<CookiePrefs>) => {
    const merged: CookiePrefs = { ...DEFAULT_PREFS, ...next, necessary: true };
    setPrefs(merged);
    setSaved(true);
    setDialogOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {}
    updateGoogleConsent(merged);
  };

  const openDialog = () => {
    setDraft(prefs);
    setDialogOpen(true);
  };

  return (
    <div className="cookie-consent">
      {saved && (
        <button className="site-control cookie-consent__trigger" type="button" aria-label="פתיחת הגדרות עוגיות" onClick={openDialog}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14M5 16h14"/><circle cx="9" cy="8" r="2"/><circle cx="15" cy="16" r="2"/></svg>
        </button>
      )}
      {!saved && (
        <aside className="cookie-consent__banner" aria-labelledby="cookieBannerTitle">
          <small>הפרטיות שלכם</small>
          <h2 id="cookieBannerTitle">אתם שולטים בעוגיות</h2>
          <p>אנחנו משתמשים בעוגיות חיוניות להפעלת האתר. עוגיות נוספות יופעלו רק לפי הבחירה שלכם.</p>
          <a href="/privacy">למדיניות הפרטיות</a>
          <div>
            <button type="button" onClick={() => save({ functional: true, analytics: true, marketing: true })}>קבל הכול</button>
            <button type="button" onClick={() => save({ functional: false, analytics: false, marketing: false })}>חיוניות בלבד</button>
            <button type="button" onClick={openDialog}>ניהול העדפות</button>
          </div>
        </aside>
      )}
      <div className="site-dialog-backdrop" hidden={!dialogOpen} onClick={(e) => { if (e.target === e.currentTarget) setDialogOpen(false); }}>
        <section className="site-dialog cookie-consent__dialog" role="dialog" aria-modal="true" aria-labelledby="cookieDialogTitle">
          <header>
            <div><small>HTC ISRAEL · PRIVACY</small><h2 id="cookieDialogTitle">ניהול העדפות עוגיות</h2></div>
            <button className="site-dialog__close" type="button" aria-label="סגירת הגדרות עוגיות" onClick={() => setDialogOpen(false)}>×</button>
          </header>
          <div className="site-dialog__body">
            <label className="site-switch-row">
              <span><b>עוגיות חיוניות</b><small>נדרשות לפעולת האתר, הסל והעדפות האבטחה</small></span>
              <input type="checkbox" checked disabled /><i aria-hidden="true"></i>
            </label>
            <label className="site-switch-row">
              <span><b>עוגיות פונקציונליות</b><small>זוכרות בחירות ומשפרות את חוויית השימוש</small></span>
              <input type="checkbox" checked={draft.functional} onChange={(e) => setDraft((d) => ({ ...d, functional: e.target.checked }))} /><i aria-hidden="true"></i>
            </label>
            <label className="site-switch-row">
              <span><b>עוגיות אנליטיות</b><small>מסייעות להבין כיצד משתמשים באתר</small></span>
              <input type="checkbox" checked={draft.analytics} onChange={(e) => setDraft((d) => ({ ...d, analytics: e.target.checked }))} /><i aria-hidden="true"></i>
            </label>
            <label className="site-switch-row">
              <span><b>עוגיות שיווקיות</b><small>מאפשרות מדידה והתאמה של מסרים שיווקיים</small></span>
              <input type="checkbox" checked={draft.marketing} onChange={(e) => setDraft((d) => ({ ...d, marketing: e.target.checked }))} /><i aria-hidden="true"></i>
            </label>
          </div>
          <footer>
            <button className="cookie-consent__necessary" type="button" onClick={() => save({ functional: false, analytics: false, marketing: false })}>
              חיוניות בלבד
            </button>
            <button className="cookie-consent__save" type="button" onClick={() => save(draft)}>שמירת הבחירה</button>
          </footer>
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/CookieConsent.tsx
git commit -m "Add cookie consent banner and preferences dialog"
```

---

## Task 11: Cart panel, toast, and root layout wiring

**Files:**
- Create: `app/components/Cart.tsx`
- Create: `app/components/CartToast.tsx`
- Modify: `app/layout.tsx` (replace Task 1's placeholder with the real root layout)

**Interfaces:**
- Consumes: `useCart()`, `FREE_SHIPPING_THRESHOLD` from Task 5; `CartProvider` from Task 5; `ScrollReveal` from Task 6; `IconSprite` from Task 4; `AccessibilityWidget` from Task 9; `CookieConsent` from Task 10; `WhatsAppButton` from Task 7.
- Produces: global chrome mounted on every page via the root layout — cart slide-out, cart toast, accessibility widget, cookie banner, floating WhatsApp button, icon sprite, scroll-reveal, skip link.

- [ ] **Step 1: Create `app/components/Cart.tsx`**

Ported from the `<aside class="cart">` markup (`index.html` lines 167-172) and `app.js`'s `renderCart` (lines 427-469):

```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, FREE_SHIPPING_THRESHOLD } from "../context/CartContext";

export default function Cart() {
  const { items, total, count, isPanelOpen, closePanel, removeItem, updateQuantity } = useCart();
  const router = useRouter();

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  const percent = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <>
      <aside className={`cart${isPanelOpen ? " is-open" : ""}`} aria-hidden={!isPanelOpen} aria-label="סל קניות">
        <div className="cart__head">
          <div>
            <small>{count ? `${count} ${count === 1 ? "פריט" : "פריטים"} בסל` : "הבחירה שלכם"}</small>
            <h2>סל הקניות</h2>
          </div>
          <button onClick={closePanel} aria-label="סגירת הסל">×</button>
        </div>
        <div className="cart__items">
          {items.length === 0 ? (
            <div className="cart__empty">
              <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg></span>
              <h3>הסל מחכה לבחירה שלכם</h3>
              <p>מצאו את מכשיר הטיפוח שמתאים בדיוק לשגרה שלכם.</p>
              <Link href="/shop" onClick={closePanel}>לכל הדגמים <b>←</b></Link>
            </div>
          ) : (
            items.map((item) => (
              <article className="cart-item" key={item.id}>
                <div className="cart-item__thumb">
                  {item.image ? <img src={item.image} alt="" /> : "HTC"}
                </div>
                <div className="cart-item__content">
                  <span>HTC ישראל · יבואן רשמי</span>
                  <h3>{item.name}</h3>
                  <small>₪{item.price}</small>
                  <div className="cart-item__quantity">
                    <button aria-label="הפחתת כמות" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <b>{item.quantity}</b>
                    <button aria-label="הגדלת כמות" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="cart-item__remove" aria-label={`הסרת ${item.name}`} onClick={() => removeItem(item.id)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>
                </button>
              </article>
            ))
          )}
        </div>
        <div className="cart__foot" hidden={items.length === 0}>
          <div className="shipping-progress">
            <p>{remaining ? <>נשארו <b>₪{remaining}</b> למשלוח חינם</> : <b>הרווחתם משלוח חינם</b>}</p>
            <i><span style={{ width: `${percent}%` }}></span></i>
          </div>
          <div>
            <span>סה״כ</span>
            <b>₪{total}</b>
          </div>
          <button type="button" onClick={() => { closePanel(); router.push("/cart"); }}>
            להמשך ההזמנה <span>←</span>
          </button>
          <small>משלוח חינם בקנייה מעל ₪{FREE_SHIPPING_THRESHOLD}</small>
        </div>
      </aside>
      <button className="scrim" aria-label="סגירה" hidden={!isPanelOpen} onClick={closePanel}></button>
    </>
  );
}
```

- [ ] **Step 2: Create `app/components/CartToast.tsx`**

Generalizes `app.js`'s `showCartConfirmation`/remove-undo toast (lines 366-416) into one component driven by `CartContext`'s `toast` state:

```tsx
"use client";

import { useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function CartToast() {
  const { toast, dismissToast } = useCart();

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(dismissToast, 3200);
    return () => window.clearTimeout(timer);
  }, [toast, dismissToast]);

  if (!toast) return null;

  return (
    <div className="toast is-visible" role="status" aria-live="polite">
      <span>{toast.message}</span>
      {toast.actionLabel && toast.onAction && (
        <button
          type="button"
          onClick={() => {
            toast.onAction?.();
            dismissToast();
          }}
        >
          {toast.actionLabel}
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Replace `app/layout.tsx` with the real root layout**

```tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import IconSprite from "./components/IconSprite";
import Cart from "./components/Cart";
import CartToast from "./components/CartToast";
import AccessibilityWidget from "./components/AccessibilityWidget";
import CookieConsent from "./components/CookieConsent";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollReveal from "./components/ScrollReveal";

export const metadata: Metadata = {
  title: "HTC ישראל | מכונות תספורת וגילוח",
  description: "HTC ישראל — מכונות תספורת, טרימרים ומכונות גילוח עם אחריות ושירות בישראל.",
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#11110f",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <a className="skip-link" href="#main">דלגו לתוכן</a>
        <CartProvider>
          {children}
          <Cart />
          <CartToast />
        </CartProvider>
        <AccessibilityWidget />
        <CookieConsent />
        <WhatsAppButton />
        <IconSprite />
        <ScrollReveal />
      </body>
    </html>
  );
}
```

Note: every page created in later tasks must give its top-level `<main>` element `id="main"` so the skip-link target resolves.

- [ ] **Step 4: Verify**

Run: `npm run dev`, open `http://localhost:3004`.
Expected: page renders (still the Task 1 placeholder `<main>HTC ישראל</main>` — add `id="main"` to it now so the skip link doesn't 404-anchor), floating WhatsApp button visible bottom-corner, accessibility icon and cookie banner visible, no console errors about `useCart` being used outside a provider. Open the accessibility dialog and cookie dialog and confirm both open/close correctly. Stop the dev server after confirming.

- [ ] **Step 5: Update the placeholder home page's `<main>` to carry the skip-link anchor**

In `app/page.tsx`, change `<main>HTC ישראל</main>` to `<main id="main">HTC ישראל</main>` (this file is fully replaced in Task 15 anyway, but keep it consistent in the meantime).

- [ ] **Step 6: Commit**

```bash
git add app/components/Cart.tsx app/components/CartToast.tsx app/layout.tsx app/page.tsx
git commit -m "Wire cart panel, toast, and global chrome into root layout"
```

---

## Task 12: Product data — categories, fallback catalog, editorial content

**Files:**
- Create: `lib/categories.ts`
- Create: `lib/products-data.ts`
- Create: `lib/product-content.ts`

**Interfaces:**
- Produces: `Category { id, name, slug }` and `categories: Category[]`; `StoreProduct { id, handle, name, price, badge?, image, images: string[], cardFeatures: string[], category: Category, categoryOrder, gtin }` and `products: StoreProduct[]`; `ProductContent { subtitle, description, compareAtPrice, notes: string[], specs: [string,string][], boxContents, powerInfo, story: { eyebrow, headline, body, benefits: [string,string][] } }`, `productContent: Record<string, ProductContent>` keyed by handle, and `WARRANTY_FAQ_ANSWER: string`.
- Consumed by: `lib/products.ts` (Task 13, fallback), `ProductCard` (Task 14), home/shop/product-detail/compare pages (Tasks 15-18).

- [ ] **Step 1: Create `lib/categories.ts`**

```ts
export interface Category {
  id: string;
  name: string;
  slug: string;
}

export const categories: Category[] = [
  { id: "cat-clipper", name: "מכונות תספורת", slug: "clipper" },
  { id: "cat-trimmer", name: "טרימרים", slug: "trimmer" },
  { id: "cat-shaver", name: "מגלחים", slug: "shaver" },
];
```

- [ ] **Step 2: Create `lib/products-data.ts`**

This is the CRM-shaped fallback catalog, used when the CRM is unreachable or returns no products (Task 13). Data ported from `dist/client/index.html`'s product cards and `dist/client/product-catalog.json`:

```ts
import { categories } from "./categories";

export interface StoreProduct {
  id: string;
  handle: string;
  name: string;
  price: number;
  badge?: string;
  image: string;
  images: string[];
  cardFeatures: string[];
  category: (typeof categories)[number];
  categoryOrder: number;
  gtin: string;
}

const [clipper, trimmer, shaver] = categories;

export const products: StoreProduct[] = [
  {
    id: "at-799",
    handle: "at-799",
    name: "HTC One Pro",
    price: 349,
    badge: "דגם הדגל",
    image: "/assets/products/at-799-single.jpg",
    images: [
      "/assets/products/at-799-single.jpg",
      "/assets/barbershop/at-799-barbershop.jpg",
      "/assets/barbershop/at-799-action.jpg",
    ],
    cardFeatures: ["9,000 סל״ד", "להב DLC", "עד 360 דקות"],
    category: clipper,
    categoryOrder: 1,
    gtin: "6971864102077",
  },
  {
    id: "at-599",
    handle: "at-599",
    name: "HTC Edge",
    price: 199,
    badge: "להב T חד",
    image: "/assets/products/at-599-official-clean.jpg",
    images: [
      "/assets/products/at-599-official-clean.jpg",
      "/assets/barbershop/at-599-barbershop.jpg",
      "/assets/barbershop/at-599-action-v2.png",
    ],
    cardFeatures: ["להב T", "מסך דיגיטלי", "4 מסרקים"],
    category: trimmer,
    categoryOrder: 1,
    gtin: "6971864102084",
  },
  {
    id: "at-158",
    handle: "at-158",
    name: "HTC Start",
    price: 129,
    badge: "למשפחה",
    image: "/assets/products/at-158-single-v2.png",
    images: [
      "/assets/products/at-158-single-v2.png",
      "/assets/barbershop/at-158-barbershop.jpg",
      "/assets/barbershop/at-158-action-v2.jpg",
    ],
    cardFeatures: ["4 מסרקים", "טעינת USB", "לכל המשפחה"],
    category: clipper,
    categoryOrder: 2,
    gtin: "6971864101933",
  },
  {
    id: "at-735",
    handle: "at-735",
    name: "HTC One Plus",
    price: 279,
    badge: "גוף מתכת מלא",
    image: "/assets/products/at-735-single-v2.png",
    images: [
      "/assets/products/at-735-single-v2.png",
      "/assets/barbershop/at-735-barbershop.jpg",
      "/assets/barbershop/at-735-action.jpg",
    ],
    cardFeatures: ["גוף מתכת", "מסך דיגיטלי", "5 מסרקים"],
    category: clipper,
    categoryOrder: 3,
    gtin: "6971864102039",
  },
  {
    id: "at-570",
    handle: "at-570",
    name: "HTC Trio",
    price: 149,
    badge: "להב T",
    image: "/assets/products/at-570-single-v2.png",
    images: [
      "/assets/products/at-570-single-v2.png",
      "/assets/barbershop/at-570-barbershop.jpg",
      "/assets/barbershop/at-570-action.jpg",
    ],
    cardFeatures: ["להב T", "מסרקי 1/2/3 מ״מ", "בסיס כלול"],
    category: trimmer,
    categoryOrder: 2,
    gtin: "6971864100592",
  },
  {
    id: "gt-667",
    handle: "gt-667",
    name: "HTC Glide",
    price: 169,
    badge: "2 ראשים",
    image: "/assets/products/gt-667-single-v2.png",
    images: [
      "/assets/products/gt-667-single-v2.png",
      "/assets/barbershop/gt-667-barbershop.jpg",
      "/assets/barbershop/gt-667-action.jpg",
    ],
    cardFeatures: ["2 ראשי גילוח", "גימור נקי", "ניקוי קל"],
    category: shaver,
    categoryOrder: 1,
    gtin: "6971864103166",
  },
];
```

- [ ] **Step 3: Create `lib/product-content.ts`**

Non-CRM editorial content (subtitle, long description, compare-at price, spec table, box contents, power/charging blurb, and per-model "story" section), ported from `dist/client/product-page.js`'s `catalog`, `productSpecs`, `powerInfo`, `productStories`, and `regularPrices` objects, keyed by handle:

```ts
export interface ProductContent {
  subtitle: string;
  description: string;
  compareAtPrice: number;
  notes: string[];
  specs: [string, string][];
  boxContents: string;
  powerInfo: string;
  story: {
    eyebrow: string;
    headline: string;
    body: string;
    benefits: [string, string][];
  };
}

export const productContent: Record<string, ProductContent> = {
  "at-799": {
    subtitle: "מכונת תספורת מקצועית עם מסך LCD",
    description: "מנוע ללא פחמים במהירות 9,000 סל״ד, להב קבוע בציפוי DLC ועד 360 דקות עבודה.",
    compareAtPrice: 399,
    notes: ["9,000 סל״ד", "עד 360 דקות", "10 מסרקים"],
    specs: [
      ["סוג", "מכונת תספורת מקצועית"],
      ["מנוע", "ללא פחמים · 9,000 סל״ד"],
      ["מערכת חיתוך", "להב קרמי נע ולהב קבוע בציפוי DLC"],
      ["סוללה", "3,000mAh"],
      ["טעינה", "כ־4 שעות · USB‑C"],
      ["זמן עבודה", "עד 360 דקות"],
      ["תצוגה", "מסך LCD"],
      ["מסרקים", "10 מידות · 1.5–25 מ״מ"],
    ],
    boxContents: "10 מסרקים: 1.5, 3, 4.5, 6, 10, 13, 16, 19, 22 ו־25 מ״מ; בקבוק שמן, כבל USB, מברשת ניקוי ומדריך שימוש.",
    powerInfo: "טעינה מלאה נמשכת כ־4 שעות ומספקת עד 360 דקות עבודה, לפי מפרט הספק.",
    story: {
      eyebrow: "HTC PROFESSIONAL · מכונת הדגל",
      headline: "נבנתה ליום עבודה מלא",
      body: "עוצמה יציבה, זמן עבודה ארוך ושליטה ברורה בכל מעבר. HTC One Pro מיועדת לספרים שצריכים כלי אמין מתחילת היום ועד הלקוח האחרון.",
      benefits: [
        ["קצב מקצועי", "9,000 סל״ד לעבודה רציפה"],
        ["חיתוך מדויק", "להב DLC לתנועה חלקה ומבוקרת"],
        ["פחות עצירות", "עד 360 דקות עבודה בין טעינות"],
        ["שליטה ברורה", "מסך LCD לקריאה מהירה"],
        ["שירות בישראל", "12 חודשי אחריות יבואן רשמי"],
      ],
    },
  },
  "at-735": {
    subtitle: "מכונת תספורת מקצועית בגוף מתכת מלא",
    description: "שתי מהירויות של 7,000 ו־8,000 סל״ד, סוללת 3,000mAh, מסך LCD ועד 240 דקות עבודה.",
    compareAtPrice: 329,
    notes: ["גוף מתכת מלא", "עד 240 דקות", "5 מסרקים"],
    specs: [
      ["סוג", "מכונת תספורת מקצועית"],
      ["מבנה", "גוף מתכת מלא"],
      ["מנוע", "7,000 / 8,000 סל״ד"],
      ["מערכת חיתוך", "להב קרמי נע ולהב פלדת אבקה"],
      ["סוללה", "3,000mAh"],
      ["טעינה ועבודה", "כ־3.5 שעות טעינה · עד 240 דקות עבודה"],
      ["תצוגה", "מסך LCD · טעינת USB‑C"],
      ["מסרקים", "5 מידות · 3/6/10/13/16 מ״מ"],
    ],
    boxContents: "5 מסרקים: 3, 6, 10, 13 ו־16 מ״מ; בקבוק שמן, כבל USB, מברשת ניקוי ומדריך שימוש.",
    powerInfo: "טעינה מלאה נמשכת כ־3.5 שעות ומספקת עד 240 דקות עבודה, לפי מפרט הספק.",
    story: {
      eyebrow: "HTC PROFESSIONAL · גוף מתכת",
      headline: "מתכת ביד. שליטה בכל מעבר.",
      body: "HTC One Plus משלבת תחושה מוצקה, איזון נוח ומסך דיגיטלי ברור—לספרים שמעריכים כלי עבודה מדויק ונוכח.",
      benefits: [
        ["בנויה לעבודה", "גוף מתכת יציב ומאוזן ביד"],
        ["שליטה ברורה", "מסך דיגיטלי לקריאה מהירה"],
        ["מעבר חלק", "להב רחב לתנועה נקייה בשיער"],
        ["חמש מידות", "מסרקים למעברים מדורגים"],
        ["שירות בישראל", "12 חודשי אחריות יבואן רשמי"],
      ],
    },
  },
  "at-599": {
    subtitle: "טרימר מדויק לזקן ולקווי מתאר",
    description: "להב T חד, מערכת חיתוך קרמית, מסך LCD ועד 200 דקות עבודה.",
    compareAtPrice: 239,
    notes: ["עד 200 דקות", "מסך LCD", "4 מסרקים"],
    specs: [
      ["סוג", "טרימר לקווים ולגימור"],
      ["מערכת חיתוך", "להב קרמי נע ולהב פלדת אבקה"],
      ["מנוע", "מנוע 280# עם הגנת זעזועים"],
      ["סוללה", "2,000mAh"],
      ["טעינה", "כ־2.5 שעות · USB‑C"],
      ["זמן עבודה", "עד 200 דקות"],
      ["תצוגה", "מסך LCD בעיצוב שעון"],
      ["מסרקים", "4 מידות · 1.5/3/6/9 מ״מ"],
    ],
    boxContents: "4 מסרקים: 1.5, 3, 6 ו־9 מ״מ; בקבוק שמן, כבל USB, מברשת ניקוי ומדריך שימוש.",
    powerInfo: "טעינה מלאה נמשכת כ־2.5 שעות ומספקת עד 200 דקות עבודה, לפי מפרט הספק.",
    story: {
      eyebrow: "HTC DETAIL · להב T",
      headline: "קווים חדים מתחילים בשליטה",
      body: "HTC Edge מיועד לקווי מתאר, זקן וגימור מדויק. להב T פתוח ומבנה מאוזן מעניקים שליטה טובה גם בפרטים הקטנים.",
      benefits: [
        ["להב T חד", "לעבודה קרובה ומדויקת"],
        ["שליטה ביד", "מבנה מאוזן לקווי מתאר ולגימור"],
        ["מידע בזמן אמת", "מסך דיגיטלי ברור"],
        ["ארבע מידות", "מסרקים לעבודה מדורגת"],
        ["שירות בישראל", "12 חודשי אחריות יבואן רשמי"],
      ],
    },
  },
  "at-570": {
    subtitle: "טרימר גימור עם 3 מסרקי הגבהה",
    description: "להב T לעבודת קווים וגימור, שלושה מסרקים ובסיס אחסון כלול.",
    compareAtPrice: 179,
    notes: ["להב T", "3 מסרקים", "בסיס כלול"],
    specs: [
      ["סוג", "טרימר גימור עם להב T"],
      ["מסרקים", "3 מידות · 1/2/3 מ״מ"],
      ["בסיס", "בסיס אחסון כלול"],
      ["טעינה", "כבל USB כלול"],
      ["תחזוקה", "שמן ומברשת ניקוי"],
      ["שימוש", "קווים, זקן וגימור"],
      ["תיעוד", "מדריך שימוש כלול"],
      ["מקור הנתון", "מסמכי ההזמנה ותכולת האריזה"],
    ],
    boxContents: "3 מסרקים: 1, 2 ו־3 מ״מ; בסיס, בקבוק שמן, כבל USB, מברשת ניקוי ומדריך שימוש.",
    powerInfo: "כבל USB כלול. זמן הטעינה וזמן העבודה אינם מצוינים במסמכי הספק המאושרים; יש לפעול לפי מדריך השימוש המצורף.",
    story: {
      eyebrow: "HTC DETAIL · להב T",
      headline: "שלוש מידות. גימור מדויק.",
      body: "HTC Trio הוא טרימר להב T לקווי מתאר, לזקן ולגימור. שלושת מסרקי ההגבהה ובסיס האחסון שומרים את כל מה שצריך מסודר ונגיש.",
      benefits: [
        ["להב T", "לקווי מתאר, לזקן ולגימור"],
        ["שלוש מידות", "מסרקי 1, 2 ו־3 מ״מ"],
        ["בסיס כלול", "אחסון מסודר בין שימושים"],
        ["תחזוקה פשוטה", "שמן ומברשת ניקוי באריזה"],
        ["שירות בישראל", "12 חודשי אחריות יבואן רשמי"],
      ],
    },
  },
  "gt-667": {
    subtitle: "מגלח חשמלי עם 2 ראשי גילוח",
    description: "מערכת גילוח כפולה לגימור קרוב וניקוי קווי פנים וצוואר.",
    compareAtPrice: 199,
    notes: ["2 ראשי גילוח", "כיסוי הגנה", "מברשת ניקוי"],
    specs: [
      ["סוג", "מגלח חשמלי"],
      ["מערכת גילוח", "2 ראשי גילוח"],
      ["הגנה", "כיסוי ראש כלול"],
      ["תחזוקה", "מברשת ניקוי כלולה"],
      ["חיבור", "כבל מתח כלול"],
      ["שימוש", "פנים, צוואר וגימור קווים"],
      ["תיעוד", "מדריך שימוש כלול"],
      ["מקור הנתון", "מסמכי ההזמנה ותכולת האריזה"],
    ],
    boxContents: "מגלח HTC Glide, כיסוי הגנה, כבל מתח, מברשת ניקוי ומדריך שימוש.",
    powerInfo: "כבל מתח כלול. זמן העבודה אינו מצוין במסמכי הספק המאושרים; יש לפעול לפי מדריך השימוש המצורף.",
    story: {
      eyebrow: "HTC SHAVE · שני ראשי גילוח",
      headline: "הדרך הקצרה למראה חלק.",
      body: "HTC Glide נע בנוחות לאורך הפנים והצוואר ומעניק גימור נקי ומהיר. שני ראשי הגילוח הופכים את הטיפוח היומיומי לפשוט ומדויק.",
      benefits: [
        ["שני ראשי גילוח", "לכיסוי יעיל בכל מעבר"],
        ["גימור נקי", "תנועה נוחה לאורך הפנים והצוואר"],
        ["שימוש יומיומי", "הפעלה פשוטה וגימור מהיר"],
        ["תחזוקה קלה", "מברשת ניקוי לשמירה על הביצועים"],
        ["שירות בישראל", "12 חודשי אחריות יבואן רשמי"],
      ],
    },
  },
  "at-158": {
    subtitle: "מכונת תספורת ביתית למשפחה",
    description: "טבעת כיוון אורך, מסך דיגיטלי וארבעה מסרקי הגבהה לשימוש ביתי נוח.",
    compareAtPrice: 159,
    notes: ["כיוון 0.8–2.5 מ״מ", "מסך דיגיטלי", "4 מסרקים"],
    specs: [
      ["סוג", "מכונת תספורת ביתית"],
      ["כיוון אורך", "טבעת כיוון 0.8–2.5 מ״מ"],
      ["תצוגה", "מסך דיגיטלי"],
      ["מסרקים", "4 מידות · 1.5/3/6/9 מ״מ"],
      ["טעינה", "כבל USB כלול"],
      ["תחזוקה", "שמן ומברשת ניקוי"],
      ["שימוש", "בית ומשפחה"],
      ["מקור הנתון", "צילום היצרן ותכולת האריזה"],
    ],
    boxContents: "4 מסרקים: 1.5, 3, 6 ו־9 מ״מ; בקבוק שמן, כבל USB, מברשת ניקוי ומדריך שימוש.",
    powerInfo: "כבל USB כלול. זמן הטעינה וזמן העבודה אינם מצוינים במסמכי הספק המאושרים; יש לפעול לפי מדריך השימוש המצורף.",
    story: {
      eyebrow: "HTC HOME · הבחירה המשפחתית",
      headline: "תספורת טובה מתחילה בפשטות.",
      body: "HTC Start הופכת תספורת ביתית למשימה ברורה ונוחה—עם ארבע מידות שימושיות, טעינה פשוטה ומבנה שקל להחזיק.",
      benefits: [
        ["פשוט להתחיל", "הפעלה ברורה לשימוש ביתי"],
        ["לכל המשפחה", "ארבע מידות חיתוך שימושיות"],
        ["נוחה ביד", "מבנה מאוזן לשליטה טובה"],
        ["טעינה פשוטה", "חיבור USB נגיש ונוח"],
        ["שירות בישראל", "12 חודשי אחריות יבואן רשמי"],
      ],
    },
  },
};

export const WARRANTY_FAQ_ANSWER =
  "12 חודשי אחריות יבואן רשמי על פגמי ייצור, ממועד מסירת המוצר ובכפוף לתעודת האחריות. השירות ניתן בישראל דרך שירות הלקוחות.";
```

- [ ] **Step 4: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors (this catches any mismatch between `Category`/`StoreProduct`/`ProductContent` field names used here and in later tasks).

- [ ] **Step 5: Commit**

```bash
git add lib/categories.ts lib/products-data.ts lib/product-content.ts
git commit -m "Add category, fallback product catalog, and editorial content data"
```

---

## Task 13: CRM product/category fetch with fallback

**Files:**
- Create: `lib/products.ts`

**Interfaces:**
- Consumes: `products`/`StoreProduct` and `categories`/`Category` from Task 12.
- Produces: `getProducts(): Promise<StoreProduct[]>`, `getCategories(): Promise<Category[]>`, `getProductByHandle(handle: string): Promise<StoreProduct | undefined>`. Consumed by every page that lists or looks up products (Tasks 15-19).

- [ ] **Step 1: Create `lib/products.ts`**

Follows the resilience pattern documented in `B2BCRM/docs/adding-new-sites.md` §5 and mirrored from `xvape/lib/products.ts` — fetch the public CRM endpoint, fall back to local static data on any failure or empty response:

```ts
import { products as fallbackProducts, type StoreProduct } from "./products-data";
import { categories as fallbackCategories, type Category } from "./categories";

const CRM_URL = process.env.CRM_URL!;
const SITE_SLUG = process.env.CRM_SITE_SLUG!;

interface CrmProduct {
  id: string;
  handle: string;
  name: string;
  price: number;
  badge?: string | null;
  image?: string | null;
  images?: string[];
  cardFeatures?: string[];
  category?: { id: string; name: string; slug: string } | null;
  categoryOrder?: number;
  gtin?: string | null;
}

export async function getProducts(): Promise<StoreProduct[]> {
  try {
    const res = await fetch(`${CRM_URL}/api/${SITE_SLUG}/products`, { next: { revalidate: 60 } });
    if (!res.ok) return fallbackProducts;
    const data: CrmProduct[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) return fallbackProducts;
    return data.map((p) => ({
      id: p.id,
      handle: p.handle,
      name: p.name,
      price: p.price,
      badge: p.badge ?? undefined,
      image: p.image ?? p.images?.[0] ?? "",
      images: p.images ?? (p.image ? [p.image] : []),
      cardFeatures: p.cardFeatures ?? [],
      category: p.category ?? fallbackCategories[0],
      categoryOrder: p.categoryOrder ?? 0,
      gtin: p.gtin ?? "",
    }));
  } catch {
    return fallbackProducts;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${CRM_URL}/api/${SITE_SLUG}/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return fallbackCategories;
    const data: Category[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) return fallbackCategories;
    return data;
  } catch {
    return fallbackCategories;
  }
}

export async function getProductByHandle(handle: string): Promise<StoreProduct | undefined> {
  const products = await getProducts();
  return products.find((p) => p.handle === handle);
}
```

- [ ] **Step 2: Verify against the fallback path**

Run: `npx tsc --noEmit`
Expected: no type errors.

With no `.env.local` yet (created in Task 20), `CRM_URL`/`CRM_SITE_SLUG` are undefined, so `fetch` throws and every call falls back to local data — this is the expected, deliberately resilient behavior and will be exercised for real once a page calls these functions (Task 15).

- [ ] **Step 3: Commit**

```bash
git add lib/products.ts
git commit -m "Add CRM product/category fetch with static fallback"
```

---

## Task 14: ProductCard component

**Files:**
- Create: `app/components/ProductCard.tsx`

**Interfaces:**
- Consumes: `useCart()` (Task 5), `productContent` (Task 12), `StoreProduct` (Task 12).
- Produces: `<ProductCard product={StoreProduct} featured?: boolean />`. Consumed by the home page (Task 15), shop page (Task 16), and compare page's related-model cards (Task 18).

- [ ] **Step 1: Create `app/components/ProductCard.tsx`**

Ported from `dist/client/index.html`'s product card markup (lines 95-118) and `app.js`'s discount-price rendering (lines 303-322), with `premium-commerce.css`'s `.price-offer__*` classes:

```tsx
"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";
import { productContent } from "../../lib/product-content";
import type { StoreProduct } from "../../lib/products-data";

export default function ProductCard({ product, featured = false }: { product: StoreProduct; featured?: boolean }) {
  const { addItem } = useCart();
  const content = productContent[product.handle];
  const compareAtPrice = content?.compareAtPrice;
  const discount = compareAtPrice ? Math.round(((compareAtPrice - product.price) / compareAtPrice) * 100) : 0;
  const savings = compareAtPrice ? compareAtPrice - product.price : 0;

  return (
    <article className={`product-card${featured ? " product-card--feature" : ""}`} data-category={product.category.slug}>
      <div className="product-card__media">
        {product.badge && <span className="tag">{product.badge}</span>}
        <img className="product-shot" src={product.image} loading="lazy" decoding="async" alt={product.name} />
      </div>
      <div className="product-card__body">
        <div>
          <small>{product.id.toUpperCase()} · {product.category.name}</small>
          <h3>{product.name}</h3>
          <p className="product-card__features">{product.cardFeatures.join(" · ")}</p>
        </div>
        <div className="product-card__price">
          {compareAtPrice ? (
            <>
              <div className="price-offer__top"><span>מחיר השקה</span><b>{discount}% הנחה</b></div>
              <div className="price-offer__main">
                <strong><sup>₪</sup>{product.price}</strong>
                <div><del>₪{compareAtPrice}</del><small>חיסכון של ₪{savings}</small></div>
              </div>
              <p>כולל מע״מ</p>
            </>
          ) : (
            <>
              <span>מחיר השקה</span>
              <strong>₪{product.price}</strong>
            </>
          )}
        </div>
        <p className="product-card__warranty">12 חודשי אחריות יבואן רשמי</p>
        <div className="product-card__bottom">
          <b className="availability is-in-stock">במלאי</b>
          <button
            className="add-button"
            type="button"
            onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image })}
          >
            הוספה לסל <span aria-hidden="true">+</span>
          </button>
          <Link className={`card-link${featured ? " card-link--gold" : ""}`} href={`/shop/${product.handle}`}>
            לפרטים
          </Link>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/components/ProductCard.tsx
git commit -m "Add ProductCard component with discount pricing"
```

---

## Task 15: Home page

**Files:**
- Modify: `app/page.tsx` (replace Task 1's placeholder)

**Interfaces:**
- Consumes: `getProducts()` (Task 13), `Navbar`/`Footer`/`UtilityBar`/`ProductCard` (Tasks 7, 8, 14).
- Produces: `/` — the full home page, an async server component.

- [ ] **Step 1: Replace `app/page.tsx`**

Ported from `dist/client/index.html` lines 14-165 (skipping the utility bar, cart aside, toast, and SVG sprite, which are now global chrome from Task 11, and the mobile menu markup, now inside `Navbar`):

```tsx
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UtilityBar from "./components/UtilityBar";
import ProductCard from "./components/ProductCard";
import { getProducts } from "../lib/products";

export default async function HomePage() {
  const products = await getProducts();
  const featured = products.find((p) => p.handle === "at-799") ?? products[0];

  return (
    <>
      <UtilityBar />
      <Navbar />
      <main id="main">
        <section className="hero">
          <div className="hero__texture"></div>
          <div className="shell hero__grid">
            <div className="hero__copy">
              <p className="kicker">HTC</p>
              <h1>מכונות תספורת וגילוח<br /><em>שנבנו לביצועים</em></h1>
              <p className="hero__lead"><strong>תוצאה חדה ומדויקת.</strong><br />ביצועים מקצועיים עם אחריות בישראל.</p>
              <div className="hero__actions">
                <a className="button button--gold" href="#products">לכל הדגמים <span>←</span></a>
                <Link className="button button--ghost" href="/compare">השוואת דגמים</Link>
              </div>
            </div>
            <div className="hero__visual" role="img" aria-label="מכונת תספורת מקצועית HTC בסביבת ברברשופ"></div>
          </div>
        </section>

        <section className="benefits" id="benefits" aria-label="יתרונות מוצר">
          <div className="shell benefits__grid">
            <article><span>01</span><svg aria-hidden="true"><use href="#icon-blade"/></svg><div><h3>להבים איכותיים</h3><p>חיתוך חד ומדויק בכל פעם</p></div></article>
            <article><span>02</span><svg aria-hidden="true"><use href="#icon-grip"/></svg><div><h3>אחיזה נוחה</h3><p>שליטה מלאה ובטוחה</p></div></article>
            <article><span>03</span><svg aria-hidden="true"><use href="#icon-battery"/></svg><div><h3>זמן עבודה ממושך</h3><p>פחות טעינות, יותר שימוש</p></div></article>
            <article><span>04</span><svg aria-hidden="true"><use href="#icon-motor"/></svg><div><h3>מנוע עוצמתי</h3><p>עבודה חלקה ללא מאמץ</p></div></article>
            <article><span>05</span><svg aria-hidden="true"><use href="#icon-shield"/></svg><div><h3>אחריות יבואן רשמי</h3><p>שירות ותמיכה בישראל</p></div></article>
          </div>
        </section>

        <section className="global-band" id="about">
          <div className="shell global-band__grid">
            <div className="global-band__map">
              <img src="/assets-htc-global.jpg" loading="lazy" decoding="async" alt="HTC מותג בינלאומי — מפת פעילות עולמית" />
            </div>
            <div className="global-band__copy">
              <p className="kicker">מותג בינלאומי. עכשיו גם בישראל.</p>
              <h2>HTC</h2>
              <p>מכונות תספורת וגילוח לשימוש ביתי ומקצועי — עם ביצועים אמינים ושירות מקומי.</p>
              <a href="#products">לצפייה בדגמים</a>
            </div>
          </div>
        </section>

        <section className="products section" id="products">
          <div className="shell">
            <div className="section-heading section-heading--center">
              <div><h2>בחרו את הדגם שמתאים לכם</h2><p><b>{products.length} דגמים.</b> פתרון לכל צורך.</p><i></i></div>
            </div>
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} featured={product.handle === "at-799"} />
              ))}
            </div>
          </div>
        </section>

        {featured && (
          <section className="brand-story section" id="one-pro">
            <div className="shell brand-story__grid">
              <div className="brand-story__image brand-story__product">
                <img src={featured.images[1] ?? featured.image} loading="lazy" decoding="async" alt="HTC One Pro בזווית מוצר מקצועית" />
                <span>ONE PRO<br />PROFESSIONAL</span>
              </div>
              <div className="brand-story__copy">
                <p className="kicker">נבנתה למקצוענים</p>
                <h2 className="one-pro__title"><span dir="ltr">HTC ONE PRO</span><span>דיוק בלי פשרות</span></h2>
                <p>מנוע ללא פחמים ולהב DLC לחיתוך חלק, מדויק ורציף.</p>
                <div className="one-pro__specs">
                  <span><b>עד 360 דקות</b><small>זמן עבודה</small></span>
                  <span><b>DLC</b><small>להב קבוע מצופה</small></span>
                  <span><b>9,000 סל״ד</b><small>עוצמה יציבה</small></span>
                  <span><b>3,000mAh</b><small>קיבולת סוללה</small></span>
                </div>
                <div className="hero__actions">
                  <Link className="button button--gold" href={`/shop/${featured.handle}`}>לרכישה</Link>
                  <Link className="button button--ghost" href="/compare">השוו דגמים</Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="why section" id="compare">
          <div className="shell">
            <div className="why__heading"><h2>למה HTC?</h2><p>ביצועים מקצועיים. שירות מקומי.</p></div>
            <div className="why__grid">
              <article><b>01</b><h3>טכנולוגיה מתקדמת</h3><p>מנועים ולהבים לביצועים יציבים.</p></article>
              <article><b>02</b><h3>עמידות גבוהה</h3><p>חומרים איכותיים לשימוש ממושך.</p></article>
              <article><b>03</b><h3>דיוק מקסימלי</h3><p>שליטה מדויקת בכל אורך חיתוך.</p></article>
              <article><b>04</b><h3>שירות בישראל</h3><p>אחריות ותמיכה מקומית.</p></article>
            </div>
          </div>
        </section>

        <section className="service section" id="service">
          <div className="shell service__split">
            <div className="service__copy">
              <p className="kicker">לספרים ומספרות</p>
              <h2>עובדים עם HTC</h2>
              <p>כלים מקצועיים ושירות בישראל.</p>
              <Link className="button button--gold" href="/contact">דברו איתנו</Link>
            </div>
            <div className="service__photo">
              <img src="/service-barbershop.jpg" loading="lazy" decoding="async" alt="עמדת ברברשופ מקצועית עם מגוון מכונות HTC" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run dev`, open `http://localhost:3004`.
Expected: hero renders with the background photo, all 6 product cards render in the grid with discount pricing, "לכל הדגמים" anchor scrolls to `#products`, clicking "הוספה לסל" on a card opens the cart toast and increments the header cart count, clicking the cart button opens the slide-out panel. Stop the dev server after confirming.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "Build home page"
```

---

## Task 16: Shop page with category filter

**Files:**
- Create: `app/shop/page.tsx`
- Create: `app/shop/ShopGrid.tsx`

**Interfaces:**
- Consumes: `getProducts()`, `getCategories()` (Task 13), `ProductCard` (Task 14).
- Produces: `/shop` — server component page + `ShopGrid` client component for filter interactivity.

- [ ] **Step 1: Create `app/shop/ShopGrid.tsx`**

Client component holding the category-filter state, ported from `shop.html`'s inline filter script (line 48):

```tsx
"use client";

import { useState } from "react";
import ProductCard from "../components/ProductCard";
import type { StoreProduct } from "../../lib/products-data";
import type { Category } from "../../lib/categories";

export default function ShopGrid({ products, categories }: { products: StoreProduct[]; categories: Category[] }) {
  const [filter, setFilter] = useState<string>("all");
  const visible = filter === "all" ? products : products.filter((p) => p.category.slug === filter);

  return (
    <>
      <section className="shop-toolbar" aria-label="סינון מוצרים">
        <div className="shell">
          <div>
            <span>{products.length} דגמים</span>
            <b>הקולקציה הרשמית בישראל</b>
          </div>
          <div className="shop-filters">
            <button className={filter === "all" ? "is-active" : undefined} type="button" onClick={() => setFilter("all")}>
              הכול
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                className={filter === category.slug ? "is-active" : undefined}
                type="button"
                onClick={() => setFilter(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="products shop-catalog" id="catalog">
        <div className="shell">
          <div className="product-grid">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} featured={product.handle === "at-799"} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Create `app/shop/page.tsx`**

Ported from `dist/client/shop.html` lines 14-40:

```tsx
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UtilityBar from "../components/UtilityBar";
import ShopGrid from "./ShopGrid";
import { getProducts, getCategories } from "../../lib/products";

export const metadata: Metadata = {
  title: "החנות | HTC ישראל",
  description: "חנות HTC ישראל — כל מכונות התספורת, הטרימרים ומכונות הגילוח.",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <>
      <UtilityBar />
      <Navbar />
      <main id="main">
        <section className="shop-hero">
          <div className="shell">
            <p className="kicker">HTC · טיפוח מדויק</p>
            <h1>הכלים שעושים<br />את ההבדל.</h1>
            <p>שישה דגמים. מהתספורת הראשונה בבית ועד עבודה מקצועית במספרה.</p>
            <a className="button button--gold" href="#catalog">לבחירת דגם</a>
          </div>
        </section>

        <ShopGrid products={products} categories={categories} />

        <section className="shop-compare">
          <div className="shell">
            <p className="kicker">צריכים עזרה?</p>
            <h2>השוו בין הדגמים ובחרו בביטחון</h2>
            <Link className="button button--gold" href="/compare">להשוואת דגמים</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev`, open `http://localhost:3004/shop`.
Expected: all 6 products show, category filter buttons ("הכול", "מכונות תספורת", "טרימרים", "מגלחים") toggle the visible grid correctly, "לבחירת דגם" anchor scrolls to `#catalog`. Stop the dev server after confirming.

- [ ] **Step 4: Commit**

```bash
git add app/shop/page.tsx app/shop/ShopGrid.tsx
git commit -m "Build shop page with category filter"
```

---

## Task 17: Product detail page

**Files:**
- Create: `app/shop/[handle]/page.tsx`
- Create: `app/shop/[handle]/ProductDetail.tsx`

**Interfaces:**
- Consumes: `getProductByHandle()`, `getProducts()` (Task 13), `productContent`, `WARRANTY_FAQ_ANSWER` (Task 12), `useCart()` (Task 5).
- Produces: `/shop/[handle]` — dynamic product detail page, replacing the 6 hardcoded `product-*.html` files.

- [ ] **Step 1: Create `app/shop/[handle]/ProductDetail.tsx`**

Ported from `dist/client/product-at-799.html` (the shared template all 6 product pages use) and the data-driven rendering in `product-page.js`, converted to a client component holding gallery/quantity/mobile-add state:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { WARRANTY_FAQ_ANSWER, type ProductContent } from "../../../lib/product-content";
import type { StoreProduct } from "../../../lib/products-data";

const noteIcons = [
  <svg key="0" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 17h6"/></svg>,
  <svg key="1" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h10v13H7zM9 4h6v3M10 11h4M12 9v4"/></svg>,
  <svg key="2" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5v14M9 5v14M13 5v14M17 5v14M21 5v14"/><path d="M3 19h18"/></svg>,
];

export default function ProductDetail({
  product,
  content,
  related,
}: {
  product: StoreProduct;
  content: ProductContent;
  related: StoreProduct[];
}) {
  const { addItem, openPanel } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [mobileAdded, setMobileAdded] = useState(false);

  const gallery = product.images.slice(0, 3);
  const discount = Math.round(((content.compareAtPrice - product.price) / content.compareAtPrice) * 100);
  const savings = content.compareAtPrice - product.price;
  const isFlagship = product.handle === "at-799";

  const addToCart = () =>
    addItem({ id: product.id, name: product.name, price: product.price, image: product.image }, quantity);

  const buyNow = () => {
    addToCart();
    openPanel();
  };

  const handleMobileAdd = () => {
    addToCart();
    setMobileAdded(true);
    window.setTimeout(() => setMobileAdded(false), 1400);
  };

  return (
    <>
      <div className="shell breadcrumb">
        <Link href="/shop">← חזרה לחנות</Link>
        <span>דף הבית / כל הדגמים / {product.name}</span>
      </div>

      <section className="product-detail shell">
        <div className="product-gallery">
          <div className="gallery-thumbs" aria-label="תמונות מוצר">
            {gallery.map((src, index) => (
              <button
                key={src}
                className={index === activeImage ? "is-active" : undefined}
                type="button"
                aria-label={`הצגת תמונה ${index + 1} של ${product.name}`}
                onClick={() => setActiveImage(index)}
              >
                <img src={src} loading="lazy" decoding="async" alt={`תמונה ${index + 1} של ${product.name}`} />
              </button>
            ))}
          </div>
          <div className="gallery-main">
            <img id="mainProductImage" src={gallery[activeImage]} alt={`${product.name} — ${content.subtitle}`} />
          </div>
        </div>

        <div className="product-info">
          <span className="product-info__eyebrow">{content.story.eyebrow}</span>
          <h1>{product.name}</h1>
          <h2>{content.subtitle}</h2>
          <div className="product-meta">
            <span>דגם / מק״ט: {product.id.toUpperCase()}</span>
            <span>ברקוד: {product.gtin}</span>
          </div>
          <p>{content.description}</p>
          <div className="stock stock--available">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/><circle cx="12" cy="12" r="10"/></svg>
            <span><b>במלאי</b><small>מוכן למשלוח מהיר</small></span>
          </div>
          <div className="product-hold">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
            <span className="product-price-offer">
              <small>מחיר השקה · <del>₪{content.compareAtPrice}</del></small>
              <strong>₪{product.price}</strong>
              <em>חיסכון ₪{savings}</em>
              <p>המחיר כולל מע״מ · משלוח חינם בקנייה מעל ₪299</p>
            </span>
          </div>
          <div className="product-quantity">
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7V3m8 4V3M5 11h14M6 5h12a2 2 0 0 1 2 2v12H4V7a2 2 0 0 1 2-2Z"/></svg>
              כמות
            </span>
            <div>
              <button type="button" aria-label="הפחתת כמות" disabled={quantity === 1} onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <b>{quantity}</b>
              <button type="button" aria-label="הגדלת כמות" onClick={() => setQuantity((q) => Math.min(10, q + 1))}>+</button>
            </div>
          </div>
          <div className="product-actions-live">
            <button className="product-add" type="button" onClick={addToCart}>
              <span className="product-add__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
              </span>
              <span>הוספה לסל</span>
            </button>
            <button className="buy-now" type="button" onClick={buyNow}>
              <span>קנייה עכשיו</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>
            </button>
          </div>
          <div className="product-notes" aria-label="יתרונות מרכזיים">
            {content.notes.map((note, index) => (
              <span key={note}>{noteIcons[index] ?? noteIcons[0]}<b>{note}</b></span>
            ))}
          </div>
        </div>
      </section>

      <ul className="product-proof-row shell" aria-label="שירות ואיכות בקצרה">
        <li><b><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 7 3v5c0 4.6-2.8 8-7 10-4.2-2-7-5.4-7-10V6l7-3Z"/><path d="m9 12 2 2 4-5"/></svg></b><span><strong>מוצר מקורי</strong><small>יבוא רשמי לישראל</small></span></li>
        <li><b><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a7 7 0 0 1 7 7v5a3 3 0 0 1-3 3h-1v-6h4M12 3a7 7 0 0 0-7 7v5a3 3 0 0 0 3 3h1v-6H5"/><path d="M15 20h-3"/></svg></b><span><strong>12 חודשי אחריות</strong><small>יבואן רשמי · שירות בישראל</small></span></li>
        <li><b><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg></b><span><strong>משלוח מהיר</strong><small>אריזה בטוחה עד הבית</small></span></li>
        <li><b><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 9.7 8.1 4 9l4 4-.9 6 4.9-2.7L17 19l-1-6 4-4-5.7-.9L12 3Z"/></svg></b><span><strong>בחירה מקצועית</strong><small>דגמים שנבחרו בקפידה</small></span></li>
      </ul>

      <section className="product-benefits">
        <div className="shell">
          {content.story.benefits.map(([title, text], index) => (
            <article key={title}><b>{`0${index + 1}`}</b><h3>{title}</h3><p>{text}</p></article>
          ))}
        </div>
      </section>

      <section className="product-spec-panel" aria-labelledby="productSpecTitle">
        <div className="shell product-spec-panel__layout">
          <div className="product-spec-panel__heading">
            <p className="kicker">המפרט החשוב. בלי רעש.</p>
            <h2 id="productSpecTitle">כל הנתונים<br />במבט אחד.</h2>
            <p>מידע ברור בעברית שיעזור לכם לדעת בדיוק מה מקבלים.</p>
            <span>{product.name} · {product.id.toUpperCase().replace("-", "‑")}</span>
            <small className="spec-verification">נבדק מול מסמכי הספק ותכולת האריזה</small>
          </div>
          <dl className="product-spec-grid">
            {content.specs.map(([label, value], index) => (
              <div key={label}>
                <span>{`0${index + 1}`}</span>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="product-story shell" data-model={product.id.toUpperCase()}>
        <div className="product-story__image">
          <img src={gallery[2] ?? gallery[1] ?? gallery[0]} alt={`${product.name} בסביבת מספרה מקצועית`} />
        </div>
        <div>
          <p className="kicker kicker--dark">{product.name.toUpperCase()}</p>
          <h2>{content.story.headline}</h2>
          <p>{content.story.body}</p>
          <ul>
            {[...content.notes, "אחריות ושירות בישראל"].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {isFlagship && (
        <section className="product-editorial" aria-label={`פרטי ${product.name}`}>
          <div className="shell product-editorial__intro">
            <p className="kicker kicker--dark">הנדסה מדויקת</p>
            <h2>דיוק בכל פרט.</h2>
            <p>מבט מקרוב על הגימור, השליטה והלהב.</p>
          </div>
          <div className="shell product-editorial__grid">
            <figure>
              <img src="/assets/optimized/at799-detail-screen.jpg" loading="lazy" decoding="async" alt="מסך LCD וחוגת הכיוון של HTC One Pro" />
              <figcaption><b>שליטה מדויקת</b><span>חוגת כיוון ומסך LCD ברור בזמן העבודה.</span></figcaption>
            </figure>
            <figure>
              <img src="/assets/barbershop/at-799-action.jpg" alt="תקריב להב HTC One Pro" />
              <figcaption><b>להב מקצועי</b><span>מבנה רחב לחיתוך נקי, רציף ואחיד.</span></figcaption>
            </figure>
            <figure>
              <img src="/assets/optimized/at799-finishes.jpg" loading="lazy" decoding="async" alt="שתי גרסאות גימור של HTC One Pro" />
              <figcaption><b>גימור מתכתי</b><span>נוכחות מקצועית ואחיזה מאוזנת ביד.</span></figcaption>
            </figure>
          </div>
        </section>
      )}

      <section className="faq product-source-details">
        <div className="shell">
          <h2>כל מה שצריך לדעת</h2>
          <details open>
            <summary><span className="detail-summary-label"><b>01</b><span>מפרט וביצועים</span></span></summary>
            <p>{content.description} תכונות מרכזיות: {content.notes.join(" · ")}.</p>
          </details>
          <details>
            <summary><span className="detail-summary-label"><b>02</b><span>מה מגיע באריזה?</span></span></summary>
            <p>{content.boxContents}</p>
          </details>
          <details>
            <summary><span className="detail-summary-label"><b>03</b><span>טעינה וזמן עבודה</span></span></summary>
            <p>{content.powerInfo}</p>
          </details>
          <details>
            <summary><span className="detail-summary-label"><b>04</b><span>אחריות ושירות</span></span></summary>
            <p>{WARRANTY_FAQ_ANSWER}</p>
          </details>
        </div>
      </section>

      <section className="related section">
        <div className="shell">
          <div className="why__heading"><h2>דגמים נוספים בסדרה</h2></div>
          <div className="related-grid">
            {related.map((item) => (
              <Link key={item.id} href={`/shop/${item.handle}`}>
                <img src={item.image} loading="lazy" decoding="async" alt={item.name} />
                <b>{item.name}</b>
                <span>לצפייה בדגם ←</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mobile-buy-bar" aria-label="רכישה מהירה">
        <div><small>במלאי · <span>₪{product.price}</span></small><strong>{product.name}</strong></div>
        <button type="button" onClick={handleMobileAdd}>
          <span>{mobileAdded ? "נוסף לסל ✓" : "הוספה לסל"}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>
        </button>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create `app/shop/[handle]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import UtilityBar from "../../components/UtilityBar";
import ProductDetail from "./ProductDetail";
import { getProducts, getProductByHandle } from "../../../lib/products";
import { productContent } from "../../../lib/product-content";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) return {};
  const content = productContent[handle];
  return {
    title: `${product.name} | HTC ישראל`,
    description: content ? `${product.name} — ${content.subtitle}. ${content.description} אחריות ושירות בישראל.` : product.name,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const [product, allProducts] = await Promise.all([getProductByHandle(handle), getProducts()]);
  if (!product) notFound();
  const content = productContent[handle];
  if (!content) notFound();
  const related = allProducts.filter((p) => p.handle !== handle).slice(0, 2);

  return (
    <>
      <UtilityBar />
      <Navbar />
      <main className="product-page" id="main">
        <ProductDetail product={product} content={content} related={related} />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev`, open `http://localhost:3004/shop/at-799`.
Expected: gallery thumbnails switch the main image on click, quantity stepper works (min 1, max 10), "הוספה לסל" and "קנייה עכשיו" both add the item with the selected quantity, the product-only editorial section appears (only for `at-799`), FAQ `<details>` open/close natively, related-model links navigate correctly, mobile-buy-bar's "הוספה לסל" shows the "נוסף לסל ✓" confirmation for 1.4s. Also check `http://localhost:3004/shop/at-158` to confirm the generic (non-flagship) rendering path and `http://localhost:3004/shop/does-not-exist` returns a 404. Stop the dev server after confirming.

- [ ] **Step 4: Commit**

```bash
git add app/shop/[handle]/page.tsx "app/shop/[handle]/ProductDetail.tsx"
git commit -m "Build dynamic product detail page"
```

---

## Task 18: Compare page

**Files:**
- Create: `app/compare/CompareClient.tsx`
- Create: `app/compare/page.tsx`

**Interfaces:**
- Consumes: `getProducts()` (Task 13).
- Produces: `/compare` — selectable comparison cards + spec table, presets, ported from `compare.html` + `compare.js`.

- [ ] **Step 1: Create `app/compare/CompareClient.tsx`**

Ported from `dist/client/compare.html` lines 63-134 and `compare.js` (full file), converting the imperative DOM toggling into React state. The per-model editorial copy (badge, summary sentence, bullet list, short table label) and the 8-row spec table are non-CRM display data, ported verbatim:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import type { StoreProduct } from "../../lib/products-data";

interface CompareModel {
  code: string;
  handle: string;
  name: string;
  image: string;
  shortLabel: string;
  small: string;
  badge?: string;
  summary: string;
  bullets: string[];
}

const MODEL_COPY: Record<string, Omit<CompareModel, "code" | "handle" | "name" | "image">> = {
  "AT-799": { shortLabel: "One Pro", small: "AT‑799 · מקצועית", badge: "הבחירה למקצוענים", summary: "עוצמה יציבה וזמן עבודה ארוך לספרים מקצועיים.", bullets: ["9,000 סל״ד", "עד 360 דקות", "להב DLC"] },
  "AT-735": { shortLabel: "One Plus", small: "AT‑735 · גוף מתכת", summary: "גוף מתכת מלא, שתי מהירויות ואחיזה יציבה.", bullets: ["2 מהירויות", "עד 240 דקות", "5 מסרקים"] },
  "AT-599": { shortLabel: "Edge", small: "AT‑599 · דיוק", summary: "טרימר להב T לקווי מתאר, לזקן ולגימור.", bullets: ["להב T", "עד 200 דקות", "מסך LCD"] },
  "AT-570": { shortLabel: "Trio", small: "AT‑570 · 3 מסרקים", summary: "טרימר להב T עם שלושה מסרקי הגבהה לגימור מדויק.", bullets: ["3 מסרקים", "להב T", "בסיס כלול"] },
  "GT-667": { shortLabel: "Glide", small: "GT‑667 · גילוח", summary: "מגלח חשמלי לגימור נקי בפנים ובצוואר.", bullets: ["2 ראשי גילוח", "ניקוי קל", "גימור נקי"] },
  "AT-158": { shortLabel: "Start", small: "AT‑158 · לבית", summary: "מכונת תספורת נוחה וברורה לשימוש משפחתי.", bullets: ["4 מסרקים", "כיוון אורך", "טעינת USB"] },
};

const specRows: { label: string; values: Record<string, string> }[] = [
  { label: "מתאים במיוחד", values: { "AT-799": "ספרים ועבודה מקצועית", "AT-735": "עבודה מקצועית", "AT-599": "קווים, זקן וגימור", "AT-570": "עיצוב רב־שימושי", "GT-667": "גילוח פנים וצוואר", "AT-158": "תספורת ביתית" } },
  { label: "סוג הכלי", values: { "AT-799": "מכונת תספורת", "AT-735": "מכונת תספורת", "AT-599": "טרימר T", "AT-570": "טרימר להב T", "GT-667": "מגלח חשמלי", "AT-158": "מכונת תספורת" } },
  { label: "מנוע וביצועים", values: { "AT-799": "9,000 סל״ד · מנוע ללא פחמים", "AT-735": "7,000 / 8,000 סל״ד · 2 מהירויות", "AT-599": "לא צוין במפרט", "AT-570": "לא צוין במפרט", "GT-667": "לא צוין במפרט", "AT-158": "לא צוין במפרט" } },
  { label: "זמן עבודה", values: { "AT-799": "עד 360 דקות", "AT-735": "עד 240 דקות", "AT-599": "עד 200 דקות", "AT-570": "לא צוין במפרט", "GT-667": "חיבור לחשמל", "AT-158": "לא צוין במפרט" } },
  { label: "טעינה", values: { "AT-799": "USB‑C · כ־4 שעות", "AT-735": "USB · כ־3.5 שעות", "AT-599": "USB · כ־2.5 שעות", "AT-570": "USB", "GT-667": "כבל חשמל", "AT-158": "USB" } },
  { label: "מערכת חיתוך", values: { "AT-799": "להב קבוע בציפוי DLC", "AT-735": "להב מתכת מקצועי", "AT-599": "להב T קרמי ומתכתי", "AT-570": "להב T עם מסרקי הגבהה", "GT-667": "2 ראשי גילוח", "AT-158": "טבעת כיוון 0.8–2.5 מ״מ" } },
  { label: "מסרקים באריזה", values: { "AT-799": "10 · 1.5–25 מ״מ", "AT-735": "5 · 3/6/10/13/16 מ״מ", "AT-599": "4 · 1.5/3/6/9 מ״מ", "AT-570": "3 · 1/2/3 מ״מ", "GT-667": "ללא", "AT-158": "4 · 1.5/3/6/9 מ״מ" } },
  { label: "בסיס / מעמד", values: { "AT-799": "לא כלול", "AT-735": "לא כלול", "AT-599": "לא כלול", "AT-570": "בסיס כלול", "GT-667": "לא כלול", "AT-158": "לא כלול" } },
];

const presets: Record<string, string[]> = {
  professional: ["AT-799", "AT-735", "AT-599"],
  detail: ["AT-599", "AT-570", "GT-667"],
  home: ["AT-158", "AT-570", "GT-667"],
};

const MAX_SELECTED = 4;

export default function CompareClient({ products }: { products: StoreProduct[] }) {
  const models: CompareModel[] = products
    .map((product) => {
      const code = product.id.toUpperCase();
      const copy = MODEL_COPY[code];
      if (!copy) return null;
      return { code, handle: product.handle, name: product.name, image: product.image, ...copy };
    })
    .filter((m): m is CompareModel => m !== null);

  const [selected, setSelected] = useState<string[]>(["AT-799", "AT-735", "AT-599"]);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const toggle = (code: string) => {
    const isSelected = selected.includes(code);
    if (isSelected && selected.length === 1) {
      setStatusMessage("יש להשאיר לפחות דגם אחד להשוואה.");
      return;
    }
    if (!isSelected && selected.length >= MAX_SELECTED) {
      setStatusMessage("ניתן להשוות עד ארבעה דגמים במקביל. הסירו דגם אחד כדי להוסיף אחר.");
      return;
    }
    setActivePreset(null);
    setSelected((prev) => (isSelected ? prev.filter((c) => c !== code) : [...prev, code]));
    setStatusMessage(isSelected ? "הדגם הוסר מההשוואה." : "הדגם נוסף להשוואה.");
  };

  const applyPreset = (key: string) => {
    setSelected(presets[key]);
    setActivePreset(key);
    setStatusMessage("מוצגים שלושת הדגמים המתאימים לסוג השימוש שבחרתם.");
    document.getElementById("model-picker")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section className="compare-needs" aria-labelledby="needs-title">
        <div className="shell">
          <div className="compare-section-head">
            <p className="kicker">קיצור דרך לבחירה</p>
            <h2 id="needs-title">מה הכי חשוב לכם?</h2>
          </div>
          <div className="compare-need-grid">
            <button type="button" className={activePreset === "professional" ? "is-active" : undefined} aria-pressed={activePreset === "professional"} onClick={() => applyPreset("professional")}>
              <span>01</span><strong>עבודה מקצועית</strong><small>עוצמה, זמן עבודה ושליטה</small>
            </button>
            <button type="button" className={activePreset === "detail" ? "is-active" : undefined} aria-pressed={activePreset === "detail"} onClick={() => applyPreset("detail")}>
              <span>02</span><strong>קווים וגימור</strong><small>דיוק לזקן, מסגרות וצוואר</small>
            </button>
            <button type="button" className={activePreset === "home" ? "is-active" : undefined} aria-pressed={activePreset === "home"} onClick={() => applyPreset("home")}>
              <span>03</span><strong>טיפוח בבית</strong><small>פשוט, שימושי ונוח למשפחה</small>
            </button>
          </div>
        </div>
      </section>

      <section className="compare-models shell" id="model-picker" aria-labelledby="models-title">
        <div className="compare-section-head compare-section-head--split">
          <div><p className="kicker">שלב 1</p><h2 id="models-title">בחרו דגמים להשוואה</h2></div>
          <div className="compare-selection-status"><b>{selected.length}</b><span>דגמים נבחרו<br />ניתן לבחור עד 4</span></div>
        </div>
        <p className="compare-model-swipe-hint">החליקו לצפייה בדגמים נוספים <span aria-hidden="true">←</span></p>

        <div className="compare-model-grid">
          {models.map((model) => {
            const isSelected = selected.includes(model.code);
            return (
              <article key={model.code} className={isSelected ? "is-selected" : undefined}>
                <div className="compare-card__visual">
                  {model.badge && <span className="compare-card__badge">{model.badge}</span>}
                  <img src={model.image} loading="lazy" decoding="async" alt={model.name} />
                </div>
                <div className="compare-card__body">
                  <small>{model.small}</small>
                  <h3>{model.name}</h3>
                  <p>{model.summary}</p>
                  <ul>{model.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                </div>
                <div className="compare-card__actions">
                  <button type="button" aria-pressed={isSelected} onClick={() => toggle(model.code)}>
                    {isSelected ? <><span aria-hidden="true">✓</span> נבחר להשוואה</> : <><span aria-hidden="true">＋</span> הוספה להשוואה</>}
                  </button>
                  <Link href={`/shop/${model.handle}`}>לדף המוצר</Link>
                </div>
              </article>
            );
          })}
        </div>
        <p className="compare-live-status" role="status" aria-live="polite">{statusMessage}</p>
      </section>

      <section className="compare-specs" id="comparison-table" aria-labelledby="specs-title">
        <div className="shell">
          <div className="compare-section-head compare-section-head--split">
            <div><p className="kicker">שלב 2</p><h2 id="specs-title">השוואה נקודה מול נקודה</h2></div>
            <p className="compare-scroll-hint">בנייד ניתן להחליק לצדדים <span aria-hidden="true">←</span></p>
          </div>
          <div className="spec-table-wrap" tabIndex={0} aria-label="טבלת השוואת דגמי HTC, ניתן לגלול לצדדים">
            <table className="spec-table">
              <caption className="sr-only">השוואת מפרטים בין דגמי HTC שנבחרו</caption>
              <thead>
                <tr>
                  <th scope="col">פרמטר</th>
                  {models.map((model) => (
                    <th scope="col" key={model.code} hidden={!selected.includes(model.code)}>
                      <b>{model.shortLabel}</b><small>{model.code.replace("-", "‑")}</small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specRows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {models.map((model) => (
                      <td key={model.code} hidden={!selected.includes(model.code)}>{row.values[model.code]}</td>
                    ))}
                  </tr>
                ))}
                <tr className="spec-table__cta">
                  <th scope="row">לפרטים</th>
                  {models.map((model) => (
                    <td key={model.code} hidden={!selected.includes(model.code)}>
                      <Link href={`/shop/${model.handle}`}>לדף המוצר</Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Create `app/compare/page.tsx`**

Ported from `dist/client/compare.html` lines 24-35 and 136-138:

```tsx
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CompareClient from "./CompareClient";
import { getProducts } from "../../lib/products";

export const metadata: Metadata = {
  title: "השוואת דגמים | HTC ישראל",
  description: "השוו בין מכונות התספורת, הטרימרים והמגלחים של HTC ישראל ובחרו את הדגם המדויק לצורך שלכם.",
};

export default async function ComparePage() {
  const products = await getProducts();

  return (
    <>
      <Navbar />
      <main id="main">
        <section className="compare-hero compare-hero--editorial">
          <div className="shell compare-hero__layout">
            <div>
              <p className="kicker">מצאו את ה־HTC שלכם</p>
              <h1>הדגם הנכון<br /><em>בלי לנחש</em></h1>
            </div>
            <div className="compare-hero__intro">
              <p>בחרו עד ארבעה דגמים וקבלו השוואה ברורה של ביצועים, זמן עבודה, להבים ואביזרים.</p>
              <a href="#model-picker">לבחירת דגמים <span aria-hidden="true">↓</span></a>
            </div>
          </div>
        </section>

        <CompareClient products={products} />

        <section className="compare-cta">
          <div className="shell compare-cta__inner">
            <div>
              <p className="kicker">עדיין מתלבטים?</p>
              <h2>נעזור לכם לבחור נכון</h2>
              <p>ספרו לנו למי מיועד המכשיר ואיך תשתמשו בו, ונכוון אתכם לדגם המתאים.</p>
            </div>
            <div>
              <Link className="button button--gold" href="/contact">ייעוץ לבחירת דגם</Link>
              <Link className="button button--ghost" href="/shop">לכל הדגמים</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev`, open `http://localhost:3004/compare`.
Expected: AT-799/AT-735/AT-599 start selected, clicking a preset ("עבודה מקצועית" etc.) swaps the selection and scrolls to the model picker, toggling a card in/out updates the spec table's visible columns, trying to deselect the last remaining model shows the "יש להשאיר לפחות דגם אחד" status message, selecting a 5th model shows the max-4 message. Stop the dev server after confirming.

- [ ] **Step 4: Commit**

```bash
git add app/compare/CompareClient.tsx app/compare/page.tsx
git commit -m "Build compare page with presets and spec table"
```

---

## Task 19: Cart page

**Files:**
- Modify: `app/globals.css` (append new rules — this page has no equivalent in the source static site, only the slide-out panel did)
- Create: `app/cart/page.tsx`

**Interfaces:**
- Consumes: `useCart()`, `FREE_SHIPPING_THRESHOLD` (Task 5).
- Produces: `/cart` — full cart page (new; the source site only ever had the slide-out panel). Reuses the `.cart-item` row styling from `globals.css` so line items look identical to the slide-out panel.

- [ ] **Step 1: Append cart-page layout rules to `app/globals.css`**

New rules, built from the existing design tokens (`--ink`, `--gold`, `--paper`, `--cream`, `--line`, `--muted`) so the new page matches the ported design system:

```css

/* Cart page (new — source site only had the slide-out panel) */
.cart-page{padding:60px 0 100px}
.cart-page__grid{display:grid;grid-template-columns:1fr 380px;gap:48px;align-items:start}
.cart-page h1{font-size:clamp(32px,4vw,48px);margin:0 0 32px}
.cart-page__empty{text-align:center;padding:90px 20px;background:var(--cream)}
.cart-page__empty span{font-size:70px;font-weight:300;color:#d4cec2}
.cart-page__empty h2{font-size:22px;margin:12px 0 8px}
.cart-page__empty p{color:var(--muted);margin:0 0 24px}
.cart-page__list{display:flex;flex-direction:column;border-top:1px solid var(--line)}
.cart-page__list .cart-item{padding:22px 0}
.cart-page__summary{background:var(--cream);padding:28px;position:sticky;top:100px}
.cart-page__summary h2{font-size:20px;margin:0 0 20px}
.cart-page__summary-row{display:flex;justify-content:space-between;font-size:14px;color:var(--muted);padding:8px 0}
.cart-page__summary-row--total{border-top:1px solid var(--line);margin-top:8px;padding-top:16px;font-size:20px;color:var(--ink);font-weight:700}
.cart-page__summary .button{width:100%;margin-top:20px}
@media(max-width:900px){.cart-page__grid{grid-template-columns:1fr}.cart-page__summary{position:static}}
```

- [ ] **Step 2: Create `app/cart/page.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart, FREE_SHIPPING_THRESHOLD } from "../context/CartContext";

export default function CartPage() {
  const { items, total, removeItem, updateQuantity } = useCart();
  const router = useRouter();
  const shipping = total === 0 || total >= FREE_SHIPPING_THRESHOLD ? 0 : 29;

  return (
    <>
      <Navbar />
      <main id="main" className="cart-page">
        <div className="shell">
          <h1>סל הקניות</h1>
          {items.length === 0 ? (
            <div className="cart-page__empty">
              <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg></span>
              <h2>הסל ריק</h2>
              <p>מצאו את מכשיר הטיפוח שמתאים בדיוק לשגרה שלכם.</p>
              <Link className="button button--gold" href="/shop">לכל הדגמים</Link>
            </div>
          ) : (
            <div className="cart-page__grid">
              <div className="cart-page__list">
                {items.map((item) => (
                  <article className="cart-item" key={item.id}>
                    <div className="cart-item__thumb">{item.image ? <img src={item.image} alt="" /> : "HTC"}</div>
                    <div className="cart-item__content">
                      <span>HTC ישראל · יבואן רשמי</span>
                      <h3>{item.name}</h3>
                      <small>₪{item.price}</small>
                      <div className="cart-item__quantity">
                        <button aria-label="הפחתת כמות" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                        <b>{item.quantity}</b>
                        <button aria-label="הגדלת כמות" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <button className="cart-item__remove" aria-label={`הסרת ${item.name}`} onClick={() => removeItem(item.id)}>
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5"/></svg>
                    </button>
                  </article>
                ))}
              </div>
              <aside className="cart-page__summary">
                <h2>סיכום הזמנה</h2>
                <div className="cart-page__summary-row"><span>סכום ביניים</span><span>₪{total}</span></div>
                <div className="cart-page__summary-row"><span>משלוח</span><span>{shipping === 0 ? "חינם" : `₪${shipping}`}</span></div>
                <div className="cart-page__summary-row cart-page__summary-row--total"><span>סה״כ</span><span>₪{total + shipping}</span></div>
                <button className="button button--gold" type="button" onClick={() => router.push("/checkout")}>
                  להמשך לתשלום <span>←</span>
                </button>
              </aside>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev`, open `http://localhost:3004/cart` with an empty cart — confirm the empty state renders with a working "לכל הדגמים" link. Add a product from the home page, revisit `/cart` — confirm the line item, quantity controls, remove button, and order summary (with the ₪299 free-shipping threshold) all work, and "להמשך לתשלום" navigates to `/checkout` (404 until Task 21). Stop the dev server after confirming.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/cart/page.tsx
git commit -m "Build cart page"
```

---

## Task 20: Order staging and Hyp Pay checkout API routes

**Files:**
- Create: `lib/orders.ts`
- Create: `app/api/hyp-checkout/route.ts`
- Create: `app/api/confirm-order/route.ts`
- Create: `.env.local` (from `.env.local.example`, not committed — gitignored)

**Interfaces:**
- Consumes: `getProducts()` (Task 13), `FREE_SHIPPING_THRESHOLD` (Task 5's `lib/constants.ts`).
- Produces: `stageCheckoutIntent(orderId: string, payload: OrderPayload): Promise<boolean>`, `finalizeOrder(orderId: string): Promise<boolean>` (in `lib/orders.ts`); `POST /api/hyp-checkout` (body `HypCheckoutBody = { coupon?, customer, items: { id, qty }[] }` — no price fields, the route recomputes the total server-side — → `{ paymentUrl, amount }` or `{ error }`); `POST /api/confirm-order` (body `{ orderId }` → `{ ok: boolean }`).
- Consumed by: checkout page (Task 21), payment success page (Task 22).

This follows the CheckoutIntent pattern used by `xvape` (`xvape/lib/orders.ts`, `xvape/app/api/hyp-checkout/route.ts`) rather than writing directly to `Order` on checkout: the full order is staged in the CRM keyed by a generated order id *before* the customer is sent to pay, and only turned into a real, paid `Order` once Hyp redirects the customer back to `/payment/success` with that same id. An abandoned checkout just leaves an unconsumed intent — never a stuck "pending" order in the CRM.

- [ ] **Step 1: Create `lib/orders.ts`**

```ts
// Nothing about a checkout becomes an Order in the CRM until payment is
// confirmed. The full order is staged server-side (CRM's CheckoutIntent,
// keyed by orderId) before the customer is sent to pay, and consumed
// exactly once — turned into a real, already-paid Order — when Hyp
// redirects the customer back with that same order id.
const ORDER_ID_PATTERN = /^HT-\d+-[a-f0-9]{8}$/;

interface OrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  apartment?: string;
  address: string;
  city: string;
  notes?: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface OrderPayload {
  total: number;
  shipping: number;
  discount: number;
  coupon?: string;
  customer: OrderCustomer;
  items: OrderItem[];
}

async function postToCrm(path: string, body?: unknown): Promise<boolean> {
  const url = `${process.env.CRM_URL}/api/${process.env.CRM_SITE_SLUG}${path}`;
  const attempts = 3;

  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.CRM_API_KEY!,
        },
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      });
      if (res.ok) return true;
    } catch {
      // fall through to retry
    }
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, 800 * (i + 1)));
  }
  return false;
}

export async function stageCheckoutIntent(orderId: string, payload: OrderPayload): Promise<boolean> {
  if (!ORDER_ID_PATTERN.test(orderId)) return false;
  return postToCrm("/checkout-intents", { id: orderId, payload });
}

export async function finalizeOrder(orderId: string): Promise<boolean> {
  if (!ORDER_ID_PATTERN.test(orderId)) return false;
  return postToCrm(`/checkout-intents/${encodeURIComponent(orderId)}/finalize`);
}
```

- [ ] **Step 2: Create `app/api/hyp-checkout/route.ts`**

Pattern ported from `xvape/app/api/hyp-checkout/route.ts` (order-id prefix `XV-` → `HT-`, default site URL → port 3004), but with one deliberate deviation from that reference: xvape's route trusts a client-supplied `amount` verbatim. This plan's Global Constraints (and `adding-new-sites.md` §7) require the total to be **recomputed server-side from CRM product data**, so this route ignores any price/amount the client sends and rebuilds the order from `getProducts()` plus a server-side coupon re-validation — the client only supplies item ids/quantities and a customer/coupon code:

```ts
import { NextRequest, NextResponse } from "next/server";
import { stageCheckoutIntent } from "../../../lib/orders";
import { getProducts } from "../../../lib/products";
import { FREE_SHIPPING_THRESHOLD } from "../../../lib/constants";

export interface CheckoutItem {
  id: string;
  qty: number;
}

export interface HypCheckoutBody {
  coupon?: string;
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    houseNumber: string;
    apartment?: string;
    address: string;
    city: string;
    notes?: string;
  };
  items?: CheckoutItem[];
}

interface CouponValidation {
  ok: boolean;
  type?: string;
  value?: number;
  code?: string;
  error?: string;
}

async function validateCouponServerSide(code: string): Promise<CouponValidation> {
  try {
    const res = await fetch(`${process.env.CRM_URL}/api/${process.env.CRM_SITE_SLUG}/validate-coupon`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    if (!res.ok) return { ok: false, error: data.error ?? "קוד קופון לא תקין" };
    return { ok: true, ...data };
  } catch {
    return { ok: false, error: "שגיאה באימות הקופון" };
  }
}

export async function POST(req: NextRequest) {
  const masof = process.env.HYP_MASOF;
  const key = process.env.HYP_KEY;
  const passP = process.env.HYP_PASSP;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3004";

  if (!masof || !key || !passP) {
    return NextResponse.json(
      { error: "Hyp Pay credentials not configured. Set HYP_MASOF, HYP_KEY, HYP_PASSP in .env.local" },
      { status: 500 }
    );
  }

  const body: HypCheckoutBody = await req.json();
  const { coupon, customer, items } = body;

  if (!customer || !items?.length) {
    return NextResponse.json({ error: "Missing customer or items" }, { status: 400 });
  }

  // Recompute the order total server-side from CRM product data — never
  // trust a client-supplied price or amount.
  const products = await getProducts();
  const priceById = new Map(products.map((p) => [p.id, p.price]));
  const nameById = new Map(products.map((p) => [p.id, p.name]));

  let subtotal = 0;
  const orderItems: { id: string; name: string; price: number; qty: number }[] = [];
  for (const item of items) {
    const price = priceById.get(item.id);
    const qty = Math.max(1, Math.floor(item.qty));
    if (price === undefined) {
      return NextResponse.json({ error: `Unknown item: ${item.id}` }, { status: 400 });
    }
    subtotal += price * qty;
    orderItems.push({ id: item.id, name: nameById.get(item.id) ?? item.id, price, qty });
  }

  let discount = 0;
  let couponCode: string | undefined;
  if (coupon) {
    const result = await validateCouponServerSide(coupon);
    if (!result.ok || !result.type || result.value === undefined) {
      return NextResponse.json({ error: result.error ?? "קוד קופון לא תקין" }, { status: 400 });
    }
    discount =
      result.type === "PERCENT"
        ? Math.round(((subtotal * result.value) / 100) * 100) / 100
        : Math.min(result.value, subtotal);
    couponCode = result.code;
  }

  const shipping = subtotal === 0 || subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : 29;
  const amount = Math.max(0, subtotal - discount) + shipping;

  // Generated server-side — never trust a client-supplied order id.
  const orderId = `HT-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

  const staged = await stageCheckoutIntent(orderId, {
    total: amount,
    shipping,
    discount,
    coupon: couponCode,
    customer,
    items: orderItems,
  });
  if (!staged) {
    return NextResponse.json({ error: "Could not save order. Please try again." }, { status: 502 });
  }

  const params = new URLSearchParams({
    action: "APISign",
    What: "SIGN",
    Sign: "True",
    KEY: key,
    PassP: passP,
    Masof: masof,
    Amount: String(amount),
    Coin: "1",
    Order: orderId,
    PageLang: "HEB",
    sendemail: "True",
    MoreData: "True",
    SuccessUrl: `${siteUrl}/payment/success`,
    ErrorUrl: `${siteUrl}/payment/failure`,
  });

  let signedParams: string;
  try {
    const resp = await fetch(`https://pay.hyp.co.il/p/?${params.toString()}`);
    signedParams = await resp.text();
  } catch (err) {
    console.error("Hyp APISign request failed:", err);
    return NextResponse.json({ error: "Failed to connect to Hyp Pay" }, { status: 502 });
  }

  if (signedParams.includes("CCode=") && !signedParams.includes("action=pay")) {
    return NextResponse.json({ error: "Hyp Pay returned an error", details: signedParams }, { status: 400 });
  }

  const paymentUrl = `https://pay.hyp.co.il/p/?${signedParams}`;
  return NextResponse.json({ paymentUrl, amount });
}
```

- [ ] **Step 3: Create `app/api/confirm-order/route.ts`**

Client-side backup finalize, ported from `xvape/app/api/confirm-order/route.ts`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { finalizeOrder } from "../../../lib/orders";

// Client-side backup — the server-side finalize on the success page's
// initial load (Task 22) is the primary path, but if that whole request
// never completed (browser closed mid-redirect, etc.), this fires once the
// page actually renders. Idempotent server-side, safe to call more than once.
export async function POST(req: NextRequest) {
  const { orderId } = await req.json();
  if (typeof orderId !== "string" || !orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }
  const ok = await finalizeOrder(orderId);
  return NextResponse.json({ ok });
}
```

- [ ] **Step 4: Create the real `.env.local`**

Copy the example and fill in real values — `CRM_API_KEY` and `REVALIDATE_SECRET` come from the Site record created in B2BCRM admin (`/admin/sites/new`); `HYP_MASOF`/`HYP_KEY`/`HYP_PASSP` are copied from polarizedx's own `.env.local` (same merchant account, per the approved design):

```bash
cp .env.local.example .env.local
```

Then edit `.env.local` and fill in the four blank values. This file is gitignored (Task 1's `.gitignore`) and must never be committed.

> If the CRM Site or the Hyp credentials aren't available yet, leave `.env.local` with blank values for now — every code path in this plan already degrades gracefully: `lib/products.ts` falls back to static data, and `/api/hyp-checkout` returns a clear 500 error instead of crashing. Fill them in before Task 26's end-to-end verification.

- [ ] **Step 5: Verify the routes respond**

Run: `npm run dev`, then:

```bash
curl -s -X POST http://localhost:3004/api/hyp-checkout -H "Content-Type: application/json" -d "{}"
```

Expected: `{"error":"Hyp Pay credentials not configured. Set HYP_MASOF, HYP_KEY, HYP_PASSP in .env.local"}` (if `.env.local` still has blank Hyp values) or `{"error":"Missing customer or items"}` (if Hyp values are filled in). Either response confirms the route is wired correctly. Stop the dev server after confirming.

- [ ] **Step 6: Commit**

```bash
git add lib/orders.ts app/api/hyp-checkout/route.ts app/api/confirm-order/route.ts
git commit -m "Add order staging and Hyp Pay checkout API routes"
```

---

## Task 21: Checkout page

**Files:**
- Modify: `app/globals.css` (append checkout-page layout rules)
- Create: `app/checkout/page.tsx`

**Interfaces:**
- Consumes: `useCart()`, `FREE_SHIPPING_THRESHOLD` (Task 5); `POST /api/hyp-checkout` (Task 20); CRM's public `POST /validate-coupon` endpoint (per `adding-new-sites.md` §9, returns `{ ok, type, value, code }` or a Hebrew `{ error }`).
- Produces: `/checkout` — two-step shipping/payment form, coupon application, redirect to Hyp's hosted payment page. Logic ported from `xvape/app/checkout/page.tsx`, restyled with `htc-israel`'s own design tokens instead of Tailwind.

- [ ] **Step 1: Append checkout-page layout rules to `app/globals.css`**

```css

/* Checkout page (new) */
.checkout-page{padding:60px 0 100px}
.checkout-page h1{font-size:clamp(32px,4vw,48px);margin:0 0 32px}
.checkout-page__grid{display:grid;grid-template-columns:1fr 380px;gap:48px;align-items:start}
.checkout-page__tabs{display:flex;gap:8px;margin-bottom:20px}
.checkout-page__tabs button{min-height:42px;padding:0 20px;border:1px solid var(--line);background:transparent;color:var(--muted);font-weight:700;font-size:13px}
.checkout-page__tabs button.is-active{background:var(--gold);border-color:var(--gold);color:var(--ink)}
.checkout-page__panel{background:var(--cream);padding:28px;display:flex;flex-direction:column;gap:16px}
.checkout-page__panel h2{font-size:18px;margin:0}
.checkout-page__field{display:flex;flex-direction:column;gap:6px}
.checkout-page__field label{font-size:12px;color:var(--muted);font-weight:700}
.checkout-page__field input,.checkout-page__field textarea{border:1px solid var(--line);background:var(--paper);padding:12px 14px;font-size:14px;font-family:inherit;color:var(--ink)}
.checkout-page__row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.checkout-page__error{color:#c0392b;font-size:12px;margin:0}
.checkout-page__recap{background:var(--paper);padding:16px;display:flex;flex-direction:column;gap:8px;font-size:13px}
.checkout-page__recap-row{display:flex;justify-content:space-between;color:var(--muted)}
.checkout-page__recap-row b{color:var(--ink);font-weight:600}
@media(max-width:900px){.checkout-page__grid{grid-template-columns:1fr}.checkout-page__row{grid-template-columns:1fr}}
```

- [ ] **Step 2: Create `app/checkout/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart, FREE_SHIPPING_THRESHOLD } from "../context/CartContext";

type Step = "shipping" | "payment";

interface CouponResult {
  code: string;
  type: string;
  value: number;
}

export default function CheckoutPage() {
  const { items, total } = useCart();
  const shipping = total === 0 || total >= FREE_SHIPPING_THRESHOLD ? 0 : 29;

  const [step, setStep] = useState<Step>("shipping");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null);

  const discount = appliedCoupon
    ? appliedCoupon.type === "PERCENT"
      ? Math.round(((total * appliedCoupon.value) / 100) * 100) / 100
      : Math.min(appliedCoupon.value, total)
    : 0;
  const finalTotal = Math.max(0, total - discount) + shipping;

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    street: "", houseNumber: "", apartment: "", city: "", notes: "",
  });

  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const isShippingValid =
    form.firstName.trim() && form.lastName.trim() && form.email.trim() &&
    form.phone.trim() && form.street.trim() && form.houseNumber.trim() && form.city.trim();

  const handleContinue = () => {
    setSubmitted(true);
    if (isShippingValid) setStep("payment");
  };

  const handleCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CRM_URL}/api/${process.env.NEXT_PUBLIC_CRM_SITE_SLUG}/validate-coupon`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: couponCode }) }
      );
      const data = await res.json();
      if (!res.ok) setCouponError(data.error ?? "קוד קופון לא תקין");
      else {
        setAppliedCoupon(data);
        setCouponCode("");
      }
    } catch {
      setCouponError("שגיאה באימות הקופון");
    }
    setCouponLoading(false);
  };

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const fullAddress = `${form.street} ${form.houseNumber}${form.apartment ? ` דירה ${form.apartment}` : ""}`;
      // No price/amount fields here — /api/hyp-checkout recomputes the
      // total server-side from CRM product data (Task 20). finalTotal above
      // is display-only, for the summary the customer sees before paying.
      const res = await fetch("/api/hyp-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupon: appliedCoupon?.code,
          customer: { ...form, address: fullAddress },
          items: items.map((i) => ({ id: i.id, qty: i.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "שגיאה בחיבור לשער התשלומים");
        setLoading(false);
        return;
      }
      window.location.href = data.paymentUrl;
    } catch {
      setError("שגיאה בחיבור לשער התשלומים. אנא נסו שוב.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main id="main" className="cart-page">
          <div className="shell">
            <h1>קופה</h1>
            <div className="cart-page__empty">
              <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg></span>
              <h2>הסל ריק</h2>
              <p>הוסיפו מוצרים לסל כדי להמשיך לתשלום.</p>
              <Link className="button button--gold" href="/shop">לכל הדגמים</Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main id="main" className="checkout-page">
        <div className="shell">
          <h1>קופה</h1>
          <div className="checkout-page__grid">
            <div>
              <div className="checkout-page__tabs">
                <button type="button" className={step === "shipping" ? "is-active" : undefined} onClick={() => setStep("shipping")}>
                  פרטי משלוח
                </button>
                <button type="button" className={step === "payment" ? "is-active" : undefined} disabled={!isShippingValid}>
                  תשלום
                </button>
              </div>

              {step === "shipping" && (
                <div className="checkout-page__panel">
                  <h2>פרטים אישיים</h2>
                  <div className="checkout-page__row">
                    <div className="checkout-page__field">
                      <label>שם פרטי</label>
                      <input value={form.firstName} onChange={(e) => set("firstName")(e.target.value)} />
                      {submitted && !form.firstName.trim() && <p className="checkout-page__error">שדה חובה</p>}
                    </div>
                    <div className="checkout-page__field">
                      <label>שם משפחה</label>
                      <input value={form.lastName} onChange={(e) => set("lastName")(e.target.value)} />
                      {submitted && !form.lastName.trim() && <p className="checkout-page__error">שדה חובה</p>}
                    </div>
                  </div>
                  <div className="checkout-page__field">
                    <label>אימייל</label>
                    <input type="email" value={form.email} onChange={(e) => set("email")(e.target.value)} />
                    {submitted && !form.email.trim() && <p className="checkout-page__error">שדה חובה</p>}
                  </div>
                  <div className="checkout-page__field">
                    <label>טלפון</label>
                    <input type="tel" value={form.phone} onChange={(e) => set("phone")(e.target.value)} />
                    {submitted && !form.phone.trim() && <p className="checkout-page__error">שדה חובה</p>}
                  </div>
                  <h2>כתובת למשלוח</h2>
                  <div className="checkout-page__field">
                    <label>רחוב</label>
                    <input value={form.street} onChange={(e) => set("street")(e.target.value)} />
                    {submitted && !form.street.trim() && <p className="checkout-page__error">שדה חובה</p>}
                  </div>
                  <div className="checkout-page__row">
                    <div className="checkout-page__field">
                      <label>מספר בית</label>
                      <input value={form.houseNumber} onChange={(e) => set("houseNumber")(e.target.value)} />
                      {submitted && !form.houseNumber.trim() && <p className="checkout-page__error">שדה חובה</p>}
                    </div>
                    <div className="checkout-page__field">
                      <label>דירה (אופציונלי)</label>
                      <input value={form.apartment} onChange={(e) => set("apartment")(e.target.value)} />
                    </div>
                  </div>
                  <div className="checkout-page__field">
                    <label>עיר</label>
                    <input value={form.city} onChange={(e) => set("city")(e.target.value)} />
                    {submitted && !form.city.trim() && <p className="checkout-page__error">שדה חובה</p>}
                  </div>
                  <div className="checkout-page__field">
                    <label>הערות להזמנה (אופציונלי)</label>
                    <textarea rows={3} value={form.notes} onChange={(e) => set("notes")(e.target.value)} />
                  </div>
                  <button className="button button--gold" type="button" onClick={handleContinue}>
                    המשך לתשלום
                  </button>
                </div>
              )}

              {step === "payment" && (
                <div className="checkout-page__panel">
                  <h2>תשלום מאובטח</h2>
                  <div className="checkout-page__recap">
                    <div className="checkout-page__recap-row"><span>שם</span><b>{form.firstName} {form.lastName}</b></div>
                    <div className="checkout-page__recap-row"><span>אימייל</span><b>{form.email}</b></div>
                    <div className="checkout-page__recap-row">
                      <span>כתובת</span>
                      <b>{form.street} {form.houseNumber}{form.apartment ? ` דירה ${form.apartment}` : ""}, {form.city}</b>
                    </div>
                    <button type="button" className="card-link" onClick={() => setStep("shipping")}>עריכת פרטים</button>
                  </div>
                  {error && <p className="checkout-page__error">{error}</p>}
                  <button className="button button--gold" type="button" disabled={loading} onClick={handlePay}>
                    {loading ? "מעבד…" : "לתשלום מאובטח"}
                  </button>
                  <p style={{ fontSize: "12px", color: "var(--muted)", textAlign: "center" }}>התשלום מאובטח באמצעות Hyp Pay</p>
                </div>
              )}
            </div>

            <aside className="cart-page__summary">
              <h2>סיכום הזמנה</h2>
              {items.map((item) => (
                <div className="cart-page__summary-row" key={item.id}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>₪{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="cart-page__summary-row"><span>סכום ביניים</span><span>₪{total}</span></div>
              {discount > 0 && (
                <div className="cart-page__summary-row"><span>הנחה ({appliedCoupon?.code})</span><span>-₪{discount}</span></div>
              )}
              <div className="cart-page__summary-row"><span>משלוח</span><span>{shipping === 0 ? "חינם" : `₪${shipping}`}</span></div>
              <div className="cart-page__summary-row cart-page__summary-row--total"><span>סה״כ</span><span>₪{finalTotal}</span></div>

              {appliedCoupon ? (
                <p style={{ fontSize: "13px", color: "#347247" }}>✓ קוד {appliedCoupon.code} הוחל</p>
              ) : (
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <input
                    style={{ flex: 1, border: "1px solid var(--line)", padding: "10px 12px", fontSize: "13px" }}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="קוד קופון"
                  />
                  <button
                    type="button"
                    className="button button--ghost"
                    style={{ color: "var(--ink)", borderColor: "var(--line)" }}
                    disabled={couponLoading}
                    onClick={handleCoupon}
                  >
                    {couponLoading ? "…" : "החל"}
                  </button>
                </div>
              )}
              {couponError && <p className="checkout-page__error">{couponError}</p>}
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev`. With an empty cart, open `http://localhost:3004/checkout` — confirm the empty-cart message shows. Add a product, revisit `/checkout` — fill the shipping form and confirm required-field errors show only after clicking "המשך לתשלום" with blanks, confirm the "תשלום" tab is disabled until shipping fields are valid, confirm clicking "לתשלום מאובטח" without Hyp credentials configured surfaces the "Hyp Pay credentials not configured" error inline rather than crashing. Stop the dev server after confirming.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css app/checkout/page.tsx
git commit -m "Build checkout page with coupon and Hyp Pay integration"
```

---

## Task 22: Payment success/failure pages

**Files:**
- Modify: `app/globals.css` (append payment-result layout rules)
- Create: `app/payment/success/page.tsx`
- Create: `app/payment/success/SuccessClient.tsx`
- Create: `app/payment/failure/page.tsx`

**Interfaces:**
- Consumes: `finalizeOrder()` (Task 20), `useCart()` (Task 5), `POST /api/confirm-order` (Task 20).
- Produces: `/payment/success` (Hyp's `SuccessUrl` redirect target), `/payment/failure` (Hyp's `ErrorUrl` redirect target). Ported from `xvape/app/payment/success/page.tsx` + `SuccessClient.tsx` + `xvape/app/payment/failure/page.tsx`.

- [ ] **Step 1: Append payment-result layout rules to `app/globals.css`**

```css

/* Payment result pages (new) */
.payment-result{padding:80px 0;display:flex;justify-content:center}
.payment-result__card{max-width:440px;width:100%;text-align:center;display:flex;flex-direction:column;align-items:center;gap:20px;padding:0 20px}
.payment-result__icon{width:88px;height:88px;border-radius:50%;display:flex;align-items:center;justify-content:center}
.payment-result__icon svg{width:40px;height:40px;stroke:#fff;stroke-width:2}
.payment-result__icon--success{background:#347247}
.payment-result__icon--failure{background:#c0392b}
.payment-result__card h1{font-size:28px;margin:0}
.payment-result__card p{color:var(--muted);margin:0}
.payment-result__summary{width:100%;background:var(--cream);padding:16px 20px;display:flex;flex-direction:column;gap:8px;font-size:13px}
.payment-result__summary>div{display:flex;justify-content:space-between}
.payment-result__actions{display:flex;gap:12px;width:100%}
.payment-result__actions .button{flex:1;justify-content:center}
.payment-result .button--ghost{border-color:var(--line);color:var(--ink)}
.payment-result__help{font-size:13px;color:var(--muted)}
```

- [ ] **Step 2: Create `app/payment/success/SuccessClient.tsx`**

```tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function SuccessClient({ orderId, amount }: { orderId: string; amount: string }) {
  const { clearCart } = useCart();

  useEffect(() => {
    // Backup — the server-side finalize in page.tsx's initial load is the
    // primary path, but if that request never completed (browser closed
    // mid-redirect, etc.), this fires once the page actually renders.
    // Idempotent server-side.
    if (orderId) {
      fetch("/api/confirm-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      }).catch(() => {});
    }
    clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="payment-result__card">
      <div className="payment-result__icon payment-result__icon--success">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4.5 12.75 6 6 9-13.5"/></svg>
      </div>
      <h1>ההזמנה אושרה!</h1>
      <p>תודה על הרכישה. אישור הזמנה יישלח לכתובת המייל שלכם.</p>
      {(orderId || amount) && (
        <div className="payment-result__summary">
          {orderId && <div><span>מספר הזמנה</span><b>{orderId}</b></div>}
          {amount && <div><span>סכום שחויב</span><b>₪{amount}</b></div>}
        </div>
      )}
      <div className="payment-result__actions">
        <Link className="button button--gold" href="/shop">המשך לקנות</Link>
        <Link className="button button--ghost" href="/">דף הבית</Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `app/payment/success/page.tsx`**

```tsx
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import SuccessClient from "./SuccessClient";
import { finalizeOrder } from "../../../lib/orders";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ Order?: string; Amount?: string }>;
}) {
  const { Order: orderId = "", Amount: amount = "" } = await searchParams;

  // Primary finalize path — fires regardless of client JS, since Hyp only
  // ever redirects the browser here (no server-to-server callback exists).
  if (orderId) {
    await finalizeOrder(orderId);
  }

  return (
    <>
      <Navbar />
      <main id="main" className="payment-result">
        <SuccessClient orderId={orderId} amount={amount} />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Create `app/payment/failure/page.tsx`**

```tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function PaymentFailurePage() {
  const params = useSearchParams();
  const orderId = params.get("Order") ?? "";

  return (
    <>
      <Navbar />
      <main id="main" className="payment-result">
        <div className="payment-result__card">
          <div className="payment-result__icon payment-result__icon--failure">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6l12 12"/></svg>
          </div>
          <h1>התשלום נכשל</h1>
          <p>לא הצלחנו לעבד את התשלום. הכרטיס לא חויב. אנא נסו שוב.</p>
          {orderId && (
            <div className="payment-result__summary">
              <div><span>מספר הזמנה</span><b>{orderId}</b></div>
            </div>
          )}
          <div className="payment-result__actions">
            <Link className="button button--gold" href="/checkout">נסו שוב</Link>
            <Link className="button button--ghost" href="/cart">חזרה לעגלה</Link>
          </div>
          <p className="payment-result__help">
            אם הבעיה חוזרת, <Link href="/contact">צרו קשר</Link> עם שירות הלקוחות שלנו.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Verify**

Run: `npm run dev`, open `http://localhost:3004/payment/success?Order=HT-123-abcdef12&Amount=349`.
Expected: success card renders with the order id and amount, cart is cleared (confirm the header cart count drops to 0 — add an item first, then visit this URL). Open `http://localhost:3004/payment/failure?Order=HT-123-abcdef12` — confirm the failure card renders with "נסו שוב" linking to `/checkout`. Stop the dev server after confirming.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css "app/payment/success/page.tsx" "app/payment/success/SuccessClient.tsx" "app/payment/failure/page.tsx"
git commit -m "Build payment success and failure pages"
```

---

## Task 23: Contact page

**Files:**
- Create: `app/contact/ContactForm.tsx`
- Create: `app/contact/page.tsx`

**Interfaces:**
- Consumes: `InnerHeader`/`InnerFooter` (Task 8), `WhatsAppContactLink` (Task 7); CRM's public `POST /submit` endpoint (per `adding-new-sites.md` §9, body `{ name, email, phone, message }`).
- Produces: `/contact` — replaces the source site's `mailto:` hack (`contact.html` line 7) with a real submission to the CRM's lead-capture endpoint.

- [ ] **Step 1: Create `app/contact/ContactForm.tsx`**

Ported from `dist/client/contact.html` line 5 (form markup), with the submit handler replaced — the source site's `mailto:` link is dropped in favor of the CRM's public `/submit` endpoint:

```tsx
"use client";

import { useState, type FormEvent } from "react";

const SUBJECTS = ["ייעוץ לפני רכישה", "שירות ואחריות", "משלוח והזמנה", "אחר"];

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: SUBJECTS[0], message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CRM_URL}/api/${process.env.NEXT_PUBLIC_CRM_SITE_SLUG}/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            message: `[${form.subject}] ${form.message}`,
          }),
        }
      );
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return <p className="contact-form__done" role="status">תודה! הפנייה נשלחה בהצלחה ונחזור אליכם בהקדם.</p>;
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>שם מלא<input name="name" required value={form.name} onChange={(e) => set("name")(e.target.value)} /></label>
      <label>טלפון<input name="phone" type="tel" required value={form.phone} onChange={(e) => set("phone")(e.target.value)} /></label>
      <label>אימייל<input name="email" type="email" required value={form.email} onChange={(e) => set("email")(e.target.value)} /></label>
      <label>
        נושא
        <select name="subject" value={form.subject} onChange={(e) => set("subject")(e.target.value)}>
          {SUBJECTS.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
      </label>
      <label className="full">
        איך נוכל לעזור?
        <textarea name="message" rows={5} required value={form.message} onChange={(e) => set("message")(e.target.value)} />
      </label>
      <button type="submit" disabled={status === "sending"}>
        {status === "sending" ? "שולח…" : "שליחת הפנייה"} <span>←</span>
      </button>
      <p role="status">{status === "error" ? "אירעה שגיאה בשליחה. נסו שוב או כתבו לנו בוואטסאפ." : ""}</p>
    </form>
  );
}
```

- [ ] **Step 2: Create `app/contact/page.tsx`**

Ported from `dist/client/contact.html` lines 1-6:

```tsx
import type { Metadata } from "next";
import InnerHeader from "../components/InnerHeader";
import InnerFooter from "../components/InnerFooter";
import ContactForm from "./ContactForm";
import { WhatsAppContactLink } from "../components/WhatsAppButton";

export const metadata: Metadata = {
  title: "יצירת קשר | HTC ישראל",
  description: "יצירת קשר עם HTC ישראל לייעוץ לפני רכישה, שירות, אחריות ומשלוחים.",
};

export default function ContactPage() {
  return (
    <>
      <InnerHeader />
      <section className="inner-hero inner-hero--contact">
        <div className="shell">
          <p>HTC ISRAEL</p>
          <h1>דברו איתנו</h1>
          <span>רכישה, שירות ואחריות</span>
        </div>
      </section>
      <main className="contact-page shell" id="main">
        <div className="contact-intro">
          <p className="kicker kicker--dark">שירות בישראל</p>
          <h2>איך אפשר לעזור?</h2>
          <p>השאירו פרטים. לפנייה על הזמנה, ציינו דגם ומספר הזמנה.</p>
          <div className="contact-details">
            <WhatsAppContactLink />
            <a href="mailto:service@htc-israel.co.il"><b>אימייל</b><span>service@htc-israel.co.il</span></a>
            <div><b>שעות פעילות</b><span>א׳–ה׳ 09:00–17:00</span></div>
          </div>
        </div>
        <ContactForm />
      </main>
      <section className="contact-trust">
        <div className="shell">
          <span><b>♢</b>אחריות בישראל</span>
          <span><b>▰</b>משלוח מהיר</span>
          <span><b>◉</b>שירות אנושי</span>
        </div>
      </section>
      <InnerFooter />
    </>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev`, open `http://localhost:3004/contact`.
Expected: page renders with WhatsApp contact link, email link, hours, and the form. Submit with all fields filled — with `.env.local`'s CRM vars pointing at a running B2BCRM dev server (`localhost:3000`), confirm the "תודה!" message replaces the form; with the CRM unreachable, confirm the inline error message shows instead of a crash. Stop the dev server after confirming.

- [ ] **Step 4: Commit**

```bash
git add app/contact/ContactForm.tsx app/contact/page.tsx
git commit -m "Build contact page with CRM lead submission"
```

---

## Task 24: Legal/info pages (shipping, terms, privacy, accessibility, warranty)

**Files:**
- Create: `app/components/LegalPageLayout.tsx`
- Create: `app/shipping/page.tsx`
- Create: `app/terms/page.tsx`
- Create: `app/privacy/page.tsx`
- Create: `app/accessibility/page.tsx`
- Create: `app/warranty/page.tsx`

**Interfaces:**
- Consumes: `InnerHeader`/`InnerFooter` (Task 8).
- Produces: `<LegalPageLayout heroKicker heroTitle heroSubtitle heroVariant? toc={{href,label}[]}>{children}</LegalPageLayout>`, plus the 5 static content routes. All 5 source pages (`shipping.html`, `terms.html`, `privacy.html`, `accessibility.html`, `warranty.html`) share the exact same `.inner-header` / `.inner-hero` / `.legal-page` (aside + article) / `.inner-footer` structure, so one shared layout replaces 5 copies of that chrome.

Note: the source `warranty.html` used empty `<div id="siteHeader">`/`<div id="siteFooter">` placeholders instead of the real chrome the other 4 pages have (apparently unfinished in the original build) — this task normalizes it to the same `InnerHeader`/`InnerFooter` the other legal pages use, which is what the empty divs were clearly meant to hold.

- [ ] **Step 1: Create `app/components/LegalPageLayout.tsx`**

```tsx
import type { ReactNode } from "react";
import InnerHeader from "./InnerHeader";
import InnerFooter from "./InnerFooter";

interface TocLink {
  href: string;
  label: string;
}

export default function LegalPageLayout({
  heroKicker,
  heroTitle,
  heroSubtitle,
  heroVariant,
  toc,
  children,
}: {
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  heroVariant?: string;
  toc: TocLink[];
  children: ReactNode;
}) {
  return (
    <>
      <InnerHeader />
      <section className={`inner-hero${heroVariant ? ` inner-hero--${heroVariant}` : ""}`}>
        <div className="shell">
          <p>{heroKicker}</p>
          <h1>{heroTitle}</h1>
          <span>{heroSubtitle}</span>
        </div>
      </section>
      <main className="legal-page shell" id="main">
        <aside>
          {toc.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
        </aside>
        <article>{children}</article>
      </main>
      <InnerFooter />
    </>
  );
}
```

- [ ] **Step 2: Create `app/shipping/page.tsx`**

Ported from `dist/client/shipping.html`:

```tsx
import type { Metadata } from "next";
import LegalPageLayout from "../components/LegalPageLayout";

export const metadata: Metadata = {
  title: "משלוחים והחזרות | HTC ישראל",
  description: "מידע על משלוחים, מעקב, החלפות והחזרות בהזמנות HTC ישראל.",
};

export default function ShippingPage() {
  return (
    <LegalPageLayout
      heroKicker="HTC ISRAEL · שירות מקומי"
      heroTitle="משלוחים והחזרות"
      heroSubtitle="כל מה שחשוב לדעת מרגע ההזמנה"
      heroVariant="shipping"
      toc={[
        { href: "#delivery", label: "זמני אספקה" },
        { href: "#cost", label: "עלות משלוח" },
        { href: "#tracking", label: "מעקב" },
        { href: "#returns", label: "החזרות" },
      ]}
    >
      <section id="delivery">
        <h2>זמני אספקה</h2>
        <p>משלוח עד הבית יגיע בדרך כלל בתוך 2–5 ימי עסקים ממועד אישור ההזמנה. יישובים מרוחקים, תקופות עומס או נסיבות שאינן בשליטתנו עשויים להאריך את זמן האספקה.</p>
      </section>
      <section id="cost">
        <h2>עלות משלוח</h2>
        <p>עלות המשלוח תוצג בסל לפני התשלום. הזמנות מעל הסכום המצוין באתר עשויות להיות זכאיות למשלוח חינם בהתאם למבצע הפעיל.</p>
      </section>
      <section id="tracking">
        <h2>מעקב אחר הזמנה</h2>
        <p>לאחר מסירת החבילה לחברת השליחויות יישלח עדכון עם פרטי המעקב. מומלץ לוודא שמספר הטלפון והכתובת הוזנו בצורה מלאה.</p>
      </section>
      <section id="returns">
        <h2>החלפה או החזרה</h2>
        <p>ניתן לפנות לשירות הלקוחות בתוך 14 ימים מקבלת המוצר. המוצר נדרש להיות שלם, ללא שימוש ובאריזה המקורית. לפני שליחת מוצר חזרה יש לקבל אישור והנחיות מהשירות.</p>
      </section>
      <section>
        <h2>מוצר פגום או הזמנה שגויה</h2>
        <p>במקרה של נזק במשלוח, חוסר או אי־התאמה, צרו איתנו קשר בהקדם וצירפו צילום של המוצר והאריזה כדי שנוכל לטפל במהירות.</p>
      </section>
    </LegalPageLayout>
  );
}
```

- [ ] **Step 3: Create `app/terms/page.tsx`**

Ported from `dist/client/terms.html`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "../components/LegalPageLayout";

export const metadata: Metadata = {
  title: "תקנון ותנאי שימוש | HTC ישראל",
  description: "תקנון אתר HTC ישראל ותנאי השימוש, ההזמנה, האחריות וההחזרות.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      heroKicker="HTC ISRAEL · מידע ושירות"
      heroTitle="תקנון ותנאי שימוש"
      heroSubtitle="תנאי הרכישה והשימוש באתר"
      toc={[
        { href: "#general", label: "כללי" },
        { href: "#orders", label: "הזמנות" },
        { href: "#prices", label: "מחירים" },
        { href: "#returns", label: "ביטולים" },
        { href: "#warranty", label: "אחריות" },
      ]}
    >
      <section id="general">
        <h2>1. כללי</h2>
        <p>השימוש באתר והרכישה בו כפופים לתנאים אלה. ביצוע הזמנה מהווה אישור כי המשתמש קרא את התנאים והסכים להם. התמונות באתר מיועדות להמחשה וייתכנו הבדלים קלים בגוון או באריזה.</p>
      </section>
      <section id="orders">
        <h2>2. ביצוע הזמנה</h2>
        <p>רכישה אפשרית לבעלי אמצעי תשלום תקף. אישור אוטומטי על קליטת ההזמנה אינו מהווה אישור סופי; ההזמנה תאושר לאחר בדיקת התשלום והמלאי.</p>
      </section>
      <section id="prices">
        <h2>3. מחירים ותשלום</h2>
        <p>המחירים באתר מוצגים בשקלים וכוללים מע״מ, אלא אם נכתב אחרת. החברה רשאית לעדכן מחירים, מלאי ומבצעים. המחיר המחייב הוא המחיר שהוצג בעת השלמת ההזמנה.</p>
      </section>
      <section id="returns">
        <h2>4. ביטול עסקה והחזרות</h2>
        <p>ביטול עסקה יתבצע בהתאם לחוק הגנת הצרכן. מוצר יוחזר באריזתו המקורית, כשהוא שלם וללא שימוש. מוצרים היגייניים שנפתחו או נעשה בהם שימוש עשויים שלא להיות ניתנים להחזרה, בכפוף לדין.</p>
      </section>
      <section id="warranty">
        <h2>5. אחריות</h2>
        <p>כל מכשירי HTC הנמכרים באתר כוללים 12 חודשי אחריות יבואן רשמי, החל ממועד מסירת המוצר לצרכן ובכפוף להצגת הוכחת רכישה ותעודת האחריות. האחריות חלה על פגמי ייצור ותינתן בישראל באמצעות שירות הלקוחות.</p>
        <p>האחריות אינה חלה על בלאי סביר של להבים, רשתות, מסרקים ואביזרים מתכלים; נזק חיצוני, שבר, קורוזיה או חדירת נוזלים שלא בהתאם לדירוג המוצר; שימוש בניגוד להוראות; שימוש באביזר או ספק כוח לא מתאים; או פתיחה ותיקון בידי גורם שאינו מורשה. אין באמור לגרוע מזכויות הצרכן על פי דין.</p>
        <p><Link href="/warranty">לפרטי האחריות ואופן הפעלתה</Link></p>
      </section>
      <section>
        <h2>6. דין וסמכות שיפוט</h2>
        <p>על השימוש באתר יחולו דיני מדינת ישראל. בכל שאלה ניתן לפנות לשירות הלקוחות דרך <Link href="/contact">עמוד יצירת הקשר</Link>.</p>
      </section>
    </LegalPageLayout>
  );
}
```

- [ ] **Step 4: Create `app/privacy/page.tsx`**

Ported from `dist/client/privacy.html`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "../components/LegalPageLayout";

export const metadata: Metadata = {
  title: "מדיניות פרטיות | HTC ישראל",
  description: "מדיניות הפרטיות של אתר HTC ישראל ואופן הטיפול במידע אישי.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      heroKicker="HTC ISRAEL · מידע ושירות"
      heroTitle="מדיניות פרטיות"
      heroSubtitle="עודכן לאחרונה: 24 ביולי 2026"
      toc={[
        { href: "#intro", label: "הקדמה" },
        { href: "#collect", label: "מידע שנאסף" },
        { href: "#use", label: "שימוש במידע" },
        { href: "#security", label: "אבטחה" },
        { href: "#rights", label: "הזכויות שלכם" },
      ]}
    >
      <section id="intro">
        <h2>1. הקדמה</h2>
        <p>פרטיות המבקרים באתר HTC ישראל חשובה לנו. מסמך זה מסביר איזה מידע נאסף בעת שימוש באתר, כיצד אנו משתמשים בו ואילו אפשרויות עומדות לרשותכם.</p>
      </section>
      <section id="collect">
        <h2>2. מידע שאנו אוספים</h2>
        <p>אנו עשויים לאסוף פרטים שנמסרו בעת פנייה או רכישה, ובהם שם, טלפון, דוא״ל, כתובת למשלוח ופרטי ההזמנה. בנוסף עשוי להיאסף מידע טכני בסיסי כגון סוג מכשיר, דפדפן ועמודים שבהם ביקרתם.</p>
      </section>
      <section id="use">
        <h2>3. שימוש במידע</h2>
        <p>המידע משמש לטיפול בהזמנות, אספקת מוצרים, שירות לקוחות, הפקת חשבוניות, שיפור חוויית השימוש ומניעת הונאות. מסרים שיווקיים יישלחו רק בהתאם להסכמה ובכל עת ניתן לבקש להסירם.</p>
      </section>
      <section>
        <h2>4. עוגיות והעדפות</h2>
        <p>האתר משתמש בעוגיות חיוניות להפעלת הסל, אבטחה ושמירת בחירות. עוגיות פונקציונליות, אנליטיות ושיווקיות יופעלו בהתאם לבחירתכם. ניתן לפתוח בכל עת את כפתור הגדרות העוגיות בתחתית האתר ולשנות את ההעדפות.</p>
      </section>
      <section>
        <h2>5. מסירת מידע לצדדים שלישיים</h2>
        <p>מידע יועבר רק לספקים הדרושים לביצוע השירות, כגון חברת משלוחים, מערכת סליקה וספקי אחסון, או כאשר הדבר נדרש על פי דין.</p>
      </section>
      <section id="security">
        <h2>6. אבטחת מידע</h2>
        <p>אנו נוקטים אמצעים ארגוניים וטכנולוגיים מקובלים להגנת המידע. תשלומים באתר יבוצעו באמצעות ספק סליקה מאובטח, ופרטי כרטיס מלאים אינם נשמרים בשרת האתר.</p>
      </section>
      <section id="rights">
        <h2>7. הזכויות שלכם</h2>
        <p>ניתן לפנות אלינו בבקשה לעיין, לתקן או למחוק מידע אישי בכפוף לדין. לפניות בנושא פרטיות: <Link href="/contact">צרו קשר</Link>.</p>
      </section>
    </LegalPageLayout>
  );
}
```

- [ ] **Step 5: Create `app/accessibility/page.tsx`**

Ported from `dist/client/accessibility.html`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "../components/LegalPageLayout";

export const metadata: Metadata = {
  title: "הצהרת נגישות | HTC ישראל",
  description: "הצהרת הנגישות של אתר HTC ישראל והדרכים לפנות בנושא נגישות.",
};

export default function AccessibilityPage() {
  return (
    <LegalPageLayout
      heroKicker="HTC ISRAEL · אתר לכולם"
      heroTitle="הצהרת נגישות"
      heroSubtitle="מחויבים לחוויית שימוש נגישה"
      toc={[
        { href: "#commitment", label: "המחויבות שלנו" },
        { href: "#features", label: "התאמות" },
        { href: "#limits", label: "מגבלות" },
        { href: "#contact-access", label: "יצירת קשר" },
      ]}
    >
      <section id="commitment">
        <h2>המחויבות שלנו</h2>
        <p>HTC ישראל פועלת לאפשר לאנשים עם מוגבלות להשתמש באתר באופן עצמאי, מכובד ושוויוני. אנו משקיעים בשיפור מתמשך בהתאם להנחיות הנגישות המקובלות ולדרישות הדין.</p>
      </section>
      <section id="features">
        <h2>התאמות שבוצעו באתר</h2>
        <ul>
          <li>מבנה כותרות וסדר ניווט ברור.</li>
          <li>תמיכה בניווט באמצעות מקלדת.</li>
          <li>טקסט חלופי לתמונות מוצר מרכזיות.</li>
          <li>ניגודיות צבעים ברורה ומצבי מיקוד גלויים.</li>
          <li>התאמה למסכים ולרמות הגדלה שונות.</li>
          <li>צמצום תנועה למשתמשים שבחרו בכך במערכת ההפעלה.</li>
        </ul>
      </section>
      <section id="limits">
        <h2>מגבלות ידועות</h2>
        <p>ייתכן שחלק מחומרי המדיה הישנים או מסמכים שמקורם בצד שלישי טרם הונגשו באופן מלא. אנו פועלים לתקן פערים ככל שהם מתגלים.</p>
      </section>
      <section id="contact-access">
        <h2>פנייה בנושא נגישות</h2>
        <p>נתקלתם בקושי? כתבו לנו דרך <Link href="/contact">עמוד יצירת הקשר</Link> וציינו באיזה עמוד נתקלתם בבעיה, באיזה מכשיר ודפדפן השתמשתם ומה הפעולה שניסיתם לבצע.</p>
      </section>
    </LegalPageLayout>
  );
}
```

- [ ] **Step 6: Create `app/warranty/page.tsx`**

Ported from `dist/client/warranty.html`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "../components/LegalPageLayout";

export const metadata: Metadata = {
  title: "אחריות ושירות | HTC ישראל",
  description: "אחריות ושירות למוצרי HTC ישראל — 12 חודשי אחריות יבואן רשמי, אופן הפעלת האחריות ויצירת קשר.",
};

export default function WarrantyPage() {
  return (
    <LegalPageLayout
      heroKicker="HTC ISRAEL · שירות מקומי"
      heroTitle="אחריות שאפשר לסמוך עליה"
      heroSubtitle="12 חודשי אחריות יבואן רשמי לכל מכשיר"
      toc={[
        { href: "#coverage", label: "מה כלול" },
        { href: "#service", label: "הפעלת אחריות" },
        { href: "#exclusions", label: "מה לא כלול" },
        { href: "#contact", label: "יצירת קשר" },
      ]}
    >
      <section id="coverage">
        <h2>12 חודשי אחריות בישראל</h2>
        <p>כל מכשיר HTC שנרכש באתר כולל 12 חודשי אחריות יבואן רשמי ממועד מסירת המוצר. האחריות מכסה פגם שמקורו בייצור, בחומרים או בהרכבה, בכפוף לתעודת האחריות ולהוראות השימוש.</p>
      </section>
      <section id="service">
        <h2>איך מפעילים אחריות?</h2>
        <p>פונים לשירות הלקוחות עם שם מלא, מספר הזמנה, דגם המכשיר ותיאור התקלה. מומלץ לצרף תמונה או סרטון קצר. לאחר בדיקה ראשונית תקבלו הנחיות למסירת המוצר לבדיקה, תיקון או החלפה בהתאם למקרה ולהוראות הדין.</p>
      </section>
      <section id="exclusions">
        <h2>מה אינו מכוסה?</h2>
        <p>בלאי סביר של להבים, רשתות, מסרקים ואביזרים מתכלים; שבר או נזק חיצוני; חדירת נוזלים שלא בהתאם לדירוג המוצר; שימוש בניגוד להוראות; אביזר או ספק כוח לא מתאים; ותיקון או פתיחה בידי גורם שאינו מורשה.</p>
        <p>הנוסח המלא בתעודת האחריות המצורפת למוצר הוא הקובע, ואין בתנאים אלה כדי לגרוע מזכויות הצרכן על פי דין.</p>
      </section>
      <section id="contact">
        <h2>אנחנו כאן לעזור</h2>
        <p>לשירות ואחריות פנו דרך <Link href="/contact">עמוד יצירת הקשר</Link> ובחרו בנושא "שירות ואחריות".</p>
      </section>
    </LegalPageLayout>
  );
}
```

- [ ] **Step 7: Verify**

Run: `npm run dev`, visit `/shipping`, `/terms`, `/privacy`, `/accessibility`, `/warranty`. Expected: each renders its hero, table-of-contents anchors scroll to the matching section, and inline links (`/warranty`, `/contact`) navigate correctly. Stop the dev server after confirming.

- [ ] **Step 8: Commit**

```bash
git add app/components/LegalPageLayout.tsx app/shipping/page.tsx app/terms/page.tsx app/privacy/page.tsx app/accessibility/page.tsx app/warranty/page.tsx
git commit -m "Build shipping, terms, privacy, accessibility, and warranty pages"
```

---

## Task 25: Revalidate route, metadata polish, and production build check

**Files:**
- Create: `app/api/revalidate/route.ts`
- Modify: `app/layout.tsx` (metadata: `metadataBase`, favicon)

**Interfaces:**
- Produces: `POST /api/revalidate` (the CRM-facing endpoint every site must expose per `adding-new-sites.md` §6).
- Verifies: the entire app builds cleanly for production.

- [ ] **Step 1: Create `app/api/revalidate/route.ts`**

Ported directly from `adding-new-sites.md` §6 (identical pattern to every other site in the workspace):

```ts
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { secret, path } = await request.json();
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidatePath(path ?? "/");
  return NextResponse.json({ revalidated: true, path });
}
```

- [ ] **Step 2: Add `metadataBase` and a favicon to `app/layout.tsx`'s metadata**

In `app/layout.tsx`, replace:

```tsx
export const metadata: Metadata = {
  title: "HTC ישראל | מכונות תספורת וגילוח",
  description: "HTC ישראל — מכונות תספורת, טרימרים ומכונות גילוח עם אחריות ושירות בישראל.",
  manifest: "/site.webmanifest",
};
```

with:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3004"),
  title: "HTC ישראל | מכונות תספורת וגילוח",
  description: "HTC ישראל — מכונות תספורת, טרימרים ומכונות גילוח עם אחריות ושירות בישראל.",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/assets/brand/htc-logo-black.png",
  },
};
```

- [ ] **Step 3: Verify the revalidate route**

Run: `npm run dev`, then:

```bash
curl -s -X POST http://localhost:3004/api/revalidate -H "Content-Type: application/json" -d '{"secret":"wrong","path":"/"}'
```

Expected: `{"error":"Unauthorized"}` with a 401 status (confirms the secret check works even with `REVALIDATE_SECRET` unset in `.env.local` — an unset env var never equals the string `"wrong"`). Stop the dev server after confirming.

- [ ] **Step 4: Run a full production build**

Run: `npm run build`
Expected: build completes with no TypeScript or ESLint errors. This is the first point where every file from every prior task is compiled together — fix any cross-task type mismatches this surfaces (e.g. a prop name that drifted between where a component was defined and where it's used) before proceeding.

- [ ] **Step 5: Commit**

```bash
git add app/api/revalidate/route.ts app/layout.tsx
git commit -m "Add revalidate endpoint and finalize site metadata"
```

---

## Task 26: README and full end-to-end verification

**Files:**
- Create: `README.md`

**Interfaces:**
- Produces: setup documentation for whoever creates the CRM Site and Hyp credentials; a full manual walkthrough of every route built in Tasks 1-25.

- [ ] **Step 1: Create `README.md`**

```md
# htc-israel

Next.js storefront for HTC ישראל (hair clippers/trimmers/shavers), integrated with B2BCRM.
Dev port: **3004**.

## Setup

1. In B2BCRM admin (`/admin/sites/new`), create a Site (slug `htc-israel`, revalidate URL
   `http://localhost:3004` in dev). Copy the generated `apiKey` and `revalidateSecret`.
2. In CRM admin, create 3 categories (`clipper`, `trimmer`, `shaver`) and add products matching
   `lib/products-data.ts`'s handles (`at-799`, `at-599`, `at-158`, `at-735`, `at-570`, `gt-667`) —
   or leave the CRM empty for now; the storefront falls back to the local static catalog.
3. `cp .env.local.example .env.local` and fill in `CRM_API_KEY`, `REVALIDATE_SECRET`, and
   `HYP_MASOF`/`HYP_KEY`/`HYP_PASSP` (reused from polarizedx — same merchant account).
4. `npm install && npm run dev`

## Architecture notes

- No Tailwind — `app/globals.css` is a near-verbatim port of the original static site's custom
  CSS design system. Build UI against its existing class names, not new utility classes.
- Product editorial content (specs, FAQ answers, "story" copy) and compare-at pricing live in
  `lib/product-content.ts`, not in CRM — see the design spec for why.
- Orders use the CheckoutIntent pattern (`lib/orders.ts`): nothing is written to the CRM as a
  real `Order` until Hyp Pay redirects the customer back to `/payment/success`.

## Go-live checklist

- [ ] Site created in CRM; `apiKey` + `revalidateSecret` copied into the deploy's env vars
- [ ] `revalidateUrl` on the Site updated to the production storefront URL
- [ ] Vercel env vars set with production values (`CRM_URL=https://www.ducks.co.il`)
- [ ] No secret behind a `NEXT_PUBLIC_` prefix
- [ ] Real Hyp Pay terminal confirmed (polarizedx's, unless this site gets its own later)
- [ ] Products created/activated in CRM (or intentionally left on the static fallback)
```

- [ ] **Step 2: Full manual walkthrough**

Run: `npm run dev` and, with `.env.local` pointing at a running B2BCRM dev server (`localhost:3000`) if available (otherwise the static fallback data is exercised instead — both are valid to verify), check every route in a browser:

- `/` — hero, benefits, product grid, brand story, why section, service section all render; add-to-cart works from a product card.
- `/shop` — category filter works; all 6 products visible under "הכול".
- `/shop/at-799` through `/shop/gt-667` — each product detail page renders correctly, including the AT-799-only editorial section.
- `/compare` — presets and manual selection both work; spec table columns match selection.
- `/cart` — empty and populated states both render; quantity controls and remove work.
- `/checkout` — shipping form validation, coupon field (test against a real coupon if the CRM has one), and the Hyp Pay redirect attempt (will show the "credentials not configured" error until real Hyp values are in `.env.local`).
- `/payment/success` and `/payment/failure` — render correctly with query params.
- `/contact` — form submits to the CRM (or shows the inline error if the CRM is unreachable).
- `/shipping`, `/terms`, `/privacy`, `/accessibility`, `/warranty` — all render with working TOC anchors.
- Global chrome on every page: cart slide-out opens/closes, accessibility widget changes persist across a reload, cookie banner accept/manage flow works, WhatsApp floating button links out correctly, mobile nav hamburger works at a narrow viewport width.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "Add README with setup instructions and go-live checklist"
```

