/* ═══════════ MOBILE TECH — interactions ═══════════ */
(function () {
  'use strict';

  const WA_NUMBER = '59891246047';

  /* ── year ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── header shrink + floating WhatsApp reveal on scroll ── */
  const header = document.querySelector('.site-header');
  const waFloat = document.querySelector('.wa-float');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 20);
    if (waFloat) waFloat.classList.toggle('show', y > 460);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── hero background video (skip on reduced-motion / data-saver) ── */
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conn = navigator.connection || {};
    if (!reduce && !conn.saveData) {
      heroVideo.muted = true;
      const addSrc = (type, src) => { if (!src) return; const s = document.createElement('source'); s.type = type; s.src = src; heroVideo.appendChild(s); };
      addSrc('video/webm', heroVideo.dataset.webm);
      addSrc('video/mp4', heroVideo.dataset.mp4);
      heroVideo.load();
      heroVideo.addEventListener('playing', () => heroVideo.classList.add('is-playing'), { once: true });
      const play = heroVideo.play();
      if (play && play.catch) play.catch(() => {}); // autoplay blocked → poster image stays
    }
  }

  /* ── mobile menu ── */
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  const closeMenu = () => {
    toggle.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
    document.body.style.overflow = '';
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    if (open) { closeMenu(); }
    else {
      toggle.setAttribute('aria-expanded', 'true');
      menu.hidden = false;
    }
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ── scroll reveal ── */
  const reveals = document.querySelectorAll('.reveal');
  let ioFired = false;
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      ioFired = true;
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* ── animated counters ── */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const dur = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(el => co.observe(el));
  } else {
    counters.forEach(el => el.textContent = parseFloat(el.dataset.count).toFixed(parseInt(el.dataset.decimals || '0', 10)));
  }

  /* ── safety backstop: never leave content hidden if IO stalls ── */
  const revealAllNow = () => {
    reveals.forEach(el => el.classList.add('in'));
    counters.forEach(el => {
      if (el.textContent === '0' || el.textContent === '0.0') {
        const d = parseInt(el.dataset.decimals || '0', 10);
        el.textContent = parseFloat(el.dataset.count).toFixed(d);
      }
    });
  };
  // if IntersectionObserver never fired (unsupported / frozen tab), reveal everything
  setTimeout(() => { if (!ioFired) revealAllNow(); }, 2600);

  /* ── liquid-glass cards: light follows the cursor ── */
  const spotCards = document.querySelectorAll('.stat, .diff-card, .review');
  spotCards.forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
    });
  });

  /* ── quote form → WhatsApp ── */
  const form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const data = new FormData(form);
      const nombre = (data.get('nombre') || '').toString().trim();
      const dispositivo = data.get('dispositivo');
      const modelo = (data.get('modelo') || '').toString().trim();
      const problema = data.get('problema');
      const comentario = (data.get('comentario') || '').toString().trim();

      let msg = '¡Hola Mobile Tech! Quiero cotizar una reparación.\n';
      if (nombre) msg += `\nSoy ${nombre}.`;
      msg += `\nDispositivo: ${dispositivo}${modelo ? ' ' + modelo : ''}`;
      msg += `\nProblema: ${problema}`;
      if (comentario) msg += `\nComentario: ${comentario}`;

      const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ── conversion hook (GA4 / Meta pixel ready) ──
     Every WhatsApp CTA carries data-cta="<location>".
     Wire your analytics here without touching markup. */
  document.querySelectorAll('[data-cta]').forEach(el => {
    el.addEventListener('click', () => {
      const where = el.dataset.cta;
      if (window.gtag) window.gtag('event', 'whatsapp_click', { location: where });
      if (window.fbq) window.fbq('trackCustom', 'WhatsAppClick', { location: where });
    });
  });

  /* ── map facade: load Google Maps only on click ── */
  const loadMapBtn = document.getElementById('loadMap');
  const mapFacade = document.getElementById('mapFacade');
  if (loadMapBtn && mapFacade) {
    loadMapBtn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.title = 'Ubicación de Mobile Tech en Montevideo';
      iframe.src = mapFacade.dataset.src;
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      mapFacade.innerHTML = '';
      mapFacade.appendChild(iframe);
    });
  }

  /* ── active nav link highlight ── */
  const sections = ['servicios', 'cotizar', 'diferenciales', 'faq', 'contacto']
    .map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = document.querySelectorAll('.nav-desktop a');
  if (sections.length && 'IntersectionObserver' in window) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(l => l.style.color =
            l.getAttribute('href') === '#' + e.target.id ? 'var(--ink)' : '');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => so.observe(s));
  }
})();
