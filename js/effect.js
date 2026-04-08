/**
 * effects.js
 * Cursor spotlight · Scroll-reveal observer · Section ambient glow
 * "Minimalism with Depth" — progressive, purposeful motion
 */

import { on, qs, qsa, rafThrottle } from "./utils.js";

/* ─────────────────────────────────────────────────────────────
   1. CUSTOM CURSOR (dot + lagging ring)
   Only on non-touch, non-mobile viewports
   ───────────────────────────────────────────────────────────── */
export const initCursor = () => {
  if (window.matchMedia("(hover: none)").matches) return () => {};

  const dot  = document.createElement("div");
  const ring = document.createElement("div");
  dot.className  = "cursor-dot";
  ring.className = "cursor-ring";
  document.body.append(dot, ring);

  let mx = -200, my = -200;
  let rx = -200, ry = -200;
  let raf;

  const lerp = (a, b, t) => a + (b - a) * t;

  const tick = () => {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    dot.style.translate  = `${mx}px ${my}px`;
    ring.style.translate = `${rx}px ${ry}px`;
    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);

  const onMove = (e) => { mx = e.clientX; my = e.clientY; };
  const onEnterHoverable = () => ring.classList.add("is-hovering");
  const onLeaveHoverable = () => ring.classList.remove("is-hovering");

  const hoverables = "a, button, [role='button'], .project-card, .skill-layer";

  const cleanupMove = on(document, "mousemove", onMove);

  // Delegate hoverable detection
  const cleanupOver = on(document, "mouseover", (e) => {
    if (e.target.closest(hoverables)) onEnterHoverable();
    else onLeaveHoverable();
  });

  return () => {
    cancelAnimationFrame(raf);
    cleanupMove();
    cleanupOver();
    dot.remove();
    ring.remove();
  };
};

/* ─────────────────────────────────────────────────────────────
   2. SCROLL REVEAL (IntersectionObserver)
   Observes [data-reveal] and [data-reveal-group]
   ───────────────────────────────────────────────────────────── */
export const initScrollReveal = () => {
  const revealEls = qsa("[data-reveal], [data-reveal-group], .section-heading");
  if (!revealEls.length) return () => {};

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target); // fire once
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  revealEls.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
};

/* ─────────────────────────────────────────────────────────────
   3. CARD PARALLAX TILT (mouse-tracking 3D tilt on glass cards)
   Subtle — max ±6deg, eased
   ───────────────────────────────────────────────────────────── */
export const initCardTilt = () => {
  if (window.matchMedia("(hover: none)").matches) return () => {};

  const cards = qsa(".project-card, .skills-panel");
  const cleanups = [];

  cards.forEach((card) => {
    let raf;

    const onEnter = () => card.style.transition = "transform 0ms";
    const onLeave = () => {
      card.style.transition = "";
      card.style.transform  = "";
      card.style.removeProperty("--glow-x");
      card.style.removeProperty("--glow-y");
      cancelAnimationFrame(raf);
    };

    const onMove = rafThrottle((e) => {
      const rect = card.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 → 0.5
      const cy = (e.clientY - rect.top)  / rect.height - 0.5;

      const rotX = (-cy * 8).toFixed(2);
      const rotY = ( cx * 8).toFixed(2);

      card.style.transform = `
        perspective(800px)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
        translateZ(4px)
      `;

      // Pass glow position to CSS for ::before spotlight
      card.style.setProperty("--glow-x", `${(cx + 0.5) * 100}%`);
      card.style.setProperty("--glow-y", `${(cy + 0.5) * 100}%`);
    });

    cleanups.push(on(card, "mouseenter", onEnter));
    cleanups.push(on(card, "mousemove",  onMove));
    cleanups.push(on(card, "mouseleave", onLeave));
  });

  return () => cleanups.forEach((c) => c());
};

/* ─────────────────────────────────────────────────────────────
   4. AMBIENT ACCENT — follows scroll position
   Moves the ::before radial glow up/down based on page scroll
   ───────────────────────────────────────────────────────────── */
export const initAmbientScroll = () => {
  const update = rafThrottle(() => {
    const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    // Map 0→1 scroll to -30vh→20vh top offset for the body::before glow
    const y = -30 + progress * 60;
    document.documentElement.style.setProperty("--ambient-y", `${y}vh`);
  });

  const cleanup = on(window, "scroll", update, { passive: true });
  update();

  return cleanup;
};