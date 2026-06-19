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
          <a href="#download">Download</a>
        </nav>
      </div>

      {/* ── Trusted by ── */}
      <div className="footer__trust">
        <span className="footer__trust-label">Recognised by</span>
        <div className="footer__trust-badges">
          <img
            src="/dpiit.png"
            alt="DPIIT Start-Up India"
            className="footer__dpiit"
            width={140}
            height={56}
          />
        </div>
      </div>

      {/* ── Contact email ── */}
      <div className="footer__contact">
        <p className="footer__contact-label">Get in touch</p>
        <a href="mailto:connect@whereismymedicine.in" className="footer__email">
          connect@whereismymedicine
          <span className="footer__email-tld">.in</span>
        </a>
      </div>

      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} WHERE IS MY MEDICINE</span>
        <span>Made for patients, pharmacies &amp; doctors.</span>
      </div>
    </footer>
  );
}
