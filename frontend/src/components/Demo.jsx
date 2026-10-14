import { Icon } from "./Icons.jsx";
import { DownloadButton } from "./DownloadButton.jsx";

// A normal, scrolling walkthrough of the app experience — no device frames,
// no tabs. Each row pairs a short explanation with a clean web-native preview
// built from clearly-labelled demo data.

function SearchPreview() {
  const rows = [
    ["CityCare Pharmacy", "0.8 km", "In stock", false],
    ["GreenLeaf Medicals", "1.4 km", "In stock", false],
    ["Metro Health Store", "2.1 km", "Low stock", true],
  ];
  return (
    <div className="prev">
      <div className="prev__field">
        <Icon name="search" size={16} /> <span>Dolo 650</span>
      </div>
      {rows.map(([n, d, a, low]) => (
        <div className="prev__row" key={n}>
          <span className="prev__ic"><Icon name="pin" size={15} /></span>
          <span className="prev__info"><b>{n}</b><small>{d} · <em className={low ? "is-low" : "is-ok"}>{a}</em></small></span>
          <span className="prev__price">₹31</span>
        </div>
      ))}
    </div>
  );
}

function RemindersPreview() {
  const rows = [
    ["Metformin 500mg", "8:00 AM · after breakfast", true],
    ["Vitamin D3", "1:00 PM · with lunch", false],
    ["Atorvastatin", "9:30 PM · after dinner", false],
  ];
  return (
    <div className="prev">
      {rows.map(([n, t, done]) => (
        <div className="prev__row" key={n}>
          <span className={`prev__tick ${done ? "is-done" : ""}`}>{done && <Icon name="check" size={12} />}</span>
          <span className="prev__info"><b>{n}</b><small>{t}</small></span>
          <span className="prev__pill"><Icon name="pill" size={15} /></span>
        </div>
      ))}
    </div>
  );
}

function AiPreview() {
  return (
    <div className="prev">
      <div className="prev__bubble prev__bubble--ai">Hi! Ask me anything about your medicines.</div>
      <div className="prev__bubble prev__bubble--me">What is Dolo 650 used for?</div>
      <div className="prev__bubble prev__bubble--ai">
        It's commonly used to help with mild pain or fever. Always confirm with the
        label and a professional. <span className="prev__src">Sample answer</span>
      </div>
    </div>
  );
}

function TrackPreview() {
  const steps = [
    ["Order placed", true],
    ["Processing", true],
    ["Ready / dispatched", true],
    ["Completed", false],
  ];
  return (
    <div className="prev">
      <div className="prev__timeline">
        {steps.map(([label, done]) => (
          <div className={`prev__tstep ${done ? "is-done" : ""}`} key={label}>
            <span className="prev__tdot" />
            <b>{label}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

const ROWS = [
  {
    n: "01",
    icon: "search",
    title: "Find your medicine & nearby pharmacies",
    text: "Search any medicine, set your area and radius, and see nearby pharmacy options with availability at a glance.",
    media: <SearchPreview />,
  },
  {
    n: "02",
    icon: "bell",
    title: "Smart dose reminders",
    text: "Set medication reminders and manage them day to day, with simple Taken and Snooze actions.",
    media: <RemindersPreview />,
  },
  {
    n: "03",
    icon: "spark",
    title: "Ask WIMM.ai",
    text: "Explore medicine information through a calm, conversational assistant that answers in plain language.",
    media: <AiPreview />,
  },
  {
    n: "04",
    icon: "pin",
    title: "Track your order",
    text: "Follow an order's progress through the available tracking experience, from placed to completed.",
    media: <TrackPreview />,
  },
];

export function Demo() {
  return (
    <section className="section demo" id="demo">
      <div className="section__head reveal-up">
        <span className="eyebrow"><span className="eyebrow__dot" /> Live demo</span>
        <h2 className="section__title">See how WIMM works.</h2>
        <p className="section__sub">
          A scroll through the experience — everything shown uses clearly labelled
          demonstration data.
        </p>
      </div>

      <div className="walk">
        {ROWS.map((r) => (
          <article className="walk__row reveal-up" key={r.n}>
            <div className="walk__text">
              <span className="walk__n"><Icon name={r.icon} size={18} /> {r.n}</span>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </div>
            <div className="walk__media">{r.media}</div>
          </article>
        ))}
      </div>

      <div className="demo__cta reveal-up">
        <DownloadButton label="Get the full app" size="lg" />
      </div>
    </section>
  );
}
