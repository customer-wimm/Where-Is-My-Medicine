export function Nav({ dark, onToggleTheme }) {
  return (
    <header className="nav">
      <a className="nav__brand" href="#top">
        <img className="nav__logo-img" src="/logo.png" alt="" width={34} height={34} />
        <span>WHERE IS MY <b>MEDICINE</b></span>
      </a>
      <nav className="nav__links">
        <a href="#how">How it works</a>
        <a href="#features">Features</a>
        <a href="#demo">Tour</a>
      </nav>
      <div className="nav__actions">
        <button
          className="nav__theme"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          title="Toggle light / dark"
        >
          {dark ? "☀" : "☾"}
        </button>
        <a href="#download" className="btn btn--ghost btn--sm">Get the app</a>
      </div>
    </header>
  );
}
