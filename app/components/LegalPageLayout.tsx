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
