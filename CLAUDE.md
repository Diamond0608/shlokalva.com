# CLAUDE.md — shlokalva.com

Personal engineering portfolio for Shlok Alva (robotics, aerospace, CAD, embedded). Live at https://shlokalva.com, deployed as a static site on Cloudflare Pages. Single-page React app with an aviation "VT-PLN flight deck" theme.

## Commands

```bash
npm install          # npm is the package manager (package-lock.json); ignore pnpm-workspace.yaml
npm run dev          # vite on 127.0.0.1
npm run build        # tsc && vite build -> dist/  (this is the CI-equivalent check)
npm run preview      # serve dist/ locally
```

There is no test runner and no linter. `npm run build` (TypeScript `strict: true`) is the verification step. Run it before saying a change works, and check the result at the 980px and 620px breakpoints.

## Layout

```
index.html                  meta tags, JSON-LD, <noscript> fallback, loads /portfolio-overrides.css and /site-patches.js
src/main.tsx                ALL content data + most components + App (about 1000+ lines)
src/EngineViewer.tsx        R3F turbofan viewer, loads /scene.glb
src/ProjectModelViewer.tsx  generic R3F .glb viewer (props: src)
src/styles.css              main stylesheet (about 2500 lines; section comments mark the big blocks)
public/portfolio-overrides.css  extra CSS loaded via <link>, NOT processed by Vite
public/site-patches.js      vanilla JS: UI hover/click sounds, Mozart audio, DOM patching
public/assets/              every image/video/.glb the site serves, referenced as /assets/<file>
public/{llms.txt,sitemap.xml,robots.txt}
tools/*.py                  one-off asset prep scripts with hardcoded Windows `S:\` paths; local-only, not runnable elsewhere
.github/workflows/update-sitemap-date.yml
.asset-review/              contact sheets for reviewing assets; not part of the build
```

Page sections in order: hero, `#mission`, `#projects`, `#experiences`, scenes, `#skills`, signals, `#interests`, Engine Room (3 live 3D viewers), `#contact`. Nav anchors in the `nav` array must match these ids.

## Branching

Work happens on one branch, `dev`, which holds everything not yet live. Push to `main` only when Shlok says so, then merge `dev` into `main` in one go. The Flight Timeline (`src/FlightTimeline.tsx`) still has placeholder milestones; do not merge `dev` to `main` until Shlok has supplied the real ones.

## Rules that will bite you

1. **Do not touch the "last updated" string.** `src/main.tsx` contains `LAST UPDATED ON <b>DD MON YYYY</b>` (uppercase month). A GitHub Action rewrites it with a regex `sed`, plus `<lastmod>` in `public/sitemap.xml`, on every push to `main`. Never hand-edit those dates and never change that markup's shape, or the Action silently stops matching.
2. **The Action pushes commits to `main`** (`[skip ci]`). Always `git pull --rebase` before pushing. Never force-push.
3. **`.gitignore` ignores `*.glb`, `*.mp4`, `*.rar`, `*.step`, `*.f3d`, `*.zip` globally**, including inside `public/assets/`. Already-tracked assets are fine, but a NEW video or model will silently not be committed. Use `git add -f public/assets/<file>` (or add a `!public/assets/**` negation). Verify with `git status` before claiming an asset is added.
4. **Never commit large working files** (CAD exports, raw phone videos, archives) to the repo root. Only final, web-ready assets go in `public/assets/`. Compress images to .jpg/.webp and keep videos short.
5. **Contact details** live in `src/main.tsx` as `atob("...")` base64 constants (`contactEmail`, `contactPhone`). That is light scraper obfuscation, not security. Never write the email or phone in plaintext in JSX, `index.html`, `<noscript>`, JSON-LD, `llms.txt`, README or commit messages.
6. **Audio is split across two files.** `useMozartLoop` in `main.tsx` and `public/site-patches.js` coordinate through a window event and share DOM selectors (e.g. `.flight-nav button[aria-label="Toggle Interface Sound"]`). Read both before changing audio, and do not rename the class names or aria-labels they query.
7. **Style layering:** `src/styles.css` is the source of truth. `portfolio-overrides.css` loads separately from `<head>` and can win on specificity. Make new styling changes in `styles.css`; touch the overrides file only to fix a conflict, and note why.
8. `pnpm-workspace.yaml` contains a placeholder (`esbuild: set this to true or false`). Leave it alone unless asked; do not switch the project to pnpm.

## BEEST devlog page

`/beest/` is a separate static page (Vite multi-page input in `vite.config.ts`), not part of the React app. Source: `beest/devlogs.json` (70 entries: 34 early journal entries with original dates and tracked time, 36 August build logs) + `beest/template.html` + `beest/beest.css`. Regenerate `beest/index.html` with `python tools/build_beest_page.py` after editing the JSON or template. Each entry can carry `images` (216 WebP files in `public/assets/beest/`, about 9 MB, lazy loaded, only used on this page). The hourly recordings and timelapses are deliberately NOT hosted here; the page states that they exist. The main-page BEEST card (`#beest` in `main.tsx`) links to it. Trinetra was also devlogged but those logs are deliberately NOT published. Only publish text Shlok wrote; the Sep 15 reviewer comment is unconfirmed and not used.

## Character Select

`src/CharacterSelect.tsx` (lazy, mounted in `#characters` via `LazyMount`). Six modes shown as 3D photo cards: transparent cutouts of Shlok (`public/assets/cut-*.webp`, background removed with rembg) on a swaying layered card. A stat or Age/Height/Level of `null` renders as PLACEHOLDER. Fill them only with values Shlok gives you (stats are self-rated 1-10); never invent numbers. A smaller Side Character box (Trixie, Little Helper, Souls of the Goldfish) sits to the right of the main select; Trixie is his pet German shepherd (photo card). Keep photos of Shlok only; do not use the ID photo or group shots where he cannot be identified.

## Content and voice

- First person, plain, a little dry. Headings and `h2/h3` copy are written in Title Case; keep that.
- **Keep the candid results.** The RC plane "never flew", Team Dinoco "second place in playoffs; quarter-final elimination", the Hack Club BEEST travel outcome. These are deliberate and are part of the site's credibility. Do not inflate or soften them.
- **No academic scores or grades on the site** (README: academic scoring is intentionally left out). Do not add test scores, marks or ranks.
- Do not invent projects, dates, awards, hours or metrics. If a number is not already in the repo, ask Shlok.
- The poems in `poems` are Shlok's own writing. Do not edit them except to fix an obvious typo he asks about.

## Adding or editing a project (checklist)

1. Add optimized images/videos to `public/assets/` (see rule 3 for git).
2. Add keys to the `images` map in `main.tsx`, then a `Project` object in `projects` (`id, title, eyebrow, icon, summary, facts, stack, gallery, stats`, optional `link`/`caution`). Gallery items: `type: "video"`, `youtubeId`, or `type: "model"` + `modelPath`.
3. Keep the same four-ish `stats` shape other cards use so the stat row lays out evenly.
4. For a 3D model, add the `.glb` to `public/assets/` and mount `<ProjectModelViewer src="/assets/<name>.glb" />` in the Engine Room section.
5. Mirror the project in the three non-React copies so SEO and no-JS visitors stay in sync: the `<noscript>` list in `index.html`, `public/llms.txt`, and (if it adds a skill area) `knowsAbout` in the JSON-LD.
6. `npm run build`, then check the lightbox, the photo strip scrolling, and mobile layout.

## Conventions

- TypeScript strict, function components, hooks. Icons come from `lucide-react`, animation from `framer-motion` (respect `useReducedMotion`), 3D from `@react-three/fiber` + `drei`.
- Vite `manualChunks` splits react / framer-motion / lucide. three is NOT in manualChunks on purpose: `EngineViewer` and `ProjectModelViewer` are `React.lazy` imports mounted via `LazyMount`, so three only loads when the Engine Room scrolls into view. Do not re-add three to `manualChunks` or import the viewers statically; that puts about 1 MB back in the initial load.
- Images in `main.tsx` go through the `Img` component, which sets `width`/`height` from `src/imageSizes.ts` so the layout does not jump on load. When you add a raster to `public/assets/`, add its entry to `imageSizes.ts` (width, height in pixels). Prefer .webp/.jpg over large .png.
- Looping CSS animations on panels listed in the `anim-off` effect in `App` are paused while off-screen; add new always-running animated panels to that selector list.
- Use `loading="lazy"` on new below-the-fold images. Give every meaningful image real `alt` text; decorative ones get `alt=""`.
- Prefer self-hosted assets. Existing hotlinks (Airbus cockpit image, Wikimedia Mozart `.ogg`, YouTube thumbnails) are fragile; do not add more.
- Keep `main.tsx` content as typed data arrays at the top, components below. If asked to refactor, split data into `src/data/*.ts` and components into `src/components/*.tsx` without changing rendered output.

## Known issues (fix when asked, do not silently "improve")

- Assets: `.glb` models are meshopt-compressed (`scene.glb`, `little-helper.glb`) or Draco (`trinetra.glb`). Keep node names intact (the engine viewer looks up bodies 640/576/577 by name). Keep videos small (720-1280px, crf about 28).

- Sound defaults to ON (`useState(true)`) with site-wide hover/click blips and looping Mozart. This is intentional (Shlok wants it on by default); do not change it.
- Single site-wide `og:image` (`rc-plane.jpg`); no per-project previews.
- `site-patches.js` patches rendered DOM from outside React via a `MutationObserver`. Fixes belong in `main.tsx` / `styles.css` instead; do not add new patches there.

## Before you finish

- `npm run build` passes with no TypeScript errors.
- `git status` shows the files you expect (especially new `.glb`/`.mp4`, see rule 3) and nothing from the root-level junk list.
- You did not hand-edit the last-updated date, did not expose contact details, and did not change the candid wording on results.
- You pulled with `--rebase` before pushing.
