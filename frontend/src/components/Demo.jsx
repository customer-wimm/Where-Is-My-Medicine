import { useState } from "react";
import { PhoneApp } from "./PhoneApp.jsx";
import { Icon } from "./Icons.jsx";
import { DownloadButton } from "./DownloadButton.jsx";

const TABS = [
  ["home", "Home", "search"],
  ["results", "Pharmacies", "pin"],
  ["reminders", "Reminders", "bell"],
  ["ai", "WIMM.ai", "spark"],
  ["track", "Track order", "bag"],
];

const NOTES = {
  home: "Type a medicine (try “para” or “azith”), tap a suggestion to add it, set your radius, then hit search — exactly like the app.",
  results: "Real pharmacies near you with live price and stock. Tap “Add to cart” — the cart badge updates, then checkout to track.",
  reminders: "Tick a dose off, or add a new reminder. In the app these fire as alarms with Taken / Snooze actions.",
  ai: "Ask WIMM.ai anything about your medicines — type a question and send. It replies with safe, plain-language guidance.",
  track: "Follow your order live from the pharmacy to your door, then mark it delivered.",
};

export function Demo() {
  const [route, setRoute] = useState("home");

  return (
    <section className="section demo" id="demo">
      <div className="section__head">
        <span className="eyebrow"><span className="eyebrow__dot" /> Live demo</span>
        <h2 className="section__title">Not a video — the real app, in your browser.</h2>
        <p className="section__sub">
          Tap around inside the phone and actually perform tasks. No install needed.
        </p>
      </div>

      <div className="demo__stage">
        <aside className="demo__nav">
          {TABS.map(([id, label, icon]) => (
            <button
              key={id}
              className={`demo__tab ${route === id ? "is-active" : ""}`}
              onClick={() => setRoute(id)}
            >
              <span className="demo__tab-icon"><Icon name={icon} size={18} /></span>
              {label}
            </button>
          ))}
        </aside>

        <div className="demo__device">
          <div className="hero__glow" />
          <PhoneApp route={route} onNavigate={setRoute} interactive className="phone--demo" />
        </div>

        <div className="demo__note">
          <p>{NOTES[route]}</p>
          <DownloadButton label="Get the full app" size="sm" variant="ghost" compact />
        </div>
      </div>
    </section>
  );
}
