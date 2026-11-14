import { CheckIcon } from "./icons.jsx";
import heroIllustration from "@pictures/web/hero-illustration.webp";

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
            קיפול כביסה וגיהוץ, סידורי ארונות, והסעות ילדים לבית הספר ולחוגים. צוות קבוע
            שאפשר לסמוך עליו, כל שבוע.
          </p>
          <div className="cta-row">
            <a href="#contact" className="btn btn-primary btn-spark">
              בואו נדבר
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
          <img
            className="hero-illustration"
            src={heroIllustration}
            alt="לוח שנה עם ימים מסומנים, תיק בית ספר, מגבות מקופלות, רכב וסל כביסה"
            width="700"
            height="530"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
