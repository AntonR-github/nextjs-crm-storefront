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
