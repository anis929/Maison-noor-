/* ============================================================
   MAISON NOOR — Main JS v2
   GSAP 3 + ScrollTrigger · Vagues bordeaux animées
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────
     1. GSAP
  ────────────────────────────────────────────────────────── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ──────────────────────────────────────────────────────────
     2. VAGUES ANIMÉES — injection SVG + animation GSAP
  ────────────────────────────────────────────────────────── */
  (function initWaves() {
    // 3 grappes × 3 chemins = 9 vagues sinusoïdales
    // Paths en viewBox 1440×900 — rappel des vagues du logo MN
    const wavePaths = [
      // Grappe haute (~25% viewport)
      { d: 'M0,205 C240,172 480,238 720,205 C960,172 1200,238 1440,205', cls: 'wave-path wave-a1' },
      { d: 'M0,245 C240,212 480,278 720,245 C960,212 1200,278 1440,245', cls: 'wave-path wave-a2' },
      { d: 'M0,285 C240,252 480,318 720,285 C960,252 1200,318 1440,285', cls: 'wave-path wave-a3' },
      // Grappe médiane (~52% viewport)
      { d: 'M0,455 C240,422 480,488 720,455 C960,422 1200,488 1440,455', cls: 'wave-path wave-b1' },
      { d: 'M0,492 C240,459 480,525 720,492 C960,459 1200,525 1440,492', cls: 'wave-path wave-b2' },
      { d: 'M0,529 C240,496 480,562 720,529 C960,496 1200,562 1440,529', cls: 'wave-path wave-b3' },
      // Grappe basse (~78% viewport)
      { d: 'M0,685 C240,652 480,718 720,685 C960,652 1200,718 1440,685', cls: 'wave-path wave-c1' },
      { d: 'M0,722 C240,689 480,755 720,722 C960,689 1200,755 1440,722', cls: 'wave-path wave-c2' },
      { d: 'M0,759 C240,726 480,792 720,759 C960,726 1200,792 1440,759', cls: 'wave-path wave-c3' },
    ];

    const ns   = 'http://www.w3.org/2000/svg';
    const wrap = document.createElement('div');
    wrap.id = 'wave-bg';
    wrap.setAttribute('aria-hidden', 'true');

    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 1440 900');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.setAttribute('xmlns', ns);

    wavePaths.forEach(({ d, cls }) => {
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', cls);
      svg.appendChild(path);
    });

    wrap.appendChild(svg);
    document.body.insertBefore(wrap, document.body.firstChild);

    // Animation GSAP si disponible
    if (typeof gsap !== 'undefined') {
      const paths = svg.querySelectorAll('.wave-path');

      // Chaque chemin flotte indépendamment
      paths.forEach((path, i) => {
        const amplitude = 14 + (i % 3) * 5;      // 14–24px
        const duration  = 9 + (i % 3) * 2.2 + (i * 0.7); // ~9–24s

        gsap.to(path, {
          y: -amplitude,
          duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.9,
        });
      });
    }
    // Sans GSAP : animation CSS déclarée dans style.css (fallback)
  })();

  /* ──────────────────────────────────────────────────────────
     3. CURSEUR CUSTOM
  ────────────────────────────────────────────────────────── */
  const isMobile = () => window.innerWidth <= 768;
  const cursor   = document.getElementById('cursor');

  if (cursor && !isMobile()) {
    let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

    const targets = 'a, button, [role="button"], input, textarea, select, label, .product-card, .path-panel';
    document.querySelectorAll(targets).forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

    if (typeof gsap !== 'undefined') {
      gsap.ticker.add(() => {
        curX += (mouseX - curX) * 0.15;
        curY += (mouseY - curY) * 0.15;
        gsap.set(cursor, { x: curX, y: curY });
      });
    } else {
      const tick = () => {
        curX += (mouseX - curX) * 0.15;
        curY += (mouseY - curY) * 0.15;
        cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%,-50%)`;
        requestAnimationFrame(tick);
      };
      tick();
    }
  }

  /* ──────────────────────────────────────────────────────────
     4. NAVIGATION — scroll + drawer mobile
  ────────────────────────────────────────────────────────── */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60), { passive: true });

    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
      if (a.getAttribute('href') === currentFile) a.classList.add('active');
    });
  }

  const toggle   = document.getElementById('nav-toggle');
  const drawer   = document.getElementById('nav-drawer');
  const backdrop = document.getElementById('nav-backdrop');
  const closeBtn = document.getElementById('drawer-close');

  const openDrawer  = () => { drawer?.classList.add('open'); backdrop?.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeDrawer = () => { drawer?.classList.remove('open'); backdrop?.classList.remove('open'); document.body.style.overflow = ''; };

  toggle?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  /* ──────────────────────────────────────────────────────────
     5. TRANSITION DE PAGE
  ────────────────────────────────────────────────────────── */
  const overlay = document.getElementById('page-transition');
  if (overlay) {
    overlay.classList.add('active');
    requestAnimationFrame(() => setTimeout(() => overlay.classList.remove('active'), 50));
  }

  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('http')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      if (overlay) { overlay.classList.add('active'); setTimeout(() => { window.location.href = href; }, 280); }
      else window.location.href = href;
    });
  });

  /* ──────────────────────────────────────────────────────────
     6. SCROLL REVEAL
  ────────────────────────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const revealObs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => revealObs.observe(el));
  }

  /* ──────────────────────────────────────────────────────────
     7. ANIMATION HERO (GSAP timeline)
  ────────────────────────────────────────────────────────── */
  const heroLabel   = document.querySelector('.hero-label');
  const heroTitle   = document.querySelector('.hero-title');
  const heroSub     = document.querySelector('.hero-subtitle');
  const heroActions = document.querySelector('.hero-actions');

  if (heroLabel && typeof gsap !== 'undefined') {
    gsap.timeline({ delay: 0.15 })
      .to(heroLabel,   { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0)
      .to(heroTitle,   { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }, 0.2)
      .to(heroSub,     { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.48)
      .to(heroActions, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.65);
  } else if (heroLabel) {
    [heroLabel, heroTitle, heroSub, heroActions].forEach((el, i) => {
      if (!el) return;
      setTimeout(() => { el.style.transition = 'opacity 0.9s, transform 0.9s'; el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, i * 200 + 150);
    });
  }

  /* ──────────────────────────────────────────────────────────
     8. TWO PATHS — hover JS
  ────────────────────────────────────────────────────────── */
  const pathPanels = document.querySelectorAll('.path-panel');
  pathPanels.forEach(panel => {
    panel.addEventListener('mouseenter', () => {
      pathPanels.forEach(p => { p.style.flex = p !== panel ? '0.65' : '1.35'; });
    });
    panel.addEventListener('mouseleave', () => {
      pathPanels.forEach(p => { p.style.flex = '1'; });
    });
  });

  /* ──────────────────────────────────────────────────────────
     9. RITUAL STICKY (Atelier)
  ────────────────────────────────────────────────────────── */
  const ritualSteps  = document.querySelectorAll('.ritual-step');
  const ritualImages = document.querySelectorAll('.ritual-image');

  if (ritualSteps.length > 0) {
    const activateStep = i => {
      ritualSteps.forEach((s, j) => s.classList.toggle('active', j === i));
      ritualImages.forEach((img, j) => img.classList.toggle('active', j === i));
    };
    activateStep(0);

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ritualSteps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 55%', end: 'bottom 45%',
          onEnter: () => activateStep(i),
          onEnterBack: () => activateStep(i),
        });
      });
    } else {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const i = Array.from(ritualSteps).indexOf(e.target);
            if (i !== -1) activateStep(i);
          }
        });
      }, { threshold: 0.5, rootMargin: '-10% 0px -10% 0px' });
      ritualSteps.forEach(s => obs.observe(s));
    }
  }

  /* ──────────────────────────────────────────────────────────
     10. VIEWER PRODUIT 3D (CSS drag-to-rotate)
  ────────────────────────────────────────────────────────── */
  const viewer = document.querySelector('.product-viewer');
  const scene  = document.querySelector('.product-3d-scene');

  if (viewer && scene) {
    let dragging = false, startX = 0, startY = 0;
    let rotX = -12, rotY = 20, lastX = 0, lastY = 0;
    let velX = 0, velY = 0, animId;

    const applyRot = (x, y) => { scene.style.transform = `perspective(800px) rotateX(${x}deg) rotateY(${y}deg)`; };
    applyRot(rotX, rotY);

    const pos = e => e.touches ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : { x: e.clientX, y: e.clientY };

    viewer.addEventListener('mousedown',  e => { dragging = true; cancelAnimationFrame(animId); const p = pos(e); startX = p.x; startY = p.y; lastX = rotY; lastY = rotX; });
    viewer.addEventListener('touchstart', e => { dragging = true; cancelAnimationFrame(animId); const p = pos(e); startX = p.x; startY = p.y; lastX = rotY; lastY = rotX; }, { passive: true });

    const onMove = e => {
      if (!dragging) return;
      const p = pos(e);
      rotY = lastX + (p.x - startX) * 0.3;
      rotX = Math.max(-30, Math.min(30, lastY + (p.y - startY) * 0.3));
      applyRot(rotX, rotY);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });

    const onEnd = () => {
      if (!dragging) return;
      dragging = false;
      const inertia = () => { velX *= 0.93; velY *= 0.93; rotY += velX; rotX = Math.max(-30, Math.min(30, rotX + velY)); applyRot(rotX, rotY); if (Math.abs(velX) > 0.04 || Math.abs(velY) > 0.04) animId = requestAnimationFrame(inertia); };
      requestAnimationFrame(inertia);
    };
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
  }

  /* ──────────────────────────────────────────────────────────
     11. FILTRES COLLECTION
  ────────────────────────────────────────────────────────── */
  const filterBtns  = document.querySelectorAll('.filter-btn[data-filter]');
  const productCards = document.querySelectorAll('.product-card[data-tags]');

  if (filterBtns.length > 0) {
    const active = {};
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.filterKey;
        const val = btn.dataset.filter;

        if (active[key] === val) {
          delete active[key];
          btn.classList.remove('active');
        } else {
          document.querySelectorAll(`.filter-btn[data-filter-key="${key}"]`).forEach(b => b.classList.remove('active'));
          active[key] = val;
          btn.classList.add('active');
        }

        productCards.forEach(card => {
          const tags = card.dataset.tags || '';
          card.style.display = Object.values(active).every(f => tags.includes(f)) ? '' : 'none';
        });
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     12. FORMULAIRE MULTI-ÉTAPES
  ────────────────────────────────────────────────────────── */
  const formSteps     = document.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  let currentStep     = 0;

  const goToStep = i => {
    formSteps.forEach((s, j) => s.classList.toggle('active', j === i));
    progressSteps.forEach((s, j) => { s.classList.toggle('done', j < i); s.classList.toggle('active', j === i); });
    currentStep = i;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (formSteps.length > 0) {
    goToStep(0);
    document.querySelectorAll('[data-next-step]').forEach(btn => btn.addEventListener('click', () => { if (currentStep < formSteps.length - 1) goToStep(currentStep + 1); }));
    document.querySelectorAll('[data-prev-step]').forEach(btn => btn.addEventListener('click', () => { if (currentStep > 0) goToStep(currentStep - 1); }));
  }

  /* ──────────────────────────────────────────────────────────
     13. RADIO OPTIONS
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('.radio-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const name = opt.querySelector('input')?.name;
      if (name) document.querySelectorAll(`.radio-option input[name="${name}"]`).forEach(inp => inp.closest('.radio-option')?.classList.remove('selected'));
      opt.classList.add('selected');
      const inp = opt.querySelector('input');
      if (inp) inp.checked = true;
    });
  });

  /* ──────────────────────────────────────────────────────────
     14. NEWSLETTER
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.newsletter-submit');
      const inp = form.querySelector('.newsletter-input');
      if (btn && inp?.value) {
        btn.textContent = 'Merci';
        btn.style.background = '#7C1F3B';
        inp.value = '';
        setTimeout(() => { btn.textContent = '→'; btn.style.background = ''; }, 3500);
      }
    });
  });

  /* ──────────────────────────────────────────────────────────
     15. SCRAMBLE TEXT — révélation Matrix sur les .mono-label
  ────────────────────────────────────────────────────────── */
  const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ·—◆▸◇△○';

  function scrambleText(el) {
    const original = el.textContent.trim();
    if (original.length > 40 || !original) return; // ignorer textes longs
    const frames = original.length * 3;
    let f = 0;
    const tick = () => {
      el.textContent = original.split('').map((ch, idx) => {
        if (ch === ' ') return ' ';
        if (idx < f / 3) return original[idx];
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }).join('');
      f++;
      if (f <= frames) requestAnimationFrame(tick);
      else el.textContent = original;
    };
    tick();
  }

  const scrambleObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => scrambleText(e.target), 150);
        scrambleObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.9 });
  document.querySelectorAll('.mono-label').forEach(el => scrambleObs.observe(el));

  /* ──────────────────────────────────────────────────────────
     16. SPLIT TEXT HERO — animation char par char (GSAP)
  ────────────────────────────────────────────────────────── */
  (function splitHeroTitle() {
    const title = document.querySelector('.hero-title');
    if (!title || typeof gsap === 'undefined') return;

    // Séparer par ligne (on conserve les <br>)
    const lines = title.innerHTML.split('<br>');
    title.innerHTML = lines.map(line =>
      line.trim().split('').map(ch => {
        if (ch === ' ') return '<span style="display:inline-block;width:0.28em">&nbsp;</span>';
        return `<span class="title-char" style="display:inline-block;will-change:transform">${ch}</span>`;
      }).join('')
    ).join('<br>');

    // Supprimer l'animation d'opacité du hero-title (on gère ici)
    title.style.opacity = '1';

    gsap.fromTo('.title-char',
      { opacity: 0, y: 55, rotateX: -90, transformOrigin: '50% 100%' },
      { opacity: 1, y: 0, rotateX: 0, duration: 0.75, stagger: 0.026, delay: 0.4, ease: 'power4.out' }
    );
  })();

  /* ──────────────────────────────────────────────────────────
     17. PARALLAX HERO — logo flottant + couches de profondeur
  ────────────────────────────────────────────────────────── */
  (function initParallaxHero() {
    const hero = document.getElementById('hero');
    if (!hero || isMobile() || typeof gsap === 'undefined') return;

    const logoLayer  = hero.querySelector('.hero-logo-layer');
    const heroBg     = hero.querySelector('.hero-bg');
    const heroLabel  = hero.querySelector('.hero-label');

    hero.addEventListener('mousemove', e => {
      const dx = (e.clientX - window.innerWidth  / 2) / window.innerWidth;
      const dy = (e.clientY - window.innerHeight / 2) / window.innerHeight;

      if (logoLayer) gsap.to(logoLayer, { x: dx * 48, y: dy * 32, duration: 2.0, ease: 'power2.out' });
      if (heroBg)    gsap.to(heroBg,    { x: dx * 12, y: dy *  8, duration: 2.4, ease: 'power2.out' });
      if (heroLabel) gsap.to(heroLabel, { x: dx * 16, y: dy * 10, duration: 1.6, ease: 'power2.out' });
    });

    hero.addEventListener('mouseleave', () => {
      [logoLayer, heroBg, heroLabel].forEach(el => {
        if (el) gsap.to(el, { x: 0, y: 0, duration: 1.8, ease: 'power2.out' });
      });
    });
  })();

  /* ──────────────────────────────────────────────────────────
     18. BOUTONS MAGNÉTIQUES — élasticité GSAP
  ────────────────────────────────────────────────────────── */
  if (!isMobile() && typeof gsap !== 'undefined') {
    document.querySelectorAll('.btn-filled, .btn-chrome, .btn-orange').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r  = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width  / 2);
        const dy = e.clientY - (r.top  + r.height / 2);
        gsap.to(btn, { x: dx * 0.22, y: dy * 0.18, duration: 0.3, ease: 'power2.out', overwrite: true });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)', overwrite: true });
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     19. SONS DE MATIÈRE — Web Audio API (aucun fichier audio)
         Son activé/désactivé via bouton #sound-toggle
  ────────────────────────────────────────────────────────── */
  (function initMaterialSound() {
    let audioCtx = null;
    let soundEnabled = false;
    const toggleBtn = document.getElementById('sound-toggle');
    if (!toggleBtn) return;

    function getCtx() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      return audioCtx;
    }

    // Texture corne : bruit blanc filtré basse fréquence
    function playHornTexture(vol = 0.06) {
      try {
        const ctx = getCtx();
        const len = ctx.sampleRate * 0.12;
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const d   = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 1.5);

        const src = ctx.createBufferSource();
        src.buffer = buf;

        const filt = ctx.createBiquadFilter();
        filt.type = 'lowpass';
        filt.frequency.value = 1200;
        filt.Q.value = 0.8;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

        src.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
        src.start();
      } catch (_) {}
    }

    // Clic nav : note douce
    function playChime(freq = 440, vol = 0.04) {
      try {
        const ctx = getCtx();
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(); osc.stop(ctx.currentTime + 0.55);
      } catch (_) {}
    }

    toggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      toggleBtn.textContent = soundEnabled ? '♪ Son actif' : '♪ Son off';
      toggleBtn.style.color = soundEnabled ? 'var(--chrome)' : 'rgba(234,224,210,0.3)';
      if (soundEnabled) playChime(528, 0.06);
    });

    // Attacher les sons aux éléments interactifs
    document.querySelectorAll('.product-card, .path-panel').forEach(el => {
      el.addEventListener('mouseenter', () => { if (soundEnabled) playHornTexture(); });
    });

    document.querySelectorAll('.nav-links a, .btn').forEach(el => {
      el.addEventListener('click', () => { if (soundEnabled) playChime(396 + Math.random() * 200, 0.03); });
    });
  })();

  /* ──────────────────────────────────────────────────────────
     20. COMPTEUR DE RARETÉ — stock en temps réel (simulé)
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('[data-stock]').forEach(el => {
    let stock = parseInt(el.dataset.stock, 10) || 3;
    const render = () => {
      el.textContent = stock <= 2 ? `Derniers ${stock} ex.` : `${stock} ex. disponibles`;
      el.style.color  = stock <= 2 ? 'var(--orange-brule)' : 'var(--chrome)';
    };
    render();

    // Décrémentation aléatoire pour simuler la demande
    const decrement = () => {
      if (stock > 1 && Math.random() < 0.35) {
        stock--;
        render();
        el.animate([{ opacity: 1 }, { opacity: 0.2 }, { opacity: 1 }], { duration: 600 });
      }
      const next = 60000 + Math.random() * 180000; // 1–4 min
      setTimeout(decrement, next);
    };
    setTimeout(decrement, 20000 + Math.random() * 60000);
  });

  /* ──────────────────────────────────────────────────────────
     21. SCROLL HORIZONTAL ÉDITORIAL (drag-to-scroll)
  ────────────────────────────────────────────────────────── */
  const editorialTrack = document.getElementById('editorial-track');
  if (editorialTrack) {
    let isDown = false, startX, scrollLeft;
    editorialTrack.addEventListener('mousedown', e => {
      isDown = true; editorialTrack.style.cursor = 'grabbing';
      startX = e.pageX - editorialTrack.offsetLeft;
      scrollLeft = editorialTrack.scrollLeft;
    });
    editorialTrack.addEventListener('mouseleave', () => { isDown = false; editorialTrack.style.cursor = 'grab'; });
    editorialTrack.addEventListener('mouseup',    () => { isDown = false; editorialTrack.style.cursor = 'grab'; });
    editorialTrack.addEventListener('mousemove',  e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - editorialTrack.offsetLeft;
      editorialTrack.scrollLeft = scrollLeft - (x - startX) * 1.4;
    });
  }

});

