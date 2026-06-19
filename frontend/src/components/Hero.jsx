import { useEffect, useState } from "react";
import { Icon } from "./Icons.jsx";
import { PhoneMockup } from "./PhoneMockup.jsx";
import { DownloadButton } from "./DownloadButton.jsx";

export function Hero() {
  const [stats, setStats] = useState({ downloads: 0, version: "2.0", size_mb: 33 });

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setStats(d))
      .catch(() => {});
  }, []);

  return (
    <section className="hero" id="top">
      <div className="hero__copy">
        <span className="eyebrow"><span className="eyebrow__dot" /> Your pharmacy, in one app</span>
        <h1 className="hero__title">
          Where <span className="grad">is</span> my
          <br /> medicine?
        </h1>
        <p className="hero__lede">
          Scan any medicine, order from verified pharmacies, set dose reminders,
          ask an AI assistant and consult doctors — all in one place.
        </p>
        <div className="hero__cta">
          <DownloadButton label="Download for Android" />
          <a href="#demo" className="btn btn--ghost btn--lg">
            <Icon name="arrow" size={18} /> Try the live demo
          </a>
        </div>
        <div className="hero__meta">
          <div><b>v{stats.version}</b><span>Latest build</span></div>
          <div><b>{stats.size_mb} MB</b><span>APK size</span></div>
          <div><b>{stats.downloads.toLocaleString()}</b><span>Downloads</span></div>
        </div>
        <p className="hero__hint">
          ✦ Move your cursor across the page to peek the {`{`}opposite{`}`} theme.
        </p>
      </div>

      <div className="hero__art">
        <div className="hero__glow" />
        <PhoneMockup screen="home" className="phone--hero phone--float" />
        <PhoneMockup screen="track" className="phone--hero phone--behind" />
      </div>
    </section>
  );
}
