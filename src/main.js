import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin);

// ── Utility ────────────────────────────────────────────────────────────────

const select  = (sel, ctx = document) => ctx.querySelector(sel);
const selectAll = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ── Nav scroll state ────────────────────────────────────────────────────────

const nav = select("#nav");
ScrollTrigger.create({
  start: "top -80",
  onUpdate: (self) => {
    nav.classList.toggle("scrolled", self.scroll() > 80);
  },
});

// ── Hero entrance ───────────────────────────────────────────────────────────

const heroTl = gsap.timeline({ defaults: { ease: "expo.out" } });

// Orbs fade in
heroTl.to(".hero__orb", {
  opacity: 1,
  duration: 2,
  stagger: 0.3,
}, 0);

// Eyebrow
heroTl.to(".hero__eyebrow", {
  opacity: 1,
  y: 0,
  duration: 1,
}, 0.4);

// Title lines — each word slides up from a clip mask
selectAll(".hero__line").forEach((line) => {
  const inner = document.createElement("div");
  inner.className = "hero__line-inner";
  inner.textContent = line.textContent;
  inner.style.cssText = "display:block;transform:translateY(110%);";
  line.textContent = "";
  line.appendChild(inner);
});

heroTl.to(".hero__line-inner", {
  y: "0%",
  duration: 1.1,
  stagger: 0.12,
  ease: "expo.out",
}, 0.5);

// Subtitle & actions
heroTl.to([".hero__subtitle", ".hero__actions"], {
  opacity: 1,
  y: 0,
  duration: 0.9,
  stagger: 0.15,
}, 1.0);

// Scroll hint
heroTl.to(".hero__scroll-hint", {
  opacity: 1,
  duration: 0.6,
}, 1.5);

heroTl.to(".hero__scroll-line", {
  scaleX: 1,
  duration: 0.8,
  ease: "expo.out",
}, 1.7);

// ── Floating orb parallax ───────────────────────────────────────────────────

gsap.to(".hero__orb--1", {
  y: -80,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 1.5,
  },
});

gsap.to(".hero__orb--2", {
  y: 60,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 2,
  },
});

gsap.to(".hero__orb--3", {
  y: -40,
  x: 30,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 1,
  },
});

// ── Stats counter ───────────────────────────────────────────────────────────

selectAll(".stat__number").forEach((el) => {
  const target = +el.dataset.target;
  ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    once: true,
    onEnter: () => {
      gsap.to({ val: 0 }, {
        val: target,
        duration: 2,
        ease: "power2.out",
        onUpdate() {
          el.textContent = Math.round(this.targets()[0].val).toLocaleString();
        },
      });
    },
  });
});

// ── Section headers reveal ──────────────────────────────────────────────────

selectAll(".section-header").forEach((header) => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: header,
      start: "top 80%",
      once: true,
    },
  });

  tl.from(select(".section-tag", header), {
    opacity: 0, y: 20, duration: 0.6,
  })
  .from(select(".section-title", header), {
    opacity: 0, y: 30, duration: 0.8, ease: "expo.out",
  }, "-=0.3")
  .from(select(".section-body", header), {
    opacity: 0, y: 20, duration: 0.6,
  }, "-=0.4");
});

// ── Skill cards stagger ─────────────────────────────────────────────────────

gsap.to(".skill-card", {
  opacity: 1,
  y: 0,
  duration: 0.8,
  stagger: 0.1,
  ease: "expo.out",
  scrollTrigger: {
    trigger: ".skills__grid",
    start: "top 78%",
    once: true,
  },
});

// Card icon spin on hover
selectAll(".skill-card").forEach((card) => {
  const icon = select(".skill-card__icon", card);

  card.addEventListener("mouseenter", () => {
    gsap.to(icon, { rotation: 20, scale: 1.2, duration: 0.4, ease: "back.out(2)" });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(icon, { rotation: 0, scale: 1, duration: 0.4, ease: "back.out(1.5)" });
  });
});

// ── Marketplace listings reveal ─────────────────────────────────────────────

selectAll(".listing").forEach((listing, i) => {
  gsap.to(listing, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: "expo.out",
    scrollTrigger: {
      trigger: listing,
      start: "top 82%",
      once: true,
    },
    delay: i * 0.12,
  });
});

// ── Infinite marquee ────────────────────────────────────────────────────────

const track = select(".marquee__track");

// Clone for seamless loop
const clone = track.cloneNode(true);
track.parentElement.appendChild(clone);

const totalWidth = track.scrollWidth;

gsap.to([track, clone], {
  x: -totalWidth,
  duration: 28,
  ease: "none",
  repeat: -1,
  modifiers: {
    x(x) {
      return (parseFloat(x) % totalWidth) + "px";
    },
  },
});

// ── CTA block reveal ────────────────────────────────────────────────────────

gsap.to(".cta__inner", {
  opacity: 1,
  y: 0,
  duration: 1,
  ease: "expo.out",
  scrollTrigger: {
    trigger: ".cta",
    start: "top 75%",
    once: true,
  },
});

// ── Generic [data-reveal] elements ─────────────────────────────────────────

selectAll("[data-reveal]").forEach((el) => {
  gsap.from(el, {
    opacity: 0,
    y: 40,
    duration: 1,
    ease: "expo.out",
    scrollTrigger: {
      trigger: el,
      start: "top 82%",
      once: true,
    },
  });
});

// ── Cursor glow (desktop only) ──────────────────────────────────────────────

if (window.matchMedia("(pointer: fine)").matches) {
  const glow = document.createElement("div");
  glow.style.cssText = `
    position: fixed; top: 0; left: 0; width: 320px; height: 320px;
    border-radius: 50%; pointer-events: none; z-index: 0;
    background: radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
  `;
  document.body.appendChild(glow);

  window.addEventListener("mousemove", (e) => {
    gsap.to(glow, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.6,
      ease: "power2.out",
    });
  });
}
