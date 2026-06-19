import { Icon } from "./Icons.jsx";

// Triggers the APK download from the FastAPI backend (which also counts it).
// Falls back to the static file if the API isn't running.
export function DownloadButton({
  label = "Download the app",
  size = "lg",
  variant = "primary",
  compact = false,
  className = "",
}) {
  function handleDownload() {
    // Hitting the endpoint streams the APK and increments the counter.
    const a = document.createElement("a");
    a.href = "/api/download";
    a.setAttribute("download", "where-is-my-medicine.apk");
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className={`btn btn--${variant} btn--${size} ${className}`}
    >
      {!compact && <Icon name="android" size={size === "lg" ? 22 : 18} />}
      <span>{label}</span>
      {!compact && <span className="btn__hint">APK · Android</span>}
    </button>
  );
}
