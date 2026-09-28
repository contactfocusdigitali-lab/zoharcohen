import { CheckIcon } from "./icons.jsx";

export default function Hero() {
  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy stagger">
          <span className="eyebrow">זוהר לבית · עזרה אמיתית לבית עמוס</span>
          <h1>
            יש מי שדואג לבית, <span className="glow-word">גם כשאין לכם כוח.</span>
          </h1>
          <p className="sub">
            קיפול כביסה וגיהוץ, סידורי ארונות, והסעות ילדים לבית הספר ולחוגים —
            צוות קבוע שאפשר לסמוך עליו, כל שבוע.
          </p>
          <div className="cta-row">
            <a href="#contact" className="btn btn-primary btn-spark">
              קבעו תור ראשון
            </a>
            <a href="#services" className="btn btn-secondary">
              לשירותים שלנו
            </a>
          </div>
          <span className="microcopy">
            בלי התחייבות ארוכת טווח · חוזרים אליכם תוך יום עסקים
          </span>
          <div className="trust-strip">
            <span>
              <CheckIcon />
              צוות קבוע, לא מתחלף
            </span>
            <span>
              <CheckIcon />
              גמישות לפי הצרכים שלכם
            </span>
            <span>
              <CheckIcon />
              ליווי אישי מהשיחה הראשונה
            </span>
          </div>
        </div>
        <div className="hero-art">
          <svg className="laundry-illo" viewBox="0 0 320 320" fill="none" aria-hidden="true">
            <ellipse cx="160" cy="285" rx="120" ry="16" fill="var(--surface-2)" opacity="0.6" />
            <rect x="60" y="150" width="200" height="40" rx="20" fill="var(--blue-tint)" opacity="0.7" transform="rotate(-2 160 170)" />
            <rect x="75" y="192" width="170" height="32" rx="16" fill="var(--surface)" stroke="var(--border)" transform="rotate(1.5 160 208)" />

            <path
              d="M50,235 C90,150 230,150 270,235"
              stroke="var(--blue)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="1 11"
              opacity="0.65"
            />

            <circle cx="60" cy="222" r="24" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
            <g transform="translate(60,222)" aria-hidden="true">
              <rect x="-14" y="-4" width="28" height="9" rx="4.5" fill="var(--blue)" opacity="0.9" />
              <rect x="-11" y="7" width="22" height="8" rx="4" fill="var(--blue-tint)" />
            </g>

            <circle cx="160" cy="150" r="26" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
            <g
              transform="translate(160,150)"
              stroke="var(--blue-deep)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="-12" y1="-11" x2="12" y2="-11" />
              <path d="M0,-11 v4 M-9,4 L0,-7 L9,4" />
              <line x1="-7" y1="9" x2="7" y2="9" />
            </g>

            <circle cx="260" cy="222" r="24" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.5" />
            <g transform="translate(260,222)" aria-hidden="true">
              <path d="M-9,-6 l4,-7 h10 l4,7" fill="var(--blue)" opacity="0.9" />
              <rect x="-15" y="-6" width="30" height="12" rx="6" fill="var(--blue)" opacity="0.9" />
              <circle cx="-8" cy="8" r="3.4" fill="var(--blue-deep)" />
              <circle cx="8" cy="8" r="3.4" fill="var(--blue-deep)" />
            </g>

            <circle cx="160" cy="60" r="14" fill="var(--accent)" />
            <g className="sun-ray" stroke="var(--blue)" strokeWidth="4" strokeLinecap="round">
              <line x1="160" y1="24" x2="160" y2="34" />
              <line x1="196" y1="60" x2="186" y2="60" />
              <line x1="124" y1="60" x2="134" y2="60" />
              <line x1="184.5" y1="35.5" x2="177.5" y2="42.5" />
              <line x1="135.5" y1="84.5" x2="142.5" y2="77.5" />
              <line x1="184.5" y1="84.5" x2="177.5" y2="77.5" />
              <line x1="135.5" y1="35.5" x2="142.5" y2="42.5" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
