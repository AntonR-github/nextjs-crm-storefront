import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const esc = (s: string = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const { name, phone, email, message } = await req.json();

  if (
    typeof name !== "string" ||
    typeof phone !== "string" ||
    typeof email !== "string" ||
    (message !== undefined && typeof message !== "string")
  ) {
    return NextResponse.json({ error: "פורמט נתונים שגוי" }, { status: 400 });
  }

  if (!name || !phone || !email) {
    return NextResponse.json({ error: "שדות חובה חסרים" }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "כתובת אימייל לא תקינה" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.verify();
  } catch (verifyErr) {
    console.error("[contact] SMTP verify failed:", verifyErr);
    return NextResponse.json({ error: "SMTP connection failed" }, { status: 500 });
  }

  try {
    await transporter.sendMail({
      from: `"HTC ישראל Website" <noreply@htc-israel.co.il>`,
      to: process.env.SMTP_USER!,
      replyTo: email,
      subject: `פנייה חדשה מהאתר – ${name}`,
      text: `שם: ${name}\nטלפון: ${phone}\nאימייל: ${email}\nהודעה: ${message}`,
      html: `
        <div dir="rtl" style="font-family:sans-serif;font-size:16px">
          <h2>פנייה חדשה מהאתר</h2>
          <p><strong>שם:</strong> ${esc(name)}</p>
          <p><strong>טלפון:</strong> ${esc(phone)}</p>
          <p><strong>אימייל:</strong> ${esc(email)}</p>
          <p><strong>הודעה:</strong><br/>${esc(message) || "—"}</p>
        </div>
      `,
    });
  } catch (sendErr) {
    console.error("[contact] sendMail failed:", sendErr);
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }

  // Save to CRM inbox (non-fatal — email already sent)
  try {
    await fetch(`${process.env.CRM_URL}/api/${process.env.CRM_SITE_SLUG}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.CRM_API_KEY! },
      body: JSON.stringify({ name, phone, email, message }),
    });
  } catch {
    // Non-fatal — email already sent
  }

  return NextResponse.json({ ok: true });
}
