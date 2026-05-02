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

});
