import { useState } from "react";
import { useNavigate } from "../hooks/useNavigate.js";
import { FEATURES } from "../data/features.js";
import { Icon } from "./Icons.jsx";

export function Features() {
  const [activeId, setActiveId] = useState(null);
  const { scrollToSection } = useNavigate();

  function handleCardClick(featureId) {
    setActiveId(featureId);
    // Small delay so user sees the highlight, then smooth-scroll to demo
    setTimeout(() => {
      scrollToSection("demo");
    }, 320);
  }

  return (
    <section className="section features" id="features">
      <div className="section__head reveal-up">
        <span className="eyebrow">Features</span>
        <h2 className="section__title">Everything your medicine needs.</h2>
        <p className="section__sub">
          One app for customers, pharmacies and doctors —{" "}
          <span className="features__hint">tap any feature to see it in action.</span>
        </p>
      </div>
      <div className="bento reveal-up reveal-up--delay">
        {FEATURES.map((f) => (
          <article
            className={`bento__card bento__card--${f.span || "base"} bento__card--clickable ${activeId === f.id ? "bento__card--active" : ""}`}
            key={f.id}
            onClick={() => handleCardClick(f.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleCardClick(f.id)}
          >
            <span className="bento__icon"><Icon name={f.icon} size={24} /></span>
            <h3>{f.title}</h3>
            <p>{f.blurb}</p>
            <span className="bento__cta">
              See it live <Icon name="arrow" size={13} />
            </span>
            <span className="bento__glow" aria-hidden />
          </article>
        ))}
      </div>
    </section>
  );
}
