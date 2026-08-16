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

  // KNOWN LIMITATION: this trusts the client-supplied orderId without
  // verifying with Hyp that a payment actually occurred — see the same
  // note in app/api/confirm-order/route.ts for details and the accepted-risk
  // rationale.
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
