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
