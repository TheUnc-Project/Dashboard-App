## TheUnc Dashboard

A SvelteKit app for AI-driven sentiment/topic analysis of customer feedback with interactive charts.

### Quick start
- Install: `npm install`
- Env: set `VITE_API_ENDPOINT=...` (defaults to `https://api.theuncproject.com`)
- Run: `npm run dev` → `http://localhost:5173`
- Build/Preview: `npm run build && npm run preview`

### Features
- Dashboard KPIs and top topics
- Word frequencies (bar chart)
- Topic management (add/delete)
- Paginated messages with media preview
- Auto-refresh every 10s
- Auth-guarded dashboard
- SEO: robots.txt, sitemap, canonical, GTM

### Auth
- Token stored in `localStorage`; headers via `Authorization: Bearer <token>`
- Login currently sends email only; password field in the form is unused

### Scripts
- `dev`, `build` (also writes `static/sitemap.xml`), `preview`, `check`, `lint`, `format`

### Notes
- Set `BASE_URL` in `src/lib/sitemap.js` for correct sitemap links
- Dashboard runs client-side; SSR is disabled in `routes/dashboard/+layout.js`

