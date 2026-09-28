import { WhatsAppIcon } from "./icons.jsx";

export default function WhatsAppFab() {
  return (
    <a
      className="whatsapp-fab"
      href="https://wa.me/972546234513"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="שלחו לנו הודעה בוואטסאפ"
    >
      <WhatsAppIcon />
    </a>
  );
}
