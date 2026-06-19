import { useEffect, useRef, useState } from "react";

const POINTS = [
  {
    id: "verified",
    tag: "Trust",
    title: "Only verified pharmacies",
    body: "Every pharmacy on our platform is government-registered and verified. No grey-market sellers, no counterfeit risk — your medicine is always the real thing.",
    stat: "100%", statLabel: "verified partners",
  },
  {
    id: "ai",
    tag: "Intelligence",
    title: "AI that speaks your language",
    body: "Ask about drug interactions, dosage, or side effects in plain English, Hindi, or your local language. Our AI gives safe, sourced answers — not generic web results.",
    stat: "24 / 7", statLabel: "AI assistance",
  },
  {
    id: "speed",
    tag: "Speed",
    title: "Medicine at your door in hours",
    body: "From prescription upload to doorstep delivery, the entire journey happens inside one app. Live tracking keeps you informed at every step — no calls, no guessing.",
    stat: "< 2 hrs", statLabel: "avg. delivery time",
  },
  {
    id: "reminders",
    tag: "Care",
    title: "Reminders that actually ring",
    body: "Our dose alarms cut through Do Not Disturb. One tap from the notification marks a dose Taken or Snoozed — no need to open the app at all.",
    stat: "0 missed", statLabel: "doses with reminders",
  },
  {
    id: "unified",
    tag: "Simplicity",
    title: "One app for everyone",
    body: "Most health apps solve one piece. We connect the entire chain — patient, pharmacy, and doctor — so care flows seamlessly without switching tools.",
    stat: "3-in-1", statLabel: "unified platform",
  },
];

// Mobile: static stacked cards (no scroll-jack)
function MobileWhyUs() {
  return (
    <div className="whyus whyus--mobile" id="why">
      <div className="whyus__sticky whyus__sticky--mobile">
        <span className="eyebrow whyus__eyebrow">Why choose us</span>
        <h2 className="whyus__title">
          Not just another <span className="grad">health app.</span>
        </h2>
        <div className="whyus__mobile-list">
          {POINTS.map((p) => (
            <div className="whyus__mobile-card" key={p.id}>
              <span className="whyus__tag">{p.tag}</span>
              <h4>{p.title}</h4>
              <p>{p.body}</p>
              <div className="whyus__stat">
                <span className="whyus__stat-num">{p.stat}</span>
                <span className="whyus__stat-label">{p.statLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Desktop: sticky scroll-jacked version with sliding capsule
function DesktopWhyUs() {
  const sectionRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight;
      const windowH = window.innerHeight;
      const scrolled = -rect.top;
      const total = sectionH - windowH;
      if (total <= 0) return;
      const t = Math.max(0, Math.min(1, scrolled / total));
      const idx = Math.min(POINTS.length - 1, Math.floor(t * POINTS.length));
      setActiveIdx(idx);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const point = POINTS[activeIdx];
  const pillY = (activeIdx / (POINTS.length - 1)) * 100;

  return (
    <div
      className="whyus"
      ref={sectionRef}
      id="why"
      style={{ "--steps": POINTS.length }}
    >
      <div className="whyus__sticky">

        {/* ── LEFT ── */}
        <div className="whyus__left">
          <span className="eyebrow whyus__eyebrow">Why choose us</span>
          <h2 className="whyus__title">
            Not just another&nbsp;<span className="grad">health app.</span>
          </h2>

          <div className="whyus__content" key={activeIdx}>
            <span className="whyus__tag">{point.tag}</span>
            <h3 className="whyus__point-title">{point.title}</h3>
            <p className="whyus__point-body">{point.body}</p>
            <div className="whyus__stat">
              <span className="whyus__stat-num">{point.stat}</span>
              <span className="whyus__stat-label">{point.statLabel}</span>
            </div>
          </div>

          <div className="whyus__counter">
            <span className="whyus__counter-cur">{String(activeIdx + 1).padStart(2, "0")}</span>
            <span className="whyus__counter-sep">/</span>
            <span className="whyus__counter-total">{String(POINTS.length).padStart(2, "0")}</span>
          </div>
        </div>

        {/* ── CENTRE: capsule track ── */}
        <div className="whyus__track-wrap">
          <div className="whyus__track-line">
            <div className="whyus__track-fill" style={{ height: `${pillY}%` }} />
          </div>

          {/* glowing medicine capsule */}
          <div className="whyus__pill" style={{ top: `${pillY}%` }}>
            <div className="whyus__capsule">
              <div className="whyus__capsule-top" />
              <div className="whyus__capsule-bot" />
            </div>
            <span className="whyus__pill-ring" />
            <span className="whyus__pill-ring whyus__pill-ring--2" />
          </div>

          {/* step dots */}
          {POINTS.map((_, i) => (
            <div
              key={i}
              className={`whyus__dot ${i === activeIdx ? "is-active" : ""} ${i < activeIdx ? "is-done" : ""}`}
              style={{ top: `${(i / (POINTS.length - 1)) * 100}%` }}
            />
          ))}
        </div>

        {/* ── RIGHT: step list ── */}
        <div className="whyus__list">
          {POINTS.map((p, i) => (
            <div
              key={p.id}
              className={`whyus__item ${i === activeIdx ? "is-active" : ""} ${i < activeIdx ? "is-done" : ""}`}
            >
              <span className="whyus__item-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="whyus__item-title">{p.title}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export function WhyUs() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 940px)");
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile ? <MobileWhyUs /> : <DesktopWhyUs />;
}
