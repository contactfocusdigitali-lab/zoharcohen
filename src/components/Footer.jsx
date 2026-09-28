import { HouseMark } from "./icons.jsx";

export default function Footer() {
  return (
    <footer>
      <div className="wrap footer-row">
        <div className="footer-brand">
          <HouseMark size={24} />
          <span className="brand-text">
            <span className="brand-en">Zohar Cohen</span>
            <span className="brand-he">זוהר לבית</span>
          </span>
        </div>
        <span className="fine">קצת אור, קצת סדר, קצת שקט לבית שלכם.</span>
        <span className="fine">© 2026 זוהר לבית</span>
      </div>
    </footer>
  );
}
