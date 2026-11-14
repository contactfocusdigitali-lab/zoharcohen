import Reveal from "./Reveal.jsx";
import form640 from "@pictures/web/step-form-640.webp";
import form1200 from "@pictures/web/step-form-1200.webp";
import call640 from "@pictures/web/step-call-640.webp";
import call1200 from "@pictures/web/step-call-1200.webp";
import schedule640 from "@pictures/web/step-schedule-640.webp";
import schedule1200 from "@pictures/web/step-schedule-1200.webp";

const steps = [
  {
    num: 1,
    title: "משאירים פרטים",
    text: "שתי דקות, בלי טפסים ארוכים.",
    image: { small: form640, large: form1200, alt: "טופס ״השאירו פרטים״ על לוח כתיבה, ליד טלפון" },
  },
  {
    num: 2,
    title: "שיחת היכרות קצרה",
    text: "מבינים מה הכי דחוף לכם עכשיו.",
    image: { small: call640, large: call1200, alt: "טלפון עם שיחה נכנסת על שולחן, ליד כוס קפה ומחברת" },
  },
  {
    num: 3,
    title: "קובעים לו״ז קבוע",
    text: "אותו צוות, אותו יום, כל שבוע.",
    image: { small: schedule640, large: schedule1200, alt: "לוח שנה שולחני עם ימים מסומנים ושעון מעורר" },
  },
];

export default function HowItWorks() {
  return (
    <section id="how">
      <div className="wrap how-row">
        <span className="how-label">
          איך זה
          <br />
          עובד
        </span>
        <Reveal as="div" className="steps">
          {steps.map((step) => (
            <div className="step" key={step.num}>
              <div className="step-media">
                <img
                  src={step.image.small}
                  srcSet={`${step.image.small} 640w, ${step.image.large} 1200w`}
                  sizes="(max-width: 780px) 7rem, 320px"
                  alt={step.image.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="step-body">
                <span className="num">{step.num}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
