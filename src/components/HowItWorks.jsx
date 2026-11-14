import Reveal from "./Reveal.jsx";
import laundry640 from "@pictures/web/laundry-640.webp";
import laundry1200 from "@pictures/web/laundry-1200.webp";
import closet640 from "@pictures/web/closet-640.webp";
import closet1200 from "@pictures/web/closet-1200.webp";
import rides640 from "@pictures/web/rides-640.webp";
import rides1200 from "@pictures/web/rides-1200.webp";

const steps = [
  {
    num: 1,
    title: "משאירים פרטים",
    text: "שתי דקות, בלי טפסים ארוכים.",
    image: { small: laundry640, large: laundry1200, alt: "ערימת בגדים מקופלים ומגהץ" },
  },
  {
    num: 2,
    title: "שיחת היכרות קצרה",
    text: "מבינים מה הכי דחוף לכם עכשיו.",
    image: { small: closet640, large: closet1200, alt: "ארון בגדים מסודר" },
  },
  {
    num: 3,
    title: "קובעים לו״ז קבוע",
    text: "אותו צוות, אותו יום, כל שבוע.",
    image: { small: rides640, large: rides1200, alt: "ילדים מחייכים בהסעה" },
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
