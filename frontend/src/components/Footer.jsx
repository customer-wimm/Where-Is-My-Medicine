import { useState } from "react";
import { LegalModal } from "./LegalModal.jsx";

// Recognitions, incubators, institutional partners & media — each links out
// to the organisation's official website (opens in a new tab).
// `label` is a graceful fallback shown inside the chip if the logo image is
// missing, so the footer never renders a broken-image icon.
const PARTNERS = [
  { name: "DPIIT — Startup India", label: "DPIIT", src: "/dpiit.png", href: "https://www.startupindia.gov.in" },
  { name: "AIC Techno — Atal Incubation Centre", label: "AIC Techno", src: "/partners/aic-techno.png", href: "https://www.aic-techno.com" },
  { name: "Bangla Hunt", label: "Bangla Hunt", src: "/partners/bangla-hunt.png", href: "https://banglahunt.com" },
  { name: "MSME — Micro, Small & Medium Enterprises", label: "MSME", src: "/partners/msme.png", href: "https://msme.gov.in" },
  { name: "CSIR — Council of Scientific & Industrial Research", label: "CSIR", src: "/partners/csir.png", href: "https://www.csir.res.in" },
  { name: "Calcutta Institute of Pharmaceutical Technology & Allied Health Sciences", label: "CIPTAHS", src: "/partners/ciptahs.png", href: "https://www.ciptulb.in" },
  { name: "GNIPST — Guru Nanak Institute of Pharmaceutical Science & Technology", label: "GNIPST", src: "/partners/gnipst.png", href: "https://www.gnipst.ac.in" },
  { name: "NITI Aayog", label: "NITI Aayog", src: "/partners/niti-aayog.png", href: "https://www.niti.gov.in" },
];

function PartnerBadge({ name, label, src, href, ariaHidden }) {
  const [failed, setFailed] = useState(false);
  return (
    <a
      className="footer__badge"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={name}
      aria-label={name}
      aria-hidden={ariaHidden || undefined}
      tabIndex={ariaHidden ? -1 : undefined}
    >
      {failed ? (
        <span className="footer__badge-text">{label}</span>
      ) : (
        <img src={src} alt={ariaHidden ? "" : name} loading="lazy" onError={() => setFailed(true)} />
      )}
    </a>
  );
}

export function Footer() {
  const [legal, setLegal] = useState(null); // "privacy" | "terms" | null
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* ── Main columns ── */}
      <div className="footer__main">
        <div className="footer__brand-col">
          <a className="nav__brand" href="#top">
            <img className="nav__logo-img" src="/logo.png" alt="" width={34} height={34} />
            <span>WHERE IS MY <b>MEDICINE</b></span>
          </a>
          <p className="footer__tagline">
            Your medicine, found. Order from verified pharmacies, set reminders,
            track delivery and get safe answers from WIMM.ai — all in one app.
          </p>
          <p className="footer__made">Made for patients, pharmacies &amp; doctors.</p>
        </div>

        <nav className="footer__col" aria-label="Explore">
          <h4 className="footer__col-title">Explore</h4>
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#demo">Tour</a>
        </nav>

        <nav className="footer__col" aria-label="Legal">
          <h4 className="footer__col-title">Legal</h4>
          <button type="button" className="footer__linkbtn" onClick={() => setLegal("privacy")}>
            Privacy Policy
          </button>
          <button type="button" className="footer__linkbtn" onClick={() => setLegal("terms")}>
            Terms of Service
          </button>
        </nav>

        <div className="footer__col">
          <h4 className="footer__col-title">Get in touch</h4>
          <a href="mailto:connect@whereismymedicine.com" className="footer__email">
            connect@whereismymedicine
            <span className="footer__email-tld">.com</span>
          </a>
          <p className="footer__reply">We usually reply within a day.</p>
        </div>
      </div>

      {/* ── Recognitions & partners (auto-scrolling, pauses on hover) ── */}
      <div className="footer__trust">
        <span className="footer__trust-label">Backed &amp; supported by</span>
        <div className="footer__marquee">
          <div className="footer__marquee-track">
            {PARTNERS.map((p) => (
              <PartnerBadge key={p.name} {...p} />
            ))}
            {/* duplicate set makes the scroll loop seamless */}
            {PARTNERS.map((p) => (
              <PartnerBadge key={p.name + "-dup"} {...p} ariaHidden />
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer__bottom">
        <span>Made with ❤️ WHERE IS MY MEDICINE © {year}</span>
        <span className="footer__legal-links">
          <button type="button" className="footer__linkbtn" onClick={() => setLegal("privacy")}>
            Privacy
          </button>
          <span className="footer__dot">•</span>
          <button type="button" className="footer__linkbtn" onClick={() => setLegal("terms")}>
            Terms
          </button>
        </span>
      </div>

      <LegalModal doc={legal} onClose={() => setLegal(null)} />
    </footer>
  );
}
