import { STEPS } from "../data/features.js";

export function HowItWorks() {
  return (
    <section className="section how" id="how">
      <div className="section__head reveal-up">
        <span className="eyebrow">How it works</span>
        <h2 className="section__title">From "Where is it?" to "Here it is."</h2>
        <p className="section__sub">Four simple steps — the whole journey lives in your pocket.</p>
      </div>
      <div className="how__grid reveal-up reveal-up--delay">
        {STEPS.map((s) => (
          <article className="how__card" key={s.n}>
            <span className="how__n">{s.n}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </article>
        ))}
        <span className="how__line" aria-hidden />
      </div>
    </section>
  );
}
