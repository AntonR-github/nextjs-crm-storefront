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
