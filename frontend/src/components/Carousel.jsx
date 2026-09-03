import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./Icons.jsx";

// Images are published from the Super-Admin "Website Carousel" page and served
// by the Admin API. Same base URL as the Poster — set VITE_ADMIN_API_URL on
// Render (or in frontend/.env for local dev). If it's not set, or nothing has
// been published, the carousel simply never appears and the rest of the site
// is unaffected.
const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL || "";

const AUTOPLAY_MS = 4000;

export function Carousel() {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState(null); // the image object being previewed, or null
  const timer = useRef(null);

  // Fetch the published images once on mount.
  useEffect(() => {
    if (!ADMIN_API_URL) return;
    let cancelled = false;

    fetch(`${ADMIN_API_URL}/api/gallery`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const list = Array.isArray(data?.images) ? data.images : [];
        if (!cancelled) setImages(list.filter((img) => img?.imageUrl));
      })
      .catch(() => {
        // Network/CORS issue, or nothing published — fail silently.
      });

    return () => { cancelled = true; };
  }, []);

  const count = images.length;

  const go = useCallback(
    (next) => setIndex((i) => (count ? (next + count) % count : 0)),
    [count]
  );
  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  // Auto-scroll — advances while not paused, no preview open, and more than one image.
  useEffect(() => {
    if (paused || lightbox || count <= 1) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(timer.current);
  }, [paused, lightbox, count]);

  // Keep the index in range if the image list ever changes.
  useEffect(() => {
    if (index >= count && count > 0) setIndex(0);
  }, [count, index]);

  // Lock background scroll + close the preview on Escape while it's open.
  useEffect(() => {
    if (!lightbox) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  if (count === 0) return null;

  return (
    <section className="section carousel" id="gallery">
      <div className="section__head">
        <span className="eyebrow"><span className="eyebrow__dot" /> Gallery</span>
        <h2 className="section__title">See it in the wild.</h2>
        <p className="section__sub">
          A rolling look at WHERE IS MY MEDICINE — offers, partners and moments,
          straight from the team.
        </p>
      </div>

      <div
        className="carousel__stage"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        role="region"
        aria-roledescription="carousel"
        aria-label="Image gallery"
      >
        <div className="carousel__viewport">
          <div
            className="carousel__track"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {images.map((img, i) => (
              <div
                className="carousel__slide"
                key={img.id || i}
                aria-hidden={i !== index}
              >
                <button
                  type="button"
                  className="carousel__frame"
                  onClick={() => setLightbox(img)}
                  tabIndex={i === index ? 0 : -1}
                  aria-label={img.title ? `Preview: ${img.title}` : `Preview image ${i + 1}`}
                >
                  {/* Blurred, zoomed copy fills the frame so there are no bare
                      letterbox bars — the sharp copy sits on top, un-cropped. */}
                  <span
                    className="carousel__bg"
                    style={{ backgroundImage: `url("${img.imageUrl}")` }}
                    aria-hidden="true"
                  />
                  <img
                    className="carousel__img"
                    src={img.imageUrl}
                    alt={img.title || `Slide ${i + 1}`}
                    loading={i === 0 ? "eager" : "lazy"}
                    draggable="false"
                  />
                  <span className="carousel__zoom" aria-hidden="true">
                    <Icon name="search" size={18} />
                  </span>
                </button>
                {img.title && <p className="carousel__caption">{img.title}</p>}
              </div>
            ))}
          </div>
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              className="carousel__arrow carousel__arrow--prev"
              onClick={prev}
              aria-label="Previous image"
            >
              <span className="carousel__arrow-flip"><Icon name="arrow" size={22} /></span>
            </button>
            <button
              type="button"
              className="carousel__arrow carousel__arrow--next"
              onClick={next}
              aria-label="Next image"
            >
              <Icon name="arrow" size={22} />
            </button>

            <div className="carousel__dots" role="tablist" aria-label="Choose image">
              {images.map((img, i) => (
                <button
                  type="button"
                  key={img.id || i}
                  className={`carousel__dot ${i === index ? "is-active" : ""}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to image ${i + 1}`}
                  aria-selected={i === index}
                  role="tab"
                />
              ))}
            </div>
          </>
        )}
      </div>

      {lightbox && (
        <Lightbox image={lightbox} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}

// Full-screen preview. First click on a slide opens this; clicking the image
// here opens its link (when one is set). Full-resolution, un-cropped.
function Lightbox({ image, onClose }) {
  const hasLink = !!image.linkUrl;

  return (
    <div
      className="lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={image.title || "Image preview"}
      onClick={onClose}
    >
      <button
        type="button"
        className="lightbox-close"
        aria-label="Close preview"
        onClick={onClose}
      >
        <Icon name="close" size={20} />
      </button>

      <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
        {hasLink ? (
          <a
            href={image.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="lightbox-link"
            title="Open link"
          >
            <img className="lightbox-img" src={image.imageUrl} alt={image.title || "Preview"} />
          </a>
        ) : (
          <img className="lightbox-img" src={image.imageUrl} alt={image.title || "Preview"} />
        )}

        {(image.title || hasLink) && (
          <figcaption className="lightbox-caption">
            {image.title && <span>{image.title}</span>}
            {hasLink && (
              <span className="lightbox-hint">
                <Icon name="arrow" size={14} /> Click the image to open the link
              </span>
            )}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
