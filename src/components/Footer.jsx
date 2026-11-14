import { HouseMark } from "./icons.jsx";

export default function Footer() {
  return (
    <footer>
      <div className="wrap footer-row">
        <a href="/" className="footer-brand" aria-label="זוהר לבית, לדף הבית">
          <HouseMark size={24} />
          <span className="brand-text">
            <span className="brand-en">Zohar Cohen</span>
            <span className="brand-he">זוהר לבית</span>
          </span>
        </a>
        <span className="fine">קצת אור, קצת סדר, קצת שקט לבית שלכם.</span>
        <nav className="footer-links" aria-label="מידע משפטי">
          <a href="/privacy">מדיניות פרטיות</a>
          <a href="/accessibility">הצהרת נגישות</a>
        </nav>
        <span className="fine">© 2026 זוהר לבית</span>
      </div>
    </footer>
  );
}
