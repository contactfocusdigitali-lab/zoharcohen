export function HouseMark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path
        d="M10 30 L32 12 L54 30"
        stroke="var(--blue-deep)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 26 V52 H47 V26"
        stroke="var(--blue-deep)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="27" cy="36" r="2.8" fill="var(--blue-deep)" />
      <circle cx="37" cy="36" r="2.8" fill="var(--blue-deep)" />
      <circle cx="27" cy="45" r="2.8" fill="var(--blue-deep)" />
      <circle cx="37" cy="45" r="2.8" fill="var(--blue-deep)" />
      <path
        d="M50 4 L52.5 10.5 L59 13 L52.5 15.5 L50 22 L47.5 15.5 L41 13 L47.5 10.5 Z"
        fill="var(--accent)"
      />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
      <path d="M4 12l5 5L20 6" />
    </svg>
  );
}

export function IronIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 30c0-3.3 2.7-6 6-6h9c7.7 0 14.6 4.6 17.6 11.7a1 1 0 0 1-.9 1.3H14a5 5 0 0 1-5-5z" />
      <path d="M17 24v-3a3 3 0 0 1 3-3h3" />
      <line x1="12" y1="42" x2="38" y2="42" />
      <path d="M22 11c1.2 1.8 1.2 3.6 0 5" />
      <path d="M29 11c1.2 1.8 1.2 3.6 0 5" />
    </svg>
  );
}

export function ClosetIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="7" width="32" height="35" rx="3" />
      <line x1="24" y1="7" x2="24" y2="42" />
      <line x1="13" y1="16" x2="35" y2="16" />
      <path d="M16 16v2M24 16v2M32 16v2" />
      <line x1="12" y1="34" x2="20" y2="34" />
      <line x1="28" y1="34" x2="36" y2="34" />
    </svg>
  );
}

export function CarIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 15c4.5-3.6 25.5-3.6 30 0" strokeDasharray="1 6" />
      <path d="M8 30V22a3 3 0 0 1 3-3h4l4-7h10l4 7h4a3 3 0 0 1 3 3v8" />
      <path d="M8 30h32v4a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z" />
      <circle cx="15" cy="36" r="2.5" />
      <circle cx="33" cy="36" r="2.5" />
    </svg>
  );
}

export function UserGroupIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

export function ClockIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="24" cy="24" r="17" />
      <path d="M24 14v10l7 5" />
    </svg>
  );
}

export function MessyPileIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="22" width="22" height="10" rx="4" transform="rotate(-9 17 27)" />
      <rect x="18" y="14" width="24" height="10" rx="4" transform="rotate(7 30 19)" />
      <rect x="10" y="6" width="20" height="10" rx="4" transform="rotate(-5 20 11)" />
    </svg>
  );
}

export function NotifBubbleIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 10a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H20l-7 6v-6h-1a4 4 0 0 1-4-4z" />
      <circle cx="34" cy="10" r="6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CoffeeIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 20h22v10a9 9 0 0 1-9 9h-4a9 9 0 0 1-9-9z" />
      <path d="M32 22h3a5 5 0 0 1 0 10h-3" />
      <path d="M16 14c1-2 1-3-1-5M23 14c1-2 1-3-1-5" />
      <line x1="8" y1="39" x2="34" y2="39" />
    </svg>
  );
}

export function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
      <path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.1c1.9 1 4 1.6 6.1 1.6 7 0 12.7-5.6 12.7-12.6C28.7 8.6 23 3 16 3zm0 23c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.3 1.3-4-.3-.4a10.4 10.4 0 0 1-1.7-5.6C5.4 9.7 10.1 5 16 5s10.6 4.7 10.6 10.6S21.9 26 16 26z" />
      <path d="M21.5 18.3c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5s-.7-1.6-.9-2.2c-.2-.5-.4-.5-.6-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.9-.8 2.2-1.5s.3-1.3.2-1.5c-.1-.1-.3-.2-.6-.4z" />
    </svg>
  );
}

export function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7z" />
    </svg>
  );
}
