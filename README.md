# WHERE IS MY MEDICINE — website

Marketing + live-demo site for the pharmacy app. Inspired by
[premiercs.com](https://premiercs.com/) (bold scroll story + demo) and
[ulrychkristian.cz](https://www.ulrychkristian.cz/) (cursor that reveals the
opposite theme). It uses the app's exact medicine-green palette and ships three
things: **Download APK**, **Features**, and a **clickable demo**.

## Stack

- **Frontend** — React (JSX) + plain CSS, bundled with Vite (`frontend/`)
- **Backend** — Python FastAPI (`backend/`) — serves the APK, counts downloads,
  takes pharmacy/doctor leads, and serves the built frontend in production

> The whole site is rendered twice: once in the visitor's theme, once in the
> opposite theme. The cursor "lens" (`App.jsx` + `styles/spotlight.css`) clips
> the second copy to a circle that follows the mouse — so you literally peek the
> app's other theme. Defaults to the visitor's OS theme; ☀/☾ in the nav flips it.

## Run it locally

Two terminals.

**1. Backend (port 8000):**
```bash
cd backend
python -m venv .venv && .venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**2. Frontend (port 5173, proxies /api → :8000):**
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Build & deploy (single server)

```bash
cd frontend && npm run build     # outputs frontend/dist
cd ../backend && uvicorn main:app --port 8000
```
When `frontend/dist` exists the backend serves it at `/`, so the whole site runs
from one FastAPI process — deploy `backend/` to Render (same as the admin
dashboard) and run `uvicorn main:app --host 0.0.0.0 --port $PORT`.

## The APK

Lives at `backend/downloads/where-is-my-medicine.apk`. Replace that file to ship
a new build (optionally set `WIMM_APK_VERSION`). It's git-ignored because of its
size — upload it to the host directly or wire it to your release storage.

## Where to customise

| Want to change… | Edit |
|---|---|
| Feature cards / steps | `frontend/src/data/features.js` |
| In-phone app screens | `frontend/src/components/PhoneScreens.jsx` |
| Demo tabs | `frontend/src/components/Demo.jsx` |
| Colors / theme | `:root`, `.theme-light`, `.theme-dark` in `frontend/src/styles/global.css` |
| Lens size | `RADIUS` in `frontend/src/App.jsx` |
