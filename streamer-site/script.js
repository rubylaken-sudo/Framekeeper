// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
navToggle.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Highlight today in the schedule
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const today = dayNames[new Date().getDay()];
document.querySelectorAll('.day').forEach((day) => {
  if (day.dataset.day === today) day.classList.add('today');
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// 3D tilt on hover for cards
const tiltEls = document.querySelectorAll('.gear-item, .clip-card, .support-card, .fact, .day');
tiltEls.forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 14;
    const rotateY = (x - 0.5) * 14;
    el.style.transition = 'none';
    el.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transition = 'transform 0.4s ease';
    el.style.transform = '';
  });
});

// Parallax glow blobs
window.addEventListener('mousemove', (e) => {
  const mx = (e.clientX / window.innerWidth - 0.5) * 2;
  const my = (e.clientY / window.innerHeight - 0.5) * 2;
  document.documentElement.style.setProperty('--mx', mx.toFixed(3));
  document.documentElement.style.setProperty('--my', my.toFixed(3));
});

// Scroll-reveal for below-the-fold content
const revealGroups = document.querySelectorAll('.gear-grid, .clips-grid, .support-grid, .schedule-grid, .fact-grid, .challenge-list');
revealGroups.forEach((group) => {
  Array.from(group.children).forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(i, 5) * 60}ms`;
  });
});
document.querySelectorAll('.section-head, .about-grid > *').forEach((el) => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
