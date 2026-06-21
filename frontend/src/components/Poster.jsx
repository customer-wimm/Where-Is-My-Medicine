import { useEffect, useState } from "react";
import { Icon } from "./Icons.jsx";

// The Admin/Super-Admin backend is a separate deployment from this site's own
// backend, so it needs its own base URL. Set VITE_ADMIN_API_URL on Render
// (or in frontend/.env for local dev) to e.g. https://wimm-admin-api.onrender.com
// If it's not set, the poster simply never appears — the rest of the site is
// unaffected.
const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL || "";

export function Poster() {
  const [poster, setPoster] = useState(null); // { imageUrl, linkUrl, title } | null
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (!ADMIN_API_URL) return;
    let cancelled = false;

    fetch(`${ADMIN_API_URL}/api/poster`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.active && data.imageUrl) setPoster(data);
      })
      .catch(() => {
        // Network/CORS issue, or nothing published — fail silently, the
        // site works fine without a poster.
      });

    return () => { cancelled = true; };
  }, []);

  const open = !!poster && !closed;

  // Full-screen takeover while it's up: lock background scroll and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") setClosed(true); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  const image = (
    <img
      className="poster__img"
      src={poster.imageUrl}
      alt={poster.title || "Promotional poster"}
    />
  );

  return (
    <div className="poster-overlay" role="dialog" aria-modal="true" aria-label={poster.title || "Promotional poster"}>
      <button
        type="button"
        className="poster-close"
        aria-label="Close poster"
        onClick={() => setClosed(true)}
      >
        <Icon name="close" size={18} />
      </button>
      <div className="poster-card">
        {poster.linkUrl ? (
          <a href={poster.linkUrl} target="_blank" rel="noopener noreferrer">
            {image}
          </a>
        ) : (
          image
        )}
        {poster.title && <p className="poster__title">{poster.title}</p>}
      </div>
    </div>
  );
}
