import { useEffect, useRef, useState } from "react";
import { Nav } from "./components/Nav.jsx";
import { Hero } from "./components/Hero.jsx";
import { HowItWorks } from "./components/HowItWorks.jsx";
import { Features } from "./components/Features.jsx";
import { Demo } from "./components/Demo.jsx";
import { DownloadCTA } from "./components/DownloadCTA.jsx";
import { Footer } from "./components/Footer.jsx";
import "./styles/spotlight.css";

// The full page content. Rendered twice: once as the base layer in the page
// theme, once inside the spotlight in the opposite theme.
function Page({ theme, dark, onToggleTheme }) {
  return (
    <div className={`page theme-${theme}`}>
      <Nav dark={dark} onToggleTheme={onToggleTheme} />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Demo />
        <DownloadCTA />
      </main>
      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scroll-reveal: once a .reveal-up element is 15% visible, add .is-visible
// which triggers the CSS fade-up transition. Runs once per mount, disconnects
// after each element is revealed so it stays cheap.
// ---------------------------------------------------------------------------
function useScrollReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      // Very old browsers: just show everything.
      document.querySelectorAll(".reveal-up").forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    document.querySelectorAll(".reveal-up").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

const RADIUS = 90;

export default function App() {
  useScrollReveal();

  // Base theme follows the visitor's OS preference; the spotlight shows the
  // opposite. A manual toggle flips both.
  const [dark, setDark] = useState(
    () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  );

  const revealRef = useRef(null);
  const innerRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: -9999, y: -9999, r: 0 });
  const raf = useRef(0);

  const baseTheme = dark ? "dark" : "light";
  const revealTheme = dark ? "light" : "dark";

  useEffect(() => {
    const reveal = revealRef.current;
    const inner = innerRef.current;
    if (!reveal || !inner) return;

    const apply = () => {
      const { x, y, r } = pos.current;
      reveal.style.clipPath = `circle(${r}px at ${x}px ${y}px)`;
      inner.style.transform = `translateY(${-window.scrollY}px)`;
      inner.style.width = `${document.documentElement.clientWidth}px`;
      const ring = ringRef.current;
      if (ring) {
        ring.style.transform = `translate(${x - r}px, ${y - r}px)`;
        ring.style.opacity = r > 0 ? "1" : "0";
        ring.style.width = ring.style.height = `${r * 2}px`;
      }
    };

    const schedule = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(apply);
    };

    // No-spotlight zones: over the demo (so the user can use the live app in a
    // stable theme) and over the sticky nav bar (where the lens would otherwise
    // cover and hide the navigation). The theme never flips in these areas.
    const inNoFlipZone = (x, y) => {
      const hit = (el) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      };
      return hit(document.getElementById("demo")) || hit(document.querySelector(".nav"));
    };

    const onMove = (e) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      // Grow the lens smoothly the first time the cursor appears — unless we're
      // in a no-flip zone, where the lens is switched off entirely.
      pos.current.r = inNoFlipZone(e.clientX, e.clientY)
        ? 0
        : Math.min(RADIUS, pos.current.r + 60) || RADIUS;
      schedule();
    };
    const onLeave = () => {
      pos.current.r = 0;
      schedule();
    };
    const onTouch = (e) => {
      const t = e.touches[0];
      if (!t) return;
      pos.current.x = t.clientX;
      pos.current.y = t.clientY;
      pos.current.r = inNoFlipZone(t.clientX, t.clientY) ? 0 : RADIUS;
      schedule();
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const toggle = () => setDark((d) => !d);

  return (
    <div className="app-root">
      {/* Base layer — normal document flow, drives scroll height. */}
      <Page theme={baseTheme} dark={dark} onToggleTheme={toggle} />

      {/* Spotlight layer — a fixed clone in the opposite theme, clipped to a
          circle that follows the cursor and kept in sync with scroll. */}
      <div className="reveal" ref={revealRef} aria-hidden>
        <div className="reveal__inner" ref={innerRef}>
          <Page theme={revealTheme} dark={dark} onToggleTheme={toggle} />
        </div>
      </div>
      <span className="reveal__ring" ref={ringRef} aria-hidden />
    </div>
  );
}
