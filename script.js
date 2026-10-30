/* Sauvage — educational concept. All interactions, no dependencies. */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DIOR = 'https://www.dior.com';

/* ---- Data. Notes only where confident; others point to the official page. ---- */
const V = [
 { id:'edt', n:'Sauvage', c:'Eau de Toilette', tint:'#2a5cc4', img:'sauvage-edt.jpg', p:[90,75,30,50],
   d:'The original. A fresh, peppery opening over a woody, ambery trail.',
   long:'A fresh, spicy-woody signature built around citrus and pepper, with an ambery base.',
   notes:{top:['Calabrian bergamot','Pepper'],heart:['Sichuan pepper','Lavender','Pink pepper','Vetiver','Patchouli','Geranium','Elemi'],base:['Ambroxan','Cedar','Labdanum']},
   why:'You lean fresh and easy: an energetic, daytime-friendly profile.' },
 { id:'edp', n:'Sauvage', c:'Eau de Parfum', tint:'#18327a', img:'sauvage-edp.png', p:[60,65,65,65],
   d:'A smoother, warmer interpretation with more depth after dark.',
   long:'A warmer, rounder take on the Sauvage idea, suited to evenings and cooler weather.',
   notes:null, why:'You want a balance of fresh and warm, versatile from day into evening.' },
 { id:'parfum', n:'Sauvage', c:'Parfum (Extrait)', tint:'#1f2757', img:'sauvage-extrait.jpg', p:[45,55,80,80],
   d:'A richer, more intimate expression with a lingering, sensual feel.',
   long:'A richer, more intimate expression of the family, made for special moments.',
   notes:null, why:'You prefer something refined and rich, made for special occasions.' },
 { id:'elixir', n:'Sauvage', c:'Elixir', tint:'#3a2a1a', img:'sauvage-elixir.jpg', p:[30,85,85,95],
   d:'The most concentrated: spicy, woody and ambery, with real presence.',
   long:'The most concentrated of the four, with a spiced, woody and ambery character.',
   notes:{top:['Grapefruit','Cinnamon','Nutmeg','Cardamom'],heart:['Lavender'],base:['Licorice','Sandalwood','Amber','Patchouli','Haitian vetiver']},
   why:'You want bold, intense and memorable: a high-presence fragrance for nights out.' }
];
const byId = id => V.find(v => v.id === id);
let cur = 'edt', noteKey = 'top';

/* ---- Reveal on scroll ---- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
const watch = r => $$('.rv:not(.in),.card:not(.in)', r).forEach((e, i) => { e.style.transitionDelay = (i % 4) * .08 + 's'; io.observe(e); });

/* ---- Stars canvas ---- */
(() => {
  const cv = $('#stars'), g = cv.getContext('2d'); let w, h, S = [];
  const size = () => { w = cv.width = innerWidth; h = cv.height = innerHeight;
    S = Array.from({ length: Math.min(110, w / 10 | 0) }, () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.2 + .2, s: Math.random() * .15 + .02, t: Math.random() * 6 })); };
  const draw = t => { g.clearRect(0, 0, w, h);
    S.forEach(p => { p.y -= p.s; if (p.y < 0) p.y = h; g.globalAlpha = .35 + .35 * Math.sin(t / 900 + p.t);
      g.fillStyle = '#dbe6ff'; g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.3); g.fill(); });
    if (!RM) requestAnimationFrame(draw); };
  size(); addEventListener('resize', size); requestAnimationFrame(draw);
})();

/* ---- Nav: solid on scroll, mobile menu, active section ---- */
const nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
const setMenu = o => { menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); };
burger.onclick = () => setMenu(!menu.classList.contains('open'));
$$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
const links = $$('#menu a');
const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) {
  const m = { story: 'discover', product: 'fragrance', quiz: 'fragrance' }, id = m[e.target.id] || e.target.id;
  links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + id)); } }), { rootMargin: '-45% 0px -50% 0px' });
$$('main > section').forEach(s => so.observe(s));

/* ---- Parallax + nav state (one rAF-throttled scroll handler) ---- */
const px = $$('.px'); let tick = false;
const onScroll = () => { tick = false; nav.classList.toggle('solid', scrollY > 40);
  if (!RM) px.forEach(el => { const r = el.parentElement.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight) el.style.transform = `translate3d(0,${(r.top + r.height / 2 - innerHeight / 2) * parseFloat(el.dataset.sp)}px,0)`; }); };
addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(onScroll); } }, { passive: true }); onScroll();
$('#top').onclick = () => scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' });

/* ---- Variant selectors (shared state) ---- */
$$('[data-vsel]').forEach(box => V.forEach(v => {
  const b = document.createElement('button'); b.type = 'button'; b.dataset.v = v.id; b.textContent = v.c;
  b.onclick = () => setVariant(v.id); box.appendChild(b); }));

function renderNotes(anim) {
  const v = byId(cur), p = $('#npanel'), label = { top: 'Top notes', heart: 'Heart notes', base: 'Base notes' }[noteKey];
  $$('.ntabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.n === noteKey));
  p.style.setProperty('--x', { top: '20%', heart: '50%', base: '80%' }[noteKey]);
  const list = v.notes ? `<ul>${v.notes[noteKey].map((n, i) => `<li style="animation-delay:${i * .08}s">${n}</li>`).join('')}</ul>` :
    `<p style="margin:1.4rem 0;max-width:34rem">The full note pyramid for Sauvage ${v.c} is not listed here, to avoid inaccuracies. Please see the official Dior product page.</p>`;
  p.innerHTML = `<p class="eyebrow">${label} · Sauvage ${v.c}</p>${list}<p class="note">Compositions differ between concentrations.</p>`;
  if (anim) { p.classList.remove('sw'); void p.offsetWidth; p.classList.add('sw'); }
}
function renderProduct() {
  const v = byId(cur), fb = $('#pfb'), im = $('#pimg');
  fb.style.setProperty('--tint', v.tint);
  fb.innerHTML = `<span>${v.n}</span><span style="font-size:.8rem;margin-top:.8rem">${v.c}</span><small>Illustrative visual · official imagery on dior.com</small>`;
  im.hidden = !v.img; if (v.img) { im.src = v.img; im.alt = `Sauvage ${v.c} bottle`; im.onerror = () => { im.hidden = true; }; }
  $('#pconc').textContent = v.c; $('#pname').textContent = v.n; $('#pdesc').textContent = v.d;
  $('#pbars').innerHTML = ['Freshness', 'Spice', 'Warmth', 'Depth'].map((l, i) => `<div><span>${l}</span><i style="--v:0%"></i></div>`).join('');
  requestAnimationFrame(() => requestAnimationFrame(() => $$('#pbars i').forEach((e, i) => e.style.setProperty('--v', v.p[i] + '%'))));
}
function setVariant(id) {
  if (id === cur && $('#pname').textContent) return;
  const st = $('#pstage'); cur = id;
  $$('[data-vsel] button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === cur));
  renderNotes(true);
  if (RM) return renderProduct();
  st.classList.add('swap'); setTimeout(() => { renderProduct(); st.classList.remove('swap'); }, 280);
}
$$('.ntabs button').forEach(b => b.onclick = () => { noteKey = b.dataset.n; renderNotes(true); });
renderProduct(); renderNotes(false); $$('[data-vsel] button').forEach(b => b.setAttribute('aria-pressed', b.dataset.v === cur));

/* ---- Quiz ---- */
const Q = [
 { q: 'What fragrance character draws you in?', a: [['Fresh and crisp', 'edt'], ['Warm and smooth', 'edp'], ['Rich and refined', 'parfum'], ['Bold and spiced', 'elixir']] },
 { q: 'When will you wear it most?', a: [['Daytime, everyday', 'edt'], ['Evenings and dinners', 'edp'], ['Special occasions', 'parfum'], ['Nights out', 'elixir']] },
 { q: 'How intense should it feel?', a: [['Light and airy', 'edt'], ['Balanced', 'edp'], ['Rich and enveloping', 'parfum'], ['Maximum presence', 'elixir']] }
];
let step = 0, picks = [];
function renderQuiz() {
  const box = $('#qbox');
  if (step >= Q.length) {
    const sc = {}; picks.forEach((id, i) => sc[id] = (sc[id] || 0) + (i === 0 ? 1.5 : 1));
    const win = byId(Object.keys(sc).sort((a, b) => sc[b] - sc[a])[0]);
    box.innerHTML = `<div class="qres"><p class="eyebrow">Your direction</p><h3>Sauvage ${win.c}</h3><p>${win.why}</p><p class="note">A general suggestion based on three answers, not a guaranteed result. Scent is personal, so try before you buy.</p>
    <div class="btns"><button class="btn solid" id="qview" type="button">View this fragrance <em>→</em></button><button class="btn" id="qre" type="button">Start again</button></div></div>`;
    $('#qview').onclick = () => { setVariant(win.id); $('#product').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); };
    $('#qre').onclick = () => { step = 0; picks = []; renderQuiz(); };
    return;
  }
  const q = Q[step];
  box.innerHTML = `<div class="qprog">${Q.map((_, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div><p class="eyebrow">Question ${step + 1} of ${Q.length}</p><h3>${q.q}</h3>
  <div class="qopts">${q.a.map(([t, id]) => `<button type="button" data-id="${id}" aria-pressed="false">${t}</button>`).join('')}</div>`;
  $$('.qopts button', box).forEach(b => b.onclick = () => { b.setAttribute('aria-pressed', 'true'); picks.push(b.dataset.id); setTimeout(() => { step++; renderQuiz(); }, RM ? 0 : 380); });
}
renderQuiz();

/* ---- Collection + modal ---- */
const cards = $('#cards'), modal = $('#modal'), mbody = $('#mbody');
V.forEach(v => {
  const c = document.createElement('article'); c.className = 'card';
  c.innerHTML = `<div class="cv" style="--tint:${v.tint}">${v.img ? `<img src="${v.img}" alt="Sauvage ${v.c} bottle" loading="lazy">` : `<span>${v.n}<br><small style="font-size:.6rem">${v.c}</small></span>`}</div>
  <h3>${v.n}</h3><p class="eyebrow">${v.c}</p><p>${v.d}</p><button class="btn" type="button">Explore <em>→</em></button>`;
  const im = $('img', c); if (im) im.onerror = () => { im.parentElement.innerHTML = `<span>${v.n}<br><small style="font-size:.6rem">${v.c}</small></span>`; };
  $('button', c).onclick = () => openModal(v);
  cards.appendChild(c);
});
function openModal(v) {
  const n = v.notes ? ['top', 'heart', 'base'].map(k => `<p><strong>${k[0].toUpperCase() + k.slice(1)}:</strong> ${v.notes[k].join(', ')}</p>`).join('') : '<p>See the official Dior page for the full note list.</p>';
  mbody.innerHTML = `${v.img ? `<img src="${v.img}" alt="Sauvage ${v.c} bottle" style="width:100%;max-height:44vh;object-fit:cover;margin-bottom:1.2rem" onerror="this.remove()">` : ''}<p class="eyebrow">${v.c}</p><h3 id="mname">${v.n}</h3><p>${v.long}</p>${n}<p class="note">Sizes and availability: see the official Dior page. This is an independent educational concept.</p>
  <div class="btns"><a class="btn solid" href="${DIOR}" target="_blank" rel="noopener noreferrer">Official Dior site <em>↗</em></a><button class="btn" type="button" id="mshow">Show in profile</button><button class="btn" type="button" id="mclose">Close</button></div>`;
  $('#mclose').onclick = () => modal.close();
  $('#mshow').onclick = () => { modal.close(); setVariant(v.id); $('#product').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' }); };
  modal.showModal();
}
modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });

watch(document);
})();
