import { FEATURES } from "../data/features.js";
import { Icon } from "./Icons.jsx";

export function Features() {
  return (
    <section className="section features" id="features">
      <div className="section__head">
        <span className="eyebrow"><span className="eyebrow__dot" /> Features</span>
        <h2 className="section__title">Everything your medicine needs.</h2>
        <p className="section__sub">
          One app for customers, pharmacies and doctors — here’s what’s inside.
        </p>
      </div>
      <div className="bento">
        {FEATURES.map((f) => (
          <article className={`bento__card bento__card--${f.span || "base"}`} key={f.id}>
            <span className="bento__icon"><Icon name={f.icon} size={24} /></span>
            <h3>{f.title}</h3>
            <p>{f.blurb}</p>
            <span className="bento__glow" aria-hidden />
          </article>
        ))}
      </div>
    </section>
  );
}
