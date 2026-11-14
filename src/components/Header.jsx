import { HouseMark } from "./icons.jsx";

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <a href="/" className="brand" aria-label="זוהר לבית, לדף הבית">
          <HouseMark size={34} />
          <span className="brand-text">
            <span className="brand-en">Zohar Cohen</span>
            <span className="brand-he">זוהר לבית</span>
          </span>
        </a>
        <nav className="primary-nav" aria-label="ניווט ראשי">
          <div className="nav-links">
            <a href="/#services">השירותים</a>
            <a href="/#how">איך זה עובד</a>
            <a href="/#contact">יצירת קשר</a>
          </div>
          <a href="/#contact" className="btn btn-primary btn-small btn-spark">
            בואו נדבר
          </a>
        </nav>
      </div>
    </header>
  );
}
