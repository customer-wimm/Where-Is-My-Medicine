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
  async function handleDownload() {
    try {
      const res = await fetch("/api/download", { method: "GET" });
      if (!res.ok) {
        alert(
          "APK not available yet — the server admin needs to set WIMM_APK_URL.\nContact connect@whereismymedicine.com for a direct link."
        );
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "where-is-my-medicine.apk";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert("Download failed — please try again or contact connect@whereismymedicine.com");
    }
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
