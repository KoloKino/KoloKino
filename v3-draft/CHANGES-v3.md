# v3-draft — Changelog

## Round 2 (esta sesión) — qué se ha hecho

### Investigación de Soul

Antes de tocar nada, investigué su perfil público con una agente de búsqueda. Datos integrados al sitio:

- Nombre público en todas sus propiedades digitales: **Soul** (no encontré "Lera" mencionado en ninguna fuente pública — la trataré como Soul hasta que me confirmes lo contrario).
- Basada en **Los Angeles**, con outcalls a otras ciudades de EE. UU.
- Touch therapist, dancer, movement coach. Cinco años estudiando tantra, regulación del sistema nervioso y sanación somática.
- **700+ alumnas certificadas** (cifra IG, más reciente que el "600+" que aparece en la web actual — uso la nueva).
- **211K seguidoras en Instagram**.
- Clientes notables citables: NLE Choppa, D'Angelo Russell, DeAndre Hopkins, Jonathan Kuminga, Doc Rivers, Rasheem Green.
- Prensa: VoyageLA, enero 2026.
- Frase fundacional: *"almost accidentally I created Soul Touch Method"*.

He guardado todo esto en mi memoria interna para no perderlo.

### Bug fix — traducciones EN/ES

El problema era que el cuerpo de las páginas (fuera del home) no tenía `<span class="lang-en">` ni `<span class="lang-es">` — solo el header y el footer. El JS hacía bien el trabajo pero no había nada que traducir. Arreglado en:

- **`index.html`** — hero, manifesto, secciones de cursos, perfil de Soul, facts, testimonios, CTA final
- **`method.html`** — hero, 4 principios numerados
- **`courses.html`** — hero, flagship, online courses, in-person section
- **`sessions.html`** — hero, "the session", booking steps

Para las páginas restantes (blog.html, contact.html, 404, article) la nav y el footer ya están traducidos; el cuerpo cae limpiamente a inglés (sin texto cortado ni vacío), y se traducirá en la siguiente iteración.

### Nuevo en home

- **Hero con video de fondo + overlay oscuro burgundy** (placeholder gradient hasta que dejes el `.mp4` en `images/hero-bg.mp4`).
- **CTA hero** ahora apunta directo a Circle.so para Soul Touch Method 2.0. Botón burgundy con sombra warm.
- **Flagship section** (Soul Touch Method 2.0) — tarjeta dark mode prominente, antes del resto de cursos. Datos reales: 9+ horas, 7 módulos, 44 lecciones, certificado.
- **Sales cards** para Self-Massage, Couples, Essential Oils con **precios reales con descuento visibles** (extraídos de la web actual: $99/$99/$55). Cada uno con CTA → checkout directo en Circle.so.
- **Profile card "Meet Soul"** con: bio, 4 chips de datos (LA · 5 años · 700+ certificadas · 211K IG), filosofía, clientes pro-athletes listados.
- **Sección facts actualizada**: 700+ (no 100+), 211K, LA · World.
- **Carrusel de testimonios** con 5 reseñas reales scrapeadas de la web actual (Samuel, Sarah, Alex, Joseph, Amanda). Scroll-snap horizontal nativo, sin JS.

### Nuevo en courses.html

- **Flagship card oscura** prominente arriba (igual que home).
- Sales cards con precios visibles y links directos a Circle.so para los 5 productos del catálogo (Self-Massage, Couples, Essential Oils, In-person waitlist, Webinar gratis).
- Sección antigua "for practitioners" / "special" eliminada — el contenido ahora está en los grids principales.

### Nuevo en sessions.html

- **How to book ahora es horizontal**: 4 columnas con un `+` para desplegar. Al abrir un paso, esa tarjeta expande a ancho completo y muestra el detalle con más cuerpo de texto. En tablet pasa a 2 columnas, en móvil a 1.
- Hero traducido (EN/ES) + precio "From $1000" visible.

### CSS — nuevos componentes

- `.flagship` — card oscura grande con imagen + copia + lista + CTA
- `.sale-card` — tarjeta producto vertical con precio old/new + CTA
- `.profile` — perfil con foto a la izquierda y bio a la derecha
- `.acc-horizontal` — variante del acordeón en 4 columnas
- `.testimonial-strip` + `.testimonial` — carrusel scroll-snap nativo
- `.hero-bgvideo` — capa de video + overlay
- `.btn-cta` — botón con más peso visual para sells
- `.btn-primary:hover` — ahora hace lift a **burgundy más suave** con sombra warm (antes se volvía negro)

### Mobile — imágenes ya no comen pantalla

CSS responsive ajustado: las imágenes de hero, feature y card en mobile tienen `max-width: 280-320px` y `max-height: 360-420px` y van centradas. Mismo principio que feralhog.

### Marca

- Wordmark de la nav: **"Soul Flow"** (igual que tu logo). "Soul Flow Vibe" se mantiene en footer, page titles, SEO y meta (donde es la marca registrada).
- Botón primario tiene un hover **burgundy warm** + sombra cálida en vez de virar a negro.
- Variables nuevas en `:root`: `--burgundy-soft`, `--rose`.

### Links rotos

Audité todos los enlaces internos. Los 13 que apuntaban a páginas que no existen todavía:

- 7 links a course-pages internos (self-massage, breathwork, somatic-touch, in-person, couples, essential-oils, webinar) → ahora todos apuntan **directamente a sus checkouts en Circle.so**, lo que además es mejor para conversión.
- 6 links a artículos de blog inexistentes (aromatherapy, can-anyone-learn, foot-exercises, how-touch-heals, soul-touch-is-an-art, what-is-psychosomatic) → redirigidos a las URLs vivas en `soulflowvibe.com/article_...` hasta que escribamos las versiones nuevas.

Verificación: ya no hay links rotos hacia archivos locales inexistentes.

### Logo / favicon

Aún no tengo los archivos PNG que mencionas (v1–v5). El sistema de favicon que monté antes sigue ahí (SVG aproximado + PNGs generados). **Cuando dejes los archivos en `v3-draft/images/logo/`**, dime y los integro:

- `v5.png` → favicon (lo que me pediste)
- `v1.png` (full + tagline, burgundy on cream) → posible OG image / about pages
- `v2.png` (full inverted on burgundy) → footer / dark sections
- `v3.png` (mark only) → headers, social cards
- `v4.png` (SOUL FLOW stacked) → posiblemente decoración

---

## Lo que aún queda (para la próxima iteración)

### Bloqueado por ti
- **Los archivos del logo** (v1–v5.png). Sin ellos, el favicon y el wordmark del header siguen siendo aproximaciones SVG hechas a mano.
- **El video de fondo del hero** (`.mp4` corto, autoplay-muted-loop). En el código está la etiqueta `<video>` lista; si no existe el archivo, cae automáticamente al gradient placeholder.

### Traducciones pendientes (siempre ES, opcionalmente los otros 6)
- `blog.html` cuerpo
- `contact.html` cuerpo
- `courses/soul-touch-method.html` cuerpo (curriculum 1-8, etc.)
- `blog/what-is-touch-therapy.html` cuerpo del artículo
- `sessions.html` "what to expect" + "etiquette"
- Sections restantes de `method.html` (How a session moves, About Soul, CTA)
- Las translations a PT/DE/IT/FR/RU/UK del body (la nav ya está hecha)

### Bigger asks que dejé pasar
- Plantillas de las 6 páginas de cursos individuales + 5 artículos individuales (todos los CTAs ya van bien a Circle.so / live URLs, pero las plantillas internas siguen sin existir)
- El formulario de contacto sigue apuntando a `/api/contact` (Worker pendiente para cuando hagamos cutover)
- Newsletter signup en blog.html (placeholder, sin backend)

### Mejoras que se me ocurren para discutir
- Probablemente el carrusel de testimonios pide un botón "ver más reviews" que abra Instagram Highlights. Ya está incluido como caption.
- Las cards de venta podrían ganar **urgency tags** ("only X spots left", "next cohort starts Sept") cuando tengas datos reales.
- El profile card de Soul gana mucho si añadimos **logos de medios** (VoyageLA + lo que venga) en una tira pequeña tipo "as featured in".
