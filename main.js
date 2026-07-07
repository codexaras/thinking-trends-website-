/* =====================================================
   THINKING TRENDS — MAIN JS
   Nav · Reveals · Counters · Slider · Cases · Supabase
   ===================================================== */

/* ─── Supabase (same table as before) ─── */
const SUPABASE_URL = 'https://cvuitiusikhugcpayfhg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dWl0aXVzaWtodWdjcGF5ZmhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NDUxMDQsImV4cCI6MjA4NzQyMTEwNH0.oIP68KvTJ1QsQeAQK3RQXhcRjuQodhgLCd9CYgzbDCI';
const SUPABASE_TABLE = 'contact_submissions';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* ─── Scroll progress bar ─── */
const progress = document.getElementById('progress');
function updateProgress() {
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
}

/* ─── Navbar: scrolled state + light/dark logo swap + active link ─── */
const navbar = document.getElementById('navbar');
const lightSections = Array.from(document.querySelectorAll('.light, #stats, #cta'));
const sections = Array.from(document.querySelectorAll('section[id], header[id]'));
const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]:not(.btn)'));

function updateNav() {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 40);

  // is the nav currently overlapping a light section?
  const probe = y + 40;
  let onLight = false;
  for (const sec of lightSections) {
    if (probe >= sec.offsetTop && probe < sec.offsetTop + sec.offsetHeight) { onLight = true; break; }
  }
  navbar.classList.toggle('on-light', onLight);

  // active link
  let current = '';
  for (const sec of sections) {
    if (y >= sec.offsetTop - 160) current = sec.id;
  }
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));

  // back to top
  toTop.classList.toggle('show', y > 700);
}

const toTop = document.getElementById('to-top');
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

let ticking = false;
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => { updateProgress(); updateNav(); ticking = false; });
}, { passive: true });
updateProgress(); updateNav();

/* ─── Mobile nav ─── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const overlay = document.getElementById('nav-overlay');

function toggleMenu(open) {
  hamburger.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', open);
  mobileNav.classList.toggle('open', open);
  mobileNav.setAttribute('aria-hidden', !open);
  overlay.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
hamburger.addEventListener('click', () => toggleMenu(!mobileNav.classList.contains('open')));
overlay.addEventListener('click', () => toggleMenu(false));
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

/* ─── Scroll reveals ─── */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ─── Counters ─── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  if (reduceMotion) { el.textContent = target + suffix; return; }
  const t0 = performance.now();
  (function step(now) {
    const p = Math.min((now - t0) / 1800, 1);
    el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}
const cio = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); cio.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-target]').forEach(el => cio.observe(el));

/* ─── Case study toggles ─── */
document.querySelectorAll('.case-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const details = btn.nextElementSibling;
    const open = details.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.querySelector('span').textContent = open ? 'Hide details' : 'View details';
  });
});

/* ─── Testimonials slider ─── */
(function () {
  const track = document.getElementById('t-track');
  const cards = track.children.length;
  const dotsWrap = document.getElementById('t-dots');
  let current = 0, timer;

  for (let i = 0; i < cards; i++) {
    const d = document.createElement('button');
    d.className = 't-dot' + (i === 0 ? ' active' : '');
    d.setAttribute('aria-label', 'Testimonial ' + (i + 1));
    d.addEventListener('click', () => { stop(); goTo(i); start(); });
    dotsWrap.appendChild(d);
  }
  const dots = dotsWrap.children;

  function goTo(i) {
    current = (i + cards) % cards;
    track.style.transform = 'translateX(-' + current * 100 + '%)';
    Array.from(dots).forEach((d, j) => d.classList.toggle('active', j === current));
  }
  function start() { if (!reduceMotion) timer = setInterval(() => goTo(current + 1), 5200); }
  function stop() { clearInterval(timer); }

  document.getElementById('t-prev').addEventListener('click', () => { stop(); goTo(current - 1); start(); });
  document.getElementById('t-next').addEventListener('click', () => { stop(); goTo(current + 1); start(); });

  // swipe support on touch
  let x0 = null;
  track.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; stop(); }, { passive: true });
  track.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 48) goTo(current + (dx < 0 ? 1 : -1));
    x0 = null; start();
  }, { passive: true });

  start();
})();

/* ─── Magnetic buttons (desktop only) ─── */
if (finePointer && !reduceMotion) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.18;
      const y = (e.clientY - r.top - r.height / 2) * 0.3;
      btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    });
    btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
  });
}

/* ─── Contact form → Supabase ─── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!contactForm.reportValidity()) return;

    const btn = contactForm.querySelector('.form-submit-btn');
    const label = btn.querySelector('span');
    const original = label.textContent;
    label.textContent = 'Sending…';
    btn.disabled = true;

    const data = {
      name: contactForm.name.value.trim(),
      phone: contactForm.phone.value.trim(),
      business: contactForm.business.value.trim(),
      service: contactForm.service.value,
      budget: contactForm.budget.value,
      message: contactForm.message.value.trim(),
      submitted_at: new Date().toISOString(),
    };

    try {
      const res = await fetch(SUPABASE_URL + '/rest/v1/' + SUPABASE_TABLE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Supabase error: ' + res.status);
      contactForm.style.display = 'none';
      document.querySelector('.form-success').classList.add('show');
    } catch (err) {
      console.error('Form submission failed:', err);
      label.textContent = 'Error — try again';
      btn.disabled = false;
      setTimeout(() => { label.textContent = original; }, 3000);
    }
  });
}

/* ─── Footer year ─── */
document.getElementById('year').textContent = new Date().getFullYear();
