import { useEffect, useRef, useState } from "react";
import { Nav } from "./components/Nav.jsx";
import { Hero } from "./components/Hero.jsx";
import { HowItWorks } from "./components/HowItWorks.jsx";
import { Features } from "./components/Features.jsx";
import { WhyUs } from "./components/WhyUs.jsx";
import { Demo } from "./components/Demo.jsx";
import { Footer } from "./components/Footer.jsx";
import { BackToTop } from "./components/BackToTop.jsx";
import "./styles/spotlight.css";

function Page({ theme, dark, onToggleTheme }) {
  return (
    <div className={`page theme-${theme}`}>
      <Nav dark={dark} onToggleTheme={onToggleTheme} />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <WhyUs />
        <Demo />
      </main>
      <Footer />
    </div>
  );
}

function useScrollReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
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
    const ring = ringRef.current;
    if (!reveal || !inner) return;

    const apply = () => {
      const { x, y, r } = pos.current;
      reveal.style.clipPath = `circle(${r}px at ${x}px ${y}px)`;
      inner.style.transform = `translateY(${-window.scrollY}px)`;
      inner.style.width = `${document.documentElement.clientWidth}px`;
      if (ring) {
        ring.style.transform = `translate(${x - r}px, ${y - r}px)`;
        ring.style.width = ring.style.height = `${r * 2}px`;
      }
    };

    const schedule = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(apply);
    };

    const zoneFor = (x, y) => {
      const hit = (el) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      };
      if (hit(document.querySelector(".nav"))) return "none";
      if (hit(document.getElementById("demo"))) return "none";
      if (hit(document.querySelector(".footer"))) return "ring-only";
      return "flip";
    };

    const onMove = (e) => {
      const zone = zoneFor(e.clientX, e.clientY);
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;

      if (zone === "none") {
        pos.current.r = 0;
        if (ring) ring.style.opacity = "0";
        schedule();
        return;
      }

      pos.current.r = Math.min(RADIUS, pos.current.r + 60) || RADIUS;

      if (zone === "ring-only") {
        const { x, y, r } = pos.current;
        if (ring) {
          ring.style.transform = `translate(${x - r}px, ${y - r}px)`;
          ring.style.width = ring.style.height = `${r * 2}px`;
          ring.style.opacity = "1";
        }
        reveal.style.clipPath = `circle(0px at ${x}px ${y}px)`;
        inner.style.transform = `translateY(${-window.scrollY}px)`;
        inner.style.width = `${document.documentElement.clientWidth}px`;
        return;
      }

      if (ring) ring.style.opacity = pos.current.r > 0 ? "1" : "0";
      schedule();
    };

    const onLeave = () => {
      pos.current.r = 0;
      if (ring) ring.style.opacity = "0";
      schedule();
    };

    const onTouch = (e) => {
      const t = e.touches[0];
      if (!t) return;
      const zone = zoneFor(t.clientX, t.clientY);
      pos.current.x = t.clientX;
      pos.current.y = t.clientY;
      pos.current.r = zone === "flip" ? RADIUS : 0;
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
      <Page theme={baseTheme} dark={dark} onToggleTheme={toggle} />
      <div className="reveal" ref={revealRef} aria-hidden>
        <div className="reveal__inner" ref={innerRef}>
          <Page theme={revealTheme} dark={dark} onToggleTheme={toggle} />
        </div>
      </div>
      <span className="reveal__ring" ref={ringRef} aria-hidden />
      <BackToTop />
    </div>
  );
}
