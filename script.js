/* =====================================================
   DINESH S - Enhanced Portfolio JavaScript
   Trending Animations & Interactivity
   ===================================================== */

// Ensure page starts at top on load
window.addEventListener('load', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    }, 0);
});

// Reset scroll position on page show (back/forward navigation)
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        window.scrollTo(0, 0);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Immediately scroll to top
    window.scrollTo(0, 0);
    
    initChristmasModal();
    initParticles();
    initCursorEffects();
    initNavigation();
    initTypingEffect();
    initScrollAnimations();
    initSkillBars();
    initTiltEffect();
    initMagneticButtons();
    initStatCounters();
    initTimelineProgress();
    initBackToTop();
    initFormHandler();
    initLetterHover();
});

/* =====================================================
   CHRISTMAS MODAL
   ===================================================== */
function initChristmasModal() {
    const modal = document.getElementById('christmas-modal');
    const closeBtn = document.getElementById('christmas-close');
    const thanksBtn = document.getElementById('christmas-btn');
    
    if (!modal || !closeBtn) {
        console.log('Christmas modal elements not found');
        return;
    }

    // Check if modal was already shown (you can clear browser storage to see it again)
    const hasSeenModal = sessionStorage.getItem('christmasModalSeen');
    
    if (!hasSeenModal) {
        // Show modal after a short delay
        setTimeout(() => {
            modal.classList.add('show');
            modal.classList.remove('hidden');
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        }, 800);
    }

    // Close modal function
    function closeModal() {
        modal.classList.remove('show');
        modal.classList.add('hidden');
        setTimeout(() => {
            document.body.style.overflow = 'auto';
        }, 500);
        sessionStorage.setItem('christmasModalSeen', 'true');
    }

    // Close on close button click
    closeBtn.addEventListener('click', closeModal);

    // Close on Thank You button click
    if (thanksBtn) {
        thanksBtn.addEventListener('click', closeModal);
    }

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

/* =====================================================
   PARTICLE BACKGROUND
   ===================================================== */
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.baseX = this.x;
            this.baseY = this.y;
            this.size = Math.random() * 2 + 0.5;
            this.density = Math.random() * 30 + 1;
            this.color = `hsla(${240 + Math.random() * 60}, 70%, 60%, ${Math.random() * 0.5 + 0.2})`;
        }

        update() {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;

            if (distance < mouse.radius) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                if (this.x !== this.baseX) {
                    let dx = this.x - this.baseX;
                    this.x -= dx / 10;
                }
                if (this.y !== this.baseY) {
                    let dy = this.y - this.baseY;
                    this.y -= dy / 10;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 18000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const opacity = (1 - distance / 120) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(102, 126, 234, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animate);
    }

    animate();
}

/* =====================================================
   CUSTOM CURSOR EFFECTS
   ===================================================== */
function initCursorEffects() {
    const cursorTrail = document.querySelector('.cursor-trail');
    const cursorDot = document.querySelector('.cursor-dot');

    // Only hide if mobile, but KEEP existing logic for now.
    // CSS might hide default cursor, this JS handles custom one.
    if (!cursorTrail || !cursorDot || window.matchMedia('(max-width: 768px)').matches) {
        if (cursorTrail) cursorTrail.style.display = 'none';
        if (cursorDot) cursorDot.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Cursor dot position is handled by separate event listener below for rotation
        // But for trail it's useful here
    });

    function animateTrail() {
        trailX += (mouseX - trailX) * 0.08;
        trailY += (mouseY - trailY) * 0.08;
        cursorTrail.style.left = `${trailX}px`;
        cursorTrail.style.top = `${trailY}px`;
        requestAnimationFrame(animateTrail);
    }
    animateTrail();

    // Expand cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item, .tag');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursorDot.classList.add('expanded'));
        el.addEventListener('mouseleave', () => cursorDot.classList.remove('expanded'));
    });
}

/* =====================================================
   NAVIGATION
   ===================================================== */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveLink();
    });

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });

    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

/* =====================================================
   TYPING EFFECT
   ===================================================== */
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const texts = [
        'Machine Learning Engineer',
        'AI Enthusiast',
        'Deep Learning Developer',
        'Data Scientist',
        'Problem Solver',
        'Tech Innovator'
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 1500);
}

/* =====================================================
   SCROLL ANIMATIONS
   ===================================================== */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.classList.contains('delay-1') ? 100 :
                    entry.target.classList.contains('delay-2') ? 200 :
                        entry.target.classList.contains('delay-3') ? 300 : 0;

                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
            } else {
                // Remove class to replay animation on re-entry
                // Check if element is above the viewport to avoid hiding when scrolling past it? 
                // No, user wants it to animate EVERY time they scroll up and down.
                entry.target.classList.remove('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => observer.observe(element));
}

/* =====================================================
   SKILL BARS ANIMATION
   ===================================================== */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.dataset.progress;
                setTimeout(() => {
                    entry.target.style.width = `${progress}%`;
                }, 200);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    skillBars.forEach(bar => observer.observe(bar));
}

/* =====================================================
   3D TILT EFFECT
   ===================================================== */
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/* =====================================================
   MAGNETIC BUTTONS
   ===================================================== */
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

/* =====================================================
   STAT COUNTERS
   ===================================================== */
function initStatCounters() {
    const statItems = document.querySelectorAll('.stat-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                const numberEl = entry.target.querySelector('.stat-number');
                animateCounter(numberEl, target, 1500);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statItems.forEach(item => observer.observe(item));
}

function animateCounter(element, target, duration) {
    let start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

/* =====================================================
   TIMELINE PROGRESS
   ===================================================== */
function initTimelineProgress() {
    const timelineProgress = document.querySelector('.timeline-progress');
    if (!timelineProgress) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    timelineProgress.style.height = '100%';
                }, 300);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    const timeline = document.querySelector('.timeline');
    if (timeline) observer.observe(timeline);
}

/* =====================================================
   BACK TO TOP BUTTON
   ===================================================== */
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    const progressCircle = backToTop.querySelector('.progress-ring-circle');
    const circumference = 2 * Math.PI * 20;

    if (progressCircle) {
        progressCircle.style.strokeDasharray = circumference;
        progressCircle.style.strokeDashoffset = circumference;
    }

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrolled / maxScroll;

        if (scrolled > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        if (progressCircle) {
            const offset = circumference - (scrollPercent * circumference);
            progressCircle.style.strokeDashoffset = offset;
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* =====================================================
   LETTER HOVER EFFECT
   ===================================================== */
function initLetterHover() {
    const letters = document.querySelectorAll('.name-letter');

    letters.forEach((letter, index) => {
        letter.style.animationDelay = `${index * 0.05}s`;

        letter.addEventListener('mouseenter', () => {
            letter.style.transform = 'translateY(-10px) scale(1.1)';
            letter.style.color = 'var(--gradient-3)';
        });

        letter.addEventListener('mouseleave', () => {
            letter.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/* =====================================================
   FORM HANDLER
   ===================================================== */
function initFormHandler() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Handle floating labels on input
    const formInputs = form.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        // Add 'has-value' class when input has content
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });

        // Check on page load if input already has value
        if (input.value.trim() !== '') {
            input.classList.add('has-value');
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // WhatsApp Integration - Send directly to your WhatsApp
        const phoneNumber = "917094043631";

        const message = `*New Portfolio Contact*\n\n━━━━━━━━━━━━━━━━━━\n*Name:* ${data.name}\n*Email:* ${data.email}\n*Subject:* ${data.subject || 'No Subject'}\n━━━━━━━━━━━━━━━━━━\n\n*Message:*\n${data.message}\n\n━━━━━━━━━━━━━━━━━━\n_Sent via Portfolio Website_`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

        // Open WhatsApp with pre-filled message
        window.open(whatsappUrl, '_blank');

        showNotification('Redirecting to WhatsApp...', 'success');

        setTimeout(() => form.reset(), 1000);
    });
}

function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 28px;
        background: ${type === 'success' ? 'rgba(0, 212, 170, 0.95)' : 'rgba(245, 87, 108, 0.95)'};
        color: white;
        border-radius: 50px;
        font-size: 0.95rem;
        font-weight: 500;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            to { transform: translateX(-50%) translateY(0); }
        }
        @keyframes slideDown {
            to { transform: translateX(-50%) translateY(100px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideDown 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

/* =====================================================
   SMOOTH SCROLL
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* =====================================================
   PARALLAX ON SCROLL
   ===================================================== */
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    // Parallax for blobs
    document.querySelectorAll('.blob').forEach((blob, index) => {
        const speed = (index + 1) * 0.05;
        blob.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

/* =====================================================
   LOADING COMPLETE
   ===================================================== */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    console.log('🚀 Portfolio loaded successfully! - Dinesh S');
});

/* =====================================================
   CLICK BURST ANIMATION
   ===================================================== */
document.addEventListener('click', (e) => {
    createClickBurst(e.clientX, e.clientY);
});

function createClickBurst(x, y) {
    const particleCount = 12;
    const colors = ['#667eea', '#764ba2', '#00d4aa', '#ffc107', '#ff5757'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('click-particle');
        document.body.appendChild(particle);

        const size = Math.random() * 8 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = color;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0, .9, .57, 1)',
        }).onfinish = () => particle.remove();
    }
}

/* =====================================================
   ROUND 10: FLOATING TOGGLE LOGIC & CUSTOM CURSOR
   ===================================================== */
const toggleBtn = document.getElementById('theme-toggle-floating');
const toggleIcon = toggleBtn ? toggleBtn.querySelector('i') : null;

function updateToggleIcon(isLight) {
    if (!toggleIcon) return;
    if (isLight) {
        toggleIcon.className = 'fas fa-sun';
        toggleIcon.style.color = '#ff9900'; // Sun color
    } else {
        toggleIcon.className = 'fas fa-moon';
        toggleIcon.style.color = '#fff'; // Moon color
    }
}

// Initial State Check
const storedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', storedTheme);
updateToggleIcon(storedTheme === 'light');

if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateToggleIcon(newTheme === 'light');

        // Flash animation
        document.body.style.transition = 'background 0.3s ease';
        setTimeout(() => document.body.style.transition = 'background 0.5s ease', 300);
    });
}


/* =====================================================
   ROUND 13: GHOST BLOB PHYSICS & HINT LOGIC
   ===================================================== */
const cursorRing = document.querySelector('.cursor-ring');
const cursorDotStatic = document.querySelector('.cursor-dot');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
let velX = 0, velY = 0;
let scaleX = 1, scaleY = 1;

if (cursorRing && cursorDotStatic) {
    // Hide default
    document.body.style.cursor = 'none';

    // Initial Pos: Center window
    ringX = window.innerWidth / 2;
    ringY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Dot moves instantly
        cursorDotStatic.style.left = `${mouseX}px`;
        cursorDotStatic.style.top = `${mouseY}px`;
    });

    // Scroll Velocity Calculation
    let lastScrollY = window.scrollY;
    let scrollVel = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        scrollVel = currentScroll - lastScrollY;
        lastScrollY = currentScroll;

        // Hide scroll hint on first scroll and PERSIST it
        const hint = document.querySelector('.scroll-indicator'); // Fixing selector to match HTML class
        const hintText = document.querySelector('.scroll-hint'); // Hero text hint

        if (!localStorage.getItem('hasScrolled')) {
            localStorage.setItem('hasScrolled', 'true');

            if (hint) {
                hint.classList.add('fade-out');
                setTimeout(() => hint.remove(), 1000);
            }
            if (hintText) {
                hintText.style.opacity = '0';
                setTimeout(() => hintText.remove(), 1000);
            }
        }
    }, { passive: true });

    // Check on load
    if (localStorage.getItem('hasScrolled')) {
        const hint = document.querySelector('.scroll-indicator');
        const hintText = document.querySelector('.scroll-hint');
        if (hint) hint.style.display = 'none';
        if (hintText) hintText.style.display = 'none';
    }

    function animateGhost() {
        // Lerp position
        let nextRingX = ringX + (mouseX - ringX) * 0.12;
        let nextRingY = ringY + (mouseY - ringY) * 0.12;

        velX = nextRingX - ringX;
        velY = nextRingY - ringY;

        ringX = nextRingX;
        ringY = nextRingY;

        // Calculate stretch based on movement speed
        const moveSpeed = Math.sqrt(velX * velX + velY * velY);
        // Calculate stretch based on SCROLL speed (vertical only)
        // Damping the scroll velocity decay
        scrollVel *= 0.9;

        // Stretch based on accumulated velocity
        // Sensitive to scroll to make it "show" as requested
        const stretchAmount = Math.min(moveSpeed * 0.05 + Math.abs(scrollVel) * 0.05, 1.5);

        // Determine angle:
        // By default align to movement
        let angle = Math.atan2(velY, velX) * 180 / Math.PI;

        // If scrolling is the dominant force (speed > 2), force vertical vertical stretch
        if (Math.abs(scrollVel) > 2) {
            angle = 90; // Vertical
            scaleX = 1 - Math.min(stretchAmount * 0.3, 0.6); // Get thinner
            scaleY = 1 + stretchAmount; // Get Much Longer
        } else {
            // Normal movement stretch
            scaleX = 1 + stretchAmount;
            scaleY = 1 - stretchAmount * 0.5;
        }

        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
        cursorRing.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;

        requestAnimationFrame(animateGhost);
    }
    animateGhost();

    // Cleanup old trail logic if present
    const oldTrail = document.querySelector('.cursor-trail');
    if (oldTrail) oldTrail.style.display = 'none';
}
