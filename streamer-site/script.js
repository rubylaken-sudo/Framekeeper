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
