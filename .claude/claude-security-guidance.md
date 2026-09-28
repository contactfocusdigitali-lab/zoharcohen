# Security guidance for this repo

This is a public marketing site (React + Vite) that collects lead data (name, phone,
requested service) from parents into Firebase Firestore. Treat submitted names and
phone numbers as personal data belonging to families, including those inquiring about
child pickup/dropoff.

- Firestore security rules must allow public `create` on the `leads` collection but
  never public `read`, `update`, or `list` — a readable leads collection leaks every
  customer's name and phone number to anyone.
- Never hardcode Firebase config (`apiKey`, etc.) directly in source. It must come from
  `import.meta.env.VITE_FIREBASE_*` as set up in `src/firebase.js`, backed by `.env`.
- Do not log the full lead payload (name/phone) to the console or to any analytics
  event. `console.error` in `ContactForm.jsx` must log only the error object, not the
  form values.
- No `dangerouslySetInnerHTML`, `.innerHTML =`, or `document.write` anywhere in this
  React app. All content renders through JSX.
- If an admin/leads-dashboard view is added later, it must require Firebase
  Authentication plus a role check before reading the `leads` collection — never expose
  lead data on a public, unauthenticated route.
