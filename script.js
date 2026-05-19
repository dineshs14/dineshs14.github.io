/* =====================================================
   DINESH S — Portfolio 2025
   Premium Interactivity & Animations
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initCanvas();
    initNavigation();
    initTyping();
    initScrollAnimations();
    initSkillBars();
    initScoreRings();
    initStatCounters();
    initBackToTop();
    initContactForm();
    initTilt();
    initParallax();
    initHeroSpotlight();
    initMagneticUI();
    initPublicationSpotlight();
    initTheme();
});

/* =====================================================
   SCROLL PROGRESS BAR
   ===================================================== */
function initScrollProgress() {
    const progress = document.getElementById('scroll-progress');
    if (!progress) return;

    const update = () => {
        const scrollTop = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const pct = maxScroll > 0 ? Math.min(100, (scrollTop / maxScroll) * 100) : 0;
        progress.style.width = `${pct}%`;
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
}

/* =====================================================
   HERO SPOTLIGHT
   ===================================================== */
function initHeroSpotlight() {
    const spotlight = document.getElementById('hero-spotlight');
    const hero = document.getElementById('hero');
    if (!spotlight || !hero) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    hero.addEventListener('mousemove', (event) => {
        const rect = hero.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        spotlight.style.setProperty('--spot-x', `${x}px`);
        spotlight.style.setProperty('--spot-y', `${y}px`);
    });
}

/* =====================================================
   MAGNETIC UI EFFECTS
   ===================================================== */
function initMagneticUI() {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targets = document.querySelectorAll('.btn-primary, .social-icon, .publication-link, .stat-box');
    targets.forEach((target) => {
        target.addEventListener('mousemove', (event) => {
            const rect = target.getBoundingClientRect();
            const dx = event.clientX - (rect.left + rect.width / 2);
            const dy = event.clientY - (rect.top + rect.height / 2);
            target.style.transform = `translate(${dx * 0.08}px, ${dy * 0.08}px)`;
        });
        target.addEventListener('mouseleave', () => {
            target.style.transform = '';
        });
    });
}

/* =====================================================
   THEME TOGGLE
   ===================================================== */
function initTheme() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);

    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio_theme', newTheme);
        updateIcon(newTheme);
    });

    function updateIcon(theme) {
        const icon = toggleBtn.querySelector('i');
        if (theme === 'light') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    }
}

/* =====================================================
   INTERACTIVE TILT & PARALLAX
   ===================================================== */
function initTilt() {
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            if (window.innerWidth < 768) return; // Disable on mobile for performance
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotX = ((y - rect.height / 2) / (rect.height / 2)) * -4;
            const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.transition = 'transform 0.1s ease-out';
        });

        card.addEventListener('mouseleave', () => {
            // Restore original CSS hover states (empty string lets CSS take over)
            card.style.transform = '';
            card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
}

function initParallax() {
    const titles = document.querySelectorAll('.section-tag, .section-title');
    window.addEventListener('scroll', () => {
        if (window.innerWidth < 768) return;
        const scrolled = window.scrollY;
        titles.forEach(el => {
            const speed = 0.08;
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yOffset = (window.innerHeight / 2 - rect.top) * speed;
                el.style.transform = `translateY(${-yOffset}px)`;
            }
        });
    }, { passive: true });
}


/* =====================================================
   CANVAS BACKGROUND — Constellation Particles
   ===================================================== */
function initCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let w, h, particles = [], mouse = { x: null, y: null };
    let tick = 0;
    const colors = ['rgba(0,229,255,', 'rgba(106,92,255,', 'rgba(255,122,24,'];

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.bx = this.x;
            this.by = this.y;
            this.size = Math.random() * 1.8 + 0.4;
            this.density = Math.random() * 30 + 1;
            this.vx = (Math.random() - 0.5) * 0.08;
            this.vy = (Math.random() - 0.5) * 0.08;
            this.phase = Math.random() * Math.PI * 2;
            const c = colors[Math.floor(Math.random() * colors.length)];
            this.baseAlpha = Math.random() * 0.35 + 0.16;
            this.colorBase = c;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < -8) this.x = w + 8;
            if (this.x > w + 8) this.x = -8;
            if (this.y < -8) this.y = h + 8;
            if (this.y > h + 8) this.y = -8;

            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.x -= (dx / dist) * force * this.density * 0.6;
                    this.y -= (dy / dist) * force * this.density * 0.6;
                } else {
                    this.x += (this.bx - this.x) * 0.05;
                    this.y += (this.by - this.y) * 0.05;
                }
            }
        }
        draw() {
            const alpha = this.baseAlpha + Math.sin(tick * 0.018 + this.phase) * 0.08;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.colorBase + Math.max(0.08, alpha).toFixed(2) + ')';
            ctx.fill();
        }
    }

    const count = Math.min(70, Math.floor((w * h) / 20000));
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(6,182,212,${((1 - dist / 130) * 0.12).toFixed(3)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        tick += 1;
        ctx.clearRect(0, 0, w, h);

        // Soft dynamic wash makes the background feel more premium.
        const centerGlow = ctx.createRadialGradient(w * 0.5, h * 0.42, 20, w * 0.5, h * 0.42, Math.max(w, h) * 0.45);
        centerGlow.addColorStop(0, 'rgba(0,229,255,0.10)');
        centerGlow.addColorStop(0.5, 'rgba(106,92,255,0.07)');
        centerGlow.addColorStop(1, 'rgba(5,9,18,0)');
        ctx.fillStyle = centerGlow;
        ctx.fillRect(0, 0, w, h);

        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(loop);
    }
    loop();
}

/* =====================================================
   NAVIGATION
   ===================================================== */
function initNavigation() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('nav-toggle');
    const links = document.getElementById('nav-links');
    const navAnchors = document.querySelectorAll('.nav-link');

    // Scroll
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 30);
        updateActive();
    }, { passive: true });

    // Mobile toggle
    toggle?.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('active');
    });

    // Close on link click
    navAnchors.forEach(a => {
        a.addEventListener('click', () => {
            toggle?.classList.remove('active');
            links?.classList.remove('active');
        });
    });

    function updateActive() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 180;
        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            if (scrollPos >= top && scrollPos < top + height) {
                navAnchors.forEach(a => {
                    a.classList.remove('active');
                    if (a.getAttribute('href') === `#${id}`) a.classList.add('active');
                });
            }
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

/* =====================================================
   TYPING EFFECT
   ===================================================== */
function initTyping() {
    const el = document.getElementById('typing-text');
    if (!el) return;

    const texts = [
        'Machine Learning Engineer',
        'AI Enthusiast',
        'Deep Learning Developer',
        'Data Scientist',
        'Problem Solver',
        'Tech Innovator'
    ];

    let ti = 0, ci = 0, deleting = false, speed = 80;

    function type() {
        const cur = texts[ti];
        if (deleting) {
            el.textContent = cur.substring(0, ci - 1);
            ci--;
            speed = 40;
        } else {
            el.textContent = cur.substring(0, ci + 1);
            ci++;
            speed = 80;
        }

        if (!deleting && ci === cur.length) { speed = 2500; deleting = true; }
        else if (deleting && ci === 0) { deleting = false; ti = (ti + 1) % texts.length; speed = 400; }

        setTimeout(type, speed);
    }
    setTimeout(type, 1200);
}

/* =====================================================
   SCROLL ANIMATIONS
   ===================================================== */
function initScrollAnimations() {
    const els = document.querySelectorAll('[data-animate]');

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || 0);
                setTimeout(() => entry.target.classList.add('visible'), delay);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => obs.observe(el));
}

/* =====================================================
   SKILL BARS
   ===================================================== */
function initSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const w = entry.target.dataset.w;
                setTimeout(() => { entry.target.style.width = w + '%'; }, 200);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    fills.forEach(f => obs.observe(f));
}

/* =====================================================
   SCORE RINGS — Animated CGPA
   ===================================================== */
function initScoreRings() {
    const rings = document.querySelectorAll('.score-ring');
    const circumference = 2 * Math.PI * 52; // r=52

    // Inject SVG gradient defs once
    const svgNS = 'http://www.w3.org/2000/svg';
    rings.forEach(ring => {
        const svg = ring.querySelector('svg');
        if (!svg.querySelector('defs')) {
            const defs = document.createElementNS(svgNS, 'defs');
            const grad = document.createElementNS(svgNS, 'linearGradient');
            grad.setAttribute('id', 'scoreGrad');
            grad.setAttribute('x1', '0%'); grad.setAttribute('y1', '0%');
            grad.setAttribute('x2', '100%'); grad.setAttribute('y2', '0%');
            const s1 = document.createElementNS(svgNS, 'stop');
            s1.setAttribute('offset', '0%'); s1.setAttribute('stop-color', '#00e5ff');
            const s2 = document.createElementNS(svgNS, 'stop');
            s2.setAttribute('offset', '100%'); s2.setAttribute('stop-color', '#6a5cff');
            grad.appendChild(s1); grad.appendChild(s2);
            defs.appendChild(grad);
            svg.insertBefore(defs, svg.firstChild);
        }
    });

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const ring = entry.target;
                const score = parseFloat(ring.dataset.score);
                const fill = ring.querySelector('.ring-fill');
                const val = ring.querySelector('.score-val');
                const fraction = score / 10;
                const dashLen = fraction * circumference;

                // Animate
                const duration = 1500;
                const start = performance.now();
                function animate(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 3);
                    const currentScore = ease * score;
                    val.textContent = currentScore.toFixed(currentScore < 10 ? 1 : 0);
                    fill.setAttribute('stroke-dasharray', `${ease * dashLen} ${circumference}`);
                    if (progress < 1) requestAnimationFrame(animate);
                    else val.textContent = score.toString();
                }
                requestAnimationFrame(animate);
                obs.unobserve(ring);
            }
        });
    }, { threshold: 0.5 });

    rings.forEach(r => obs.observe(r));
}

/* =====================================================
   STAT COUNTERS
   ===================================================== */
function initStatCounters() {
    const boxes = document.querySelectorAll('.stat-box');

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                const numEl = entry.target.querySelector('.stat-num');
                const duration = 1200;
                const start = performance.now();
                function tick(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 3);
                    numEl.textContent = Math.floor(ease * target);
                    if (progress < 1) requestAnimationFrame(tick);
                    else numEl.textContent = target;
                }
                requestAnimationFrame(tick);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    boxes.forEach(b => obs.observe(b));
}

/* =====================================================
   BACK TO TOP
   ===================================================== */
function initBackToTop() {
    const btn = document.getElementById('back-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* =====================================================
   CONTACT FORM — WhatsApp Integration
   ===================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form));
        const phone = '917094043631';
        const msg = `*New Portfolio Contact*\n\n━━━━━━━━━━━━━━━━━━\n*Name:* ${data.name}\n*Email:* ${data.email}\n*Subject:* ${data.subject || 'No Subject'}\n━━━━━━━━━━━━━━━━━━\n\n*Message:*\n${data.message}\n\n━━━━━━━━━━━━━━━━━━\n_Sent via Portfolio Website_`;
        window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`, '_blank');
        showToast('Redirecting to WhatsApp...', 'success');
        setTimeout(() => form.reset(), 1000);
    });
}

/* =====================================================
   TOAST NOTIFICATION
   ===================================================== */
function showToast(message, type) {
    const existing = document.querySelector('.toast-msg');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    toast.style.cssText = `
        position:fixed; bottom:30px; left:50%; transform:translateX(-50%) translateY(80px);
        display:flex; align-items:center; gap:10px; padding:14px 28px;
        background:${type === 'success' ? 'rgba(6,182,212,.9)' : 'rgba(236,72,153,.9)'};
        color:#fff; border-radius:100px; font-size:.9rem; font-weight:500;
        backdrop-filter:blur(12px); box-shadow:0 8px 30px rgba(0,0,0,.3);
        z-index:10000; animation:toastIn .4s cubic-bezier(.4,0,.2,1) forwards;
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes toastIn { to { transform:translateX(-50%) translateY(0); } }
        @keyframes toastOut { to { transform:translateX(-50%) translateY(80px); opacity:0; } }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toastOut .4s cubic-bezier(.4,0,.2,1) forwards';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

/* =====================================================
   PAGE LOAD
   ===================================================== */
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    console.log('🚀 Portfolio loaded — Dinesh S');
});

/* =====================================================
   PUBLICATION SPOTLIGHT
   ===================================================== */
function initPublicationSpotlight() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.publication-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (event) => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            card.style.setProperty('--spot-x', `${x}px`);
            card.style.setProperty('--spot-y', `${y}px`);
        });
    });
}
