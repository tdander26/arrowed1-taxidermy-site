/* =========================================================
   ARROWED 1 TAXIDERMY — PREMIUM INTERACTIONS
   ========================================================= */

(function () {
  'use strict';

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- STICKY NAV ----
  const header = document.querySelector('.site-header');
  let lastScroll = 0;
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    if (y > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    // Parallax hero content (gentle)
    if (!prefersReducedMotion && heroContent && y < window.innerHeight) {
      const offset = y * 0.35;
      const opacity = Math.max(0, 1 - y / (window.innerHeight * 0.75));
      heroContent.style.transform = `translate3d(0, ${offset}px, 0)`;
      heroContent.style.opacity = String(opacity);
    }

    lastScroll = y;
    ticking = false;
  }

  function requestScrollTick() {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }

  // ---- HERO PARALLAX ----
  const heroContent = document.querySelector('.hero-content');
  const hero = document.querySelector('.hero');

  window.addEventListener('scroll', requestScrollTick, { passive: true });

  // ---- MOBILE NAV ----
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;

  function closeNav() {
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.classList.remove('open');
    navLinks?.classList.remove('open');
    body.classList.remove('nav-open');
  }

  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    toggle.classList.toggle('open');
    navLinks.classList.toggle('open');
    body.classList.toggle('nav-open', !open);
  });

  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeNav);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });

  // ---- SMOOTH SCROLL OFFSET ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH =
        parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 84;
      const top = target.getBoundingClientRect().top + window.scrollY - navH + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ---- SCROLL-IN ANIMATIONS ----
  const fadeSelectors = [
    '.section-header',
    '.service-card',
    '.pricing-card',
    '.trust-item',
    '.contact-detail',
    '.credential',
    '.term-item',
    '.services-note',
    '.about-image-wrap',
    '.about-content',
    '.cta-banner-inner > *',
    '.contact-form-wrap',
    '.gallery-cta'
  ];

  const fadeEls = document.querySelectorAll(fadeSelectors.join(','));

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const parent = el.parentElement;
          const siblings = parent ? Array.from(parent.children).filter(c => c.classList.contains('fade-up')) : [];
          const idx = siblings.indexOf(el);
          const delay = Math.min(idx * 90, 500);
          el.style.transitionDelay = `${delay}ms`;
          requestAnimationFrame(() => el.classList.add('visible'));
          fadeObserver.unobserve(el);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -60px 0px' }
    );

    fadeEls.forEach(el => {
      el.classList.add('fade-up');
      fadeObserver.observe(el);
    });

    // ---- GALLERY ITEMS (scale fade) ----
    const galleryObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const parent = el.parentElement;
          const siblings = parent ? Array.from(parent.children) : [];
          const idx = siblings.indexOf(el);
          el.style.transitionDelay = `${Math.min(idx * 90, 540)}ms`;
          requestAnimationFrame(() => el.classList.add('visible'));
          galleryObserver.unobserve(el);
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.gallery-item').forEach(el => {
      el.classList.add('fade-in');
      galleryObserver.observe(el);
    });

    // ---- TRUST NUMBERS COUNT UP ----
    const trustObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const text = el.textContent.trim();
          const match = text.match(/^(\d+)(\+?)$/);
          if (match && !prefersReducedMotion) {
            const target = parseInt(match[1], 10);
            const suffix = match[2] || '';
            let current = 0;
            const duration = 1500;
            const start = performance.now();
            const step = now => {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              current = Math.floor(eased * target);
              el.textContent = current + suffix;
              if (progress < 1) requestAnimationFrame(step);
              else el.textContent = target + suffix;
            };
            requestAnimationFrame(step);
          }
          trustObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll('.trust-number').forEach(el => trustObserver.observe(el));
  } else {
    // Fallback
    fadeEls.forEach(el => el.classList.add('visible'));
    document.querySelectorAll('.gallery-item').forEach(el => el.classList.add('visible'));
  }

  // ---- SERVICE CARDS — MAGNETIC HOVER (subtle) ----
  if (!prefersReducedMotion) {
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = (x / rect.width - 0.5) * 2;
        const py = (y / rect.height - 0.5) * 2;
        card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${-py * 1.2}deg) rotateY(${px * 1.2}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // ---- CONTACT FORM (mailto) ----
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name') || '';
    const phone = data.get('phone') || '';
    const email = data.get('email') || '';
    const service = data.get('service') || '';
    const message = data.get('message') || '';

    const body = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Service: ${service}`,
      '',
      'Message:',
      message
    ].join('\n');

    const mailto = `mailto:arrowed1@gmail.com?subject=${encodeURIComponent(
      'Mount Inquiry from ' + name
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;

    formSuccess.hidden = false;
    form.querySelectorAll('input, select, textarea').forEach(f => (f.value = ''));
    setTimeout(() => {
      formSuccess.hidden = true;
    }, 6000);
  });

  // ---- INITIAL CALL ----
  onScroll();
})();
