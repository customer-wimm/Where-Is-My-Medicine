import { Icon } from "./Icons.jsx";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <a className="nav__brand" href="#top">
          <span className="nav__logo"><Icon name="pill" size={18} /></span>
          <span>WHERE IS MY <b>MEDICINE</b></span>
        </a>
        <nav className="footer__links">
          <a href="#how">How it works</a>
          <a href="#features">Features</a>
          <a href="#demo">Demo</a>
          <a href="#download">Download</a>
        </nav>
      </div>
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} WHERE IS MY MEDICINE</span>
        <span>Made for patients, pharmacies & doctors.</span>
      </div>
    </footer>
  );
}
