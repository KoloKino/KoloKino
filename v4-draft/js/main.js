/* ============================================================
   Soul Touch Therapy · v4 interactivity
   - Mobile nav toggle
   - Reveal on scroll
   - Language toggle (EN visible primary + ES + dropdown for 6 more)
   - Newsletter signup → opens external form (placeholder)
   ============================================================ */

(function () {
  'use strict';

  // ── mark JS as active (so .no-js fallbacks turn off) ─────────────
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  // ── reveal on scroll ─────────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    );
    reveals.forEach((r) => io.observe(r));
  } else {
    reveals.forEach((r) => r.classList.add('in-view'));
  }

  // ── mobile nav ───────────────────────────────────────────────────
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-primary');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      navList.classList.toggle('open');
      navToggle.setAttribute(
        'aria-expanded',
        navList.classList.contains('open') ? 'true' : 'false'
      );
    });
  }

  // ── language toggle ──────────────────────────────────────────────
  const SUPPORTED = ['en', 'es', 'pt', 'de', 'it', 'fr', 'ru', 'uk'];
  const STORAGE = 'stt-lang';
  const html = document.documentElement;

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = 'en';
    html.setAttribute('lang', lang);
    try { localStorage.setItem(STORAGE, lang); } catch (_) {}
    document.querySelectorAll('.lang-toggle [data-lang]').forEach((b) => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    const more = document.querySelector('.lang-toggle .lang-more');
    if (more) {
      more.classList.toggle('active', !['en', 'es'].includes(lang));
    }
  }

  // initialize lang from storage or browser
  let initial = 'en';
  try {
    const stored = localStorage.getItem(STORAGE);
    if (stored && SUPPORTED.includes(stored)) {
      initial = stored;
    } else {
      const browser = (navigator.language || 'en').slice(0, 2).toLowerCase();
      if (SUPPORTED.includes(browser)) initial = browser;
    }
  } catch (_) {}
  setLang(initial);

  // wire buttons
  document.querySelectorAll('.lang-toggle [data-lang]').forEach((b) => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      setLang(b.dataset.lang);
      const dd = b.closest('.lang-toggle');
      if (dd) dd.classList.remove('open');
    });
  });

  // dropdown for additional languages
  document.querySelectorAll('.lang-toggle .lang-more').forEach((m) => {
    m.addEventListener('click', (e) => {
      e.preventDefault();
      m.closest('.lang-toggle').classList.toggle('open');
    });
  });
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.lang-toggle.open').forEach((t) => {
      if (!t.contains(e.target)) t.classList.remove('open');
    });
  });

  // ── newsletter form handler (placeholder — replace with your provider) ──
  const FORM_THANKS = {
    en: 'Thank you. The journal is being set up — we will let you know the moment it goes live.',
    es: 'Gracias. El diario se está preparando — te avisamos en cuanto esté listo.',
    pt: 'Obrigada. O diário está a ser preparado — avisamos assim que estiver pronto.',
    de: 'Danke. Das Journal wird eingerichtet — wir melden uns, sobald es bereit ist.',
    it: 'Grazie. Il diario è in preparazione — ti scriviamo appena è pronto.',
    fr: 'Merci. Le journal est en préparation — nous vous écrirons dès qu&rsquo;il sera prêt.',
    ru: 'Спасибо. Журнал готовится — напишем, как только всё будет готово.',
    uk: 'Дякуємо. Журнал готується — напишемо, щойно все буде готове.',
  };
  document.querySelectorAll('form.newsletter-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // TODO: connect to ConvertKit / Mailchimp / Buttondown / Beehiiv.
      const note = form.querySelector('.form-note');
      const lang = html.getAttribute('lang') || 'en';
      if (note) {
        note.textContent = FORM_THANKS[lang] || FORM_THANKS.en;
        note.style.color = 'var(--burgundy)';
      }
      form.querySelector('input[type="email"]').value = '';
    });
  });
})();
