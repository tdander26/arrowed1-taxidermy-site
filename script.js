/* =============================================
   ARROWED 1 TAXIDERMY — SCRIPT
   ============================================= */

// ---- STICKY NAV ----
const header = document.getElementById('top')?.closest('.site-header') || document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

// ---- MOBILE NAV ----
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  toggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ---- SMOOTH SCROLL OFFSET (accounts for fixed nav) ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---- SCROLL-IN ANIMATIONS ----
const animItems = document.querySelectorAll(
  '.service-card, .pricing-card, .trust-item, .contact-detail, .credential, .term-item'
);

const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = [...entry.target.parentElement.children];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

animItems.forEach(el => {
  el.classList.add('fade-up');
  observer.observe(el);
});

// ---- GALLERY ITEMS ----
const galleryObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      galleryObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.gallery-item').forEach((el, i) => {
  el.style.transitionDelay = `${i * 60}ms`;
  el.classList.add('fade-in');
  galleryObserver.observe(el);
});

// ---- CONTACT FORM (mailto fallback) ----
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form?.addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(form);
  const name    = data.get('name') || '';
  const phone   = data.get('phone') || '';
  const email   = data.get('email') || '';
  const service = data.get('service') || '';
  const message = data.get('message') || '';

  const body = [
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Service: ${service}`,
    `\nMessage:\n${message}`
  ].join('\n');

  const mailto = `mailto:arrowed1@gmail.com?subject=Mount Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;

  // Show success message
  formSuccess.hidden = false;
  form.querySelectorAll('input, select, textarea').forEach(f => f.value = '');
  setTimeout(() => { formSuccess.hidden = true; }, 6000);
});

// ---- INJECT ANIMATION STYLES ----
const style = document.createElement('style');
style.textContent = `
  .fade-up {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.55s ease, transform 0.55s ease;
  }
  .fade-up.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .fade-in {
    opacity: 0;
    transition: opacity 0.6s ease, transform 0.6s ease;
    transform: scale(0.97);
  }
  .fade-in.visible {
    opacity: 1;
    transform: scale(1);
  }
`;
document.head.appendChild(style);
