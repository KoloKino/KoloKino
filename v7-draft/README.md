# Soul Touch Therapy — Web v5

Static. HTML + CSS + vanilla JS + Lenis + GSAP. Ready for Cloudflare Pages.

## v5 — the conversion build (May 2026)

**Strategic shift:** in-person sessions retired. The site now sells **one product only**: the **Soul Touch Therapy 2.0** online course. Every funnel ends at `learn.html` → Circle checkout.

**Goals:**
- Convert visitors into course enrollments (primary)
- Build the journal subscriber list (secondary)
- Establish brand authority (tertiary)

**Tone:** cinematic · sensual · warm · luxurious · clear · NON-sexual.

## Pages

| URL | Purpose |
|-----|---------|
| `index.html`        | Home — cinematic hero, 3 ways in, meet Soul, course teaser, testimonials, newsletter |
| `what-is.html`      | The method — philosophy, 6 principles (sticky scroll), Q&A |
| `learn.html`        | The course — flagship landing (hero, 6 pillars, curriculum 7×44, two paths, preview, pricing, testimonials, FAQ, big CTA) |
| `watch.html`        | Watch — YouTube grid + featured video player |
| `articles.html`     | The journal — newsletter signup + selected letters |
| `articles/what-is-touch-therapy.html` | Long-form article example |
| `404.html`          | Not found |

Old routes (`sessions.html`, `contact.html`, `blog.html`, `courses.html`, `method.html`, `newsletter.html`, `courses/*`, `blog/*`) are HTML redirect stubs **and** redirected at the edge via `_redirects`.

## Premium UX engine

| What | How |
|------|-----|
| Smooth scroll | **Lenis** 1.3.x (CDN) |
| Scroll-triggered animation | **GSAP** + **ScrollTrigger** (CDN), synced with Lenis ticker |
| Reveal on view | IntersectionObserver — classes: `.reveal`, `.reveal-slow`, `.reveal-clip`, `.reveal-image`, `.reveal-stagger`, `.reveal-lines` |
| Custom cursor | Desktop only, mix-blend-mode difference — hover state on interactive elements |
| Magnetic buttons | `.magnetic` class, pulls toward cursor |
| Word rotator | `.word-rotator` in hero — cycles "healing / sacred / somatic / quiet" |
| Marquees | CSS-only, seamlessly cloned via JS |
| Hero parallax | GSAP scale-on-scroll for the video |
| Header transformation | `.scrolled` + `.dark-mode` classes |
| Scroll progress bar | Top-of-page burgundy→gold gradient |
| Animated counters | `[data-count]` triggered on view |
| Sticky philosophy | Apple-style sticky principles tracker |
| Sticky curriculum | 7-module accordion with sticky aside |
| Floating CTA mobile | `.floating-cta` appears after hero exit |
| Page loader | Brief logo pulse + fade |
| Reduced motion | All animations gracefully disabled |

## Brand facts (use these exactly)

- 6 years of practice
- 600+ students certified worldwide
- 7 modules, 44 lessons, 9+ hours
- 2 years of course access (extendable)
- Online only — in-person retired May 2026
- Certification requires submitting practice videos

## Palette

- `--cream` `#f0e7d5` — body bg
- `--paper` `#faf6ec` — cards, alt sections
- `--sage-night` `#1f2a23` — dark hero + footer
- `--sage-deep` `#2c3a30` — quote bands
- `--burgundy` `#6f0c0c` — primary accent (CTAs, eyebrows)
- `--gold` `#c4a878` — secondary accent (on dark, on pricing)
- `--ink` `#2b2a28` — body text

## Type

- **Unbounded** — display (h1, h2)
- **Inter** — body, UI, nav
- **Cormorant Garamond** — italics, lede, pull quotes, accent words inside headings

## Languages

EN, ES (toggle visible) + PT, DE, IT, FR, RU, UK (dropdown). Multi-lang via `<span class="lang-XX">` siblings + CSS visibility.

## Newsletter form

Placeholder. To wire up: replace the `form.newsletter-form` submit handler in `js/main.js` with a POST to ConvertKit / Mailchimp / Buttondown / Beehiiv.

## Course checkout

Single CTA destination: `https://souls-community-d38799.circle.so/checkout/soul-touch-therapy-20`

## Local preview

Open `index.html` in a browser. No build step. Requires internet for Lenis/GSAP CDNs.

## Deploy

Push to GitHub → Cloudflare Pages builds from `v5-draft/`. `_redirects` handles old → new path mappings at the edge.

## Files of note

- `css/styles.css` — main visual system (~1700 lines, the heart of v5)
- `css/responsive.css` — patches & extras (modals, feature blocks, hero entrance)
- `js/main.js` — Lenis init, GSAP scroll-triggers, custom cursor, word rotator, magnetic, language toggle, all interactivity
- `BRIEF-DISENO-WEB-SOULFLOW.md` (parent folder) — design decisions log
