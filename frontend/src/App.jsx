import { useEffect } from "react";
import { Nav } from "./components/Nav.jsx";
import { Hero } from "./components/Hero.jsx";
import { HowItWorks } from "./components/HowItWorks.jsx";
import { Features } from "./components/Features.jsx";
import { Demo } from "./components/Demo.jsx";
import { WhyUs } from "./components/WhyUs.jsx";
import { DownloadCTA } from "./components/DownloadCTA.jsx";
import { Footer } from "./components/Footer.jsx";

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

  return (
    <div className="page theme-dark">
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Demo />
        <WhyUs />
        <DownloadCTA />
      </main>
      <Footer />
    </div>
  );
}
