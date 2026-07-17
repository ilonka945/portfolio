// ===== Přepínač světlého / tmavého tématu =====
// (výchozí téma se nastavuje malým skriptem v <head>, aby stránka neblikla)
document.querySelectorAll('.theme-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  });
});

// ===== Mobilní menu =====
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobile-menu');
let menuOpen = false;
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    mobileMenu.style.maxHeight = menuOpen ? mobileMenu.scrollHeight + 'px' : '0px';
    const [l1, l2, l3] = burger.children;
    l1.style.transform = menuOpen ? 'translateY(7.5px) rotate(45deg)' : '';
    l2.style.opacity = menuOpen ? '0' : '1';
    l3.style.transform = menuOpen ? 'translateY(-7.5px) rotate(-45deg)' : '';
  });
}

// ===== Zvýraznění aktivní stránky v menu =====
const current = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(a => {
  if (a.getAttribute('href') === current) a.classList.add('active');
});

// ===== Hvězdičky v referencích =====
const starSvg = '<svg viewBox="0 0 20 20"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8L1.5 7.7l5.9-.9z"/></svg>';
document.querySelectorAll('.stars').forEach(el => { el.innerHTML = starSvg.repeat(5); });

// ===== Animované čítače =====
// Spouští se, když se dostanou na obrazovku; pojistka je spustí nejpozději
// po 1,5 s, aby čísla nikdy nezůstala na nule.
function runCounter(el) {
  if (el.dataset.done) return;
  el.dataset.done = '1';
  const target = +el.dataset.target, dur = 1500, t0 = performance.now();
  const tick = now => {
    const p = Math.min((now - t0) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const counters = document.querySelectorAll('.counter');
if (counters.length) {
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { runCounter(e.target); counterIO.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterIO.observe(el));
  setTimeout(() => counters.forEach(runCounter), 1500);
}

// ===== Jemný parallax hero fotky (jen na úvodní stránce) =====
const heroFrame = document.getElementById('hero-frame');
if (heroFrame) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      heroFrame.style.transform = `translateY(${window.scrollY * 0.08}px)`;
      ticking = false;
    });
  }, { passive: true });
}
