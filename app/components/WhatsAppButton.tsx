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
