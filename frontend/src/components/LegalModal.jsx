import { useEffect } from "react";

const CONTACT_EMAIL = "connect@whereismymedicine.com";
const UPDATED = "September 2026";

// NOTE: This is a sensible starting template written for the app's features
// (medicine ordering, reminders, delivery tracking and the WIMM.ai assistant).
// Have it reviewed by a legal professional before relying on it.
const DOCS = {
  privacy: {
    title: "Privacy Policy",
    intro:
      "Where Is My Medicine (“WIMM”, “we”, “us”) is committed to protecting your privacy. This policy explains what we collect, why, and the choices you have.",
    sections: [
      {
        heading: "Information we collect",
        body: "Account details you provide (name, phone number, email, delivery address); medicine and prescription information you add to place orders or set reminders; order and delivery history; questions you ask WIMM.ai; and basic device and usage data that helps the app run reliably.",
      },
      {
        heading: "How we use your information",
        body: "To fulfil and deliver your medicine orders, send reminders and refill alerts, connect you with verified pharmacies and doctors, answer your questions through WIMM.ai, keep your account secure, and improve the service.",
      },
      {
        heading: "How we share information",
        body: "We share only what is needed to serve you — for example, order details with the pharmacy fulfilling it and address details with the delivery partner. We use trusted service providers under confidentiality obligations. We do not sell your personal or health information.",
      },
      {
        heading: "Data security",
        body: "We use encryption in transit, access controls and other safeguards to protect your data. No system is perfectly secure, so we also encourage you to keep your account credentials private.",
      },
      {
        heading: "Your choices & rights",
        body: "You can view and update your profile, manage reminders, and request a copy or deletion of your account data at any time by contacting us. You may opt out of non-essential notifications from within the app.",
      },
      {
        heading: "Children",
        body: "WIMM is intended for use by adults. If a minor's medicines are managed through the app, this should be done by a parent or guardian.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    intro:
      "These terms govern your use of the Where Is My Medicine app and website. By using WIMM you agree to them.",
    sections: [
      {
        heading: "Using the service",
        body: "You agree to provide accurate information, use WIMM only for lawful purposes, and keep your account secure. You are responsible for activity that happens under your account.",
      },
      {
        heading: "Not medical advice",
        body: "WIMM helps you find, order and manage medicines and offers general information through WIMM.ai. It is not a substitute for professional medical advice, diagnosis or treatment. Always consult a qualified doctor or pharmacist, and in an emergency contact local emergency services.",
      },
      {
        heading: "Orders & pharmacies",
        body: "Medicines are dispensed by government-registered, verified pharmacies on our platform. Availability, pricing and prescription requirements are set by those pharmacies and applicable law. Some medicines require a valid prescription.",
      },
      {
        heading: "Prescriptions",
        body: "Where a prescription is required, you must provide a valid one. Pharmacies may decline or hold an order that does not meet legal or clinical requirements.",
      },
      {
        heading: "Limitation of liability",
        body: "WIMM is provided “as is”. To the extent permitted by law, we are not liable for indirect or consequential damages arising from use of the service. Nothing here limits liability that cannot be limited by law.",
      },
      {
        heading: "Changes to these terms",
        body: "We may update these terms as the service evolves. Continued use after an update means you accept the revised terms.",
      },
    ],
  },
};

export function LegalModal({ doc, onClose }) {
  useEffect(() => {
    if (!doc) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [doc, onClose]);

  if (!doc) return null;
  const data = DOCS[doc];
  if (!data) return null;

  return (
    <div className="legal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={data.title}>
      <div className="legal-card" onClick={(e) => e.stopPropagation()}>
        <div className="legal-card__head">
          <div>
            <h2 className="legal-card__title">{data.title}</h2>
            <p className="legal-card__updated">Last updated {UPDATED}</p>
          </div>
          <button className="legal-card__close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>
        <div className="legal-card__body">
          <p className="legal-card__intro">{data.intro}</p>
          {data.sections.map((s) => (
            <section key={s.heading} className="legal-card__section">
              <h3 className="legal-card__heading">{s.heading}</h3>
              <p className="legal-card__text">{s.body}</p>
            </section>
          ))}
          <p className="legal-card__contact">
            Questions? Email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
