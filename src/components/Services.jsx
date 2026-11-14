import { IronIcon, ClosetIcon, CarIcon } from "./icons.jsx";
import Reveal from "./Reveal.jsx";
import laundry640 from "@pictures/web/laundry-640.webp";
import laundry1200 from "@pictures/web/laundry-1200.webp";
import closet640 from "@pictures/web/closet-640.webp";
import closet1200 from "@pictures/web/closet-1200.webp";
import rides640 from "@pictures/web/rides-640.webp";
import rides1200 from "@pictures/web/rides-1200.webp";

const services = [
  {
    icon: IronIcon,
    title: "קיפול כביסה וגיהוץ",
    text: "כביסה נכנסת בערימה, יוצאת מקופלת, מגוהצת ומסודרת בארון. כל שבוע, באותו יום קבוע.",
    badge: "הכי מבוקש",
    image: { small: laundry640, large: laundry1200, alt: "חולצות ומגבות מקופלות על קרש גיהוץ, לצד מגהץ אדים" },
  },
  {
    icon: ClosetIcon,
    title: "סידורי ארונות",
    text: "מארון הילדים ועד ארון ההורים, בונים סדר לפי קטגוריה ועונה שבאמת נשאר ככה.",
    image: { small: closet640, large: closet1200, alt: "ארון בגדים מסודר עם חולצות תלויות, מגבות מקופלות וסלי קש" },
  },
  {
    icon: CarIcon,
    title: "הסעות לבית הספר ולחוגים",
    text: "איסוף והחזרה מבית הספר וחוגים, בזמן, עם אותו מלווה קבוע שהילדים כבר מכירים.",
    image: { small: rides640, large: rides1200, alt: "ילדים חגורים ומחייכים בהסעה לחוגים" },
  },
];

export default function Services() {
  return (
    <section id="services">
      <div className="wrap">
        <h2 className="services-title">מה מקבלים, בלי להתפשר</h2>
        <Reveal className="service-grid">
          {services.map(({ icon: Icon, title, text, badge, image }, index) => (
            <div className={`service-card${index === 0 ? " featured" : ""}`} key={title}>
              <div className="service-media">
                <img
                  src={image.small}
                  srcSet={`${image.small} 640w, ${image.large} 1200w`}
                  sizes={index === 0 ? "(max-width: 900px) 100vw, 640px" : "(max-width: 900px) 100vw, 480px"}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                />
                {badge && <span className="badge">{badge}</span>}
              </div>
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
