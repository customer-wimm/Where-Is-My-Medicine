import { useEffect, useState } from "react";
import { Icon } from "./Icons.jsx";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a href="#top" className={`back-to-top ${visible ? "is-visible" : ""}`} aria-label="Back to top">
      <Icon name="up" size={20} />
    </a>
  );
}
