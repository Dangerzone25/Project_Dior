/* SAUVAGE independent educational concept.
   No backend, framework, API key, or paid service is needed. */
(() => {
  'use strict';

  const variants = {
    edt: {
      title: 'EAU DE TOILETTE',
      name: 'Sauvage Eau de Toilette',
      description: 'A striking burst of citrus, peppery brightness, and an ambery-woody trail. The freshest, most open-air expression of Sauvage.',
      character: 'Calabrian bergamot and Sichuan pepper over ambroxan, elemi, and woods. A vibrant, aromatic signature.',
      profile: 'Fresh · Citrus · Woody',
      notes: 'Bergamot / Sichuan pepper / Ambroxan',
      sizes: [30, 60, 100, 200],
      intensity: 2,
      image: 'https://www.sephora.com.mx/on/demandware.static/-/Sites-masterCatalog_Sephora/es_MX/dwdefc1b76/images/hi-res/eau-de-toilette-dior-dior-sauvage-eau-de-toilette-100ml3348901250146A.jpg',
      official: 'https://www.dior.com/en_int/beauty/products/sauvage-eau-de-toilette-Y0685240.html'
    },
    edp: {
      title: 'EAU DE PARFUM',
      name: 'Sauvage Eau de Parfum',
      description: 'Fresh Calabrian bergamot meets warm vanilla and subtle smoky facets. An evocative interpretation of the desert at twilight.',
      character: 'Juicy, spicy Calabrian bergamot and a smooth Papua New Guinean vanilla extract accord create a warmer, sensual interpretation.',
      profile: 'Citrus · Vanilla · Warm',
      notes: 'Bergamot / Vanilla extract',
      sizes: [30, 60, 100, 200],
      intensity: 3,
      image: 'https://buybeautique.com/cdn/shop/files/s2038131-main-zoom.webp?v=1695292626',
      official: 'https://www.dior.com/en_int/beauty/products/sauvage-eau-de-parfum-Y0785220.html'
    },
    parfum: {
      title: 'PARFUM',
      name: 'Sauvage Parfum',
      description: 'A richly textured fragrance where mandarin meets creamy sandalwood and tonka bean. Freshness reimagined in deeper, warmer tones.',
      character: 'Calabrian mandarin is joined by tonka bean, Sri Lankan sandalwood and cedar, creating a smooth, embracing woody trail.',
      profile: 'Mandarin · Tonka · Woods',
      notes: 'Mandarin / Tonka bean / Sandalwood',
      sizes: [30, 60, 100, 200],
      intensity: 3,
      image: 'https://www.atticadps.gr/files/products/3348901486385/01.jpg',
      official: 'https://www.dior.com/en_int/beauty/products/sauvage-parfum-Y0998004.html'
    },
    elixir: {
      title: 'ELIXIR',
      name: 'Sauvage Elixir',
      description: 'An exceptionally concentrated composition of bright grapefruit, warm spices, expressive lavender, and sumptuous woods.',
      character: 'A grapefruit-and-spice opening of cinnamon, nutmeg and cardamom meets lavender from Nyons, then rich woods, vetiver and smooth licorice nuances.',
      profile: 'Spicy · Lavender · Woody',
      notes: 'Grapefruit / Spices / Lavender / Woods',
      sizes: [60, 100, 150],
      intensity: 4,
      image: 'https://www.sephora.com/productimages/sku/s2890119-main-zoom.jpg',
      official: 'https://www.dior.com/en_int/beauty/products/sauvage-elixir-Y0996460.html'
    }
  };

  const el = (id) => document.getElementById(id);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeVariant = 'edp';
  let lastModalTrigger = null;

  function loadBottle(container, variantId) {
    if (!container || !variants[variantId]) return;
    const data = variants[variantId];
    const img = container.querySelector('.product-photo');
    const caption = container.querySelector('.bottle-concentration');
    container.dataset.bottle = variantId;
    container.setAttribute('aria-label', `${data.name} bottle; stylized illustration if photo is unavailable`);
    if (caption) caption.textContent = data.title;
    if (!img) return;
    container.classList.remove('has-product-photo');
    img.alt = `Photograph of Dior ${data.name} bottle`;
    const requestedUrl = data.image;
    img.onload = () => {
      if (img.getAttribute('src') === requestedUrl && img.naturalWidth > 0) {
        container.classList.add('has-product-photo');
      }
    };
    img.onerror = () => container.classList.remove('has-product-photo');
    img.src = requestedUrl;
    if (img.complete && img.naturalWidth > 0) img.onload();
  }

  // Use authentic product photographs when accessible; the CSS bottle renders offline.
  document.querySelectorAll('.bottle-visual[data-bottle]').forEach((bottle) => {
    loadBottle(bottle, bottle.dataset.bottle);
  });

  // Main navigation, accessible mobile menu, and scroll progress.
  const header = el('site-header');
  const menuToggle = el('menu-toggle');
  const mobileMenu = el('mobile-menu');
  const progressBar = el('page-progress-bar');
  const trackedNav = [...document.querySelectorAll('.desktop-nav .nav-link')];
  let scrollTicking = false;

  function closeMenu() {
    header.classList.remove('menu-open');
    mobileMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }
  menuToggle.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    header.classList.toggle('menu-open', open);
    mobileMenu.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  mobileMenu.querySelectorAll('a').forEach((anchor) => anchor.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (!header.contains(event.target) && !mobileMenu.hidden) closeMenu();
  });

  function updateScrollState() {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 28);
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progressBar.style.width = `${Math.min(100, y / maxScroll * 100)}%`;
    const observedIds = ['discover', 'fragrance', 'collection', 'details'];
    let active = 'discover';
    const sectionBounds = observedIds.map((id) => ({
      id, y: el(id).getBoundingClientRect().top
    }));
    for (const entry of sectionBounds) {
      if (entry.y < window.innerHeight * .51) active = entry.id;
    }
    trackedNav.forEach((link) => {
      const selected = link.dataset.nav === active;
      link.classList.toggle('is-active', selected);
      if (selected) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (!prefersReducedMotion.matches) {
      const hero = document.querySelector('.hero-backdrop');
      if (y < window.innerHeight * 1.4) hero.style.transform = `translate3d(0,${(y * .12).toFixed(1)}px,0)`;
    }
    scrollTicking = false;
  }
  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(updateScrollState);
  }, { passive: true });
  window.addEventListener('resize', updateScrollState, { passive: true });
  updateScrollState();

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: '0px 0px -20px 0px' });
    revealElements.forEach((item) => revealObserver.observe(item));
  } else {
    revealElements.forEach((item) => item.classList.add('in-view'));
  }

  // Notes are deliberately tied to Elixir only. This is not a universal Sauvage pyramid.
  const noteInfo = {
    top: {
      stage: 'THE OPENING', name: 'GRAPEFRUIT & SPICES', monogram: 'CITRUS', index: '01 / 03',
      description: 'A vibrant grapefruit accord meets the warmth of cinnamon and nutmeg, with an aromatic lift of cardamom.'
    },
    heart: {
      stage: 'THE HEART', name: 'NYONS LAVENDER', monogram: 'FLORAL', index: '02 / 03',
      description: 'Dior describes a specially selected AOP lavender essence from Nyons: floral, fresh, and layered with softly vanillic nuances.'
    },
    base: {
      stage: 'THE LASTING TRAIL', name: 'AMBER & RICH WOODS', monogram: 'WOODS', index: '03 / 03',
      description: 'An enveloping woody-amber accord is enriched by smooth licorice nuances, Haitian vetiver, and patchouli.'
    }
  };
  const noteButtons = [...document.querySelectorAll('.note-tab')];
  function selectNote(id, focus = false) {
    const data = noteInfo[id];
    if (!data) return;
    noteButtons.forEach((button) => {
      const selected = button.dataset.note === id;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (focus && selected) button.focus();
    });
    el('note-panel').setAttribute('aria-labelledby', `tab-${id}`);
    el('note-art').dataset.noteArt = id;
    el('note-art-monogram').textContent = data.monogram;
    document.querySelector('.note-art-index').textContent = data.index;
    el('note-stage').textContent = data.stage;
    el('note-name').textContent = data.name;
    el('note-description').textContent = data.description;
  }
  noteButtons.forEach((button, index) => {
    button.addEventListener('click', () => selectNote(button.dataset.note));
    button.addEventListener('keydown', (event) => {
      const direction = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 :
        event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
      if (!direction && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      let nextIndex = direction ? (index + direction + noteButtons.length) % noteButtons.length :
        event.key === 'Home' ? 0 : noteButtons.length - 1;
      selectNote(noteButtons[nextIndex].dataset.note, true);
    });
  });

  // Product switcher. Data and image always change together.
  const variantButtons = [...document.querySelectorAll('.variant-tab')];
  const experienceDisplay = el('experience-display');
  function chooseVariant(id, { focus = false, scroll = false } = {}) {
    const product = variants[id];
    if (!product) return;
    activeVariant = id;
    variantButtons.forEach((button) => {
      const selected = button.dataset.variant === id;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (focus && selected) button.focus();
    });
    el('product-title').innerHTML = `SAUVAGE<br><em>${product.title}</em>`;
    el('product-description').textContent = product.description;
    el('product-profile').textContent = product.profile;
    el('product-notes').textContent = product.notes;
    el('product-sizes').textContent = product.sizes.join(' / ') + ' mL';
    el('official-product-link').href = product.official;
    el('intensity-text').textContent = `${product.intensity} / 4`;
    const bars = [...el('intensity-bars').children];
    bars.forEach((bar, index) => bar.classList.toggle('filled', index < product.intensity));
    el('intensity-bars').setAttribute('aria-label', `Illustrative intensity ${product.intensity} out of 4`);
    loadBottle(el('experience-bottle'), id);
    experienceDisplay.classList.remove('is-changing');
    void experienceDisplay.offsetWidth; // Restart the brief product reveal on selection.
    experienceDisplay.classList.add('is-changing');
    if (scroll) el('experience').scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
  }
  variantButtons.forEach((button, index) => {
    button.addEventListener('click', () => chooseVariant(button.dataset.variant));
    button.addEventListener('keydown', (event) => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % variantButtons.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + variantButtons.length) % variantButtons.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = variantButtons.length - 1;
      else return;
      event.preventDefault();
      chooseVariant(variantButtons[nextIndex].dataset.variant, { focus: true });
    });
  });
  chooseVariant('edp');

  // Native accessible product modal used by selector, gallery and quiz.
  const modal = el('product-modal');
  const modalClose = el('modal-close');
  function openProduct(id, trigger = null) {
    const product = variants[id];
    if (!product) return;
    lastModalTrigger = trigger || document.activeElement;
    el('modal-title').textContent = product.title;
    el('modal-description').textContent = product.description;
    el('modal-character').textContent = product.character;
    el('modal-sizes').textContent = product.sizes.join(' / ') + ' mL';
    el('modal-official').href = product.official;
    loadBottle(el('modal-bottle'), id);
    if (!modal.open) {
      modal.showModal();
      document.body.classList.add('modal-open');
    }
    modalClose.focus();
  }
  function closeModal() { if (modal.open) modal.close(); }
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  modal.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    if (lastModalTrigger && typeof lastModalTrigger.focus === 'function') lastModalTrigger.focus();
  });
  el('view-product-detail').addEventListener('click', (event) => openProduct(activeVariant, event.currentTarget));
  document.querySelectorAll('[data-open-product]').forEach((button) => {
    button.addEventListener('click', () => openProduct(button.dataset.openProduct, button));
  });

  // Quiz: three independent questions; transparent, non-clinical heuristic scoring.
  const questions = [
    { title: 'What kind of scent draws you in?', options: [
      { label: 'Fresh and invigorating', value: 'edt' },
      { label: 'Smooth and inviting', value: 'edp' },
      { label: 'Warm and refined', value: 'parfum' },
      { label: 'Spicy and commanding', value: 'elixir' }
    ] },
    { title: 'Where would you most often wear it?', options: [
      { label: 'Daytime and casual adventures', value: 'edt' },
      { label: 'Work, dinners, and everyday life', value: 'edp' },
      { label: 'Intimate evenings and special plans', value: 'parfum' },
      { label: 'Statement-making occasions', value: 'elixir' }
    ] },
    { title: 'How present should your scent feel?', options: [
      { label: 'Light and airy', value: 'edt' },
      { label: 'Balanced and noticeable', value: 'edp' },
      { label: 'Rich and enveloping', value: 'parfum' },
      { label: 'Bold and concentrated', value: 'elixir' }
    ] }
  ];
  let step = 0;
  let picks = [null, null, null];
  let quizWinner = null;
  function renderQuestion() {
    el('quiz-question-area').hidden = false;
    el('quiz-controls').hidden = false;
    el('quiz-result').hidden = true;
    el('quiz-count').textContent = `0${step + 1} / 03`;
    el('quiz-progress-fill').style.width = `${(step + 1) / questions.length * 100}%`;
    el('quiz-question').textContent = questions[step].title;
    el('quiz-validation').textContent = '';
    el('quiz-back').disabled = step === 0;
    el('quiz-next').innerHTML = step === questions.length - 1 ? 'REVEAL MY SCENT <span aria-hidden="true">→</span>' : 'NEXT QUESTION <span aria-hidden="true">→</span>';
    const options = el('quiz-options');
    options.replaceChildren();
    questions[step].options.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'quiz-option';
      button.textContent = option.label;
      button.setAttribute('aria-pressed', String(picks[step] === option.value));
      button.classList.toggle('is-selected', picks[step] === option.value);
      button.addEventListener('click', () => {
        picks[step] = option.value;
        options.querySelectorAll('.quiz-option').forEach((candidate) => {
          const selected = candidate === button;
          candidate.classList.toggle('is-selected', selected);
          candidate.setAttribute('aria-pressed', String(selected));
        });
        el('quiz-validation').textContent = '';
      });
      options.append(button);
    });
    const questionEyebrow = el('quiz-question-area').querySelector('.eyebrow');
    questionEyebrow.textContent = `QUESTION 0${step + 1}`;
  }
  const quizReasons = {
    edt: 'Your answers lean toward an easygoing, fresh profile. The citrus, pepper, and woody character of Eau de Toilette could be a natural starting point.',
    edp: 'You appear to prefer versatility with a touch of warmth. Eau de Parfum balances bright bergamot with a smooth, softly smoky vanilla accord.',
    parfum: 'Your choices suggest an appreciation for softer depth and polished warmth. Parfum pairs mandarin with creamy sandalwood and tonka bean.',
    elixir: 'Your choices favor a bolder character. Elixir combines grapefruit, aromatic spice, lavender, and rich woods for a more concentrated expression.'
  };
  function showResult() {
    const scores = { edt: 0, edp: 0, parfum: 0, elixir: 0 };
    picks.forEach((id, index) => { scores[id] += index === 2 ? 2 : 1; });
    const maxScore = Math.max(...Object.values(scores));
    quizWinner = picks.slice().reverse().find((id) => scores[id] === maxScore) || 'edp';
    el('quiz-result-name').textContent = variants[quizWinner].name.toUpperCase();
    el('quiz-result-reason').textContent = quizReasons[quizWinner];
    el('quiz-question-area').hidden = true;
    el('quiz-controls').hidden = true;
    el('quiz-result').hidden = false;
    el('quiz-count').textContent = 'YOUR MATCH';
    el('quiz-progress-fill').style.width = '100%';
    el('quiz-explore').focus();
  }
  el('quiz-back').addEventListener('click', () => { if (step > 0) { step--; renderQuestion(); } });
  el('quiz-next').addEventListener('click', () => {
    if (!picks[step]) { el('quiz-validation').textContent = 'Select an answer to continue.'; return; }
    if (step < questions.length - 1) { step++; renderQuestion(); }
    else showResult();
  });
  el('quiz-restart').addEventListener('click', () => {
    step = 0; picks = [null, null, null]; quizWinner = null; renderQuestion();
    el('quiz-question').focus?.();
  });
  el('quiz-explore').addEventListener('click', () => {
    if (quizWinner) chooseVariant(quizWinner, { scroll: true });
  });
  renderQuestion();

  // A back-to-top button with reduced-motion behavior.
  el('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
  });
})();
