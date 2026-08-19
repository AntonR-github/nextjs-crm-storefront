"use client";

import { useState } from "react";
import Link from "next/link";
import type { StoreProduct } from "../../lib/products-data";

interface CompareModel {
  code: string;
  handle: string;
  name: string;
  image: string;
  shortLabel: string;
  small: string;
  badge?: string;
  summary: string;
  bullets: string[];
}

const MODEL_COPY: Record<string, Omit<CompareModel, "code" | "handle" | "name" | "image">> = {
  "AT-799": { shortLabel: "One Pro", small: "AT‑799 · מקצועית", badge: "הבחירה למקצוענים", summary: "עוצמה יציבה וזמן עבודה ארוך לספרים מקצועיים.", bullets: ["9,000 סל״ד", "עד 360 דקות", "להב DLC"] },
  "AT-735": { shortLabel: "One Plus", small: "AT‑735 · גוף מתכת", summary: "גוף מתכת מלא, שתי מהירויות ואחיזה יציבה.", bullets: ["2 מהירויות", "עד 240 דקות", "5 מסרקים"] },
  "AT-599": { shortLabel: "Edge", small: "AT‑599 · דיוק", summary: "טרימר להב T לקווי מתאר, לזקן ולגימור.", bullets: ["להב T", "עד 200 דקות", "מסך LCD"] },
  "AT-570": { shortLabel: "Trio", small: "AT‑570 · 3 מסרקים", summary: "טרימר להב T עם שלושה מסרקי הגבהה לגימור מדויק.", bullets: ["3 מסרקים", "להב T", "בסיס כלול"] },
  "GT-667": { shortLabel: "Glide", small: "GT‑667 · גילוח", summary: "מגלח חשמלי לגימור נקי בפנים ובצוואר.", bullets: ["2 ראשי גילוח", "ניקוי קל", "גימור נקי"] },
  "AT-158": { shortLabel: "Start", small: "AT‑158 · לבית", summary: "מכונת תספורת נוחה וברורה לשימוש משפחתי.", bullets: ["4 מסרקים", "כיוון אורך", "טעינת USB"] },
};

const specRows: { label: string; values: Record<string, string> }[] = [
  { label: "מתאים במיוחד", values: { "AT-799": "ספרים ועבודה מקצועית", "AT-735": "עבודה מקצועית", "AT-599": "קווים, זקן וגימור", "AT-570": "עיצוב רב־שימושי", "GT-667": "גילוח פנים וצוואר", "AT-158": "תספורת ביתית" } },
  { label: "סוג הכלי", values: { "AT-799": "מכונת תספורת", "AT-735": "מכונת תספורת", "AT-599": "טרימר T", "AT-570": "טרימר להב T", "GT-667": "מגלח חשמלי", "AT-158": "מכונת תספורת" } },
  { label: "מנוע וביצועים", values: { "AT-799": "9,000 סל״ד · מנוע ללא פחמים", "AT-735": "7,000 / 8,000 סל״ד · 2 מהירויות", "AT-599": "לא צוין במפרט", "AT-570": "לא צוין במפרט", "GT-667": "לא צוין במפרט", "AT-158": "לא צוין במפרט" } },
  { label: "זמן עבודה", values: { "AT-799": "עד 360 דקות", "AT-735": "עד 240 דקות", "AT-599": "עד 200 דקות", "AT-570": "לא צוין במפרט", "GT-667": "חיבור לחשמל", "AT-158": "לא צוין במפרט" } },
  { label: "טעינה", values: { "AT-799": "USB‑C · כ־4 שעות", "AT-735": "USB · כ־3.5 שעות", "AT-599": "USB · כ־2.5 שעות", "AT-570": "USB", "GT-667": "כבל חשמל", "AT-158": "USB" } },
  { label: "מערכת חיתוך", values: { "AT-799": "להב קבוע בציפוי DLC", "AT-735": "להב מתכת מקצועי", "AT-599": "להב T קרמי ומתכתי", "AT-570": "להב T עם מסרקי הגבהה", "GT-667": "2 ראשי גילוח", "AT-158": "טבעת כיוון 0.8–2.5 מ״מ" } },
  { label: "מסרקים באריזה", values: { "AT-799": "10 · 1.5–25 מ״מ", "AT-735": "5 · 3/6/10/13/16 מ״מ", "AT-599": "4 · 1.5/3/6/9 מ״מ", "AT-570": "3 · 1/2/3 מ״מ", "GT-667": "ללא", "AT-158": "4 · 1.5/3/6/9 מ״מ" } },
  { label: "בסיס / מעמד", values: { "AT-799": "לא כלול", "AT-735": "לא כלול", "AT-599": "לא כלול", "AT-570": "בסיס כלול", "GT-667": "לא כלול", "AT-158": "לא כלול" } },
];

const presets: Record<string, string[]> = {
  professional: ["AT-799", "AT-735", "AT-599"],
  detail: ["AT-599", "AT-570", "GT-667"],
  home: ["AT-158", "AT-570", "GT-667"],
};

const MAX_SELECTED = 4;

// Fixed display order for this page specifically — matches the original
// static compare.html's hand-arranged sequence, which differs from the
// homepage/shop grid order and from whatever order the CRM returns.
const CODE_ORDER = ["AT-799", "AT-735", "AT-599", "AT-570", "GT-667", "AT-158"];

export default function CompareClient({ products }: { products: StoreProduct[] }) {
  const productByCode = new Map(products.map((product) => [product.handle.toUpperCase(), product]));
  const models: CompareModel[] = CODE_ORDER
    .map((code) => {
      const product = productByCode.get(code);
      const copy = MODEL_COPY[code];
      if (!product || !copy) return null;
      return { code, handle: product.handle, name: product.name, image: product.image, ...copy };
    })
    .filter((m): m is CompareModel => m !== null);

  const [selected, setSelected] = useState<string[]>(["AT-799", "AT-735", "AT-599"]);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  const toggle = (code: string) => {
    const isSelected = selected.includes(code);
    if (isSelected && selected.length === 1) {
      setStatusMessage("יש להשאיר לפחות דגם אחד להשוואה.");
      return;
    }
    if (!isSelected && selected.length >= MAX_SELECTED) {
      setStatusMessage("ניתן להשוות עד ארבעה דגמים במקביל. הסירו דגם אחד כדי להוסיף אחר.");
      return;
    }
    setActivePreset(null);
    setSelected((prev) => (isSelected ? prev.filter((c) => c !== code) : [...prev, code]));
    setStatusMessage(isSelected ? "הדגם הוסר מההשוואה." : "הדגם נוסף להשוואה.");
  };

  const applyPreset = (key: string) => {
    setSelected(presets[key]);
    setActivePreset(key);
    setStatusMessage("מוצגים שלושת הדגמים המתאימים לסוג השימוש שבחרתם.");
    document.getElementById("model-picker")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section className="compare-needs" aria-labelledby="needs-title">
        <div className="shell">
          <div className="compare-section-head">
            <p className="kicker">קיצור דרך לבחירה</p>
            <h2 id="needs-title">מה הכי חשוב לכם?</h2>
          </div>
          <div className="compare-need-grid">
            <button type="button" className={activePreset === "professional" ? "is-active" : undefined} aria-pressed={activePreset === "professional"} onClick={() => applyPreset("professional")}>
              <span>01</span><strong>עבודה מקצועית</strong><small>עוצמה, זמן עבודה ושליטה</small>
            </button>
            <button type="button" className={activePreset === "detail" ? "is-active" : undefined} aria-pressed={activePreset === "detail"} onClick={() => applyPreset("detail")}>
              <span>02</span><strong>קווים וגימור</strong><small>דיוק לזקן, מסגרות וצוואר</small>
            </button>
            <button type="button" className={activePreset === "home" ? "is-active" : undefined} aria-pressed={activePreset === "home"} onClick={() => applyPreset("home")}>
              <span>03</span><strong>טיפוח בבית</strong><small>פשוט, שימושי ונוח למשפחה</small>
            </button>
          </div>
        </div>
      </section>

      <section className="compare-models shell" id="model-picker" aria-labelledby="models-title">
        <div className="compare-section-head compare-section-head--split">
          <div><p className="kicker">שלב 1</p><h2 id="models-title">בחרו דגמים להשוואה</h2></div>
          <div className="compare-selection-status"><b>{selected.length}</b><span>דגמים נבחרו<br />ניתן לבחור עד 4</span></div>
        </div>
        <p className="compare-model-swipe-hint">החליקו לצפייה בדגמים נוספים <span aria-hidden="true">←</span></p>

        <div className="compare-model-grid">
          {models.map((model) => {
            const isSelected = selected.includes(model.code);
            return (
              <article key={model.code} className={isSelected ? "is-selected" : undefined}>
                <div className="compare-card__visual">
                  {model.badge && <span className="compare-card__badge">{model.badge}</span>}
                  <img src={model.image} loading="lazy" decoding="async" alt={`HTC ${model.shortLabel}`} />
                </div>
                <div className="compare-card__body">
                  <small>{model.small}</small>
                  <h3>HTC {model.shortLabel}</h3>
                  <p>{model.summary}</p>
                  <ul>{model.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                </div>
                <div className="compare-card__actions">
                  <button type="button" aria-pressed={isSelected} onClick={() => toggle(model.code)}>
                    {isSelected ? <><span aria-hidden="true">✓</span> נבחר להשוואה</> : <><span aria-hidden="true">＋</span> הוספה להשוואה</>}
                  </button>
                  <Link href={`/shop/${model.handle}`}>לדף המוצר</Link>
                </div>
              </article>
            );
          })}
        </div>
        <p className="compare-live-status" role="status" aria-live="polite">{statusMessage}</p>
      </section>

      <section className="compare-specs" id="comparison-table" aria-labelledby="specs-title">
        <div className="shell">
          <div className="compare-section-head compare-section-head--split">
            <div><p className="kicker">שלב 2</p><h2 id="specs-title">השוואה נקודה מול נקודה</h2></div>
            <p className="compare-scroll-hint">בנייד ניתן להחליק לצדדים <span aria-hidden="true">←</span></p>
          </div>
          <div className="spec-table-wrap" tabIndex={0} aria-label="טבלת השוואת דגמי HTC, ניתן לגלול לצדדים">
            <table className="spec-table">
              <caption className="sr-only">השוואת מפרטים בין דגמי HTC שנבחרו</caption>
              <thead>
                <tr>
                  <th scope="col">פרמטר</th>
                  {models.map((model) => (
                    <th scope="col" key={model.code} hidden={!selected.includes(model.code)}>
                      <b>{model.shortLabel}</b><small>{model.code.replace("-", "‑")}</small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {specRows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    {models.map((model) => (
                      <td key={model.code} hidden={!selected.includes(model.code)}>{row.values[model.code]}</td>
                    ))}
                  </tr>
                ))}
                <tr className="spec-table__cta">
                  <th scope="row">לפרטים</th>
                  {models.map((model) => (
                    <td key={model.code} hidden={!selected.includes(model.code)}>
                      <Link href={`/shop/${model.handle}`}>לדף המוצר</Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
