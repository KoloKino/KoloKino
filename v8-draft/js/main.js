/* ============================================================
   Soul Touch Therapy · v5 — premium interactivity
   - Lenis smooth scroll
   - GSAP + ScrollTrigger
   - Custom cursor + magnetic buttons
   - Word rotator (hero)
   - Marquee infinitos
   - Scroll progress bar
   - Header dark-mode + scrolled state
   - IntersectionObserver reveals
   - Animated counters
   - Sticky philosophy active tracker
   - Tabs
   - Floating CTA mobile
   - Newsletter form
   - Language toggle (8 langs)
   - Mobile nav
   - Smooth anchor links
   ============================================================ */

(function () {
  'use strict';

  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  const html = document.documentElement;
  const supportsTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── page loader ─────────────────────────────────────────── */
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.body.classList.add('loaded');
      const loader = document.querySelector('.page-loader');
      if (loader) {
        setTimeout(() => loader.classList.add('gone'), 200);
      }
    }, 100);
  });
  // Failsafe: if 'load' doesn't fire (e.g. broken asset), still reveal
  setTimeout(() => {
    document.body.classList.add('loaded');
    const loader = document.querySelector('.page-loader');
    if (loader) loader.classList.add('gone');
  }, 2400);

  /* ── Lenis smooth scroll ─────────────────────────────────── */
  let lenis = null;
  if (typeof Lenis !== 'undefined' && !reducedMotion) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      touchMultiplier: 1.4,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && gsap.ticker) {
      lenis.on('scroll', () => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
      });
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ── Smooth anchor links (when Lenis present) ────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const rect = target.getBoundingClientRect();
      const top = window.scrollY + rect.top - offset;
      if (lenis) {
        lenis.scrollTo(top, { duration: 1.4 });
      } else {
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── scroll progress bar + header state ──────────────────── */
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('.scroll-progress');
  const heroCine = document.querySelector('.hero-cine');

  function onScroll() {
    const sy = window.scrollY || window.pageYOffset;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = docH > 0 ? sy / docH : 0;
    if (progress) progress.style.width = (ratio * 100).toFixed(2) + '%';
    if (header) {
      if (sy > 80) header.classList.add('scrolled');
      else header.classList.remove('scrolled');

      // Dark mode while hero-cine is in view
      if (heroCine) {
        const heroBottom = heroCine.getBoundingClientRect().bottom;
        if (heroBottom > 100) header.classList.add('dark-mode');
        else header.classList.remove('dark-mode');
      }
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── IntersectionObserver reveals ────────────────────────── */
  const allReveals = document.querySelectorAll(
    '.reveal, .reveal-slow, .reveal-clip, .reveal-image, .reveal-stagger, .reveal-lines'
  );
  if ('IntersectionObserver' in window && allReveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );
    allReveals.forEach((r) => io.observe(r));
  } else {
    allReveals.forEach((r) => r.classList.add('in-view'));
  }

  /* ── Animated counters ───────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const end = parseFloat(el.dataset.count);
          const dur = parseInt(el.dataset.duration || '1400', 10);
          const decimals = parseInt(el.dataset.decimals || '0', 10);
          const startTime = performance.now();
          function step(now) {
            const t = Math.min(1, (now - startTime) / dur);
            const eased = 1 - Math.pow(1 - t, 3);
            const val = end * eased;
            el.textContent = val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            if (t < 1) requestAnimationFrame(step);
            else el.textContent = end.toLocaleString();
          }
          requestAnimationFrame(step);
          cio.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => cio.observe(c));
  }

  /* ── Word rotator (hero) — only rotates within active language ─ */
  function initWordRotator() {
    const rotator = document.querySelector('.word-rotator');
    if (!rotator) return;
    const allItems = Array.from(rotator.querySelectorAll('span'));

    function getActiveLang() { return html.getAttribute('lang') || 'en'; }

    function visibleItems() {
      const lang = getActiveLang();
      return allItems.filter((it) => it.classList.contains('lang-' + lang));
    }

    let idx = 0;
    function showIdx(i) {
      const list = visibleItems();
      if (!list.length) return;
      idx = ((i % list.length) + list.length) % list.length;
      list.forEach((it, j) => {
        it.classList.toggle('is-active', j === idx);
        it.classList.remove('is-out');
      });
    }
    function next() {
      const list = visibleItems();
      if (!list.length) return;
      const cur = list[idx];
      if (cur) {
        cur.classList.remove('is-active');
        cur.classList.add('is-out');
      }
      idx = (idx + 1) % list.length;
      setTimeout(() => {
        list.forEach((it) => it.classList.remove('is-out'));
        const upcoming = visibleItems()[idx];
        if (upcoming) upcoming.classList.add('is-active');
      }, 60);
    }

    // initial state — make sure only first visible item is active
    showIdx(0);
    setInterval(next, 2800);

    // reset when language changes
    const obs = new MutationObserver(() => { idx = 0; showIdx(0); });
    obs.observe(html, { attributes: true, attributeFilter: ['lang'] });
  }
  initWordRotator();

  /* ── Marquee duplication (so it loops seamlessly) ────────── */
  document.querySelectorAll('.marquee-track, .footer-marquee .marquee-track').forEach((track) => {
    // Clone children to make a seamless loop
    const original = Array.from(track.children).map((c) => c.cloneNode(true));
    original.forEach((c) => track.appendChild(c));
  });

  /* ── Custom cursor (desktop only) ────────────────────────── */
  if (!supportsTouch && !reducedMotion) {
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.classList.add('has-cursor');

    let mx = 0, my = 0;
    let rx = 0, ry = 0;
    let dx = 0, dy = 0;

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();

    // Hover state on interactive elements
    const interactives = 'a, button, .nav-card, .video-card, .testimonial-card, .magnetic, .qa-item summary, .curriculum-item summary, .principle-acc summary, .pillar summary, [data-cursor-hover]';
    document.querySelectorAll(interactives).forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  /* ── Magnetic buttons (rAF lerp = buttery smooth follow + scale) ── */
  if (!supportsTouch && !reducedMotion) {
    document.querySelectorAll('.magnetic, [data-magnetic]').forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic || '0.3');
      // Optional hover scale: nav-cta gets a 1.2× zoom; others stay 1×.
      const hoverScale = parseFloat(
        el.dataset.magneticScale || (el.classList.contains('nav-cta') ? '1.2' : '1')
      );
      // Easing factor — lower = slower, more "soft butter" follow
      const easeMove  = 0.10;
      const easeScale = 0.12;

      let targetX = 0, targetY = 0, targetScale = 1;
      let curX = 0, curY = 0, curScale = 1;
      let running = false;
      let rafId = null;

      function tick() {
        curX     += (targetX     - curX)     * easeMove;
        curY     += (targetY     - curY)     * easeMove;
        curScale += (targetScale - curScale) * easeScale;

        // Snap when essentially at rest, free the rAF loop.
        if (
          Math.abs(targetX - curX) < 0.05 &&
          Math.abs(targetY - curY) < 0.05 &&
          Math.abs(targetScale - curScale) < 0.001
        ) {
          curX = targetX; curY = targetY; curScale = targetScale;
          if (curX === 0 && curY === 0 && curScale === 1) {
            el.style.transform = '';
          } else {
            el.style.transform = `translate(${curX}px, ${curY}px) scale(${curScale})`;
          }
          running = false;
          return;
        }

        el.style.transform = `translate(${curX}px, ${curY}px) scale(${curScale})`;
        rafId = requestAnimationFrame(tick);
      }
      function kick() {
        if (!running) {
          running = true;
          rafId = requestAnimationFrame(tick);
        }
      }

      el.addEventListener('mouseenter', () => {
        targetScale = hoverScale;
        kick();
      });
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        targetX = (e.clientX - rect.left - rect.width / 2) * strength;
        targetY = (e.clientY - rect.top - rect.height / 2) * strength;
        targetScale = hoverScale;
        kick();
      });
      el.addEventListener('mouseleave', () => {
        targetX = 0; targetY = 0; targetScale = 1;
        kick();
      });
    });
  }

  /* ── Mobile nav toggle ───────────────────────────────────── */
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.querySelector('.nav-primary');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const open = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('no-scroll', open);
      if (lenis) {
        if (open) lenis.stop();
        else lenis.start();
      }
    });
    // close on link click
    navList.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        if (navList.classList.contains('open')) {
          navList.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('no-scroll');
          if (lenis) lenis.start();
        }
      });
    });
  }

  /* ── Language toggle ─────────────────────────────────────── */
  const SUPPORTED = ['en', 'es', 'pt', 'de', 'it', 'fr', 'ru', 'uk'];
  const STORAGE = 'stt-lang';

  const LANG_LABELS = {
    en: 'ENG', es: 'ESP', pt: 'POR', de: 'DEU',
    it: 'ITA', fr: 'FRA', ru: 'РУС', uk: 'УКР'
  };

  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = 'en';
    html.setAttribute('lang', lang);
    try { localStorage.setItem(STORAGE, lang); } catch (_) {}
    document.querySelectorAll('.lang-toggle [data-lang]').forEach((b) => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    document.querySelectorAll('.lang-current-label').forEach((el) => {
      el.textContent = LANG_LABELS[lang] || 'ENG';
    });
  }
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

  document.querySelectorAll('.lang-toggle [data-lang]').forEach((b) => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      setLang(b.dataset.lang);
      const dd = b.closest('.lang-toggle');
      if (dd) dd.classList.remove('open');
    });
  });
  document.querySelectorAll('.lang-toggle .lang-current').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const wrap = trigger.closest('.lang-toggle');
      const open = wrap.classList.toggle('open');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', (e) => {
    document.querySelectorAll('.lang-toggle.open').forEach((t) => {
      if (!t.contains(e.target)) t.classList.remove('open');
    });
  });

  /* ── Article modal ───────────────────────────────────────── */
  document.querySelectorAll('[data-article-open]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const id = trigger.getAttribute('data-article-open');
      const dlg = document.getElementById(id);
      if (!dlg) return;
      if (typeof dlg.showModal === 'function') {
        dlg.showModal();
      } else {
        dlg.setAttribute('open', '');
      }
      document.body.classList.add('modal-open');
      const scroll = dlg.querySelector('.dialog-scroll');
      if (scroll) scroll.scrollTop = 0;
    });
  });
  document.querySelectorAll('.article-dialog').forEach((dlg) => {
    const closeBtn = dlg.querySelector('.dialog-close');
    if (closeBtn) closeBtn.addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', (e) => {
      const rect = dlg.getBoundingClientRect();
      const inside =
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top  && e.clientY <= rect.bottom;
      if (!inside) dlg.close();
    });
    dlg.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
    });
  });

  /* ── Newsletter form ─────────────────────────────────────── */
  const FORM_THANKS = {
    en: 'Thank you. You\'ll hear from Soul soon.',
    es: 'Gracias. Pronto sabrás de Soul.',
    pt: 'Obrigada. Em breve receberás notícias de Soul.',
    de: 'Danke. Du hörst bald von Soul.',
    it: 'Grazie. Sentirai presto di Soul.',
    fr: 'Merci. Vous recevrez bientôt des nouvelles de Soul.',
    ru: 'Спасибо. Скоро вы получите весточку от Soul.',
    uk: 'Дякуємо. Незабаром отримаєте звістку від Soul.',
  };
  document.querySelectorAll('form.newsletter-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const note = form.querySelector('.form-note');
      const input = form.querySelector('input[type="email"]');
      const lang = html.getAttribute('lang') || 'en';
      if (note) {
        note.textContent = FORM_THANKS[lang] || FORM_THANKS.en;
        note.classList.add('success');
      }
      form.classList.add('success');
      if (input) input.value = '';
    });
  });

  /* ── Testimonial carousel arrows ─────────────────────────── */
  document.querySelectorAll('.testimonials').forEach((wrapper) => {
    const strip = wrapper.querySelector('.testimonial-strip');
    const prevBtn = wrapper.querySelector('[data-testimonials-prev]');
    const nextBtn = wrapper.querySelector('[data-testimonials-next]');
    if (!strip || !prevBtn || !nextBtn) return;

    function step() {
      const card = strip.querySelector('.testimonial-card');
      if (!card) return strip.clientWidth * 0.85;
      const cardW = card.getBoundingClientRect().width;
      const gap = parseFloat(getComputedStyle(strip).columnGap || getComputedStyle(strip).gap || '16');
      return cardW + (isNaN(gap) ? 16 : gap);
    }
    function updateDisabled() {
      const maxScroll = strip.scrollWidth - strip.clientWidth - 1;
      prevBtn.disabled = strip.scrollLeft <= 0;
      nextBtn.disabled = strip.scrollLeft >= maxScroll;
    }
    prevBtn.addEventListener('click', () => strip.scrollBy({ left: -step(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => strip.scrollBy({ left: step(), behavior: 'smooth' }));
    strip.addEventListener('scroll', updateDisabled, { passive: true });
    window.addEventListener('resize', updateDisabled);
    updateDisabled();
  });

  /* ── Tabs (track switcher on learn) ──────────────────────── */
  document.querySelectorAll('[data-tabs]').forEach((tabsContainer) => {
    const tabBtns = tabsContainer.querySelectorAll('button[data-tab]');
    const panelGroup = document.querySelector(tabsContainer.dataset.tabs);
    if (!panelGroup) return;
    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.tab;
        tabBtns.forEach((b) => b.classList.toggle('active', b === btn));
        panelGroup.querySelectorAll('.tab-panel').forEach((p) => {
          p.classList.toggle('active', p.dataset.tabKey === key);
        });
      });
    });
  });

  /* ── Sticky philosophy active tracker ─────────────────────── */
  const principles = document.querySelectorAll('.sticky-philosophy .principle');
  if (principles.length && 'IntersectionObserver' in window) {
    const pio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            principles.forEach((p) => p.classList.remove('is-active'));
            e.target.classList.add('is-active');
          }
        });
      },
      { threshold: 0.6, rootMargin: '-20% 0px -20% 0px' }
    );
    principles.forEach((p) => pio.observe(p));
  }

  /* ── Floating CTA visibility on mobile ───────────────────── */
  const floating = document.querySelector('.floating-cta');
  if (floating) {
    const sentinel = document.querySelector('.hero-cine, .hero-split, .hero-centered');
    function onScrollFloat() {
      if (!sentinel) return;
      const passed = sentinel.getBoundingClientRect().bottom < 0;
      floating.classList.toggle('visible', passed);
    }
    window.addEventListener('scroll', onScrollFloat, { passive: true });
    onScrollFloat();
  }

  /* ── Parallax on .parallax elements (GSAP if available) ──── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !reducedMotion) {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax || '0.3');
      gsap.fromTo(el,
        { y: 0 },
        {
          y: () => -window.innerHeight * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });

    // Hero image subtle zoom on scroll
    document.querySelectorAll('.hero-cine .hero-media img, .hero-cine .hero-media video').forEach((el) => {
      gsap.fromTo(el,
        { scale: 1.0 },
        {
          scale: 1.18,
          ease: 'none',
          scrollTrigger: {
            trigger: '.hero-cine',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });

    // Heading char/word reveals via SplitText? skip — line-wrap CSS handles it.
  }

  /* ── Initialize hero word rotator entry on load ──────────── */
  // (handled in CSS body.loaded)

})();
