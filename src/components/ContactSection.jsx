import ContactForm from "./ContactForm.jsx";

export default function ContactSection() {
  return (
    <section id="contact">
      <div className="wrap final-cta">
        <div>
          <span className="eyebrow">מוכנים להתחיל?</span>
          <h2>מוכנים לקצת רגיעה?</h2>
          <p className="sub">
            משאירים פרטים, ואנחנו חוזרים אליכם עוד היום לתאם שיחת היכרות קצרה —
            בלי התחייבות.
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
