import { Icon } from "./Icons.jsx";

// The little app-screen recreations shown inside the phone. They are pure
// markup styled with theme CSS variables, so they render in the page theme on
// the base layer and in the opposite theme inside the spotlight.

function StatusBar() {
  return (
    <div className="ph-status">
      <span>9:41</span>
      <span className="ph-status__dots"><i /><i /><i /></span>
    </div>
  );
}

export function HomeScreen() {
  return (
    <div className="screen">
      <StatusBar />
      <div className="screen__pad">
        <div className="app-brand">
          <span className="app-brand__dot" />
          <span>WHERE IS MY <b>MEDICINE</b></span>
        </div>
        <h3 className="screen__hi">Hi Aarav 👋</h3>
        <div className="search">
          <Icon name="search" size={18} />
          <span>Search or scan a medicine…</span>
        </div>
        <div className="quick">
          {[
            ["scan", "Scan"],
            ["spark", "AI Assist"],
            ["bell", "Reminders"],
            ["doc", "Upload Rx"],
            ["video", "Consult"],
            ["bag", "Orders"],
          ].map(([ic, label]) => (
            <div className="quick__item" key={label}>
              <span className="quick__icon"><Icon name={ic} size={20} /></span>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="card card--accent">
          <div>
            <p className="card__eyebrow">Next dose</p>
            <p className="card__title">Paracetamol 500mg</p>
            <p className="card__sub">in 25 min · after food</p>
          </div>
          <span className="pill-badge"><Icon name="pill" size={18} /></span>
        </div>
      </div>
    </div>
  );
}

export function ScanScreen() {
  return (
    <div className="screen">
      <StatusBar />
      <div className="screen__pad">
        <p className="screen__crumb"><Icon name="scan" size={16} /> Scan result</p>
        <div className="med-photo"><Icon name="pill" size={34} /></div>
        <h3 className="screen__hi">Azithromycin 500</h3>
        <span className="tag tag--ok"><Icon name="check" size={14} /> Verified</span>
        <div className="kv"><span>Uses</span><b>Bacterial infections</b></div>
        <div className="kv"><span>Dosage</span><b>1 tablet / day</b></div>
        <div className="warn"><Icon name="bell" size={14} /> Avoid antacids within 2 hours.</div>
        <button className="ph-btn">Add to cart</button>
      </div>
    </div>
  );
}

export function AiScreen() {
  return (
    <div className="screen">
      <StatusBar />
      <div className="screen__pad">
        <p className="screen__crumb"><Icon name="spark" size={16} /> AI assistant</p>
        <div className="bubble bubble--me">Can I take this with my BP medicine?</div>
        <div className="bubble bubble--ai">
          Generally yes, but space them 2 hours apart. I can set a reminder so you
          don't mix the timings. Want me to?
        </div>
        <div className="bubble bubble--me">Yes please</div>
        <div className="ai-input">
          <span>Ask anything…</span>
          <span className="ai-input__mic"><Icon name="mic" size={16} /></span>
        </div>
      </div>
    </div>
  );
}

export function RemindersScreen() {
  return (
    <div className="screen">
      <StatusBar />
      <div className="screen__pad">
        <p className="screen__crumb"><Icon name="bell" size={16} /> Reminders</p>
        {[
          ["Metformin", "8:00 AM", true],
          ["Vitamin D", "1:00 PM", false],
          ["Atorvastatin", "9:30 PM", false],
        ].map(([name, time, done]) => (
          <div className="rem" key={name}>
            <span className={`rem__tick ${done ? "is-done" : ""}`}>
              {done && <Icon name="check" size={14} />}
            </span>
            <div className="rem__body">
              <b>{name}</b>
              <span>{time} · after food</span>
            </div>
            <span className="rem__pill"><Icon name="pill" size={16} /></span>
          </div>
        ))}
        <button className="ph-btn">+ Add reminder</button>
      </div>
    </div>
  );
}

export function TrackScreen() {
  return (
    <div className="screen">
      <StatusBar />
      <div className="screen__pad">
        <p className="screen__crumb"><Icon name="pin" size={16} /> Order tracking</p>
        <div className="map">
          <span className="map__route" />
          <span className="map__pin map__pin--a"><Icon name="bag" size={14} /></span>
          <span className="map__pin map__pin--b"><Icon name="pin" size={14} /></span>
        </div>
        <p className="screen__hi screen__hi--sm">Arriving in 12 min</p>
        <div className="steps">
          {[
            ["Order confirmed", true],
            ["Packed by pharmacy", true],
            ["Out for delivery", true],
            ["Delivered", false],
          ].map(([label, done]) => (
            <div className={`tstep ${done ? "is-done" : ""}`} key={label}>
              <span className="tstep__dot" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const SCREENS = {
  home: HomeScreen,
  scan: ScanScreen,
  ai: AiScreen,
  reminders: RemindersScreen,
  track: TrackScreen,
};
