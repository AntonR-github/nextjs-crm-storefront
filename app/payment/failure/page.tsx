import { Suspense } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import FailureClient from "./FailureClient";

export default function PaymentFailurePage() {
  return (
    <>
      <Navbar />
      <main id="main" className="payment-result">
        <Suspense fallback={<div className="payment-result__card">جاري التحميل...</div>}>
          <FailureClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
