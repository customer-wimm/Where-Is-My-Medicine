import { useState, useRef, useEffect } from "react";
import { Icon } from "./Icons.jsx";
import "../styles/phoneapp.css";

// A working, interactive recreation of the WHERE IS MY MEDICINE app — built to
// match the real glassmorphism UI (location chip, logo header, glass search
// card, radius stepper, action tiles, consult banner) and let you actually
// perform tasks: search a medicine, pick a pharmacy, add to cart, set a
// reminder, chat with the AI and track an order.

const MEDS = [
  { name: "Paracetamol 500mg", form: "Tablet", cat: "Pain & fever", price: 28 },
  { name: "Azithromycin 500", form: "Tablet", cat: "Antibiotic", price: 84 },
  { name: "Cetirizine 10mg", form: "Tablet", cat: "Allergy", price: 22 },
  { name: "Pantoprazole 40", form: "Tablet", cat: "Acidity", price: 56 },
  { name: "Metformin 500mg", form: "Tablet", cat: "Diabetes", price: 35 },
  { name: "Vitamin D3 60K", form: "Sachet", cat: "Supplement", price: 67 },
  { name: "Amoxicillin 250", form: "Capsule", cat: "Antibiotic", price: 72 },
  { name: "Dolo 650", form: "Tablet", cat: "Pain & fever", price: 31 },
];

// Placeholder demo pharmacies only — not real businesses.
const PHARMACIES = [
  { name: "ABC Pharmacy", dist: "0.8 km", rating: "4.8" },
  { name: "XYZ Medicals", dist: "1.4 km", rating: "4.6" },
  { name: "123 Drugstore", dist: "2.1 km", rating: "4.5" },
];

const RADII = [2, 4, 8, 16, 32];

function StatusBar() {
  return (
    <div className="pa-status">
      <span>9:41</span>
      <span className="pa-status__r"><i /><i /><b /></span>
    </div>
  );
}

function Logo({ size = 46 }) {
  return <img className="pa-logo" src="/logo.png" alt="" width={size} height={size} />;
}

export function PhoneApp({ route = "home", onNavigate, interactive = true, className = "" }) {
  const go = (r) => interactive && onNavigate?.(r);

  // --- shared app state (real tasks mutate these) ---
  const [query, setQuery] = useState("");
  const [chips, setChips] = useState([]);
  const [radius, setRadius] = useState(0);
  const [cart, setCart] = useState([]);
  const [added, setAdded] = useState({});
  const [reminders, setReminders] = useState([
    { name: "Metformin 500mg", time: "8:00 AM", done: true },
    { name: "Vitamin D3", time: "1:00 PM", done: false },
    { name: "Atorvastatin", time: "9:30 PM", done: false },
  ]);
  const [messages, setMessages] = useState([
    { who: "ai", text: "Hi! I'm your medicine assistant. Ask me anything about your medicines." },
  ]);
  const [chat, setChat] = useState("");
  const [delivered, setDelivered] = useState(false);

  const suggestions =
    query.trim().length >= 1
      ? MEDS.filter((m) => m.name.toLowerCase().includes(query.toLowerCase()) && !chips.some((c) => c.name === m.name)).slice(0, 4)
      : [];

  const addChip = (m) => { setChips((c) => [...c, m]); setQuery(""); };
  const removeChip = (n) => setChips((c) => c.filter((x) => x.name !== n));
  const search = () => { if (chips.length) go("results"); };
  const addToCart = (ph, med) => {
    const key = ph.name + med.name;
    if (added[key]) return;
    setAdded((a) => ({ ...a, [key]: true }));
    setCart((c) => [...c, { ph: ph.name, ...med }]);
  };
  const addReminder = () => {
    const pool = ["Amoxicillin 250", "Cetirizine 10mg", "Pantoprazole 40", "Dolo 650"];
    const name = pool[reminders.length % pool.length];
    const times = ["7:00 AM", "11:00 AM", "3:00 PM", "10:00 PM"];
    setReminders((r) => [...r, { name, time: times[r.length % times.length], done: false }]);
  };
  const toggleReminder = (i) =>
    setReminders((r) => r.map((x, j) => (j === i ? { ...x, done: !x.done } : x)));

  const chatEndRef = useRef(null);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ block: "nearest" }); }, [messages]);
  const sendChat = () => {
    const text = chat.trim();
    if (!text) return;
    setMessages((m) => [...m, { who: "me", text }]);
    setChat("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { who: "ai", text: "Good question — take it after food, and keep a 2-hour gap from antacids. Want me to set a reminder?" },
      ]);
    }, 650);
  };

  const cartCount = cart.length;
  const searched = chips.length ? chips : [MEDS[1]];

  // ----------------------------------------------------------------- screens
  function Home() {
    return (
      <div className="pa-scroll">
        {/* top bar */}
        <div className="pa-top">
          <button className="pa-loc" onClick={() => go("home")}>
            <span className="pa-loc__pin"><Icon name="pin" size={12} /></span>
            <span className="pa-loc__txt">
              <small>Deliver to</small>
              <b>Koramangala, Bengaluru</b>
            </span>
            <Icon name="arrow" size={12} />
          </button>
          <div className="pa-top__btns">
            <button className="pa-iconbtn" onClick={() => go("results")}>
              <Icon name="bag" size={18} />
              {cartCount > 0 && <span className="pa-badge">{cartCount}</span>}
            </button>
            <button className="pa-iconbtn"><Icon name="bell" size={18} /><i className="pa-dot" /></button>
          </div>
        </div>

        {/* logo header */}
        <div className="pa-brand">
          <Logo />
          <div className="pa-brand__txt">
            <span>Where Is My</span>
            <b>Medicine</b>
          </div>
        </div>

        {/* search glass card */}
        <div className="pa-glass">
          {chips.length > 0 && (
            <div className="pa-chips">
              {chips.map((c) => (
                <button className="pa-chip" key={c.name} onClick={() => removeChip(c.name)}>
                  {c.name} <Icon name="check" size={11} />
                </button>
              ))}
            </div>
          )}
          <div className="pa-field">
            <Icon name="search" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your medicine…"
              disabled={!interactive}
            />
          </div>
          {suggestions.length > 0 && (
            <div className="pa-suggest">
              {suggestions.map((m) => (
                <button className="pa-suggest__row" key={m.name} onClick={() => addChip(m)}>
                  <span><b>{m.name}</b><small>{m.form} · {m.cat}</small></span>
                  <span className="pa-plus"><Icon name="scan" size={14} /></span>
                </button>
              ))}
            </div>
          )}
          {chips.length > 0 && (
            <button className="pa-btn pa-btn--primary" onClick={search}>
              Find in nearby pharmacies
            </button>
          )}
          <div className="pa-or"><span /><small>or</small><span /></div>
          <button className="pa-btn pa-btn--outline" onClick={() => go("results")}>
            <Icon name="doc" size={16} /> Upload Prescription
          </button>
        </div>

        {/* radius card */}
        <div className="pa-glass pa-row">
          <div className="pa-row__l">
            <span className="pa-radius"><span /><Icon name="pin" size={14} /></span>
            <span><b>Search Radius</b><small>Pharmacies within range</small></span>
          </div>
          <div className="pa-step">
            <button onClick={() => setRadius((r) => Math.max(0, r - 1))}>−</button>
            <b>{RADII[radius]} km</b>
            <button onClick={() => setRadius((r) => Math.min(RADII.length - 1, r + 1))}>+</button>
          </div>
        </div>

        {/* action tiles */}
        <div className="pa-tiles">
          <button className="pa-tile" onClick={() => go("results")}>
            <span className="pa-tile__ic"><Icon name="doc" size={20} /></span>
            Get Free<br />Prescription
          </button>
          <button className="pa-tile" onClick={() => go("reminders")}>
            <span className="pa-tile__ic"><Icon name="bell" size={20} /></span>
            Medicine<br />Reminder
          </button>
        </div>

        {/* consult banner */}
        <button className="pa-consult" onClick={() => go("ai")}>
          <span className="pa-consult__ic"><Icon name="video" size={22} /></span>
          <span className="pa-consult__txt">
            <b>Consult a Doctor</b>
            <small>Talk to a certified doctor online</small>
          </span>
          <Icon name="arrow" size={18} />
        </button>
      </div>
    );
  }

  function Results() {
    return (
      <div className="pa-scroll">
        <div className="pa-head">
          <button className="pa-back" onClick={() => go("home")}>‹</button>
          <span><b>Pharmacies near you</b><small>{searched.map((m) => m.name).join(", ")}</small></span>
        </div>
        {PHARMACIES.map((ph) => {
          const med = searched[0];
          const key = ph.name + med.name;
          return (
            <div className="pa-glass pa-pharm" key={ph.name}>
              <div className="pa-pharm__top">
                <span className="pa-pharm__logo"><Icon name="pin" size={16} /></span>
                <span className="pa-pharm__info">
                  <b>{ph.name}</b>
                  <small>{ph.dist} away · ★ {ph.rating} · In stock</small>
                </span>
              </div>
              <div className="pa-pharm__bottom">
                <span className="pa-price">₹{med.price}</span>
                <button
                  className={`pa-btn pa-btn--sm ${added[key] ? "is-added" : ""}`}
                  onClick={() => addToCart(ph, med)}
                >
                  {added[key] ? <><Icon name="check" size={14} /> Added</> : "Add to cart"}
                </button>
              </div>
            </div>
          );
        })}
        {cartCount > 0 && (
          <button className="pa-btn pa-btn--primary pa-sticky" onClick={() => go("track")}>
            Checkout · {cartCount} item{cartCount > 1 ? "s" : ""} → Track order
          </button>
        )}
      </div>
    );
  }

  function Reminders() {
    return (
      <div className="pa-scroll">
        <div className="pa-head">
          <button className="pa-back" onClick={() => go("home")}>‹</button>
          <span><b>Medicine Reminders</b><small>Never miss a dose</small></span>
        </div>
        {reminders.map((r, i) => (
          <div className="pa-glass pa-rem" key={i}>
            <button className={`pa-tick ${r.done ? "is-done" : ""}`} onClick={() => toggleReminder(i)}>
              {r.done && <Icon name="check" size={13} />}
            </button>
            <span className="pa-rem__info"><b>{r.name}</b><small>{r.time} · after food</small></span>
            <span className="pa-rem__pill"><Icon name="pill" size={16} /></span>
          </div>
        ))}
        <button className="pa-btn pa-btn--outline" onClick={addReminder}>+ Add reminder</button>
      </div>
    );
  }

  function Ai() {
    return (
      <div className="pa-ai">
        <div className="pa-head pa-head--ai">
          <span className="pa-ai__logo"><Icon name="spark" size={16} /></span>
          <span><b>WIMM.ai</b><small>Safe answers about your medicines</small></span>
        </div>
        <div className="pa-chat">
          {messages.map((m, i) => (
            <div className={`pa-bubble pa-bubble--${m.who}`} key={i}>{m.text}</div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="pa-aiinput">
          <input
            value={chat}
            onChange={(e) => setChat(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendChat()}
            placeholder="Ask anything…"
            disabled={!interactive}
          />
          <button onClick={sendChat}><Icon name="arrow" size={16} /></button>
        </div>
      </div>
    );
  }

  function Track() {
    const steps = [
      ["Order confirmed", true],
      ["Packed by pharmacy", true],
      ["Out for delivery", true],
      ["Delivered", delivered],
    ];
    return (
      <div className="pa-scroll">
        <div className="pa-head">
          <button className="pa-back" onClick={() => go("home")}>‹</button>
          <span><b>Order tracking</b><small>{delivered ? "Delivered" : "Arriving in 12 min"}</small></span>
        </div>
        <div className="pa-map">
          <span className="pa-map__route" />
          <span className="pa-map__pin pa-map__pin--a"><Icon name="bag" size={13} /></span>
          <span className="pa-map__pin pa-map__pin--b"><Icon name="pin" size={13} /></span>
        </div>
        <div className="pa-glass pa-steps">
          {steps.map(([label, done]) => (
            <div className={`pa-tstep ${done ? "is-done" : ""}`} key={label}>
              <span className="pa-tstep__dot" />{label}
            </div>
          ))}
        </div>
        {!delivered && (
          <button className="pa-btn pa-btn--primary" onClick={() => setDelivered(true)}>
            Mark as delivered
          </button>
        )}
      </div>
    );
  }

  const SCREENS = { home: Home, results: Results, reminders: Reminders, ai: Ai, track: Track };
  const Screen = SCREENS[route] || Home;

  const TABS = [
    ["home", "search"],
    ["reminders", "bell"],
    ["ai", "spark"],
    ["track", "pin"],
  ];

  return (
    <div className={`phone phone--app ${interactive ? "" : "phone--static"} ${className}`}>
      <div className="phone__notch" />
      <div className="phone__glass">
        <div className="pa">
          <StatusBar />
          <Screen />
          <nav className="pa-nav">
            {TABS.map(([r, ic]) => (
              <button
                key={r}
                className={`pa-nav__b ${route === r ? "is-active" : ""}`}
                onClick={() => go(r)}
              >
                <Icon name={ic} size={20} />
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
