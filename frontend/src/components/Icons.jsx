// Lightweight inline SVG icon set. `currentColor` so they inherit theme color.
const S = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

export function Icon({ name, size = 24, ...rest }) {
  const p = { ...S, width: size, height: size, ...rest };
  switch (name) {
    case "scan":
      return (
        <svg {...p}><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" /><path d="M7 12h10" /></svg>
      );
    case "spark":
      return (
        <svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="M12 8.5a3.5 3.5 0 0 0 0 7 3.5 3.5 0 0 0 0-7Z" /></svg>
      );
    case "bell":
      return (
        <svg {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10.5 19a1.5 1.5 0 0 0 3 0" /></svg>
      );
    case "doc":
      return (
        <svg {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
      );
    case "video":
      return (
        <svg {...p}><rect x="3" y="6" width="12" height="12" rx="2" /><path d="m15 10 6-3v10l-6-3Z" /></svg>
      );
    case "pin":
      return (
        <svg {...p}><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></svg>
      );
    case "bag":
      return (
        <svg {...p}><path d="M6 7h12l-1 13H7L6 7Z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
      );
    case "users":
      return (
        <svg {...p}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 6a3 3 0 0 1 0 6M21 20a5.5 5.5 0 0 0-4-5.3" /></svg>
      );
    case "search":
      return (
        <svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></svg>
      );
    case "pill":
      return (
        <svg {...p}><rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(45 12 12)" /><path d="M8.5 8.5 15.5 15.5" /></svg>
      );
    case "check":
      return (
        <svg {...p}><path d="m5 12 5 5 9-11" /></svg>
      );
    case "mic":
      return (
        <svg {...p}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
      );
    case "download":
      return (
        <svg {...p}><path d="M12 3v12M7 11l5 4 5-4" /><path d="M5 21h14" /></svg>
      );
    case "android":
      return (
        <svg {...p}><path d="M5 17V11a7 7 0 0 1 14 0v6Z" /><path d="M5 17a1.5 1.5 0 0 0 1.5 1.5H8M19 17a1.5 1.5 0 0 1-1.5 1.5H16M8 18.5V21M16 18.5V21M8.5 7 7 5M15.5 7 17 5" /><circle cx="9.5" cy="12" r=".6" fill="currentColor" /><circle cx="14.5" cy="12" r=".6" fill="currentColor" /></svg>
      );
    case "arrow":
      return (
        <svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      );
    case "up":
      return (
        <svg {...p}><path d="M12 19V5M6 11l6-6 6 6" /></svg>
      );
    case "close":
      return (
        <svg {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
      );
    default:
      return null;
  }
}
