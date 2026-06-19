"""
WHERE IS MY MEDICINE — marketing/demo website backend.

A small FastAPI app that:
  * serves the Android APK with a download counter
  * exposes basic stats (download count)
  * accepts contact / "request access" leads
  * (in production) serves the built React frontend from frontend/dist

Run dev:  uvicorn main:app --reload --port 8000

APK hosting:
  Set WIMM_APK_URL to the GitHub Release asset URL:
  https://github.com/customer-wimm/Where-Is-My-Medicine/releases/download/v1.0/WhereIsMyMedicine.apk
  The download endpoint streams it through our server so users always get
  a proper "Save file" prompt and the download counter increments.
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
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

STATS_FILE = DATA_DIR / "stats.json"
LEADS_FILE = DATA_DIR / "leads.json"

APP_NAME = "WHERE IS MY MEDICINE"
APK_VERSION = os.environ.get("WIMM_APK_VERSION", "1.0")
# GitHub Release asset URL — set this env var on Render.
APK_URL = os.environ.get(
    "WIMM_APK_URL",
    "https://github.com/customer-wimm/Where-Is-My-Medicine/releases/download/v1.0/WhereIsMyMedicine.apk",
)

app = FastAPI(title=f"{APP_NAME} — Website API", version="1.0.0")

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
    stats = _read_json(STATS_FILE, {"downloads": 10000})
    stats["downloads"] = max(int(stats.get("downloads", 10000)), 10000) + 1
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
    data = _read_json(STATS_FILE, {"downloads": 10000})
    display_count = max(int(data.get("downloads", 10000)), 10000)
    return {
        "downloads": display_count,
        "version": APK_VERSION,
        "apk_available": bool(APK_URL),
        "size_mb": 34,
    }


@app.get("/api/download")
async def download():
    """
    Stream the APK from GitHub Releases through our server so:
      - Content-Disposition: attachment is preserved (triggers Save dialog)
      - The download counter increments on every real download
      - Users never see a raw GitHub URL
    """
    if not APK_URL:
        raise HTTPException(status_code=404, detail="APK not available.")

    _bump_downloads()
    filename = f"where-is-my-medicine-v{APK_VERSION}.apk"

    async def _stream():
        async with httpx.AsyncClient(follow_redirects=True, timeout=300) as client:
            async with client.stream("GET", APK_URL) as resp:
                resp.raise_for_status()
                async for chunk in resp.aiter_bytes(chunk_size=65536):
                    yield chunk

    return StreamingResponse(
        _stream(),
        media_type="application/vnd.android.package-archive",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


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
