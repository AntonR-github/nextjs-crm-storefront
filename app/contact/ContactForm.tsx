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
