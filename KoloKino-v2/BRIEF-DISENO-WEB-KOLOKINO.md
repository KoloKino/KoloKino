# BRIEF — Decisiones de diseño · Kolo Kino v2

Resumen de decisiones reutilizables del rediseño cinematográfico de kolo-kino.com. Vivo aquí para que la próxima sesión no empiece desde cero.

---

## 1. Identidad visual

**Posicionamiento**: independent cinema documentaries premium. No streamer, no influencer, no creator. Más cerca de Criterion / MUBI / A24 que de YouTube convencional.

**Paleta**:
- `--ink: #0a0a0a` (true cinematic black, no gris)
- `--paper: #f5e9c8` (Academy leader cream, el color que SOLO se usa para acento, eyebrows, slate)
- `--blood: #c8102e` (Criterion red, acento primario)
- `--gold: #b5985a` (Janus muted gold, acento secundario raramente usado)
- `--fg: #f4f1ec` (celuloide cream, body text)
- `--fg-dim: #b5b0a8` (secundario, contraste 6:1)
- `--fg-mute: #a09a92` (terciario, contraste 4.5:1 — NO bajar más)

**Tipografía**:
- **Playfair Display** 700/900 + italic — film titles, manifesto, hero
- **Inter** 400/500/600/700 — body, párrafos, UI
- **JetBrains Mono** 500/700 — eyebrows, slate meta, kickers, captions cinemáticas
- **Bodoni Moda** 900 — numerals (hero stats, number cards, percentages)

Combinación característica: serif italic + mono uppercase tracking 0.2em. La triada serif/sans/mono diferencia capas de información (poesía / lectura / metadata).

---

## 2. Componentes premium implementados

| Componente | Técnica | Dónde |
|---|---|---|
| Academy leader 3-2-1 | Loader full-screen, mono numerals, conic-gradient sweep, sessionStorage skip-on-return | `.leader` |
| SVG film grain | `feTurbulence` con seed animado 120ms, screen blend, gated >900px hover | `.grain-svg` |
| Crosshair cursor | SVG reticle + mix-blend-mode difference, RAF lerp 0.22, swap a play-icon sobre video tiles | `.reticle` |
| Letterbox masthead | `aspect-ratio: 2.39/1` + portrait fallback 4:3 + bandera negra padding-block del wrap | `.hero-frame` |
| Slate header | Diagonal stripes `repeating-linear-gradient 135deg`, mono meta SCENE/TAKE/ROLL, serif title | `.slate` |
| Hover-to-swap hero list | 4 stages absolute, opacity transition, list `pointerenter` swap + counter 01/04 | `.upcoming-grid` |
| 35mm filmstrip | Perforations vía `repeating-linear-gradient` cinta paper, scroll-snap proximity | `.filmstrip-rail` |
| Director marquee | CSS-only `animation: marquee-scroll 60s linear infinite` + dup track + hover pause | `.director-marquee` |
| Footer wordmark | `KOLO KINO ✦` x8 stroke-only `-webkit-text-stroke` marquee | `.footer-wordmark` |
| VHS easter egg | Konami code `↑↑↓↓←→←→` → SVG filter (RGB channel offset + feDisplacementMap) + CSS scanlines roll | `body.vhs` |
| Reel indicator | Sticky nav right-side, 9 sections, scroll-driven | `#reelIndicator` |
| Reveal-on-scroll | IO + above-fold skip; cinematic easing 0.9s | `.reveal` |

---

## 3. Trucos invisibles

- **Top marquee strip** (28px alto): vintage cinema bulb marquee con bullets rojos. Crea la primera impresión "we're a venue, not a feed".
- **`mix-blend-mode: screen` para grain**: visible sobre `--ink-warm` pero discreto sobre el true-black `--ink`. Da textura sin ensuciar.
- **Vignette radial fija** (`--ink` 50%→ alpha 50% 100%): empuja la atención al centro del frame en todas las secciones.
- **Reveal-on-scroll skip-if-visible**: cualquier elemento ya above-the-fold se marca `.in-view` inmediatamente — evita el flash en cargas con anchor o restore-position.
- **`scroll-margin-top` global** en los `id` de sección: anchor jumps respetan el banner fijo + sticky nav (148px).

---

## 4. Reglas operativas (no negociables)

1. **Dark theme exclusivo**. Cero light mode. Cine no se ve con luz encendida.
2. **NO em-dashes** en copy nueva. Coma, punto, o guión corto.
3. **NO patrones IA**: "X isn't Y. It's Z." → prohibido. "We don't compete with X, we compete with Y" → solo si suena auténtico y atribuido (manifesto Alex pass).
4. **NO Wikipedia style**. La voz del canal es cause-and-effect, no expositiva.
5. **NO AI playing critic**: la web NUNCA califica las películas. Solo enumera, contextualiza, deja al espectador decidir.
6. **NO grain ni VHS en mobile/coarse pointer**: full-page SVG filter sangra batería en iOS Safari. Gating obligatorio.
7. **Latest Videos JS intocable** salvo restyle CSS: race de 3 proxies + caché localStorage es el contrato que evita Batman como último.
8. **Multi-language preparada** vía `<span class="lang-XX">` siblings; v2 vive EN-only por ahora (el v1 también).

---

## 5. Performance budget

- Web fonts: 4 familias × varios weights ≈ 250-350KB. Con `display=swap` y preconnect. No-go: añadir una 5ª.
- Hero LCP image: `<link rel="preload" as="image" fetchpriority="high">` apuntando a `i.ytimg.com/.../maxresdefault.jpg`.
- JS inline total: ~12KB sin comprimir. Sin libs externas (sin Lenis, sin GSAP, sin Three).
- Grain: setInterval 120ms gated a >900px y hover-capable.

---

## 6. Decisiones que NO se tomaron (por qué)

- **Lenis smooth scroll**: descartado. El gain es marginal y el bundle (10KB) no vale la pena para un single-page documental. CSS `scroll-behavior: smooth` cubre el 90%.
- **GSAP + ScrollTrigger**: descartado. Pin/scrub horizontal-rail era P1 nice-to-have, pero el filmstrip horizontal CSS-only ya da el efecto. Bundle GSAP+ST core = 45KB minified — no justificado.
- **Three.js / WebGL**: descartado siempre. Cine documental no necesita 3D. SEO + mobile cost > benefit.
- **YouTube Data API v3**: opción mejor que proxies CORS, pero requiere registro de clave + restricción por referrer. Defer hasta que un proxy caiga en producción suficiente para justificar el setup.
- **Color-of-page dinámico via Color-Thief**: descartado por complejidad. Cross-origin de YouTube i.ytimg.com no permite canvas readout sin headers que YouTube no envía. Imposible sin reverse-proxy.

---

## 7. Tres sorpresas no pedidas

1. **Top cinema marquee strip 28px** con bullets rojos — primera impresión "esto es un cine".
2. **Konami code → VHS filter** (Easter egg). SVG `feColorMatrix` RGB channel shift + `feDisplacementMap` + CSS scanlines roll. Toast confirmando el modo.
3. **Reel indicator en nav** — el right side de la sticky nav lleva un contador "Reel 4 / 9 · Latest" que actualiza con scroll. Detalle pequeño que insiste en la metáfora cinematográfica.

---

## 8. Lo que se le dejó al futuro

- Aspect-ratio toggle (2.35 / 16:9 / 4:3 / 1.33) — diseñado en plan, no integrado por falta de un asset real para demostrarlo.
- FLIP expand-to-fullscreen card — útil para "Read the essay" CTA cuando exista.
- Color-of-page dinámico — requiere hostear posters local (no remote).
- Vertical-to-horizontal pin con GSAP — overkill para el filmstrip actual.
- Director-name filter pills — exige más videos en la grid; defer.
- Scrub video on scroll — espera asset; no es prioridad para landing.

---

## 9. Archivos del repositorio v2

```
KoloKino - v2/
├── index.html                       — single-file site
├── banner.jpg                       — top banner cinema strip
├── logo.png + logo_200p.png         — wordmark fallback
├── favicon.ico, *favicon-*.png      — multi-size icons
├── pdf.png, youtube.png, ...        — UI/social icons
├── xgimi.png                        — past partner logo
├── team/ievgen.jpg, alex.jpg, gabe.jpg  — cast portraits
├── pages/page_05.jpg                — DiCaprio spike chart (zoomable in sponsorship)
├── SG Grainy Speckle Textures/1-10.png — opcional, no usado todavía
├── robots.txt, sitemap.xml          — SEO
├── INVESTIGACION-KOLOKINO.md        — cinema sites steal list
├── PLAN-KOLOKINO.md                 — sitemap + sistema + decisiones técnicas
├── BRIEF-DISENO-WEB-KOLOKINO.md     — este fichero
└── README.md                        — quickstart + deploy
```
