import { useState, useEffect, useRef } from "react";
import { PhoneApp } from "./PhoneApp.jsx";
import { Icon } from "./Icons.jsx";

const STOPS = [
  {
    id: "home",
    label: "Search & Scan",
    icon: "search",
    route: "home",
    dot: { x: 50, y: 38 },
    callout: {
      title: "Smart Medicine Search",
      body: "Type any medicine name and get instant suggestions. Our autocomplete pulls from a verified drug database so you're always searching the right product.",
    },
  },
  {
    id: "results",
    label: "Nearby Pharmacies",
    icon: "pin",
    route: "results",
    dot: { x: 72, y: 55 },
    callout: {
      title: "Live Prices & Stock",
      body: "Verified pharmacies near you — with real-time stock and price. Tap a result to add it to your cart and check out without leaving the app.",
    },
  },
  {
    id: "reminders",
    label: "Dose Reminders",
    icon: "bell",
    route: "reminders",
    dot: { x: 30, y: 42 },
    callout: {
      title: "Never Miss a Dose",
      body: "Alarms that ring through even on silent. One tap from the notification marks it Taken or Snoozed — no need to open the app.",
    },
  },
  {
    id: "ai",
    label: "AI Assistant",
    icon: "spark",
    route: "ai",
    dot: { x: 50, y: 72 },
    callout: {
      title: "Ask Anything",
      body: "Your personal medicine assistant answers questions in plain language — drug interactions, dosage, side effects — available 24/7, in your language.",
    },
  },
  {
    id: "track",
    label: "Track Order",
    icon: "bag",
    route: "track",
    dot: { x: 50, y: 30 },
    callout: {
      title: "Live Order Tracking",
      body: "Follow your delivery on a live map from the moment the pharmacy dispatches it. Get a push notification at every step, including when it arrives.",
    },
  },
];

const AUTO_ADVANCE_MS = 4000;

export function Demo() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [animating, setAnimating]  = useState(false);
  const timerRef  = useRef(null);
  const tabsRef   = useRef(null);
  const stop = STOPS[activeIdx];

  // Auto-advance
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      goTo((activeIdx + 1) % STOPS.length);
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [activeIdx]);

  // Scroll active tab into view on mobile
  useEffect(() => {
    const rail = tabsRef.current;
    if (!rail) return;
    const activeBtn = rail.children[activeIdx];
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeIdx]);

  function goTo(idx) {
    if (idx === activeIdx) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setAnimating(false);
    }, 220);
    clearTimeout(timerRef.current);
  }

  return (
    <section className="section tour" id="demo">
      <div className="section__head reveal-up">
        <span className="eyebrow">Product Tour</span>
        <h2 className="section__title">See the app, feature by feature.</h2>
        <p className="section__sub">
          Tap any tab to explore a feature. The guide dot shows exactly what to look at.
        </p>
      </div>

      <div className="tour__stage reveal-up reveal-up--delay">

        {/* ── Tab rail — left on desktop, scrollable strip on mobile ── */}
        <aside className="tour__tabs" ref={tabsRef}>
          {STOPS.map((s, i) => (
            <button
              key={s.id}
              className={`tour__tab ${i === activeIdx ? "is-active" : ""}`}
              onClick={() => goTo(i)}
              aria-pressed={i === activeIdx}
            >
              <span className="tour__tab-icon">
                <Icon name={s.icon} size={18} />
              </span>
              <span className="tour__tab-label">{s.label}</span>
              {i === activeIdx && (
                <span className="tour__tab-bar">
                  <span
                    className="tour__tab-bar-fill"
                    style={{ animationDuration: `${AUTO_ADVANCE_MS}ms` }}
                  />
                </span>
              )}
            </button>
          ))}
        </aside>

        {/* ── Phone + hotspot dot ── */}
        <div className="tour__phone-wrap">
          <div className="tour__glow" />
          <PhoneApp
            route={stop.route}
            interactive={false}
            className="phone--tour"
          />
          <div
            className={`tour__dot ${animating ? "tour__dot--hide" : ""}`}
            style={{ left: `${stop.dot.x}%`, top: `${stop.dot.y}%` }}
          >
            <span className="tour__dot-ring" />
            <span className="tour__dot-ring tour__dot-ring--2" />
            <span className="tour__dot-core" />
          </div>
        </div>

        {/* ── Callout card ── */}
        <div className={`tour__callout ${animating ? "tour__callout--hide" : ""}`}>
          <div className="tour__callout-inner">
            <span className="tour__callout-icon">
              <Icon name={stop.icon} size={22} />
            </span>
            <h3 className="tour__callout-title">{stop.callout.title}</h3>
            <p className="tour__callout-body">{stop.callout.body}</p>
          </div>

          <div className="tour__pips">
            {STOPS.map((_, i) => (
              <button
                key={i}
                className={`tour__pip ${i === activeIdx ? "is-active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          <a href="#download" className="btn btn--primary btn--sm tour__dl-btn">
            <Icon name="download" size={16} /> Download the app
          </a>
        </div>

      </div>
    </section>
  );
}
