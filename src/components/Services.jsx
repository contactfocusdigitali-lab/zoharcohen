import { IronIcon, ClosetIcon, CarIcon } from "./icons.jsx";
import Reveal from "./Reveal.jsx";

const services = [
  {
    icon: IronIcon,
    title: "קיפול כביסה וגיהוץ",
    text: "כביסה נכנסת בערימה, יוצאת מקופלת, מגוהצת ומסודרת בארון. כל שבוע, באותו יום קבוע.",
    badge: "הכי מבוקש",
  },
  {
    icon: ClosetIcon,
    title: "סידורי ארונות",
    text: "מארון הילדים ועד ארון ההורים — בונים סדר לפי קטגוריה ועונה, שבאמת נשאר ככה.",
  },
  {
    icon: CarIcon,
    title: "הסעות לבית הספר ולחוגים",
    text: "איסוף והחזרה מבית הספר וחוגים, בזמן — עם אותו מלווה קבוע שהילדים כבר מכירים.",
  },
];

export default function Services() {
  return (
    <section id="services">
      <div className="wrap">
        <h2 className="services-title">מה מקבלים, בלי להתפשר</h2>
        <Reveal className="service-grid">
          {services.map(({ icon: Icon, title, text, badge }, index) => (
            <div className={`service-card${index === 0 ? " featured" : ""}`} key={title}>
              {badge && <span className="badge">{badge}</span>}
              <div className="service-icon">
                <Icon />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
