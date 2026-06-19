"""
WHERE IS MY MEDICINE — marketing/demo website backend.

A small FastAPI app that:
  * serves the Android APK with a download counter
  * exposes basic stats (download count)
  * accepts contact / "request access" leads
  * (in production) serves the built React frontend from frontend/dist

Run dev:  uvicorn main:app --reload --port 8000
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr, Field

BASE_DIR = Path(__file__).resolve().parent
DOWNLOADS_DIR = BASE_DIR / "downloads"
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

APK_FILE = DOWNLOADS_DIR / "where-is-my-medicine.apk"
STATS_FILE = DATA_DIR / "stats.json"
LEADS_FILE = DATA_DIR / "leads.json"

APP_NAME = "WHERE IS MY MEDICINE"
APK_VERSION = os.environ.get("WIMM_APK_VERSION", "2.0")
# When the APK isn't bundled on the server (e.g. it's too big to commit), set
# WIMM_APK_URL to a hosted copy — a GitHub Release asset works well — and the
# download endpoint will stream the bytes through our own server so mobile
# browsers always get a proper "Save file" prompt instead of opening GitHub.
APK_URL = os.environ.get("WIMM_APK_URL", "")

app = FastAPI(title=f"{APP_NAME} — Website API", version="1.0.0")

# During dev the Vite frontend runs on :5173. In prod everything is same-origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------------------------------------------------------------------------
# tiny JSON "store" helpers (no DB needed for a landing page)
# ----------------------------------------------------------------------------
def _read_json(path: Path, default):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (FileNotFoundError, json.JSONDecodeError):
        return default


def _write_json(path: Path, value) -> None:
    path.write_text(json.dumps(value, indent=2), encoding="utf-8")


def _bump_downloads() -> int:
    stats = _read_json(STATS_FILE, {"downloads": 0})
    stats["downloads"] = int(stats.get("downloads", 0)) + 1
    stats["updated_at"] = datetime.now(timezone.utc).isoformat()
    _write_json(STATS_FILE, stats)
    return stats["downloads"]


# ----------------------------------------------------------------------------
# models
# ----------------------------------------------------------------------------
class Lead(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    role: str = Field(default="customer", max_length=40)  # customer | pharmacy | doctor
    message: str = Field(default="", max_length=2000)


# ----------------------------------------------------------------------------
# API
# ----------------------------------------------------------------------------
@app.get("/api/health")
def health():
    return {"status": "ok", "app": APP_NAME}


@app.get("/api/stats")
def stats():
    data = _read_json(STATS_FILE, {"downloads": 0})
    return {
        "downloads": int(data.get("downloads", 0)),
        "version": APK_VERSION,
        "apk_available": APK_FILE.exists() or bool(APK_URL),
        "size_mb": round(APK_FILE.stat().st_size / 1_048_576, 1) if APK_FILE.exists() else 0,
    }


@app.get("/api/download")
async def download():
    """
    Serve the APK with Content-Disposition: attachment so mobile browsers
    always trigger a 'Save file' prompt rather than opening GitHub or
    attempting to render the binary in the browser.

    Priority:
      1. Bundled APK on disk  → FileResponse (same-origin, headers fully controlled)
      2. Remote URL (GitHub)  → stream bytes through us so Content-Disposition
                                 is preserved and the download= attribute works
      3. Neither              → 404
    """
    if APK_FILE.exists():
        _bump_downloads()
        return FileResponse(
            APK_FILE,
            media_type="application/vnd.android.package-archive",
            filename=f"where-is-my-medicine-v{APK_VERSION}.apk",
            headers={"Content-Disposition": f'attachment; filename="where-is-my-medicine-v{APK_VERSION}.apk"'},
        )

    if APK_URL:
        _bump_downloads()
        filename = f"where-is-my-medicine-v{APK_VERSION}.apk"

        async def _stream():
            async with httpx.AsyncClient(follow_redirects=True, timeout=60) as client:
                async with client.stream("GET", APK_URL) as resp:
                    resp.raise_for_status()
                    async for chunk in resp.aiter_bytes(chunk_size=65536):
                        yield chunk

        return StreamingResponse(
            _stream(),
            media_type="application/vnd.android.package-archive",
            headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        )

    raise HTTPException(status_code=404, detail="APK not found on server.")


@app.post("/api/contact")
async def contact(lead: Lead, request: Request):
    leads = _read_json(LEADS_FILE, [])
    leads.append(
        {
            **lead.model_dump(),
            "ip": request.client.host if request.client else None,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    )
    _write_json(LEADS_FILE, leads)
    return JSONResponse({"ok": True, "message": "Thanks! We'll be in touch."})


# ----------------------------------------------------------------------------
# serve built frontend (production). Safe no-op while developing with Vite.
# ----------------------------------------------------------------------------
_DIST = BASE_DIR.parent / "frontend" / "dist"
if _DIST.exists():
    app.mount("/", StaticFiles(directory=str(_DIST), html=True), name="static")
