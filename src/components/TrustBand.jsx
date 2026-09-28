import { UserGroupIcon, MessageIcon, CheckIcon } from "./icons.jsx";
import Reveal from "./Reveal.jsx";

const points = [
  {
    icon: UserGroupIcon,
    title: "אותו מלווה קבוע",
    text: "לא מחליפים אנשים כל שבוע — הילדים מכירים מי מגיע.",
  },
  {
    icon: MessageIcon,
    title: "עדכון בכל איסוף והגעה",
    text: "הודעה קצרה שהילד עלה לרכב, והודעה שהגיע ליעד.",
  },
  {
    icon: CheckIcon,
    title: "מכירים לפני שמתחילים",
    text: "אפשר לפגוש את הצוות ולשאול כל שאלה לפני שקובעים לוח זמנים קבוע.",
  },
];

export default function TrustBand() {
  return (
    <section className="trust-band">
      <div className="wrap">
        <Reveal>
          <span className="eyebrow">בטיחות וילדים</span>
          <h2>כשזה נוגע לילדים</h2>
          <p className="lead" style={{ marginTop: "0.75rem" }}>
            הסעת ילדים היא לא עוד משימה ברשימה — זו שאלה של אמון. ככה אנחנו
            בונים אותו:
          </p>
        </Reveal>
        <Reveal className="trust-points">
          {points.map(({ icon: Icon, title, text }) => (
            <div className="trust-point" key={title}>
              <Icon />
              <div>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
