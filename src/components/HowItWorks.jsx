import Reveal from "./Reveal.jsx";

const steps = [
  { num: 1, title: "משאירים פרטים", text: "שתי דקות, בלי טפסים ארוכים." },
  { num: 2, title: "שיחת היכרות קצרה", text: "מבינים מה הכי דחוף לכם עכשיו." },
  { num: 3, title: "קובעים לו״ז קבוע", text: "אותו צוות, אותו יום, כל שבוע." },
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
              <span className="num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
