import { HouseMark } from "./icons.jsx";

export default function Header() {
  return (
    <header className="site-header">
      <div className="wrap header-row">
        <div className="brand">
          <HouseMark size={34} />
          <span className="brand-text">
            <span className="brand-en">Zohar Cohen</span>
            <span className="brand-he">זוהר לבית</span>
          </span>
        </div>
        <nav className="primary-nav">
          <div className="nav-links">
            <a href="#services">השירותים</a>
            <a href="#how">איך זה עובד</a>
            <a href="#contact">יצירת קשר</a>
          </div>
          <a href="#contact" className="btn btn-primary btn-small btn-spark">
            קבעו תור ראשון
          </a>
        </nav>
      </div>
    </header>
  );
}
