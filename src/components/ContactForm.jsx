import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, appCheckSiteKey } from "../firebase.js";
import { BUSINESS } from "../legal/business.js";

const SERVICE_OPTIONS = [
  "קיפול כביסה וגיהוץ",
  "סידורי ארונות",
  "הסעות לבית הספר ולחוגים",
  "עוד לא בטוחים",
];

// Bump when the notice / consent wording below changes, so each lead records
// which version the person agreed to.
const CONSENT_VERSION = "2026-11-14.4";

const CONSENT_REQUIRED_MESSAGE = "כדי לשלוח את הטופס יש לסמן את תיבת ההסכמה";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(SERVICE_OPTIONS[0]);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot — stays empty for real people
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  async function handleSubmit(event) {
    event.preventDefault();
    if (!consent) return; // the checkbox is `required`; this is a second guard
    if (website) {
      setStatus("success"); // bot: pretend it worked, store nothing
      return;
    }
    setStatus("submitting");
    const lead = {
      name: name.trim(),
      phone: phone.trim(),
      service,
      consent: true,
      consentVersion: CONSENT_VERSION,
    };
    try {
      await addDoc(collection(db, "leads"), { ...lead, createdAt: serverTimestamp() });
      setStatus("success");
      setName("");
      setPhone("");
      setService(SERVICE_OPTIONS[0]);
      setConsent(false);
    } catch (error) {
      console.error("Failed to save lead", error);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <form className="lead-form">
        <p className="form-status success" role="status">
          תודה! קיבלנו את הפרטים ונחזור אליכם עוד היום.
        </p>
      </form>
    );
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="name">שם מלא</label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="איך קוראים לכם?"
          maxLength={100}
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="phone">טלפון</label>
        <input
          id="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="05X-XXXXXXX"
          pattern={"0[0-9 \\-]{8,12}"}
          title="מספר טלפון ישראלי, לדוגמה 050-1234567"
          maxLength={20}
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="service">מה הכי מעניין אתכם?</label>
        <select id="service" value={service} onChange={(event) => setService(event.target.value)}>
          {SERVICE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website">אתר אינטרנט</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      {/* Duty-to-inform (Privacy Protection Law s.11) + explicit consent, in one block */}
      <label className="consent-check" htmlFor="consent">
        <input
          id="consent"
          type="checkbox"
          checked={consent}
          onChange={(event) => {
            event.target.setCustomValidity("");
            setConsent(event.target.checked);
          }}
          onInvalid={(event) => event.target.setCustomValidity(CONSENT_REQUIRED_MESSAGE)}
          required
        />
        <span>
          <strong>אני מסכים/ה באופן מפורש</strong> ש{BUSINESS.name} ({BUSINESS.owner}) תשמור את
          הפרטים שמסרתי בשירותי ענן מאובטחים, ותשתמש בהם רק כדי לחזור אליי בנוגע
          לשירות. אין חובה חוקית למסור אותם, אבל בלעדיהם לא ניתן לחזור אליי. הפרטים לא יועברו לאחרים,
          ואני יכול/ה לעיין בהם, לתקן, למחוק ולבטל את ההסכמה בכל עת. פרטים ויצירת קשר ב
          <a href="/privacy">מדיניות הפרטיות</a>.
          <span className="required-mark" aria-hidden="true">
            {" "}
            *
          </span>
        </span>
      </label>

      {status === "error" && (
        <p className="form-status error" role="alert">
          משהו השתבש בשליחה. אפשר לנסות שוב, או ליצור קשר ישירות.
        </p>
      )}
      <button
        className="btn btn-primary"
        type="submit"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "שולח…" : "בואו נדבר"}
      </button>
      {appCheckSiteKey && (
        // Required by reCAPTCHA's terms because the floating badge is hidden (it overlapped the WhatsApp button).
        <span className="form-note recaptcha-note">
          האתר מוגן באמצעות reCAPTCHA, וחלים עליו{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            מדיניות הפרטיות
          </a>{" "}
          ו
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
            תנאי השימוש
          </a>{" "}
          של Google.
        </span>
      )}
    </form>
  );
}
