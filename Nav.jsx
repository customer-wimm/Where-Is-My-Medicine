import { Icon } from "./Icons.jsx";

// Triggers the APK download from the FastAPI backend (which also counts it).
// Set the WIMM_APK_URL environment variable on the server to point to the
// hosted APK (e.g. a GitHub Release asset) so this button streams a real file.
export function DownloadButton({
  label = "Download the app",
  size = "lg",
  variant = "primary",
  compact = false,
  className = "",
}) {
  function handleDownload() {
    // Navigate directly — the backend streams the APK with Content-Disposition: attachment
    // so the browser triggers a Save dialog without loading the whole file into JS memory.
    window.location.href = "/api/download";
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
