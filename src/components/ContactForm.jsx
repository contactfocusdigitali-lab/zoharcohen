import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.js";

const SERVICE_OPTIONS = [
  "קיפול כביסה וגיהוץ",
  "סידורי ארונות",
  "הסעות לבית הספר ולחוגים",
  "עוד לא בטוחים",
];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(SERVICE_OPTIONS[0]);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    try {
      await addDoc(collection(db, "leads"), {
        name,
        phone,
        service,
        createdAt: serverTimestamp(),
      });
      setStatus("success");
      setName("");
      setPhone("");
      setService(SERVICE_OPTIONS[0]);
    } catch (error) {
      console.error("Failed to save lead", error);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <form className="lead-form">
        <p className="form-status success">
          תודה! קיבלנו את הפרטים ונחזור אליכם עוד היום.
        </p>
      </form>
    );
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="name">שם מלא</label>
        <input
          id="name"
          type="text"
          placeholder="איך קוראים לכם?"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="phone">טלפון</label>
        <input
          id="phone"
          type="tel"
          placeholder="05X-XXXXXXX"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="service">מה הכי מעניין אתכם?</label>
        <select
          id="service"
          value={service}
          onChange={(event) => setService(event.target.value)}
        >
          {SERVICE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {status === "error" && (
        <p className="form-status error">
          משהו השתבש בשליחה. אפשר לנסות שוב, או ליצור קשר ישירות.
        </p>
      )}
      <button className="btn btn-primary" type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "שולח…" : "בואי נדבר"}
      </button>
      <span className="form-note">הפרטים נשמרים אצלנו ולא משותפים עם צד שלישי</span>
    </form>
  );
}
