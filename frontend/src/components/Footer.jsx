// Recognitions, incubators, institutional partners & media — each links out
// to the organisation's official website (opens in a new tab).
const PARTNERS = [
  { name: "DPIIT — Startup India", src: "/dpiit.png", href: "https://www.startupindia.gov.in" },
  { name: "NITI Aayog", src: "/partners/niti-aayog.png", href: "https://www.niti.gov.in" },
  { name: "CSIR — Council of Scientific & Industrial Research", src: "/partners/csir.png", href: "https://www.csir.res.in" },
  { name: "MSME — Micro, Small & Medium Enterprises", src: "/partners/msme.png", href: "https://msme.gov.in" },
  { name: "AIC Techno — Atal Incubation Centre", src: "/partners/aic-techno.png", href: "https://www.aic-techno.com" },
  { name: "GNIPST — Guru Nanak Institute of Pharmaceutical Science & Technology", src: "/partners/gnipst.png", href: "https://www.gnipst.ac.in" },
  { name: "Calcutta Institute of Pharmaceutical Technology & Allied Health Sciences", src: "/partners/ciptahs.png", href: "https://www.ciptulb.in" },
  { name: "Bangla Hunt", src: "/partners/bangla-hunt.png", href: "https://banglahunt.in" },
];

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
            <a
              key={p.name}
              className="footer__badge"
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              title={p.name}
              aria-label={p.name}
            >
              <img src={p.src} alt={p.name} loading="lazy" />
            </a>
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
