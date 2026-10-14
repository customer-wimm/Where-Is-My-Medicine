import { useEffect, useState } from "react";
import { Icon } from "./Icons.jsx";
import { DownloadButton } from "./DownloadButton.jsx";

// Placeholder demo pharmacies only — illustrative, not real businesses.
const PREVIEW = [
  { name: "CityCare Pharmacy", dist: "0.8 km", avail: "In stock", price: "₹31" },
  { name: "GreenLeaf Medicals", dist: "1.4 km", avail: "In stock", price: "₹31" },
  { name: "Metro Health Store", dist: "2.1 km", avail: "Low stock", price: "₹31", low: true },
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
        <div className="webcard">
          <div className="webcard__chrome">
            <span className="webcard__dots"><i /><i /><i /></span>
            <span className="webcard__url">
              <Icon name="search" size={12} /> whereismymedicine.com
            </span>
          </div>
          <div className="webcard__body">
            <div className="webcard__loc">
              <Icon name="pin" size={14} />
              <span><small>Searching near</small><b>Koramangala, Bengaluru</b></span>
            </div>
            <div className="webcard__field">
              <Icon name="search" size={18} />
              <span>Dolo 650</span>
            </div>
            <div className="webcard__list">
              {PREVIEW.map((p) => (
                <div className="webcard__row" key={p.name}>
                  <span className="webcard__ic"><Icon name="pin" size={16} /></span>
                  <span className="webcard__info">
                    <b>{p.name}</b>
                    <small>
                      {p.dist} ·{" "}
                      <em className={p.low ? "is-low" : "is-ok"}>{p.avail}</em>
                    </small>
                  </span>
                  <span className="webcard__price">{p.price}</span>
                </div>
              ))}
            </div>
            <span className="webcard__tag">Demo preview · illustrative data</span>
          </div>
        </div>
      </div>
    </section>
  );
}
