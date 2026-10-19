// Content lives in site-data.json (edited from admin.html). The HTML holds fallback values.
const DEFAULT_GTA_TARGET = '2026-11-19T00:00:00';
let gtaTarget = new Date(DEFAULT_GTA_TARGET);

async function loadSiteData() {
  try {
    const res = await fetch('site-data.json', { cache: 'no-store' });
    return res.ok ? await res.json() : null;
  } catch (err) {
    return null;
  }
}

function setText(key, value) {
  if (value === undefined || value === null || value === '') return;
  document.querySelectorAll(`[data-bind="${key}"]`).forEach((node) => {
    node.textContent = value;
  });
}

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function renderSchedule(days) {
  const grid = document.getElementById('schedule-grid');
  if (!grid || !Array.isArray(days) || !days.length) return;
  grid.replaceChildren(...days.map((d) => {
    const card = make('div', 'day');
    card.dataset.day = d.day;
    card.append(
      make('h3', '', d.day),
      make('p', 'time', d.off ? 'Off' : d.time),
      make('p', d.off ? 'tag muted' : 'tag', d.tag || (d.off ? 'Rest day' : ''))
    );
    return card;
  }));
}

function renderClips(clips) {
  const grid = document.querySelector('.clips-grid');
  if (!grid || !Array.isArray(clips) || !clips.length) return;
  grid.replaceChildren(...clips.map((c) => {
    const id = encodeURIComponent(c.id);
    const link = make('a', 'clip-card');
    link.href = `https://youtube.com/shorts/${id}`;
    link.target = '_blank';
    link.rel = 'noopener';
    const thumb = make('div', 'clip-thumb');
    const img = document.createElement('img');
    img.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    img.alt = '';
    img.loading = 'lazy';
    thumb.append(img, make('span', 'play', '▶'));
    const meta = make('div', 'clip-meta');
    meta.append(make('h3', '', c.title), make('p', '', c.label || 'YouTube Shorts'));
    link.append(thumb, meta);
    return link;
  }));
}

function renderChallenges(items) {
  const list = document.querySelector('.challenge-list');
  if (!list || !Array.isArray(items) || !items.length) return;
  list.replaceChildren(...items.map((c) => {
    const item = make('div', 'challenge-item');
    const title = make('div', 'challenge-title');
    title.append(make('span', 'challenge-tag', c.tag), document.createTextNode(c.title));
    item.append(title, make('p', 'challenge-desc', c.desc));
    return item;
  }));
}

function renderGear(items) {
  const grid = document.querySelector('.gear-grid');
  if (!grid || !Array.isArray(items) || !items.length) return;
  grid.replaceChildren(...items.map((g) => {
    const item = make('div', 'gear-item');
    item.append(make('span', 'gear-icon', g.icon), make('h3', '', g.name), make('p', '', g.text));
    return item;
  }));
}

function applySiteData(data) {
  setText('currentlyPlaying', data.currentlyPlaying);
  setText('followers', data.stats && data.stats.followers);
  setText('streams', data.stats && data.stats.streams);
  setText('mainGames', data.facts && data.facts.mainGames);
  setText('streamingSince', data.facts && data.facts.streamingSince);

  if (Array.isArray(data.schedule) && data.schedule.length) {
    renderSchedule(data.schedule);
    const active = data.schedule.filter((d) => !d.off).map((d) => d.day);
    if (active.length) setText('scheduleSummary', active.join(' · '));
  }
  renderClips(data.clips);
  renderChallenges(data.challenges);
  setText('challengeNote', data.challengeNote);
  renderGear(data.gear);

  const release = data.gta6 && data.gta6.releaseDate;
  if (release) {
    const date = new Date(`${release}T00:00:00`);
    if (!Number.isNaN(date.getTime())) {
      gtaTarget = date;
      const label = document.getElementById('cd-target-label');
      if (label) {
        label.textContent = `Counting down to ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
      }
    }
  }
}

function initSite() {
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
  const tiltEls = document.querySelectorAll('.gear-item, .clip-card, .support-card, .fact, .day, .countdown-glass');
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

  // GTA VI release countdown
  const cdDays = document.getElementById('cd-days');
  function updateGtaCountdown() {
    if (!cdDays) return;
    const diff = gtaTarget - new Date();
    const label = document.getElementById('cd-target-label');
    if (diff <= 0) {
      ['cd-days', 'cd-hours', 'cd-mins', 'cd-secs'].forEach((id) => {
        document.getElementById(id).textContent = '00';
      });
      if (label) label.textContent = 'GTA VI is out now!';
      return;
    }
    const pad = (n) => String(n).padStart(2, '0');
    document.getElementById('cd-days').textContent = pad(Math.floor(diff / 86400000));
    document.getElementById('cd-hours').textContent = pad(Math.floor(diff / 3600000) % 24);
    document.getElementById('cd-mins').textContent = pad(Math.floor(diff / 60000) % 60);
    document.getElementById('cd-secs').textContent = pad(Math.floor(diff / 1000) % 60);
  }
  updateGtaCountdown();
  setInterval(updateGtaCountdown, 1000);
}

loadSiteData().then((data) => {
  if (data) applySiteData(data);
  initSite();
});
