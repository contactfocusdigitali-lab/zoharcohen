import { useEffect, useRef, useState } from "react";

// Self-hosted accessibility menu: no third-party scripts, no tracking.
// Preferences are saved only in this browser (localStorage) and applied as
// classes on <html>; the matching styles live in index.css under "a11y".

const STORAGE_KEY = "a11y-prefs";
const TEXT_SIZES = [100, 115, 130, 150];

const TOGGLES = [
  { key: "contrast", label: "ניגודיות גבוהה" },
  { key: "grayscale", label: "גווני אפור" },
  { key: "links", label: "הדגשת קישורים" },
  { key: "readable", label: "גופן קריא" },
  { key: "spacing", label: "ריווח טקסט" },
  { key: "noMotion", label: "עצירת אנימציות" },
  { key: "cursor", label: "סמן עכבר גדול" },
];

const DEFAULTS = { textSize: 0, ...Object.fromEntries(TOGGLES.map((t) => [t.key, false])) };

function loadPrefs() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return { ...DEFAULTS, ...saved };
  } catch {
    return DEFAULTS;
  }
}

function applyPrefs(prefs) {
  const root = document.documentElement;
  root.style.fontSize = prefs.textSize ? `${TEXT_SIZES[prefs.textSize]}%` : "";
  for (const { key } of TOGGLES) root.classList.toggle(`a11y-${key}`, !!prefs[key]);
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(loadPrefs);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    applyPrefs(prefs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* storage unavailable: settings still apply for this visit */
    }
  }, [prefs]);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector("button")?.focus();
    function onKey(event) {
      if (event.key === "Escape") close();
    }
    function onClickOutside(event) {
      if (!panelRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));
  const changeText = (delta) =>
    setPrefs((p) => ({ ...p, textSize: Math.min(TEXT_SIZES.length - 1, Math.max(0, p.textSize + delta)) }));
  const isDefault = JSON.stringify(prefs) === JSON.stringify(DEFAULTS);

  return (
    <div className="a11y-widget">
      <button
        ref={buttonRef}
        type="button"
        className="a11y-fab"
        aria-label="תפריט נגישות"
        aria-expanded={open}
        aria-controls="a11y-panel"
        onClick={() => (open ? close() : setOpen(true))}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="4.2" r="2.2" fill="currentColor" />
          <path
            d="M4 8.2c2.6.8 5.3 1.2 8 1.2s5.4-.4 8-1.2M12 9.4v4.8m0 0-3.2 7m3.2-7 3.2 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div id="a11y-panel" ref={panelRef} className="a11y-panel" role="dialog" aria-label="תפריט נגישות">
          <div className="a11y-head">
            <h2>תפריט נגישות</h2>
            <button type="button" className="a11y-close" onClick={close} aria-label="סגירת תפריט הנגישות">
              ✕
            </button>
          </div>

          <div className="a11y-text-size" role="group" aria-label="גודל טקסט">
            <span>גודל טקסט</span>
            <div>
              <button type="button" onClick={() => changeText(-1)} disabled={prefs.textSize === 0} aria-label="הקטנת טקסט">
                א−
              </button>
              <output aria-live="polite">{TEXT_SIZES[prefs.textSize]}%</output>
              <button
                type="button"
                onClick={() => changeText(1)}
                disabled={prefs.textSize === TEXT_SIZES.length - 1}
                aria-label="הגדלת טקסט"
              >
                א+
              </button>
            </div>
          </div>

          <div className="a11y-grid">
            {TOGGLES.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className="a11y-toggle"
                aria-pressed={!!prefs[key]}
                onClick={() => toggle(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="a11y-foot">
            <button type="button" className="a11y-reset" onClick={() => setPrefs(DEFAULTS)} disabled={isDefault}>
              איפוס הגדרות
            </button>
            <a href="/accessibility">הצהרת נגישות</a>
          </div>
        </div>
      )}
    </div>
  );
}
