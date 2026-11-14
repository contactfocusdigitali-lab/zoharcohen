import { BUSINESS } from "./business.js";

export default function ContactDetails({ contactName }) {
  return (
    <ul className="legal-contact">
      {contactName && (
        <li>
          <strong>שם:</strong> {contactName}
        </li>
      )}
      <li>
        <strong>טלפון:</strong>{" "}
        <a href={BUSINESS.phoneHref} dir="ltr">
          {BUSINESS.phone}
        </a>
      </li>
      <li>
        <strong>וואטסאפ:</strong>{" "}
        <a href={BUSINESS.whatsappHref} target="_blank" rel="noopener noreferrer">
          שליחת הודעה (נפתח בחלון חדש)
        </a>
      </li>
      {BUSINESS.email && (
        <li>
          <strong>דוא״ל:</strong>{" "}
          <a href={`mailto:${BUSINESS.email}`} dir="ltr">
            {BUSINESS.email}
          </a>
        </li>
      )}
    </ul>
  );
}
