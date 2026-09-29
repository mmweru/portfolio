import './style.css';

/* ================================================================ */
/* CONFIG — edit these once; every link on the page updates.         */
/* ================================================================ */
const CONFIG = {
  email: 'mwerumaryann@gmail.com',
  phone: '+254 792 498 427',
  whatsapp: 'https://wa.me/254792498427',
  linkedin: 'https://www.linkedin.com/in/your-handle',
  github: 'https://github.com/mmweru',
  resume: '/resume.pdf',
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

/* ---------- Config -> links ---------- */
$$('[data-cfg-href]').forEach((el) => {
  const key = el.dataset.cfgHref;
  if (key === 'mailto') el.href = `mailto:${CONFIG.email}`;
  else if (key === 'whatsapp') el.href = CONFIG.whatsapp;
  else if (CONFIG[key]) el.href = CONFIG[key];
});
$('#year').textContent = new Date().getFullYear();

/* ================================================================ */
/* Theme toggle (persisted)                                          */
/* ================================================================ */
(function theme() {
  const root = document.documentElement;
  const btn = $('#themeToggle');
  const icon = $('#themeIcon');
  const meta = $('meta[name="theme-color"]');

  function apply(t, save) {
    root.dataset.theme = t;
    icon.textContent = t === 'dark' ? 'light_mode' : 'dark_mode';
    btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    if (meta) meta.content = t === 'dark' ? '#080c14' : '#f1f6fa';
    if (save) {
      try { localStorage.setItem('theme', t); } catch (e) { /* storage unavailable */ }
    }
  }
  apply(root.dataset.theme || 'dark', false);
  btn.addEventListener('click', () => apply(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
  window.__toggleTheme = () => {
    apply(root.dataset.theme === 'dark' ? 'light' : 'dark', true);
    return root.dataset.theme;
  };
})();

/* ================================================================ */
/* Mobile menu                                                       */
/* ================================================================ */
(function mobileMenu() {
  const btn = $('#menuBtn');
  const panel = $('#mobileNav');
  const icon = $('#menuIcon');
  const set = (open) => {
    panel.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    icon.textContent = open ? 'close' : 'menu';
  };
  btn.addEventListener('click', () => set(!panel.classList.contains('is-open')));
  $$('a', panel).forEach((a) => a.addEventListener('click', () => set(false)));
  window.addEventListener('resize', () => window.innerWidth >= 768 && set(false));
})();

/* ================================================================ */
/* Scroll progress, nav highlight, reveal                            */
/* ================================================================ */
(function scrollFx() {
  const bar = $('#progress');
  let ticking = false;
  function update() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();

  // Active link
  const links = $$('[data-nav-link]');
  const map = new Map(links.map((l) => [l.getAttribute('href').slice(1), l]));
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((l) => l.classList.toggle('is-active', l === map.get(e.target.id)));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) secObs.observe(s); });

  // Reveal
  const items = $$('[data-reveal]');
  if (reduced) { items.forEach((i) => i.classList.add('is-visible')); return; }
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); revObs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  items.forEach((i) => revObs.observe(i));
})();

/* ================================================================ */
/* Cursor spotlight + photo parallax                                 */
/* ================================================================ */
(function ambient() {
  if (finePointer && !reduced) {
    let raf = null;
    let x = 0; let y = 0;
    window.addEventListener('pointermove', (e) => {
      x = e.clientX; y = e.clientY;
      if (!raf) raf = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mx', `${x}px`);
        document.documentElement.style.setProperty('--my', `${y}px`);
        raf = null;
      });
    }, { passive: true });
  }

  const targets = $$('[data-parallax]');
  if (!targets.length || reduced) return;
  let ticking = false;
  function run() {
    const vh = window.innerHeight;
    targets.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      const offset = (r.top + r.height / 2 - vh / 2) * parseFloat(el.dataset.parallax);
      el.style.setProperty('--py', `${offset.toFixed(1)}px`);
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(run); }
  }, { passive: true });
  run();
})();

/* ================================================================ */
/* Hero: typed role line                                             */
/* ================================================================ */
(function typedRole() {
  const el = $('#typedRole');
  const words = ['data engineer', 'data analyst', 'software developer', 'python developer'];
  if (reduced) { el.textContent = words[0]; return; }
  let w = 0; let c = 0; let del = false;
  function tick() {
    const word = words[w];
    el.textContent = word.slice(0, c);
    let delay = del ? 35 : 75;
    if (!del && c === word.length) { del = true; delay = 1500; }
    else if (del && c === 0) { del = false; w = (w + 1) % words.length; delay = 350; }
    else c += del ? -1 : 1;
    setTimeout(tick, delay);
  }
  setTimeout(tick, 900);
})();

/* ================================================================ */
/* Hero: hanging ID badge with drag + spring physics                 */
/* ================================================================ */
(function lanyard() {
  const lan = $('#lanyard');
  const badge = $('#badge');
  let angle = 0; let vel = 0; let dragging = false;
  let startX = 0; let startAngle = 0; let lastX = 0; let lastDelta = 0;
  let t = 0; let running = false; let visible = true;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function frame() {
    if (!visible) { running = false; return; }
    if (!dragging) {
      vel += -0.028 * angle; // spring back to centre
      vel *= 0.965;          // damping
      angle += vel;
    }
    t += 0.014;
    const idle = reduced ? 0 : Math.sin(t) * 1.4;
    lan.style.transform = `rotate(${(angle + idle).toFixed(3)}deg)`;
    requestAnimationFrame(frame);
  }
  function start() { if (!running) { running = true; requestAnimationFrame(frame); } }

  badge.addEventListener('pointerdown', (e) => {
    dragging = true; startX = lastX = e.clientX; startAngle = angle; vel = 0;
    badge.setPointerCapture(e.pointerId);
  });
  badge.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    lastDelta = e.clientX - lastX; lastX = e.clientX;
    angle = clamp(startAngle + (e.clientX - startX) * 0.22, -28, 28);
  });
  const release = () => { if (dragging) { dragging = false; vel = lastDelta * 0.12; } };
  badge.addEventListener('pointerup', release);
  badge.addEventListener('pointercancel', release);

  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) start();
  }).observe(lan);
  start();
})();

/* ================================================================ */
/* Stats: count-up                                                   */
/* ================================================================ */
(function counters() {
  const els = $$('[data-count]');
  const ease = (x) => 1 - Math.pow(1 - x, 3);
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      const target = parseInt(e.target.dataset.count, 10);
      if (reduced) { e.target.textContent = target; return; }
      const dur = 1400; const t0 = performance.now();
      (function step(now) {
        const p = Math.min((now - t0) / dur, 1);
        e.target.textContent = Math.round(target * ease(p));
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }, { threshold: 0.6 });
  els.forEach((el) => obs.observe(el));

  // Duplicate marquee content for a seamless loop
  const track = $('#marqueeTrack');
  if (track) track.innerHTML += track.innerHTML;
})();

/* ================================================================ */
/* Work carousel: buttons, drag, progress; card tilt                 */
/* ================================================================ */
(function carousel() {
  const rail = $('#rail');
  const bar = $('#railBar');
  const step = () => {
    const card = $('.work-card', rail);
    return card ? card.getBoundingClientRect().width + 24 : 320;
  };
  $('#railPrev').addEventListener('click', () => rail.scrollBy({ left: -step(), behavior: 'smooth' }));
  $('#railNext').addEventListener('click', () => rail.scrollBy({ left: step(), behavior: 'smooth' }));

  function progress() {
    const max = rail.scrollWidth - rail.clientWidth;
    const ratio = rail.clientWidth / rail.scrollWidth;
    const trackW = bar.parentElement.clientWidth;
    bar.style.width = `${Math.max(ratio, 0.15) * 100}%`;
    const travel = trackW - bar.clientWidth;
    bar.style.transform = `translateX(${max > 0 ? (rail.scrollLeft / max) * travel : 0}px)`;
  }
  rail.addEventListener('scroll', progress, { passive: true });
  window.addEventListener('resize', progress);
  progress();

  // Mouse drag-to-scroll (touch already scrolls natively)
  let down = false; let moved = false; let sx = 0; let sl = 0;
  rail.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft;
  });
  window.addEventListener('pointermove', (e) => {
    if (!down) return;
    const dx = e.clientX - sx;
    if (Math.abs(dx) > 4) { moved = true; rail.classList.add('is-dragging'); }
    rail.scrollLeft = sl - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!down) return;
    down = false; rail.classList.remove('is-dragging');
  });
  rail.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

  // Subtle 3D tilt on cards
  if (finePointer && !reduced) {
    $$('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        if (down) return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${(-py * 5).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }
})();

/* ================================================================ */
/* Copy email                                                        */
/* ================================================================ */
(function copyEmail() {
  const btn = $('#copyEmail');
  const label = $('#copyLabel');
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.email);
      label.textContent = 'Copied!';
      setTimeout(() => (label.textContent = 'Copy email'), 2000);
    } catch (e) {
      label.textContent = CONFIG.email;
    }
  });
})();

/* ================================================================ */
/* Terminal                                                          */
/* ================================================================ */
(function terminal() {
  const DB = {
    skills: [
      { skill: 'PySpark', area: 'Data engineering' },
      { skill: 'Azure Databricks', area: 'Data engineering' },
      { skill: 'SQL (T-SQL, PostgreSQL, MSSQL)', area: 'Data' },
      { skill: 'Python', area: 'Language' },
      { skill: 'Power BI', area: 'Analytics / BI' },
      { skill: 'Tableau', area: 'Analytics / BI' },
      { skill: 'XGBoost', area: 'AI / ML' },
      { skill: 'TensorFlow Lite', area: 'AI / ML' },
      { skill: 'Git', area: 'Tooling' },
    ],
    projects: [
      { name: 'PlantCare AI', summary: 'TensorFlow Lite crop disease diagnostic tool' },
      { name: 'Football Predictor', summary: 'SQLAlchemy/Postgres + Elo + XGBoost, Next.js frontend' },
      { name: 'Power BI Sales Dashboard', summary: 'Net sales, profit and city level rankings' },
      { name: 'Airbnb Market Price Analysis', summary: 'Tableau EDA across geolocation and pricing' },
      { name: 'COVID-19 Data Exploration', summary: 'T-SQL window functions, CTEs, vaccination rate view' },
    ],
    experience: [
      { role: 'Software Developer', company: 'Safaricom PLC', period: 'Contract', since: 2025 },
      { role: 'Software Developer', company: 'ONA Kenya', period: 'Mar - Sep 2023', since: 2023 },
      { role: 'Android Trainer (Volunteer)', company: 'Google & ACAT', period: 'Jan - Jun 2024', since: 2024 },
    ],
    education: [
      { degree: 'BSc Computer Science', institution: 'Moi University', period: '2021 - 2025', honours: 'Second Class Upper', since: 2021 },
    ],
  };
  const TABLES = Object.keys(DB);

  const out = $('#termOut');
  const body = $('#termBody');
  const input = $('#termInput');
  const history = []; let hIdx = 0;

  const scroll = () => { body.scrollTop = body.scrollHeight; };
  function print(parts, cls) {
    const line = document.createElement('div');
    line.className = 't-line';
    (Array.isArray(parts) ? parts : [[parts, cls]]).forEach(([text, c]) => {
      const s = document.createElement('span');
      if (c) s.className = c;
      s.textContent = text;
      line.appendChild(s);
    });
    out.appendChild(line);
    scroll();
  }
  function printTable(cols, rows) {
    const wrap = document.createElement('div');
    wrap.className = 't-table-wrap t-line';
    const table = document.createElement('table');
    table.className = 't-table';
    const thead = table.createTHead().insertRow();
    cols.forEach((c) => { const th = document.createElement('th'); th.textContent = c; thead.appendChild(th); });
    const tb = table.createTBody();
    rows.forEach((r) => {
      const tr = tb.insertRow();
      cols.forEach((c) => { tr.insertCell().textContent = r[c] ?? ''; });
    });
    wrap.appendChild(table);
    out.appendChild(wrap);
    scroll();
  }

  function sql(q) {
    const re = /^select\s+(.+?)\s+from\s+(\w+)(?:\s+where\s+(\w+)\s*(=|like)\s*'([^']*)')?(?:\s+order\s+by\s+(\w+)(?:\s+(asc|desc))?)?(?:\s+limit\s+(\d+))?\s*;?$/i;
    const m = q.match(re);
    if (!m) return print([['syntax error. ', 't-err'], ["try: select * from skills;", 't-dim']]);
    const [, colsRaw, table, wcol, wop, wval, ocol, odir, lim] = m;
    const tname = table.toLowerCase();
    if (!DB[tname]) return print([[`unknown table "${table}". `, 't-err'], [`available: ${TABLES.join(', ')}`, 't-dim']]);

    let rows = DB[tname].slice();
    const all = Object.keys(rows[0]);

    if (wcol) {
      const key = wcol.toLowerCase();
      if (!all.includes(key)) return print([[`unknown column "${wcol}". `, 't-err'], [`columns: ${all.join(', ')}`, 't-dim']]);
      const v = wval.toLowerCase();
      rows = rows.filter((r) => {
        const cell = String(r[key]).toLowerCase();
        return wop === '=' ? cell === v : cell.includes(v.replace(/%/g, ''));
      });
    }
    if (ocol) {
      const key = ocol.toLowerCase();
      if (!all.includes(key)) return print([[`unknown column "${ocol}".`, 't-err']]);
      const dir = (odir || 'asc').toLowerCase() === 'desc' ? -1 : 1;
      rows.sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * dir);
    }
    if (lim) rows = rows.slice(0, parseInt(lim, 10));

    if (/^count\(\*\)$/i.test(colsRaw.trim())) return printTable(['count'], [{ count: rows.length }]);

    let cols = all;
    if (colsRaw.trim() !== '*') {
      cols = colsRaw.split(',').map((c) => c.trim().toLowerCase());
      const bad = cols.find((c) => !all.includes(c));
      if (bad) return print([[`unknown column "${bad}". `, 't-err'], [`columns: ${all.join(', ')}`, 't-dim']]);
    }
    if (!rows.length) return print('0 rows returned.', 't-dim');
    printTable(cols, rows);
    print(`${rows.length} row${rows.length === 1 ? '' : 's'} returned`, 't-dim');
  }

  const SECTIONS = { work: 'work', projects: 'work', about: 'about', contact: 'contact', top: 'top', terminal: 'terminal' };
  const commands = {
    help() {
      print('Commands', 't-key');
      [
        ['help', 'show this list'],
        ['ls', 'list tables you can query'],
        ['whoami', 'a one-line intro'],
        ['contact', 'how to reach me'],
        ['goto <section>', 'work | about | contact'],
        ['theme', 'toggle light / dark'],
        ['clear', 'clear the screen'],
      ].forEach(([c, d]) => print([[c.padEnd(16), 't-prompt'], [d, 't-dim']]));
      print('');
      print('SQL', 't-key');
      print([['select * from skills;', 't-ok']]);
      print([["select name from projects where name like '%plant%';", 't-ok']]);
      print([['select * from experience order by since desc limit 1;', 't-ok']]);
    },
    ls() { print(TABLES.join('   '), 't-ok'); },
    whoami() { print('Maryann Wambui — Data Analyst, Data Engineer and BI Developer, Nairobi. Computer Science graduate (Moi University).'); },
    contact() {
      print([['email    ', 't-dim'], [CONFIG.email, 't-ok']]);
      print([['whatsapp ', 't-dim'], [CONFIG.phone, 't-ok']]);
      print([['linkedin ', 't-dim'], [CONFIG.linkedin, 't-ok']]);
      print([['github   ', 't-dim'], [CONFIG.github, 't-ok']]);
    },
    goto(arg) {
      const id = SECTIONS[(arg || '').toLowerCase()];
      if (!id) return print([['usage: goto work | about | contact', 't-dim']]);
      print(`scrolling to ${arg}…`, 't-dim');
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    },
    theme() { print(`theme → ${window.__toggleTheme()}`, 't-ok'); },
    clear() { out.innerHTML = ''; },
  };

  function run(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    print([['maryann@portfolio:~$ ', 't-prompt'], [cmd, '']]);
    history.push(cmd); hIdx = history.length;
    const [head, ...rest] = cmd.split(/\s+/);
    const name = head.toLowerCase().replace(/;$/, '');
    if (/^select\s/i.test(cmd)) return sql(cmd);
    if (commands[name]) return commands[name](rest.join(' '));
    print([[`command not found: ${name}. `, 't-err'], ['type help', 't-dim']]);
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { run(input.value); input.value = ''; }
    else if (e.key === 'ArrowUp') { if (history.length) { hIdx = Math.max(0, hIdx - 1); input.value = history[hIdx] || ''; e.preventDefault(); } }
    else if (e.key === 'ArrowDown') { if (history.length) { hIdx = Math.min(history.length, hIdx + 1); input.value = history[hIdx] || ''; e.preventDefault(); } }
    else if (e.key === 'Tab') {
      e.preventDefault();
      const v = input.value.toLowerCase();
      const hit = Object.keys(commands).find((c) => v && c.startsWith(v));
      if (hit) input.value = hit;
    } else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); commands.clear(); }
  });
  body.addEventListener('click', () => {
    if (!window.getSelection().toString()) input.focus({ preventScroll: true });
  });
  $$('#termChips [data-cmd]').forEach((b) => b.addEventListener('click', () => {
    run(b.dataset.cmd);
    input.focus({ preventScroll: true });
  }));

  // Boot message, typed once when the terminal scrolls into view
  let booted = false;
  new IntersectionObserver((entries, obs) => {
    if (!entries[0].isIntersecting || booted) return;
    booted = true; obs.disconnect();
    const lines = [
      [[['Welcome to Maryann’s portfolio terminal.', 't-ok']]],
      [[['Type ', 't-dim'], ['help', 't-key'], [' to see commands, or try ', 't-dim'], ['select * from skills;', 't-ok']]],
    ];
    lines.forEach((l, i) => setTimeout(() => print(l[0]), reduced ? 0 : 350 + i * 450));
  }, { threshold: 0.35 }).observe(body);
})();


/* ---- Scroll effects: marquee skew by velocity, rail card depth, code typing, pipeline ---- */
(() => {
  if (reduced) return;
  const track = document.getElementById('marqueeTrack');
  let last = scrollY, skew = 0;
  const tick = () => {
    const v = scrollY - last; last = scrollY;
    skew += (Math.max(-12, Math.min(12, v * 0.5)) - skew) * 0.12;
    if (track) track.style.transform = `skewX(${-skew}deg)`;
    const rail = document.getElementById('rail');
    if (rail) {
      const c = rail.getBoundingClientRect(); const mid = c.left + c.width / 2;
      rail.querySelectorAll('.work-card').forEach((card) => {
        const r = card.getBoundingClientRect();
        const d = Math.max(-1, Math.min(1, (r.left + r.width / 2 - mid) / c.width));
        card.style.setProperty('--ry', `${-d * 10}deg`);
        card.style.setProperty('--s', String(1 - Math.abs(d) * 0.06));
      });
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();



/* ---- Typewriter titles: types out heading HTML (text + one inline span) on reveal ---- */
(() => {
  const targets = $$('.type-title[data-reveal-type]');
  if (!targets.length) return;
  function typeHTML(el, speed) {
    const nodes = Array.from(el.childNodes);
    el.textContent = '';
    el.classList.add('caret');
    let i = 0;
    function typeText(text, target, done) {
      let j = 0;
      if (!text.length) return done();
      const step = () => {
        target.nodeType === 3 ? (target.textContent += text[j]) : (target.textContent += text[j]);
        j++;
        if (j < text.length) setTimeout(step, speed); else done();
      };
      step();
    }
    function next() {
      if (i >= nodes.length) { el.classList.remove('caret'); return; }
      const node = nodes[i];
      if (node.nodeType === 3) {
        const tn = document.createTextNode('');
        el.appendChild(tn);
        typeText(node.textContent, tn, () => { i++; next(); });
      } else if (node.tagName === 'BR') {
        el.appendChild(document.createElement('br'));
        i++; next();
      } else {
        const clone = node.cloneNode(false);
        el.appendChild(clone);
        typeText(node.textContent, clone, () => { i++; next(); });
      }
    }
    next();
  }
  if (reduced) return; // leave static text as-is when reduced motion is requested
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        o.unobserve(e.target);
        setTimeout(() => typeHTML(e.target, 26), 350);
      }
    });
  }, { threshold: 0.5 });
  targets.forEach((t) => obs.observe(t));
})();
