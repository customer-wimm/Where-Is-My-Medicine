// Feature catalogue, derived from the actual app modules.
// Each renders as its own animated card in the bento grid.

export const FEATURES = [
  {
    id: "scan",
    icon: "scan",
    title: "Scan any medicine",
    blurb:
      "Point your camera at a strip or box. We read the name, uses, dosage and warnings instantly.",
    span: "wide",
  },
  {
    id: "ai",
    icon: "spark",
    title: "AI medicine assistant",
    blurb:
      "Ask anything in plain language. Get safe, sourced answers about your medicines — even by voice.",
    span: "tall",
  },
  {
    id: "reminders",
    icon: "bell",
    title: "Smart reminders",
    blurb:
      "Never miss a dose. Alarms that ring through, with Taken / Snooze right from the notification.",
  },
  {
    id: "prescriptions",
    icon: "doc",
    title: "Upload a prescription",
    blurb: "Snap your Rx, send it to a verified pharmacy and let them do the rest.",
  },
  {
    id: "consult",
    icon: "video",
    title: "Doctor video consults",
    blurb: "Book a verified doctor and talk face-to-face over secure video.",
    span: "wide",
  },
  {
    id: "tracking",
    icon: "pin",
    title: "Live order tracking",
    blurb: "Watch your order move from the pharmacy to your door in real time.",
    span: "tall",
  },
  {
    id: "cart",
    icon: "bag",
    title: "Order & pay in-app",
    blurb: "Add medicines to cart, check delivery coverage and pay securely.",
  },
  {
    id: "roles",
    icon: "users",
    title: "Built for everyone",
    blurb: "One platform for customers, pharmacies and doctors.",
  },
];

export const STEPS = [
  {
    n: "01",
    title: "Find your medicine",
    text: "Scan it, search it, or ask the AI assistant — by text or voice.",
  },
  {
    n: "02",
    title: "Order from a verified pharmacy",
    text: "Upload your prescription, add to cart and pay securely in-app.",
  },
  {
    n: "03",
    title: "Track it to your door",
    text: "Follow your delivery live and get notified at every step.",
  },
  {
    n: "04",
    title: "Stay on schedule",
    text: "Set dose reminders and consult a doctor whenever you need to.",
  },
];
