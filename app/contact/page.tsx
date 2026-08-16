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
