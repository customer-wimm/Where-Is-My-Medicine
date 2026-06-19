import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During dev, proxy /api -> FastAPI on :8000 so the frontend can call the
// backend without CORS headaches. In production both are served same-origin.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
  build: {
    outDir: "dist",
  },
});
