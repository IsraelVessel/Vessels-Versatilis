Vessels Versatilis — Website (React + Vite)

Overview

- A small, editable React site for "Vessels Versatilis". Content is stored in localStorage, editable via an admin JSON editor in the UI. This keeps the site editable without a backend.

Files created

- `package.json` — project metadata and scripts (Vite).
- `public/index.html` — app entry HTML.
- `src/main.jsx` — React entry.
- `src/App.jsx` — main site with content and admin launcher.
- `src/Admin.jsx` — JSON editor overlay for editing content and downloading JSON.
- `src/styles.css` — site styles.
- `design/figma-mockup.svg` — a static SVG mockup you can import into Figma as an image for further design.

Run locally (Windows PowerShell)

1. Install dependencies:

```powershell
npm install
```

2. Run dev server:

```powershell
npm run dev
```

Backend (optional) — persist edits across devices

1. Change to the server folder and install server deps:

```powershell
cd server
npm install
npm start
```

The backend listens on port 3001 by default and provides GET/POST /api/content. The frontend will attempt to call this endpoint automatically when the page loads; if the backend is not available the app will fall back to localStorage.

3. Open the URL printed by Vite (usually http://localhost:5173)

Notes

- The admin editor persists edits to browser localStorage under `vv_content`. Use the "Download JSON" button to export the current content and to re-import later.
- For a production site you can add a small backend or use Git-based CMS (Netlify CMS, Tina, etc.).
- The SVG in `design/figma-mockup.svg` is a simple visual starting point; import it into Figma or replace with a richer design.

If you want, I can:
- commit and push these files to your repo (tell me to push),
- add a small Node/Express backend to persist content,
- connect a headless CMS or a static export pipeline.

