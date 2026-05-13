# Soul Touch Therapy — Web v4

Static. HTML + CSS + vanilla JS. Ready for Cloudflare Pages.

## v4 follows the brand proposal and the brand knowledge file (May 2026)

**Goals:**
- Drive traffic to Circle (community + courses) and YouTube
- Capture newsletter subscriptions
- Inform clearly about *Soul Touch Therapy* (not "soulmassage")
- Feel like a personal save-space — minimal, warm, intimate

**Tone:** very personal · luxurious · confident, not boastful · warm, not casual · clear, not clinical · NON-sexual.

## Pages (the new simplified sitemap)

| URL | Purpose |
|-----|---------|
| `index.html`        | Home — summary of what STT is + 3 ways in + newsletter |
| `what-is.html`      | What is Soul Touch Therapy — method, philosophy, Q&A |
| `watch.html`        | Watch — YouTube channel + featured videos |
| `learn.html`        | Learn — Course 2.0, two tracks (yourself / certified), curriculum, reviews |
| `newsletter.html`   | The journal — newsletter signup + sample letter |
| `404.html`          | Not found |

Old routes (`sessions.html`, `contact.html`, `blog.html`, `courses.html`, `method.html`) are kept as HTML redirect stubs and also redirected at the server level via `_redirects`.

## Brand facts (use these exactly)

- 6 years of practice
- 600+ students worldwide
- 7 modules, 44 lessons, 11 sections, 9+ hours
- 2 years of course access (with possibility to extend)
- Mainly online, occasional in-person workshops
- Course requires submitting practice videos for certification

## Palette

- `--cream` `#f0e7d5` — primary bg
- `--paper` `#faf6ec` — cards / alt sections
- `--sage-deep` `#2c3a30` — dark sections, footer
- `--burgundy` `#6f0c0c` — accents only (buttons, links, eyebrows)
- `--ink` `#2b2a28` — body text

## Type

- **Cormorant Garamond** — serif display + italics
- **Inter** — sans body + UI

## Languages

EN, ES (primary toggle) + PT, DE, IT, FR, RU, UK (dropdown). All copy is multilingual via `<span class="lang-XX">` siblings.

## Newsletter form

Currently a placeholder. To wire up: replace the `form.newsletter-form` submit handler in `js/main.js` with a POST to ConvertKit / Mailchimp / Buttondown / Beehiiv.

## Local preview

Open `index.html` in a browser. No build step.

## Deploy

Push to GitHub → Cloudflare Pages builds from the v4-draft folder. `_redirects` handles the old → new path mappings at the edge.
