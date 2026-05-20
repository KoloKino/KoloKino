# INVESTIGACIÓN — Cinema Premium Sites · Steal List para kolo-kino.com v2

Investigación cinemática para rediseño visual ambicioso. Las referencias se eligen por **técnica implementable**, no por estética genérica. Vanilla HTML/CSS/JS + GSAP/Lenis. GitHub Pages estático.

---

## A. Plataformas y revistas de cine premium

### MUBI · mubi.com
- **Hero**: Full-bleed photographic still de un film vigente. Top status bar ("Now Showing"). Single huge type lockup. Sin video autoplay en home. Detail letterboxea el still en 16:9 con negative space masiva.
- **Grid**: Horizontal poster rail con snap. Notebook editorial = magazine grid asimétrico 60/40.
- **Type**: MUBI Mono (display) + LL Riforma (UI sans). Display lockups all-lowercase, tight tracking.
- **Color**: `#0B0B0B` near-black, `#FFFFFF`, `#FFD201` mustard CTAs, `#2E2E2E` surface.
- **Microinteraction**: Cursor custom (chunky arrow) sobre cards. Posters scale `1.02` + image-shift parallax 100ms.
- **STEAL**: **Mono-display + neutral-sans pairing** para signal art-house. JetBrains Mono + Inter como sustitutos gratis.

### Criterion · criterion.com/current
- **Hero**: NO hay big hero. Magazine cover: serif essay headline + still + byline.
- **Grid**: Editorial mixed-density. Una featured story span 2-col, después 3-col grid de essays.
- **Type**: Criterion Sans + Caslon-derived serif. Helvetica-feel UI. Serif con brackets afilados y alto contraste.
- **Color**: `#FFFFFF`, `#111`, `#C8102E` Criterion red hover, `#F4F1EB` cream surface.
- **Microinteraction**: Underline-grows-from-left vía `background-size: 0% 1px → 100% 1px`.
- **STEAL**: **Editorial cover homepage**, no marketing landing. Featured essay above-the-fold con un single still y serif H1. Anti-streamer.

### A24 · a24films.com
- **Hero**: Sticky autoplay 16:9 trailer (muted, ~10s loop) del film actual. Lista numerada "1 / 6" debajo, click swap.
- **Grid**: Heterogeneous brick. Film tiles (16:9), shop (square), podcast (16:9), notes (portrait). Lee como magazine, no como app.
- **Type**: NB International Pro + NB International Mono. All caps labels en mono. Sin serif.
- **Color**: `#000`, `#FFF`, `#FF0000` ocasional hover. Asset colors do all the work.
- **Microinteraction**: Hover de list-item swappea `<video src>` instantáneamente (no fade). Visceral.
- **STEAL**: **Hover-to-swap hero** con 6 muted loops 720p preloaded. Pin "1 / N" bottom-right.

### Le Cinéma Club · lecinemaclub.com
- **Hero**: Single film of the week. Letterboxed still full-bleed, title thin classical serif. Sin nav chrome competing — solo film + título + countdown a next Friday.
- **Grid**: Sin grid casi. Archives = vertical list, hover-reveal del still.
- **Type**: Caslon italic display + neutral sans UI.
- **Color**: `#FFFFFF`, `#111`, warm accent `#A88E6A`.
- **Microinteraction**: Archive rows hover-reveals still en absolute-positioned image anchored a mouse Y. Pure CSS+JS.
- **STEAL**: **One thing at a time**. Landing donde el current week's video se come la entire fold. Past videos en archive con hover-preview.

### Janus Films · janusfilms.com
- **Hero**: Slow auto-advancing slider (6 spots). Cinematic still + "Now Playing!" eyebrow + serif title + 1-line logline. Pagination "1 / 6".
- **Grid**: 3-col card grid. Poster + serif title + **director-linked filter** + country/year + format.
- **Type**: Heavy slab serif para titles + sans body. ALL CAPS small-caps labels.
- **Color**: `#FFF`, `#1A1A1A`, muted gold `#B5985A` accent.
- **STEAL**: **Director-name como filter pill**. Cada video card lleva `<a href="#dir=nolan">` que filtra el archive.

---

## B. Awwwards picks cinema-tagged

### Edoardo Smerilli (SOTD)
- Vertical-scroll → horizontal-translate vía GSAP ScrollTrigger.
- Custom blob cursor que morphea a "play ▸" sobre video tiles.
- **STEAL**: `gsap.to(rail, { x: () => -(rail.scrollWidth - innerWidth), scrollTrigger: { trigger: section, pin: true, scrub: 1, end: () => '+=' + rail.scrollWidth }})`.

### Blindsight (microsite)
- Marquee text gigante sobre fixed bg video.
- Letterbox bars que animan `height 0 → 12vh` al entrar "cinema mode".
- **STEAL**: **Animated letterbox bars on scroll**. Dos `position: fixed` top/bottom, height drived por ScrollTrigger.

### Ethos Media (Film Roll Horizontal Scroll)
- 35mm filmstrip literal con perforaciones SVG. Frames tilteados en perspectiva.
- **STEAL**: **SVG sprocket-hole border** vía `<pattern>` como section divider. Pure decorative.

### Cinema Typography (Honorable Mention)
- Wall of famous title cards en su propia tipografía.
- Click expandé a fullscreen vía **FLIP technique**.
- **STEAL**: **FLIP expand-to-fullscreen** en click de video thumbs. Feels like Criterion essay opening.

---

## TOP 12 TÉCNICAS A ROBAR (ranked by cinema-doc-channel impact)

1. **Letterbox bars animados on scroll** — Blindsight. `position: fixed` top/bottom `<div>`, height 0→12vh vía ScrollTrigger. THE most cinematic move.
2. **Hover-to-swap hero video** — A24. 6 muted MP4 loops preloaded 720p. Swap `<video>.src` en `mouseenter`. Pin "1/N" counter.
3. **Vertical→horizontal scroll rail** — Smerilli. GSAP pin + scrub para latest essays carousel.
4. **Scroll-linked clip-path reveal de stills** — 80vh sticky. `clip-path: inset(var(--p) 0)` driven by scroll progress.
5. **Custom cursor con state changes** — MUBI/Smerilli. Crosshair/reticle, mix-blend-mode difference. `.is-play` over video tiles.
6. **Director-name filter pills** — Janus. `<a href="#dir=nolan">` filtra cards vía display:none. Static-safe.
7. **Mono + sans typographic system** — A24/MUBI. JetBrains Mono labels + Inter body + Playfair Display para film titles.
8. **Editorial cover homepage** — Criterion. Big still + serif H1 + 80-word standfirst. Sin carousel above-the-fold.
9. **Underline-grows-from-left** — Criterion. `background-size: 0% 1px → 100%`. Zero JS.
10. **FLIP expand-to-fullscreen** — Cinema Typography. `getBoundingClientRect()` antes/después, animate delta.
11. **SVG sprocket-hole section divider** — Ethos. 24px tall SVG con circles via `<pattern>`. Pure decoration.
12. **Slow auto-advance slider 1/6** — Janus. `setInterval` 7s, pauses on hover, dots clickable.

---

## RECETAS DE IMPLEMENTACIÓN (12 cinema-specific patterns)

### R1. Letterbox masthead 2.39:1
```css
.hero-letterbox{ background:#000; padding-block:var(--bar, clamp(24px, 6vh, 80px)); display:grid; place-items:center; }
.hero-frame{ width:100%; aspect-ratio: 2.39/1; max-height:calc(100svh - 2*var(--bar)); overflow:hidden; }
```
Gotcha: usar `svh` (no `vh`) en iOS. Portrait fallback `@media (orientation:portrait){ aspect-ratio:4/3 }`.

### R2. Film grain SVG animado
```html
<svg class="grain"><filter id="g"><feTurbulence id="t" type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg>
```
```css
.grain{ position:fixed; inset:0; pointer-events:none; opacity:.10; mix-blend-mode:overlay; z-index:9999; }
```
Animar `seed` cada 80ms (12fps suficiente, no 60). Disable on `prefers-reduced-motion`.

### R3. Academy leader countdown 3-2-1
Conic gradient sweeping `--p: 0% → 100%`, mono numbers Plex Mono. Sync exit con `body.loaded` class.

### R4. Scrub video on scroll
```js
gsap.to(v, { currentTime:v.duration, ease:'none',
  scrollTrigger:{ trigger:'.scrub', start:'top top', end:'+=200%', scrub:0.5, pin:true }});
```
CRÍTICO mobile: `muted` + `playsinline` + `webkit-playsinline`, video < 15s, H.264 baseline 1-2Mbps, **fragmented MP4** (`ffmpeg -movflags +faststart+frag_keyframe`). `#t=0.001` hack para poster en iOS.

### R5. Aspect-ratio toggle
```js
btn.onclick = () => stage.style.setProperty('--ar', btn.dataset.ar);
```
```css
.ar-stage{ aspect-ratio: var(--ar); transition: aspect-ratio .4s ease; }
```

### R6. Color-of-page dinámico
Canvas average 50×50 (no library). Cross-origin: `<img crossorigin="anonymous">` y hostear posters same-repo (GitHub Pages OK).

### R7. 35mm filmstrip
```css
.filmstrip{
  background:
    repeating-linear-gradient(90deg, transparent 0 14px, #0a0a0a 14px 32px) 0 0/100% 18px no-repeat,
    repeating-linear-gradient(90deg, transparent 0 14px, #0a0a0a 14px 32px) 0 100%/100% 18px no-repeat,
    #111;
  display:flex; gap:1rem; overflow-x:auto; scroll-snap-type:x mandatory;
}
```

### R8. Slate header
Diagonal stripes 135deg + mono meta (SCENE/TAKE/ROLL) + serif title.

### R9. VHS easter egg
SVG filter chain: feColorMatrix RGB-channel-shift + feTurbulence + feDisplacementMap. CSS scanlines overlay con `mix-blend-mode: multiply` + animation roll.

### R10. Marquee
```css
.track{ display:flex; width:max-content; animation:scroll 30s linear infinite; gap:3rem; }
.track:hover{ animation-play-state:paused; }
@keyframes scroll{ to{ transform:translateX(-50%) }}
```
Duplicar contenido idéntico, `aria-hidden` en duplicate.

### R11. Focus-puller cursor (crosshair)
```js
let tx=0,ty=0,cx=0,cy=0;
addEventListener('pointermove', e=>{ tx=e.clientX; ty=e.clientY; });
(function loop(){ cx+=(tx-cx)*.18; cy+=(ty-cy)*.18; r.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
```
`@media (hover:hover){ body{ cursor:none }}`. `mix-blend-mode:difference` con white strokes.

### R12. End-card watch-next
CSS-only overlay sobre last-frame poster con gradient + 2 thumb cards + subscribe button. Kicker en Plex Mono uppercase tracking `.2em`.

---

## Decisiones técnicas para v2

- **Fonts**: Playfair Display (titles, ya cargada) + Inter (body, ya cargada) + JetBrains Mono (metadata/labels nueva).
- **Color tokens**:
  - `--ink: #0a0a0a` (true black, was #0b0b0b)
  - `--paper: #f5e9c8` (Academy leader cream)
  - `--blood: #c8102e` (Criterion red, semantic accent)
  - `--gold: #b5985a` (Janus accent, secondary)
  - `--fg: #f4f1ec` (cream celluloid)
  - `--accent` dinámico por sección (color-thief)
- **Libs**: GSAP 3 + ScrollTrigger via CDN. Lenis para smooth scroll. NO Three.js (overkill SEO/mobile).
- **Image strategy**: existing assets en repo + grain pngs (`SG Grainy Speckle Textures/1-10.png`). Sin CDN deps.
- **Performance gates**: grain animado, VHS y scrub video solo activos en `matchMedia('(min-width:900px)')`.
- **A11y**: `prefers-reduced-motion` apaga grain animation, marquee, cursor smoothing, scroll-linked anims.
