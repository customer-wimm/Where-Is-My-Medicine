import { useEffect, useState } from "react";
import { Nav } from "./components/Nav.jsx";
import { Hero } from "./components/Hero.jsx";
import { HowItWorks } from "./components/HowItWorks.jsx";
import { Features } from "./components/Features.jsx";
import { WhyUs } from "./components/WhyUs.jsx";
import { Demo } from "./components/Demo.jsx";
import { Footer } from "./components/Footer.jsx";
import { BackToTop } from "./components/BackToTop.jsx";

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

export default function App() {
  useScrollReveal();

  const [dark, setDark] = useState(
    () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  );

  const toggle = () => setDark((d) => !d);

  return (
    <div className="app-root">
      <Page theme={dark ? "dark" : "light"} dark={dark} onToggleTheme={toggle} />
      <BackToTop />
    </div>
  );
}
