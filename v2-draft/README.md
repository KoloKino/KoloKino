# Soul Flow Vibe — Web v2 (first draft)

Estático puro. HTML + CSS + un poco de JS. Listo para servir desde Cloudflare Pages cuando llegue el momento.

## Estructura

```
v2-draft/
├── index.html                          # Home
├── method.html                         # The Method (about + filosofía)
├── courses.html                        # Hub de cursos
├── courses/
│   └── soul-touch-method.html          # Página de curso (plantilla)
├── sessions.html                       # Booking 1:1
├── blog.html                           # Hub de artículos
├── blog/
│   └── what-is-touch-therapy.html      # Artículo (plantilla)
├── contact.html
├── 404.html
├── css/styles.css                      # Sistema de diseño
├── js/main.js                          # Sticky header + mobile nav + reveal
├── images/                             # Assets seleccionados del export
├── robots.txt
├── sitemap.xml
└── _redirects                          # Reglas para Cloudflare Pages
```

## Páginas pendientes de poblar (plantillas a duplicar)

Cursos:
- `/courses/self-massage.html`
- `/courses/breathwork.html`
- `/courses/somatic-touch.html`
- `/courses/in-person.html`
- `/courses/couples.html`
- `/courses/essential-oils.html`
- `/courses/webinar.html`

Blog:
- `/blog/how-touch-heals-trauma.html`
- `/blog/can-anyone-learn-touch-therapy.html`
- `/blog/aromatherapy-in-massage.html`
- `/blog/soul-touch-is-an-art.html`
- `/blog/foot-exercises.html`
- `/blog/what-is-psychosomatic.html`

## Sistema de diseño

- Tipografía: Unbounded (display), Inter (body), Cormorant Garamond (decorative italic) — todas vía Google Fonts.
- Paleta: cream `#f6f1ea`, ink `#1a1413`, burgundy `#750608`, blush `#e8d5d6`, mist `#d0e2eb` (manteniendo identidad de Tilda).
- Layout: 12-col conceptual con `wrap`, `wrap-narrow`, `wrap-wide`.
- Componentes: `.btn`, `.card`, `.feature`, `.facts`, `.pull`, `.eyebrow`.

## Cómo previsualizar

```
cd v2-draft
python3 -m http.server 8080
# o
npx serve .
```

Y abrir `http://localhost:8080/`.

## Pendiente para el cutover real

1. **Multilingüe (EN/ES/…)** — definir estructura `/en/`, `/es/`, traducir contenido, hreflang, language switcher.
2. **Formularios de contacto** — el endpoint `/api/contact` en `contact.html` apunta a un Cloudflare Worker que aún hay que crear (Worker + Resend o Web3Forms).
3. **Newsletter en blog** — pendiente de elegir herramienta (Resend Audiences, Mailerlite, etc.) y enganchar el submit.
4. **Optimización de imágenes** — convertir las JPG/PNG pesadas a WebP/AVIF.
5. **Favicon set** — actualmente referenciado pero no incluido. Generar set completo (16, 32, 180, manifest).
6. **Resto de páginas de cursos y artículos** — duplicar y poblar las plantillas listadas arriba.
7. **Analytics** — añadir Cloudflare Web Analytics + GA4 + mantener Meta Pixel.

## Notas

- Todos los links de compra de cursos van a Circle.so (`souls-community-d38799.circle.so/checkout/...`).
- Los DM bookings van a Instagram (`@soul_flowvibe`).
- Header y footer están duplicados en cada página intencionalmente (no hay build step). Cuando se migre a Astro/Eleventy se extraerán como partials.
