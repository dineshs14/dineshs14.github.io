/* Small, progressive enhancements. All portfolio content works without animation. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const themeButton = document.getElementById('theme-toggle');
  const menuButton = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-links');
  const links = [...document.querySelectorAll('.nav-link')];
  const progress = document.getElementById('scroll-progress');
  const backTop = document.getElementById('back-top');

  function setTheme(theme) {
    root.dataset.theme = theme;
    const light = theme === 'light';
    themeButton.setAttribute('aria-label', `Switch to ${light ? 'dark' : 'light'} theme`);
    themeButton.innerHTML = `<i class="fas fa-${light ? 'moon' : 'sun'}" aria-hidden="true"></i>`;
    document.querySelector('meta[name="theme-color"]').content = light ? '#f5f6fa' : '#0c1019';
  }
  try { setTheme(localStorage.getItem('portfolio_theme') === 'light' ? 'light' : 'dark'); }
  catch { setTheme('dark'); }
  themeButton.addEventListener('click', () => {
    const theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    setTheme(theme);
    try { localStorage.setItem('portfolio_theme', theme); } catch { /* Storage is optional. */ }
  });

  function setMenu(open, returnFocus = false) {
    menu.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  links.forEach(link => link.addEventListener('click', () => {
    setMenu(false);
    const destination = document.querySelector(link.getAttribute('href'));
    if (destination) {
      destination.setAttribute('tabindex', '-1');
      destination.focus({ preventScroll: true });
    }
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.classList.contains('open')) setMenu(false, true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.nav')) setMenu(false);
  });
  document.addEventListener('focusin', event => {
    if (!event.target.closest('.nav')) setMenu(false);
  });
  const mobile = window.matchMedia('(max-width: 800px)');
  mobile.addEventListener('change', () => setMenu(false));

  // One scheduled scroll update, with native scrolling and no perpetual render loop.
  let framePending = false;
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  function updateScroll() {
    const max = root.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    backTop.classList.toggle('visible', window.scrollY > 600);
    let current = null;
    sections.forEach(section => {
      if (section && section.getBoundingClientRect().top <= 150) {
        if (!current || section.offsetTop > current.offsetTop) current = section;
      }
    });
    links.forEach(link => {
      const active = current && link.hash === `#${current.id}`;
      link.classList.toggle('active', Boolean(active));
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    framePending = false;
  }
  function scheduleScroll() {
    if (!framePending) {
      framePending = true;
      window.requestAnimationFrame(updateScroll);
    }
  }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll, { passive: true });
  window.addEventListener('load', scheduleScroll, { once: true });
  updateScroll();
  backTop.addEventListener('click', () => {
    document.querySelector('.nav-brand').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });

  document.querySelectorAll('.skill-fill').forEach(fill => {
    fill.style.setProperty('--skill-width', `${fill.dataset.w}%`);
  });
  document.querySelectorAll('.score-ring').forEach(ring => {
    const score = Number(ring.dataset.score);
    const circumference = 2 * Math.PI * 52;
    ring.querySelector('.ring-fill').setAttribute('stroke-dasharray', `${circumference * score / 10} ${circumference}`);
  });

  // Only hide reveal targets after their observer is successfully installed.
  const targets = document.querySelectorAll('[data-animate]');
  let observer;
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.06, rootMargin: '0px 0px 24px 0px' });
    targets.forEach(target => observer.observe(target));
    root.classList.add('motion-ready');
  }
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      root.classList.remove('motion-ready');
      if (observer) observer.disconnect();
    }
  });
  // Anchored sections and keyboard-focused content must never remain transparent.
  document.addEventListener('focusin', event => {
    let element = event.target;
    while (element && element !== document.body) {
      if (element.matches('[data-animate]')) element.classList.add('revealed');
      element = element.parentElement;
    }
  });

  const form = document.getElementById('contact-form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    const message = `New portfolio contact\n\nName: ${data.name.trim()}\nEmail: ${data.email.trim()}\nSubject: ${data.subject.trim()}\n\n${data.message.trim()}`;
    const url = `https://api.whatsapp.com/send?phone=917094043631&text=${encodeURIComponent(message)}`;
    // A regular anchor preserves browser handling and keeps the draft in the form.
    const handoff = document.createElement('a');
    handoff.href = url;
    handoff.target = '_blank';
    handoff.rel = 'noopener noreferrer';
    handoff.textContent = 'Open WhatsApp';
    document.getElementById('form-status').replaceChildren('Your draft is ready. If WhatsApp did not open, ', handoff, '.');
    handoff.click();
  });
  document.getElementById('copyright-year').textContent = new Date().getFullYear();

  // A user-triggered signal, with a static equivalent for reduced motion.
  const network = document.getElementById('neural-portrait');
  const signalButton = document.getElementById('signal-button');
  const networkState = document.getElementById('network-state');
  let signalTimer;
  let signalFrame;
  function resetSignal() {
    window.clearTimeout(signalTimer);
    window.cancelAnimationFrame(signalFrame);
    network.classList.remove('signal-on');
    networkState.textContent = 'Everything starts with a connection.';
  }
  signalButton.addEventListener('click', () => {
    resetSignal();
    signalFrame = window.requestAnimationFrame(() => {
      network.classList.add('signal-on');
      networkState.textContent = reducedMotion.matches ? 'Connections highlighted.' : 'Signal sent through the network.';
      signalTimer = window.setTimeout(resetSignal, 3500);
    });
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) resetSignal();
  });
})();
