import { useEffect } from "react";

export default function LegalLayout({ title, children }) {
  useEffect(() => {
    document.title = `${title} | זוהר לבית`;
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <section className="legal">
      <div className="wrap legal-wrap">
        <a href="/" className="legal-back">
          → חזרה לדף הבית
        </a>
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  );
}
