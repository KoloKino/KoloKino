# Borrador de rediseño. Home (v0.3)

Mockup HTML estático del nuevo home para Feral Hog Content.

## Cómo verlo

1. Volvé a la carpeta padre (`Gabe/`).
2. Doble click en `copiar-assets.bat` (si todavía no lo corriste, o si Claude bajó nuevos assets. esta versión necesita los samples MP3 y el CV PDF).
3. Volvé acá y doble click en `index.html`. Se abre en el navegador.

## Cambios v0.2 → v0.3

**Eliminados / corregidos:**
- Banner superior "REDESIGN DRAFT v0.2". fuera.
- Botón duplicado "Start a project" del hero. fuera (queda solo en nav y CTA final).
- Filtro grayscale en logos médicos. fuera, ahora a color.
- Sección "Sobre Gabriel" suelta. la habíamos sacado en v0.2, sigue accesible vía modal.
- Embed de YouTube inline en V.O.. fuera. Ahora son links a YouTube como en kolo-kino.com.
- Bloque pequeño del jabalí en footer. fuera, reemplazado por brand sign-off grande.

**Nuevos / mejorados:**

| Cambio | Detalle |
|---|---|
| Nav siempre visible | En mobile (<720px) los items pasan a una segunda fila debajo del brand+CTA, con scroll horizontal si fuera necesario. La marca FERAL HOG CONTENT y el jabalí nunca se ocultan. |
| Nav representativa | 5 entradas: Audiobooks · Reels · Voice-Over · Healthcare · About. Más toggle EN/ES y CTA de Start a project. |
| CTA "Start a project" | Ahora rojo bien visible (con sombra). Abre **modal de contacto** con formulario de campos opcionales (nombre, empresa, email, teléfono, tipo, tiempo, mensaje). Submit arma un mailto: con todo el contenido. También ofrece email directo. |
| Hero CTAs | Primario "Meet Gabriel →" en rojo (abre modal About). Secundario "Hear audio samples" en ghost. El botón About ahora invita a hacer click. |
| Hero portrait mobile | `max-width: 320px` (480px-900px) y `240px` en mobile pequeño. Ya no ocupa toda la pantalla. |
| V.O. → YouTube link cards | 9 cards estilo kolo-kino: thumbnail 16:9, título serif a 2 líneas, view count debajo. Hover lift + borde rojo. Click abre YouTube en pestaña nueva. **Top 9 por views**. desde "Once Upon a Time… in Tarantino's Hollywood" (2.5M) hasta "Everything You Didn't Know About Inglourious Basterds" (802K). |
| Botón "Show all 41" | Inyecta los 32 restantes en la grilla, todos con título y views. |
| Self-Help → playlist compacto | 6 thumbnails chicos en una sola fila (3 en tablet, 2 en mobile). Sub-sección dentro de Voice-Over, no sección propia. Cards menores, link a YouTube. Texto "6 full titles on YouTube". |
| Healthcare logos a color | Sin filtro, max-height 130px (era 70), padding mayor (50px), hover scale 1.08. |
| Brand sign-off al final | Sección dedicada antes del footer con el jabalí en tamaño **220–340px** (mostaza con drop-shadow dorado), wordmark FERAL HOG CONTENT en serif gigante, tagline "Stories worth hearing. Stories worth seeing. Since 2014." |
| Hero meta data | Ahora dice "20M+ doc. views narrated" además de los otros 3 datos (10 audiolibros, ES/EN, 150+ radio). |
| Bio enriquecida | El modal About ahora cuenta lo de Kolo Kino y los 20M+ views como dato principal. |

## Sistema visual aplicado

- **Paleta:** `#0E0E0E` (negro), `#F4F1EC` (crema), `#D64541` (rojo cálido), `#E0A800` (mostaza).
- **Tipografías:** Fraunces (display) + Inter (texto).
- **Símbolo Feral Hog (jabalí):** aparece 3 veces. nav (rojo, 36px), hero (mostaza, watermark grande), brand sign-off (mostaza, 220-340px).
- **Hover vocabulary:** lift translateY(-1/3px), border swap a rojo, sombra suave.
- **Botones primarios:** rojo + sombra de color para que estén visibles desde lejos.

## Modales

**About**. abierto desde "Meet Gabriel" (hero), "About" (nav), "About" (footer). Contiene bio, Kolo Kino, 150 radios, Annotations series, IMDb credits (Griffin in Summer, Enemies of the State, NFL Today, link a IMDb completo), 11 brands/clients, descargar CV PDF, ver IMDb.

**Contact**. abierto desde "Start a project" (nav) y "Start a project →" (CTA final). Form con todos los campos opcionales. Submit arma mailto: con asunto "New project inquiry from feralhogcontent.com" y cuerpo formateado con los campos completados (en EN o ES según idioma activo). Botón secundario "Email directly" que abre cliente de correo a `gabe@feralhogcontent.com`.

## Limitaciones del mockup

- Es **HTML estático**, no Weebly. Cuando se migre, hay que:
  - Replicar el modal de contacto con el form builder de Weebly (más robusto que el mailto).
  - Implementar el modal About como custom HTML embed.
  - El toggle EN/ES → custom HTML embed con JS, o sub-páginas `/` y `/es/`.
- El submit de contacto vía `mailto:` depende del cliente de correo del usuario. En el sitio en Weebly se reemplaza con un form server-side.
- En navegadores muy viejos `mask-image` no funciona y el jabalí no aparece.

## Pendientes para Gabriel

- Confirmar bio + créditos de IMDb (incluí los 3 que aparecen en su página).
- Etiquetar los 6 audiolibros de Self-Help con título real (los puse como "Title 1", "Title 2"...).
- Confirmar los 4 logos de Healthcare (incluí Duke Square, los otros 3 sin nombre porque el sitio actual no los tenía).
- Decidir si los videos de Self-Help merecen título largo o si "Title 1, 2..." está bien.
- Validar el copy de las tarjetas expandibles de servicios.
