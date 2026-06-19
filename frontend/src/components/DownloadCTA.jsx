import { useState } from "react";
import { Icon } from "./Icons.jsx";
import { DownloadButton } from "./DownloadButton.jsx";

export function DownloadCTA() {
  const [form, setForm] = useState({ name: "", email: "", role: "customer", message: "" });
  const [state, setState] = useState("idle"); // idle | sending | done | error

  async function submit(e) {
    e.preventDefault();
    setState("sending");
    try {
      const r = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setState(r.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="section download" id="download">
      <div className="download__card reveal-up">
        <div className="download__left">
          <span className="eyebrow eyebrow--light">Get started</span>
          <h2>Carry your pharmacy in your pocket.</h2>
          <p>Download the Android APK and you're ready in under a minute.</p>
          <div className="download__cta">
            <DownloadButton label="Download APK" />
            <span className="download__os"><Icon name="android" size={18} /> Android 8.0+</span>
          </div>
          <ul className="download__steps">
            <li><Icon name="check" size={16} /> Tap download, open the file</li>
            <li><Icon name="check" size={16} /> Allow "install from this source"</li>
            <li><Icon name="check" size={16} /> Open the app and sign in</li>
          </ul>
        </div>

        <div className="download__right">
          <h3>Are you a pharmacy or doctor?</h3>
          <p className="download__note">Tell us a bit about you and we'll get you onboarded.</p>
          {state === "done" ? (
            <div className="form__done"><Icon name="check" size={20} /> Thanks! We'll be in touch.</div>
          ) : (
            <form className="form" onSubmit={submit}>
              <input
                required placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                required type="email" placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="customer">I'm a customer</option>
                <option value="pharmacy">I'm a pharmacy</option>
                <option value="doctor">I'm a doctor</option>
              </select>
              <textarea
                rows={3} placeholder="Anything you'd like us to know? (optional)"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <button className="btn btn--primary btn--md" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "Request access"}
              </button>
              {state === "error" && <p className="form__err">Something went wrong — try again.</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
