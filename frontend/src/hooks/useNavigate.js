// Smooth scroll helper — scrolls to any section by id.
// Works with both scroll-snap (desktop) and natural scroll (mobile).
export function useNavigate() {
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  return { scrollToSection };
}
