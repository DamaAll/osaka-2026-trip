# Osaka 2026 Trip

Mobile-first travel execution site for Osaka, Kyoto and Universal Studios Japan.

- Travel dates: 2026-09-21 to 2026-09-25
- Stack: Vue 3 + Vite
- Entry point: `src/main.js`
- Trip content: `data.js` (single source; the app renders it, nothing is hard-coded in components)
- Production build: `npm run build`
- Mobile verification: `npm run test:mobile`
- Live: https://damaall.github.io/osaka-2026-trip/

## Structure

Tabs are split by *when you open them*, not by topic:

| Tab | Opened when | Holds |
| --- | --- | --- |
| 行程 | during the trip | day timeline, live switch rules, group rules |
| 準備 | before leaving | critical tasks, checklist, tax-free, baggage, IC cards, reservations |
| 花費 | settling up | budget, tickets, transport fares, shopping split |
| 買什麼 | while shopping | souvenir reference, import ban |
| 應急 | when something breaks | hotlines, typhoon staging, medical, phrases |

Reference material sits in collapsed `<details>` so the page stays scannable.
A focus card on the hero picks the next action from the date: pending critical
tasks before departure, today's day during the trip.

## Deployment

GitHub Pages **must** be set to build from GitHub Actions
(Settings → Pages → Source: GitHub Actions).

With the legacy "deploy from a branch" setting, Pages publishes the repo root,
so the live site loads `/src/main.js` — unbuilt source, blank page — while the
workflow still reports success. `pages.yml` detects this and fails loudly, but
it cannot fix it: changing Pages configuration needs repo admin rights, and
`GITHUB_TOKEN` only carries `pages: write` (deploy, not configure).

Do not add `cp sw.js dist/sw.js` back to either workflow. `public/sw.js` is a
template; `vite.config.js` writes the real hashed asset list into it at build
time. Copying the root `sw.js` over the generated one silently empties the
offline precache.

## Offline

The service worker precaches the app shell and every hashed asset, and serves
`/assets/` cache-first. Without precaching, the JS and CSS load *before* the
worker takes control, so the fetch handler never sees them and an offline
reload returns HTML with no app.

Day and souvenir photos are cross-origin, so they are not cached and will not
appear offline; the layout hides them rather than showing broken images.
