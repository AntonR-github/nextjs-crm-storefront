"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "htc-israel-a11y-v1";

interface A11yPrefs {
  fontSize: "normal" | "lg" | "xl";
  contrast: boolean;
  underlineLinks: boolean;
  reduceMotion: boolean;
}

const DEFAULT_PREFS: A11yPrefs = {
  fontSize: "normal",
  contrast: false,
  underlineLinks: false,
  reduceMotion: false,
};

const FONT_ORDER: A11yPrefs["fontSize"][] = ["normal", "lg", "xl"];
const FONT_NAMES: Record<A11yPrefs["fontSize"], string> = {
  normal: "רגיל",
  lg: "מוגדל",
  xl: "מוגדל מאוד",
};

function readPrefs(): A11yPrefs {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    return stored && typeof stored === "object" ? { ...DEFAULT_PREFS, ...stored } : { ...DEFAULT_PREFS };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export default function AccessibilityWidget() {
  const [prefs, setPrefs] = useState<A11yPrefs>(DEFAULT_PREFS);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setPrefs(readPrefs());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.classList.remove("a11y-font-lg", "a11y-font-xl");
    if (prefs.fontSize === "lg") root.classList.add("a11y-font-lg");
    if (prefs.fontSize === "xl") root.classList.add("a11y-font-xl");
    root.classList.toggle("a11y-contrast", prefs.contrast);
    root.classList.toggle("a11y-underline-links", prefs.underlineLinks);
    root.classList.toggle("a11y-reduce-motion", prefs.reduceMotion);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {}
  }, [prefs, hydrated]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("no-scroll");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("no-scroll");
    };
  }, [open]);

  const cycleFontSize = () => {
    const next = FONT_ORDER[(FONT_ORDER.indexOf(prefs.fontSize) + 1) % FONT_ORDER.length];
    setPrefs((p) => ({ ...p, fontSize: next }));
  };

  const toggle =
    (key: "contrast" | "underlineLinks" | "reduceMotion") =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setPrefs((p) => ({ ...p, [key]: event.target.checked }));
    };

  return (
    <div className="accessibility-widget">
      <button
        className="site-control accessibility-widget__trigger"
        type="button"
        aria-label="פתיחת הגדרות נגישות"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4.5" r="2.2"/><path d="M5 8.5h14M12 7v13M8 12l4 3 4-3M9 20l3-5 3 5"/></svg>
      </button>
      <div
        className="site-dialog-backdrop"
        hidden={!open}
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
      >
        <section className="site-dialog accessibility-widget__dialog" role="dialog" aria-modal="true" aria-labelledby="accessibilityTitle">
          <header>
            <div><small>HTC ISRAEL · ACCESS</small><h2 id="accessibilityTitle">הגדרות נגישות</h2></div>
            <button className="site-dialog__close" type="button" aria-label="סגירת הגדרות נגישות" onClick={() => setOpen(false)}>×</button>
          </header>
          <div className="site-dialog__body">
            <button className="accessibility-font-control" type="button" onClick={cycleFontSize}>
              <span>גודל טקסט</span><b>{FONT_NAMES[prefs.fontSize]}</b>
            </button>
            <label className="site-switch-row">
              <span><b>ניגודיות גבוהה</b><small>הגברת ההבדל בין טקסט לרקע</small></span>
              <input type="checkbox" checked={prefs.contrast} onChange={toggle("contrast")} /><i aria-hidden="true"></i>
            </label>
            <label className="site-switch-row">
              <span><b>הדגשת קישורים</b><small>קו תחתון ברור לכל הקישורים</small></span>
              <input type="checkbox" checked={prefs.underlineLinks} onChange={toggle("underlineLinks")} /><i aria-hidden="true"></i>
            </label>
            <label className="site-switch-row">
              <span><b>הפחתת אנימציות</b><small>עצירת תנועה ומעברים שאינם חיוניים</small></span>
              <input type="checkbox" checked={prefs.reduceMotion} onChange={toggle("reduceMotion")} /><i aria-hidden="true"></i>
            </label>
          </div>
          <footer>
            <a href="/accessibility">להצהרת הנגישות</a>
            <button className="accessibility-reset" type="button" onClick={() => setPrefs({ ...DEFAULT_PREFS })}>
              איפוס הגדרות
            </button>
          </footer>
        </section>
      </div>
    </div>
  );
}
