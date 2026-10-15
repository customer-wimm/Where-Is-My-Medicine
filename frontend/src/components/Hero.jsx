import { useEffect, useState } from "react";
import { Icon } from "./Icons.jsx";
import { DownloadButton } from "./DownloadButton.jsx";

const HIGHLIGHTS = [
  { icon: "scan", title: "Scan any medicine", text: "Name, uses & dosage in seconds" },
  { icon: "spark", title: "WIMM.ai", text: "Plain-language medicine answers" },
  { icon: "bell", title: "Smart reminders", text: "Never miss a dose" },
  { icon: "pin", title: "Order tracking", text: "Follow delivery to your door" },
];

export function Hero() {
  const [stats, setStats] = useState({ downloads: 10000, version: "1.0", size_mb: 34 });

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setStats(d))
      .catch(() => {});
  }, []);

  return (
    <section className="hero" id="top">
      <div className="hero__copy">
        <span className="eyebrow">Your pharmacy, in one app</span>
        <h1 className="hero__title">
          Where <span className="grad">is</span> my
          <br /> medicine?
        </h1>
        <p className="hero__lede">
          Scan any medicine, order from verified pharmacies, set dose reminders,
          ask WIMM.ai and consult doctors — all in one place.
        </p>
        <div className="hero__cta">
          <DownloadButton label="Download for Android" />
          <a href="#demo" className="btn btn--ghost btn--lg">
            <Icon name="arrow" size={18} /> Take the tour
          </a>
        </div>
        <div className="hero__meta">
          <div><b>v{stats.version}</b><span>Latest build</span></div>
          <div><b>{stats.size_mb} MB</b><span>APK size</span></div>
          <div><b>{stats.downloads.toLocaleString()}</b><span>Downloads</span></div>
        </div>
      </div>

      <div className="hero__art">
        <div className="hero__glow" />
        <div className="hero__panel">
          <div className="hero__panel-top">
            <img src="/logo.png" alt="" width={44} height={44} />
            <span className="hero__panel-brand">WHERE IS MY <b>MEDICINE</b></span>
          </div>
          <ul className="hero__panel-list">
            {HIGHLIGHTS.map((h) => (
              <li key={h.title}>
                <span className="hero__panel-ic"><Icon name={h.icon} size={20} /></span>
                <span><b>{h.title}</b><small>{h.text}</small></span>
              </li>
            ))}
          </ul>
          <a href="#features" className="hero__panel-link">
            Explore all features <Icon name="arrow" size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
