# kolo-kino.com · v2

Cinematic redesign of the Kolo Kino landing page. Single-file static HTML/CSS/JS. GitHub Pages compatible.

## v2 vs v1

v1 was a clean media-kit landing with working Latest Releases auto-update. v2 keeps every line of business logic and re-skins everything else as a cinema venue:

- Academy leader 3-2-1 countdown loader (skipped on return visits via `sessionStorage`)
- Top cinema marquee strip with red bullet separators
- Letterbox `aspect-ratio: 2.39/1` masthead with portrait fallback
- Slate clapperboard section headers with diagonal stripes + mono SCENE/TAKE/ROLL meta
- Hover-to-swap hero list (A24 pattern) for the 4 flagship documentaries
- 35mm filmstrip horizontal scroll for featured docs
- Director marquee infinite scroll between sections
- Footer monumental "KOLO KINO ✦" wordmark in stroke-only serif
- SVG film grain overlay (`screen` blend, gated to hover-capable >900px)
- Custom crosshair cursor with `mix-blend-mode: difference` (auto-restores on Tab keypress)
- VHS easter egg (Konami code `↑↑↓↓←→←→` → RGB channel shift + scanlines)
- Reel indicator in sticky nav showing current section as "Reel 4 / 9 · Latest"
- Reveal-on-scroll with above-the-fold skip
- WCAG AA focus-visible rings + skip-link

**Preserved from v1**: Latest Releases JS (race of 3 CORS proxies + localStorage caching), channel stats fetch from mixerno.space, full JSON-LD schema, GA4, all meta tags, all section IDs, all copy.

## Deploy

Same as v1 — GitHub Pages static, CNAME `kolo-kino.com`. No build step.

```
git add .
git commit -m "v2 cinematic redesign"
git push origin main
```

GitHub Pages serves from `main` root. DNS pointed to `username.github.io`.

## Local preview

```
cd "KoloKino - v2"
python -m http.server 8000
# open http://localhost:8000
```

## Engine of animations

- Plain CSS for transitions, marquees, hover states.
- Plain JS (vanilla, no libs) for reveals, cursor, grain, hover-swap, Konami, leader, lightbox, RSS race.
- `scroll-behavior: smooth` for anchor navigation (no Lenis).
- IntersectionObserver for reveal-on-scroll.
- No GSAP, no Three.js, no React, no build pipeline.

## Performance gates

- Grain: skipped on touch / coarse pointer / width < 900px.
- Custom cursor: skipped on touch + reduced-motion.
- Reveal animations: skipped on reduced-motion.
- Marquees: paused via `animation-play-state` on hover; killed on reduced-motion.
- Hero backdrop: preloaded via `<link rel="preload" as="image" fetchpriority="high">` for LCP.

## Reference docs in this folder

- `INVESTIGACION-KOLOKINO.md` — cinema sites studied + 12 techniques to steal
- `PLAN-KOLOKINO.md` — sitemap, design system, top-20 priority list
- `BRIEF-DISENO-WEB-KOLOKINO.md` — reusable decisions for next session

## Known limits (for future sessions)

- Latest Releases depends on public CORS proxies. If all three fail simultaneously AND no localStorage cache exists, the static fallback shows old videos. Long-term: GitHub Action that runs `update_videos.py` daily.
- Color-of-page dynamic accent not wired — needs locally-hosted posters (YouTube i.ytimg.com blocks canvas readout).
- Multi-language structure ready (`<span class="lang-XX">` pattern from v1) but v2 ships EN-only.
