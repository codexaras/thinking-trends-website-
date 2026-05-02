/* =====================================================
   THINKING TRENDS — MAIN JAVASCRIPT
   Particles, Counters, Nav, Sliders, Form → Supabase
   ===================================================== */

/* ─── SUPABASE CONFIG ─────────────────────────────────
   Replace SUPABASE_URL and SUPABASE_ANON_KEY below with
   your actual values from the Supabase dashboard.
   ──────────────────────────────────────────────────── */
const SUPABASE_URL = 'https://cvuitiusikhugcpayfhg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2dWl0aXVzaWtodWdjcGF5ZmhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NDUxMDQsImV4cCI6MjA4NzQyMTEwNH0.oIP68KvTJ1QsQeAQK3RQXhcRjuQodhgLCd9CYgzbDCI';
const SUPABASE_TABLE = 'contact_submissions'; // Change if needed

/* ─── PAGE LOADER (Logo spins for 5s → site reveals) ─── */
(function () {
    const loader = document.getElementById('page-loader');
    const logoImg = document.getElementById('loader-img');
    const glowRing = document.getElementById('loader-glow');
    const burst = document.getElementById('loader-burst');
    const brandName = document.getElementById('loader-brand');

    if (!loader || !logoImg) return;

    // Stage 1: Logo fades in (300ms)
    setTimeout(() => {
        logoImg.classList.add('visible');
        if (brandName) brandName.classList.add('visible');
    }, 300);

    // Stage 2: Logo starts spinning (700ms)
    setTimeout(() => {
        logoImg.classList.add('spin');
        if (glowRing) {
            glowRing.classList.add('active');
            glowRing.style.borderColor = 'rgba(255,210,0,0.9)';
            glowRing.style.boxShadow = '0 0 50px rgba(255,210,0,0.65), 0 0 100px rgba(255,210,0,0.2)';
        }
        if (burst) burst.classList.add('ignite');
    }, 700);

    // Stage 3: After 5 seconds total → fade out loader
    setTimeout(() => {
        loader.classList.add('fade-out');
    }, 5000);
})();



/* ─── CUSTOM CURSOR ─────────────────────────────────── */
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');

if (window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
        dot.style.left = ring.style.left = e.clientX + 'px';
        dot.style.top = ring.style.top = e.clientY + 'px';
    });
    document.querySelectorAll('a, button, .service-card, .case-card').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
}

/* ─── NAVBAR ─────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const overlay = document.getElementById('nav-overlay');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

function toggleMenu(open) {
    hamburger.classList.toggle('active', open);
    mobileNav.classList.toggle('open', open);
    overlay.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => toggleMenu(!mobileNav.classList.contains('open')));
overlay.addEventListener('click', () => toggleMenu(false));

document.querySelectorAll('.mobile-nav a').forEach(a => {
    a.addEventListener('click', () => toggleMenu(false));
});

/* Active nav highlight on scroll */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + current ? 'var(--yellow)' : '';
    });
}, { passive: true });

/* ─── PARTICLES CANVAS ───────────────────────────────── */
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, particles = [];

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.r = Math.random() * 1.6 + 0.4;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.alpha = Math.random() * 0.5 + 0.1;
            this.color = Math.random() > 0.5 ? '#FFD200' : '#FFFFFF';
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function init() {
        const count = Math.min(Math.floor(W * H / 8000), 120);
        particles = Array.from({ length: count }, () => new Particle());
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const p = particles[i], q = particles[j];
                const dx = p.x - q.x, dy = p.y - q.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(q.x, q.y);
                    ctx.strokeStyle = '#FFD200';
                    ctx.globalAlpha = (1 - dist / 120) * 0.08;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', () => { resize(); init(); });
    resize(); init(); loop();
})();

/* ─── SCROLL REVEAL ──────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            revealObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── ANIMATED COUNTERS ──────────────────────────────── */
function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const start = performance.now();

    function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = eased * target;
        el.textContent = prefix + (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            animateCounter(e.target);
            counterObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

/* ─── HERO TYPING EFFECT ─────────────────────────────── */
(function heroTyping() {
    const lines = document.querySelectorAll('.hero-headline .line');
    lines.forEach((line, i) => {
        line.style.animation = `fadeInUp 0.7s ${0.2 + i * 0.2}s ease both`;
    });
})();

/* ─── CASE STUDY TOGGLES ─────────────────────────────── */
document.querySelectorAll('.case-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.case-card');
        const detail = card.querySelector('.case-details');
        const isOpen = detail.classList.contains('open');
        detail.classList.toggle('open', !isOpen);
        btn.classList.toggle('open', !isOpen);
        btn.querySelector('.toggle-text').textContent = isOpen ? 'View Details' : 'Hide Details';
    });
});

/* ─── TESTIMONIALS SLIDER ────────────────────────────── */
(function initSlider() {
    const inner = document.querySelector('.testimonials-inner');
    const dots = document.querySelectorAll('.t-dot');
    const prevBtn = document.getElementById('t-prev');
    const nextBtn = document.getElementById('t-next');
    const total = document.querySelectorAll('.testimonial-card').length;
    let current = 0;
    let autoTimer;

    function goTo(idx) {
        current = (idx + total) % total;
        inner.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 5000); }
    function stopAuto() { clearInterval(autoTimer); }

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

    startAuto();
})();

/* ─── CONTACT FORM → SUPABASE ────────────────────────── */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.form-submit-btn');
        const successEl = document.querySelector('.form-success');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = 'Sending…';
        submitBtn.disabled = true;

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
            if (SUPABASE_URL === 'YOUR_SUPABASE_URL') {
                // Dev mode — log and simulate success
                console.log('📧 [DEV] Form submission (Supabase not configured):', data);
                await new Promise(r => setTimeout(r, 800));
                showSuccess();
            } else {
                const res = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Prefer': 'return=minimal',
                    },
                    body: JSON.stringify(data),
                });

                if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
                showSuccess();
            }
        } catch (err) {
            console.error('Form submission failed:', err);
            submitBtn.textContent = 'Error — Try Again';
            submitBtn.disabled = false;
            submitBtn.style.background = '#ff4444';
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        }

        function showSuccess() {
            contactForm.style.display = 'none';
            successEl.classList.add('show');
        }
    });
}

/* ─── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ─── PARALLAX ON HERO ───────────────────────────────── */
window.addEventListener('scroll', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const offset = window.scrollY;
        heroContent.style.transform = `translateY(${offset * 0.18}px)`;
        heroContent.style.opacity = 1 - offset / 700;
    }
}, { passive: true });

/* ─── MAGNETIC BUTTONS ───────────────────────────────── */
document.querySelectorAll('.btn-glow, .btn-primary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px) scale(1.04)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});
