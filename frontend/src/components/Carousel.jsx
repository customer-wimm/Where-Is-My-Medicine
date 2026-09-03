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

  // Auto-scroll — advances while not paused and more than one image exists.
  useEffect(() => {
    if (paused || count <= 1) return;
    timer.current = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(timer.current);
  }, [paused, count]);

  // Keep the index in range if the image list ever changes.
  useEffect(() => {
    if (index >= count && count > 0) setIndex(0);
  }, [count, index]);

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
            {images.map((img, i) => {
              const slide = (
                <img
                  className="carousel__img"
                  src={img.imageUrl}
                  alt={img.title || `Slide ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  draggable="false"
                />
              );
              return (
                <div
                  className="carousel__slide"
                  key={img.id || i}
                  aria-hidden={i !== index}
                >
                  {img.linkUrl ? (
                    <a href={img.linkUrl} target="_blank" rel="noopener noreferrer">
                      {slide}
                    </a>
                  ) : (
                    slide
                  )}
                  {img.title && <p className="carousel__caption">{img.title}</p>}
                </div>
              );
            })}
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
    </section>
  );
}
