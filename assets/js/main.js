/* ============================================================
   MAISON NOOR — Main JS
   GSAP 3 + ScrollTrigger via CDN
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────────────────
     1. GSAP REGISTRATION
  ────────────────────────────────────────────────────────── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ──────────────────────────────────────────────────────────
     2. CUSTOM CURSOR
  ────────────────────────────────────────────────────────── */
  const isMobile = () => window.innerWidth <= 768;
  const cursor = document.getElementById('cursor');

  if (cursor && !isMobile()) {
    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const interactiveSelectors = 'a, button, [role="button"], input, textarea, select, label, .product-card, .path-panel';

    document.querySelectorAll(interactiveSelectors).forEach(el => {
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
      const moveCursor = () => {
        curX += (mouseX - curX) * 0.15;
        curY += (mouseY - curY) * 0.15;
        cursor.style.transform = `translate(${curX - 6}px, ${curY - 6}px) translate(-50%, -50%)`;
        requestAnimationFrame(moveCursor);
      };
      moveCursor();
    }
  }

  /* ──────────────────────────────────────────────────────────
     3. NAVIGATION — scroll behavior + mobile drawer
  ────────────────────────────────────────────────────────── */
  const nav = document.getElementById('nav');

  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Highlight active nav link based on current page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  // Mobile drawer
  const toggle = document.getElementById('nav-toggle');
  const drawer = document.getElementById('nav-drawer');
  const backdrop = document.getElementById('nav-backdrop');
  const closeBtn = document.getElementById('drawer-close');

  const openDrawer = () => {
    drawer?.classList.add('open');
    backdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer?.classList.remove('open');
    backdrop?.classList.remove('open');
    document.body.style.overflow = '';
  };

  toggle?.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  /* ──────────────────────────────────────────────────────────
     4. PAGE TRANSITION
  ────────────────────────────────────────────────────────── */
  const overlay = document.getElementById('page-transition');

  // Fade in on page load
  if (overlay) {
    overlay.classList.add('active');
    setTimeout(() => overlay.classList.remove('active'), 50);
  }

  // Fade out on navigation
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('http')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      if (overlay) {
        overlay.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 280);
      } else {
        window.location.href = href;
      }
    });
  });

  /* ──────────────────────────────────────────────────────────
     5. SCROLL REVEAL (Intersection Observer fallback + GSAP)
  ────────────────────────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length > 0) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach(el => observer.observe(el));
  }

  /* ──────────────────────────────────────────────────────────
     6. HERO ANIMATION (GSAP timeline)
  ────────────────────────────────────────────────────────── */
  const heroLabel   = document.querySelector('.hero-label');
  const heroTitle   = document.querySelector('.hero-title');
  const heroSub     = document.querySelector('.hero-subtitle');
  const heroActions = document.querySelector('.hero-actions');

  if (heroLabel && typeof gsap !== 'undefined') {
    const tl = gsap.timeline({ delay: 0.1 });
    tl.to(heroLabel,   { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0)
      .to(heroTitle,   { opacity: 1, y: 0, duration: 1,   ease: 'power3.out' }, 0.2)
      .to(heroSub,     { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.45)
      .to(heroActions, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.6);
  } else if (heroLabel) {
    // CSS fallback
    [heroLabel, heroTitle, heroSub, heroActions].forEach((el, i) => {
      if (!el) return;
      setTimeout(() => {
        el.style.transition = 'opacity 0.8s, transform 0.8s';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, i * 200 + 100);
    });
  }

  /* ──────────────────────────────────────────────────────────
     7. TWO PATHS — hover interaction (JS enhancement)
  ────────────────────────────────────────────────────────── */
  const pathPanels = document.querySelectorAll('.path-panel');

  pathPanels.forEach(panel => {
    panel.addEventListener('mouseenter', () => {
      pathPanels.forEach(p => {
        if (p !== panel) p.style.flex = '0.65';
      });
      panel.style.flex = '1.35';
    });

    panel.addEventListener('mouseleave', () => {
      pathPanels.forEach(p => { p.style.flex = '1'; });
    });
  });

  /* ──────────────────────────────────────────────────────────
     8. STICKY RITUAL (Atelier page)
  ────────────────────────────────────────────────────────── */
  const ritualSteps = document.querySelectorAll('.ritual-step');
  const ritualImages = document.querySelectorAll('.ritual-image');

  if (ritualSteps.length > 0) {
    const activateStep = index => {
      ritualSteps.forEach((s, i) => s.classList.toggle('active', i === index));
      ritualImages.forEach((img, i) => img.classList.toggle('active', i === index));
    };

    activateStep(0); // Activate first step by default

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ritualSteps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 55%',
          end: 'bottom 45%',
          onEnter: () => activateStep(i),
          onEnterBack: () => activateStep(i),
        });
      });
    } else {
      // IntersectionObserver fallback
      const stepObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const index = Array.from(ritualSteps).indexOf(entry.target);
              if (index !== -1) activateStep(index);
            }
          });
        },
        { threshold: 0.5, rootMargin: '-10% 0px -10% 0px' }
      );
      ritualSteps.forEach(step => stepObserver.observe(step));
    }
  }

  /* ──────────────────────────────────────────────────────────
     9. PRODUCT 3D VIEWER (CSS transforms, drag-to-rotate)
  ────────────────────────────────────────────────────────── */
  const viewer = document.querySelector('.product-viewer');
  const scene  = document.querySelector('.product-3d-scene');

  if (viewer && scene) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let rotX = -12, rotY = 20;
    let lastX = rotX, lastY = rotY;
    let velX = 0, velY = 0;
    let animId;

    const applyRotation = (x, y) => {
      scene.style.transform = `perspective(800px) rotateX(${x}deg) rotateY(${y}deg)`;
    };

    applyRotation(rotX, rotY);

    const getPos = e => {
      if (e.touches) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      return { x: e.clientX, y: e.clientY };
    };

    const onStart = e => {
      isDragging = true;
      cancelAnimationFrame(animId);
      const pos = getPos(e);
      startX = pos.x;
      startY = pos.y;
      lastX = rotY;
      lastY = rotX;
    };

    const onMove = e => {
      if (!isDragging) return;
      const pos = getPos(e);
      const dx = pos.x - startX;
      const dy = pos.y - startY;
      velX = dx * 0.3 - (rotY - lastX);
      velY = dy * 0.3 - (rotX - lastY);
      rotY = lastX + dx * 0.3;
      rotX = Math.max(-30, Math.min(30, lastY + dy * 0.3));
      applyRotation(rotX, rotY);
    };

    const inertia = () => {
      velX *= 0.94;
      velY *= 0.94;
      rotY += velX;
      rotX = Math.max(-30, Math.min(30, rotX + velY));
      applyRotation(rotX, rotY);
      if (Math.abs(velX) > 0.05 || Math.abs(velY) > 0.05) {
        animId = requestAnimationFrame(inertia);
      }
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      animId = requestAnimationFrame(inertia);
    };

    viewer.addEventListener('mousedown', onStart);
    viewer.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
  }

  /* ──────────────────────────────────────────────────────────
     10. COLLECTION FILTERS
  ────────────────────────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const productCards = document.querySelectorAll('.product-card[data-tags]');

  if (filterBtns.length > 0) {
    const activeFilters = {};

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.filterKey;
        const val = btn.dataset.filter;

        // Toggle
        if (activeFilters[key] === val) {
          delete activeFilters[key];
          btn.classList.remove('active');
        } else {
          // Deactivate siblings
          document.querySelectorAll(`.filter-btn[data-filter-key="${key}"]`).forEach(b => b.classList.remove('active'));
          activeFilters[key] = val;
          btn.classList.add('active');
        }

        // Filter cards
        productCards.forEach(card => {
          const tags = card.dataset.tags || '';
          const match = Object.values(activeFilters).every(f => tags.includes(f));
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     11. MULTI-STEP FORM (Rendez-vous)
  ────────────────────────────────────────────────────────── */
  const formSteps = document.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  let currentStep = 0;

  const goToStep = index => {
    formSteps.forEach((s, i) => s.classList.toggle('active', i === index));
    progressSteps.forEach((s, i) => {
      s.classList.toggle('done', i < index);
      s.classList.toggle('active', i === index);
    });
    currentStep = index;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (formSteps.length > 0) {
    goToStep(0);

    document.querySelectorAll('[data-next-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep < formSteps.length - 1) goToStep(currentStep + 1);
      });
    });

    document.querySelectorAll('[data-prev-step]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep > 0) goToStep(currentStep - 1);
      });
    });
  }

  /* ──────────────────────────────────────────────────────────
     12. RADIO OPTIONS (custom styling)
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('.radio-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const name = opt.querySelector('input')?.name;
      if (name) {
        document.querySelectorAll(`.radio-option input[name="${name}"]`).forEach(inp => {
          inp.closest('.radio-option')?.classList.remove('selected');
        });
      }
      opt.classList.add('selected');
      const inp = opt.querySelector('input');
      if (inp) inp.checked = true;
    });
  });

  /* ──────────────────────────────────────────────────────────
     13. NEWSLETTER FORM
  ────────────────────────────────────────────────────────── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.newsletter-submit');
      const input = form.querySelector('.newsletter-input');
      if (btn && input && input.value) {
        btn.textContent = 'Merci';
        btn.style.background = '#A67C52';
        input.value = '';
        setTimeout(() => {
          btn.textContent = '→';
          btn.style.background = '';
        }, 3000);
      }
    });
  });

  /* ──────────────────────────────────────────────────────────
     14. CONTACT FORM
  ────────────────────────────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Message envoyé';
        btn.disabled = true;
        btn.style.opacity = '0.6';
      }
    });
  }

});
