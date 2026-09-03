import { useState } from "react";

// Recognitions, incubators, institutional partners & media — each links out
// to the organisation's official website (opens in a new tab).
// `label` is a graceful fallback shown inside the chip if the logo image is
// missing, so the footer never renders a broken-image icon.
const PARTNERS = [
  { name: "DPIIT — Startup India", label: "DPIIT", src: "/dpiit.png", href: "https://www.startupindia.gov.in" },
  { name: "NITI Aayog", label: "NITI Aayog", src: "/partners/niti-aayog.png", href: "https://www.niti.gov.in" },
  { name: "CSIR — Council of Scientific & Industrial Research", label: "CSIR", src: "/partners/csir.png", href: "https://www.csir.res.in" },
  { name: "MSME — Micro, Small & Medium Enterprises", label: "MSME", src: "/partners/msme.png", href: "https://msme.gov.in" },
  { name: "AIC Techno — Atal Incubation Centre", label: "AIC Techno", src: "/partners/aic-techno.png", href: "https://www.aic-techno.com" },
  { name: "GNIPST — Guru Nanak Institute of Pharmaceutical Science & Technology", label: "GNIPST", src: "/partners/gnipst.png", href: "https://www.gnipst.ac.in" },
  { name: "Calcutta Institute of Pharmaceutical Technology & Allied Health Sciences", label: "CIPTAHS", src: "/partners/ciptahs.png", href: "https://www.ciptulb.in" },
  { name: "Bangla Hunt", label: "Bangla Hunt", src: "/partners/bangla-hunt.png", href: "https://banglahunt.in" },
];

function PartnerBadge({ name, label, src, href }) {
  const [failed, setFailed] = useState(false);
  return (
    <a
      className="footer__badge"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={name}
      aria-label={name}
    >
      {failed ? (
        <span className="footer__badge-text">{label}</span>
      ) : (
        <img src={src} alt={name} loading="lazy" onError={() => setFailed(true)} />
      )}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <a className="nav__brand" href="#top">
          <img className="nav__logo-img" src="/logo.png" alt="" width={34} height={34} />
          <span>WHERE IS MY <b>MEDICINE</b></span>
        </a>
        <nav className="footer__links">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#demo">Tour</a>
        </nav>
      </div>

      {/* ── Recognitions & partners ── */}
      <div className="footer__trust">
        <span className="footer__trust-label">Backed &amp; supported by</span>
        <div className="footer__trust-badges">
          {PARTNERS.map((p) => (
            <PartnerBadge key={p.name} {...p} />
          ))}
        </div>
      </div>

      {/* ── Contact email ── */}
      <div className="footer__contact">
        <p className="footer__contact-label">Get in touch</p>
        <a href="mailto:connect@whereismymedicine.com" className="footer__email">
          connect@whereismymedicine
          <span className="footer__email-tld">.com</span>
        </a>
      </div>

      <div className="footer__bottom">
        <span>Made with ❤️ WHERE IS MY MEDICINE © {new Date().getFullYear()}</span>
        <span className="footer__dot">•</span>
        <span>Made for patients, pharmacies &amp; doctors.</span>
      </div>
    </footer>
  );
}
