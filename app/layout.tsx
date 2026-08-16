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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3004"),
  title: "HTC ישראל | מכונות תספורת וגילוח",
  description: "HTC ישראל — מכונות תספורת, טרימרים ומכונות גילוח עם אחריות ושירות בישראל.",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/assets/brand/htc-logo-black.png",
  },
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
