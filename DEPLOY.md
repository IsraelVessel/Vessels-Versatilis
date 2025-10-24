Deployment notes - Netlify & Vercel

Quick ready steps so you can just log in and deploy:

Netlify (recommended for static site):
- Connect your GitHub repository to Netlify or use drag-and-drop of the `dist` folder after running a local build.
- In Netlify site settings -> Build & deploy -> Continuous Deployment -> Build settings:
  - Build command: npm run build
  - Publish directory: dist
- Add an environment variable `VITE_API_URL` if you have an external backend (e.g. https://my-api.example.com). If unset, the site will use the built-in localStorage fallback.
- The repository includes `netlify.toml` (build settings + SPA redirect) so Netlify auto-detect will work.

Vercel:
- Import the GitHub repo into Vercel (or drag-and-drop the `dist` folder).
- During setup set the Build Command to: npm run build
- Output Directory: dist
- Add an environment variable `VITE_API_URL` if you want the frontend to call a hosted backend. If omitted, the app will use localStorage fallback.
- `vercel.json` is included to instruct Vercel to use the static-build adapter and provide SPA routing.

Notes about the backend persistence:
- This repo contains a lightweight Express backend under `server/` that provides GET/POST `/api/content` and stores data in `server/content.json`.
- Netlify and Vercel serve static frontends; to host the Express backend you can use Render, Railway, Fly, or any small Node host. After hosting the backend set `VITE_API_URL` to the backend base URL.
- If you do not host the backend, the Admin UI saves content to localStorage so the site is fully editable in-browser.

Environment variables to set in Netlify/Vercel:
- VITE_API_URL (optional) = https://your-backend.example.com

That’s it — connect the repo, set the build command/publish dir, optionally set `VITE_API_URL`, and deploy.
