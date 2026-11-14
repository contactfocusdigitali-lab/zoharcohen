import { ClockIcon, CarIcon, StressIcon, CheckIcon, SmileIcon, HeartIcon } from "./icons.jsx";
import Reveal from "./Reveal.jsx";
import withPhoto from "@pictures/web/morning-with.webp";
import withoutPhoto from "@pictures/web/morning-without.webp";

const panels = [
  {
    key: "with",
    label: "עם זוהר, הכול כבר מסודר",
    photo: withPhoto,
    alt: "תיק בית ספר ארוז, בקבוק מים ופתק עם לב וסמיילי",
    items: [
      { icon: CheckIcon, text: "הסעות לחוגים בזמן ובקלות" },
      { icon: SmileIcon, text: "שקט נפשי ובוקר רגוע" },
      { icon: HeartIcon, text: "יותר זמן בשביל מה שחשוב" },
    ],
  },
  {
    key: "without",
    label: "בלי זוהר, הבוקר מתחיל בלחץ",
    photo: withoutPhoto,
    alt: "שעון מעורר על שולחן ליד ערימת כביסה ותיק",
    items: [
      { icon: ClockIcon, text: "ריצה בין חוג לחוג" },
      { icon: CarIcon, text: "התעסקות בהסעות" },
      { icon: StressIcon, text: "לחץ ודאגה" },
    ],
  },
];

export default function ParentStory() {
  return (
    <section className="morning" aria-labelledby="morning-title">
      <div className="wrap">
        <div className="morning-head">
          <h2 id="morning-title">
            <span className="morning-underline">אותו בוקר. שתי מציאויות שונות.</span>
          </h2>
          <p className="sub">עם זוהר, הבוקר שלך יכול להיראות אחרת.</p>
        </div>

        <Reveal className="morning-grid">
          {panels.map(({ key, label, photo, alt, items }) => (
            <div className={`morning-card morning-${key}`} key={key}>
              <h3 className="morning-pill">{label}</h3>
              <ul className="morning-list">
                {items.map(({ icon: Icon, text }) => (
                  <li key={text}>
                    <span className="morning-icon">
                      <Icon />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
              <div className="morning-photo">
                <img src={photo} alt={alt} loading="lazy" decoding="async" />
              </div>
            </div>
          ))}
        </Reveal>

        <div className="morning-cta">
          <a href="#contact" className="btn btn-primary btn-large">
            גם אני רוצה בוקר רגוע
            <span aria-hidden="true">←</span>
          </a>
        </div>
      </div>
    </section>
  );
}
