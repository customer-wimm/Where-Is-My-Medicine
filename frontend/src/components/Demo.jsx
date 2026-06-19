import { useState } from "react";
import { PhoneMockup } from "./PhoneMockup.jsx";
import { Icon } from "./Icons.jsx";

const TABS = [
  ["home", "Home", "scan"],
  ["scan", "Scan", "scan"],
  ["ai", "AI Assistant", "spark"],
  ["reminders", "Reminders", "bell"],
  ["track", "Track", "pin"],
];

const NOTES = {
  home: "Your dashboard — search, scan, quick actions and your next dose at a glance.",
  scan: "Point the camera at any strip. We identify it and surface uses, dosage and warnings.",
  ai: "Chat or talk to the assistant for safe, plain-language answers about your medicines.",
  reminders: "Schedule doses; alarms ring through with Taken / Snooze actions.",
  track: "Follow your order from the pharmacy to your door, live.",
};

export function Demo() {
  const [screen, setScreen] = useState("home");

  return (
    <section className="section demo" id="demo">
      <div className="section__head">
        <span className="eyebrow"><span className="eyebrow__dot" /> Live demo</span>
        <h2 className="section__title">Take it for a spin.</h2>
        <p className="section__sub">Tap through the real app screens — no install needed.</p>
      </div>

      <div className="demo__stage">
        <aside className="demo__nav">
          {TABS.map(([id, label, icon]) => (
            <button
              key={id}
              className={`demo__tab ${screen === id ? "is-active" : ""}`}
              onClick={() => setScreen(id)}
            >
              <span className="demo__tab-icon"><Icon name={icon} size={18} /></span>
              {label}
            </button>
          ))}
        </aside>

        <div className="demo__device">
          <div className="hero__glow" />
          <PhoneMockup screen={screen} className="phone--demo" />
        </div>

        <div className="demo__note">
          <p>{NOTES[screen]}</p>
          <a href="#download" className="btn btn--ghost btn--sm">
            <Icon name="download" size={16} /> Get the full app
          </a>
        </div>
      </div>
    </section>
  );
}
