/* ============================================================
   SOUL FLOW VIBE — interactivity (v3)
   - Sticky header shadow on scroll
   - Reveal on scroll (subtle fade-in)
   - Language system: EN + ES toggle (visible) + 6 hidden languages
     (PT, DE, IT, FR, RU, UK) auto-detected from navigator.language
   ============================================================ */
(() => {
  'use strict';

  /* ---------- Sticky header ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Reveal on scroll ---------- */
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  /* ============================================================
     LANGUAGE SYSTEM
     - 2 visible buttons: EN, ES
     - 6 extra languages selectable from the "+" dropdown
     - On first visit: auto-detect from navigator.language
     - Choice persists in localStorage
     ============================================================ */
  const SUPPORTED = ['en', 'es', 'pt', 'de', 'it', 'fr', 'ru', 'uk'];
  const VISIBLE   = ['en', 'es'];
  const EXTRA     = ['pt', 'de', 'it', 'fr', 'ru', 'uk'];

  const LANG_NAMES = {
    en: 'English',
    es: 'Español',
    pt: 'Português',
    de: 'Deutsch',
    it: 'Italiano',
    fr: 'Français',
    ru: 'Русский',
    uk: 'Українська',
  };
  const STORAGE_KEY = 'sfv-lang';

  const detectLang = () => {
    // 1) Saved choice
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED.includes(saved)) return saved;
    } catch (e) {}
    // 2) Browser language(s)
    const candidates = [navigator.language, ...(navigator.languages || [])];
    for (const raw of candidates) {
      if (!raw) continue;
      const code = raw.toLowerCase().split('-')[0];
      if (SUPPORTED.includes(code)) return code;
    }
    // 3) Default
    return 'en';
  };

  // For each .lang-en span, mark with data-fb="" if no translation exists
  // for the active language in the same parent (so CSS keeps EN visible
  // as a silent fallback).
  const updateFallbacks = (activeLang) => {
    document.querySelectorAll('.lang-en').forEach(el => {
      if (activeLang === 'en') { el.removeAttribute('data-fb'); return; }
      const parent = el.parentElement;
      if (!parent) return;
      const hasTranslation = parent.querySelector(':scope > .lang-' + activeLang);
      if (hasTranslation) el.removeAttribute('data-fb');
      else el.setAttribute('data-fb', '');
    });
  };

  const setLang = (lang, { persist = true } = {}) => {
    if (!SUPPORTED.includes(lang)) lang = 'en';
    document.documentElement.lang = lang;
    // Remove any previous lang-XX class on body
    Array.from(document.body.classList).forEach(c => {
      if (c.startsWith('lang-')) document.body.classList.remove(c);
    });
    document.body.classList.add('lang-' + lang);
    updateFallbacks(lang);
    // Update toggle UI
    document.querySelectorAll('[data-lang-btn]').forEach(b => {
      b.classList.toggle('active', b.dataset.langBtn === lang);
    });
    // Mark dropdown items
    document.querySelectorAll('[data-lang-pick]').forEach(b => {
      b.classList.toggle('active', b.dataset.langPick === lang);
    });
    // If the active lang is one of the EXTRA ones, light up the "+" button
    const moreBtn = document.querySelector('.lang-more');
    if (moreBtn) moreBtn.classList.toggle('active', EXTRA.includes(lang));
    if (persist) {
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
    }
  };

  // Initial language
  setLang(detectLang(), { persist: false });

  // Wire up visible EN/ES buttons
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.langBtn));
  });

  // Wire up the extra-languages dropdown
  const moreBtn = document.querySelector('.lang-more');
  const dropdown = document.querySelector('.lang-dropdown');
  if (moreBtn && dropdown) {
    moreBtn.addEventListener('click', e => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    dropdown.addEventListener('click', e => e.stopPropagation());
    document.addEventListener('click', () => dropdown.classList.remove('open'));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') dropdown.classList.remove('open');
    });
    dropdown.querySelectorAll('[data-lang-pick]').forEach(btn => {
      btn.addEventListener('click', () => {
        setLang(btn.dataset.langPick);
        dropdown.classList.remove('open');
      });
    });
  }
})();


// carousel-arrow — testimonial carousel prev/next behaviour
(function() {
  document.querySelectorAll('.testimonial-carousel').forEach(function(carousel) {
    var strip = carousel.querySelector('.testimonial-strip');
    if (!strip) return;
    var prev = carousel.querySelector('.carousel-arrow.prev');
    var next = carousel.querySelector('.carousel-arrow.next');
    function step(dir) {
      var card = strip.querySelector('.testimonial');
      var delta = card ? card.getBoundingClientRect().width + 20 : strip.clientWidth * 0.8;
      strip.scrollBy({ left: dir * delta, behavior: 'smooth' });
    }
    function update() {
      var atStart = strip.scrollLeft <= 4;
      var atEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 4;
      if (prev) prev.setAttribute('aria-disabled', atStart ? 'true' : 'false');
      if (next) next.setAttribute('aria-disabled', atEnd ? 'true' : 'false');
      carousel.classList.toggle('at-end', atEnd);
    }
    [prev, next].forEach(function(btn) {
      if (!btn) return;
      btn.addEventListener('click', function() {
        step(parseInt(btn.getAttribute('data-dir'), 10) || 1);
      });
    });
    strip.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    // Initialize once layout settles
    requestAnimationFrame(update);
  });
})();
