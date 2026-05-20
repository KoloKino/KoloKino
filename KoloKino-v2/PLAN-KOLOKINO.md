# PLAN — kolo-kino.com v2 · Rediseño Visual Cinematográfico

## 1. Sitemap revisado

Single-page por ahora. Las secciones del v1 funcionan estructuralmente; la transformación es visual. Orden + roles:

1. **Academy leader loader** (0.0–2.5s) — countdown 3·2·1 sobre `<body>` antes de pintar.
2. **Letterbox masthead 2.39:1** — primera fold. Video silent loop + lockup serif "The stories cinema deserves". Letterbox bars que crecen al scrollear (Blindsight).
3. **Manifesto / standfirst** — replicar la lógica Criterion: gran tipografía editorial, sin imágenes. 80-120 palabras max.
4. **Hover-to-swap hero list** — "What's playing" list 6 items numerados 1/6, hover swappea backdrop video. Refleja la dirección autorial del canal (A24 move).
5. **Featured long-form** (#featured) — los 4 flagships actuales (Tarantino, Scorsese, Cameron, DiCaprio) como **filmstrip horizontal scroll** con perforaciones 35mm SVG. Pin + scrub.
6. **Latest from the channel** (#videos) — Latest Releases grid, MANTENER el self-update RSS race + caché. Skin nuevo: cards con slate-header style, mono captions.
7. **By the numbers** (#numbers) — slate-style cards. Numerals XL Bodoni Moda con `var(--paper)`. Sticky reveal con clip-path.
8. **Cinephiles, worldwide** (#audience) — markets + devices. Conservar el mapping de países, rediseñar como ledger/credits roll.
9. **The people behind every frame** (#team) — team grid con cinematic portrait treatment (grain overlay per portrait, mono caption).
10. **Sponsorship that fits the story** (#sponsorship) — single-column editorial pitch, slate header, link to PDF.
11. **Marquee de directores** — entre sections, infinite scroll names of subjects covered.
12. **Contact** (#contact) — minimal.
13. **Footer monumental** — wordmark "KOLO KINO" en marquee enorme. Social icons abajo.

## 2. Sistema de diseño

### Color tokens (CSS variables `:root`)
```
--ink:        #0a0a0a   (true cinematic black)
--ink-warm:   #110b0a   (slight warm tint for elevated)
--ink-2:      #181414
--paper:      #f5e9c8   (Academy leader cream — accent text)
--paper-dim:  #c5b89a
--fg:         #f4f1ec   (celluloid cream — body)
--fg-dim:     #b5b0a8
--line:       #2a2424
--blood:      #c8102e   (Criterion red — primary accent)
--gold:       #b5985a   (Janus muted gold — secondary)
--accent:     var(--blood)   (dynamic per section)
```

### Typography
- **Display (titles)**: Playfair Display 700/900 — ya cargada.
- **Body / UI**: Inter 400/500/600 — ya cargada.
- **Mono (labels, slates, eyebrows, kickers)**: JetBrains Mono 500/700 — añadir.
- **Numerals (stats)**: Bodoni Moda 900 — ya cargada.

Type scale:
```
display:  clamp(3rem, 9vw, 7.5rem)   (hero H1)
h1:       clamp(2.4rem, 6vw, 5rem)
h2:       clamp(2rem, 4vw, 3.5rem)
h3:       1.5rem
body:     1.05rem
caption:  0.85rem  (mono uppercase tracking .15em)
kicker:   0.72rem  (mono uppercase tracking .25em)
```

### Spacing scale
```
xs: 0.4rem   sm: 0.8rem   md: 1.2rem   lg: 2rem
xl: 3.2rem   2xl: 5rem    3xl: 8rem    4xl: 12rem
```

### Easings
```
--ease-cine: cubic-bezier(0.65, 0, 0.35, 1)   (slow start, slow end — projector feel)
--ease-cut:  cubic-bezier(0.85, 0, 0.15, 1)   (snappy cut)
--ease-fade: cubic-bezier(0.4, 0, 0.2, 1)
```

## 3. Top-20 elementos premium a integrar (prioridad)

**P0 — Showstoppers (must ship)**:
1. Academy leader countdown loader 3-2-1.
2. Letterbox masthead 2.39:1 + animated letterbox bars on scroll.
3. Live SVG film grain overlay full-page (12fps).
4. Hover-to-swap hero list (A24 numbered) — 4-6 items.
5. 35mm filmstrip horizontal scroll para flagship docs.
6. Editorial homepage logic (Criterion) — H1 grande sobre still, sin carousel above-the-fold.
7. Custom crosshair cursor con mix-blend-mode difference.
8. Slate / clapperboard section headers (mono meta + serif title + diagonal stripes).
9. Marquee infinito de directores entre sections.
10. Footer monumental "KOLO KINO" wordmark.

**P1 — Premium polish**:
11. Underline-grows-from-left links.
12. Mono + sans + serif system applied throughout.
13. Vertical-to-horizontal scroll rail (GSAP pin/scrub) en featured.
14. Sticky reveal con clip-path on numbers / audience.
15. Color-of-page dinámico via canvas-average dominant color por section.

**P2 — Easter eggs y nice-to-have**:
16. VHS easter egg toggle (Konami code → `body.vhs`).
17. End-card watch-next overlay on hover de featured cards.
18. Director-name filter pills en Latest videos.
19. FLIP expand-to-fullscreen para video thumbs.
20. Aspect-ratio toggle visible en featured (2.35 / 16:9 / 4:3 / 1.33).

## 4. Decisión técnica

- **Smooth scroll**: Lenis via CDN (`@studio-freight/lenis`). Drives `--scroll` CSS var on `<html>`.
- **Anim**: GSAP 3 + ScrollTrigger via CDN. Solo para: scrub video (R4), horizontal scroll rail (R3-Smerilli), letterbox bars (R1-Blindsight).
- **No JS framework**. No build step. Single index.html, single inline `<style>`, single inline `<script>`. GitHub Pages compat 100%.
- **No Three.js**. SEO + mobile cost > benefit para doc channel.
- **No service worker** (todavía).
- **Asset budget**: 2 hero loops max (8s, ~1.5MB each H.264 720p) + grain SVG inline + posters JPG.
- **Existing assets reusable**: logo.png, banner.jpg, SG Grainy Speckle Textures/*.png, social icons.

## 5. Lo que SE CONSERVA del v1

- Latest Releases con race de proxies + caché localStorage (no tocar lógica, sí re-skin).
- Caption Top Markets exacto ("A community of cinephiles in the world's leading film markets, mostly English-speaking").
- Schema JSON-LD completo (Organization, Persons, VideoObjects).
- Multi-idioma via `<span class="lang-XX">` siblings (EN principal).
- Anti-flash script de idioma inline en `<head>`.
- GA4 tag.
- All meta tags (Open Graph, Twitter, canonical).
- Favicons.
- Footer social links.

## 6. Reglas a respetar

- **Dark by default**, sin excepciones.
- **NO em-dashes** en copy nueva. Usar punto, coma o guion corto.
- **NO loremipsum**. Copy real desde los guiones o tono Kolo Kino existente.
- **Reduced-motion**: cero grain animation, cero marquee, cero cursor smoothing, cero scroll-linked anims.
- **No-JS fallback** completo (CSS-only fallbacks para todo lo dinámico).
- **A11y AAA** contraste en body text.
- **LCP < 2.5s**, JS bundle inline < 100KB sin comprimir.

## 7. Orden de implementación

1. Reescribir `<head>` (añadir JetBrains Mono, ajustar OG, mantener todo lo demás).
2. Inyectar Academy leader loader markup + CSS al inicio del body.
3. Inyectar SVG film grain + crosshair cursor (fixed, ignored from flow).
4. Reescribir hero como letterbox 2.39:1 + lockup serif.
5. Manifesto editorial.
6. Hover-to-swap hero list.
7. Featured como filmstrip horizontal (perforaciones SVG).
8. Latest videos re-skin (preserva JS RSS race + caché).
9. Slate headers para numbers, audience, team, sponsorship.
10. Marquee de directores.
11. Footer monumental.
12. Easter eggs (Konami → VHS).
13. CSS variables + tokens.
14. JS: Lenis init, GSAP ScrollTrigger setup, crosshair cursor RAF loop, grain seed loop, hero-list hover swap, marquee, leader countdown.
