import { ClockIcon, MessyPileIcon, NotifBubbleIcon, CheckIcon, CoffeeIcon } from "./icons.jsx";
import Reveal from "./Reveal.jsx";

export default function ParentStory() {
  return (
    <section className="story">
      <div className="wrap">
        <h2 className="story-title">את מכירה את הבוקר הזה?</h2>
        <div className="story-split">
          <Reveal as="div" className="story-panel story-before">
            <span className="story-time">06:47</span>
            <div className="story-mess" aria-hidden="true">
              <span className="mess-item mess-1">
                <MessyPileIcon />
              </span>
              <span className="mess-item mess-2">
                <ClockIcon />
              </span>
              <span className="mess-item mess-3">
                <NotifBubbleIcon />
              </span>
            </div>
            <p className="story-line">
              את רצה בין ערימת הכביסה, הארון הפתוח, וקבוצת ההורים שכבר שלחה 47
              הודעות על ההסעה שמאחרת.
            </p>
          </Reveal>
          <Reveal as="div" className="story-panel story-after">
            <span className="story-time">06:47</span>
            <ul className="story-checklist">
              <li>
                <CheckIcon />
                הכביסה כבר מקופלת בארון
              </li>
              <li>
                <CheckIcon />
                הארונות מסודרים לפי עונה
              </li>
              <li>
                <CheckIcon />
                ההסעה כבר בדרך, עם המלווה הקבוע
              </li>
            </ul>
            <p className="story-line story-payoff">
              <CoffeeIcon />
              ואת פשוט שותה קפה, בישיבה.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
