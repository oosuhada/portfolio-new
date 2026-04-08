import { clamp, on, qsa } from "./utils.js";

const HOVER_SELECTOR =
  "a, button, [role='button'], input, textarea, select, .project-card, .skill-layer, .global-nav a, .contact-links a";

export const initCursor = () => {
  if (window.matchMedia("(pointer: coarse)").matches) {
    return () => {};
  }

  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  dot.setAttribute("aria-hidden", "true");

  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  ring.setAttribute("aria-hidden", "true");

  document.body.append(dot, ring);

  let targetX = 0;
  let targetY = 0;
  let ringX = 0;
  let ringY = 0;
  let rafId = 0;

  const syncDot = (clientX, clientY) => {
    dot.style.left = `${clientX}px`;
    dot.style.top = `${clientY}px`;
  };

  const tick = () => {
    ringX += (targetX - ringX) * 0.18;
    ringY += (targetY - ringY) * 0.18;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    rafId = requestAnimationFrame(tick);
  };

  const onMove = (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    syncDot(targetX, targetY);
  };

  const setHover = (event) => {
    const el = event.target;
    if (!(el instanceof Element)) return;
    const match = el.closest(HOVER_SELECTOR);
    ring.classList.toggle("is-hovering", Boolean(match));
  };

  ringX = window.innerWidth / 2;
  ringY = window.innerHeight / 2;
  targetX = ringX;
  targetY = ringY;
  syncDot(targetX, targetY);
  ring.style.left = `${ringX}px`;
  ring.style.top = `${ringY}px`;

  rafId = requestAnimationFrame(tick);

  const cleanupMove = on(window, "pointermove", onMove, { passive: true });
  const cleanupOver = on(document, "pointerover", setHover, true);
  const cleanupOut = on(document, "pointerout", setHover, true);

  return () => {
    cancelAnimationFrame(rafId);
    cleanupMove();
    cleanupOver();
    cleanupOut();
    dot.remove();
    ring.remove();
  };
};

export const initScrollReveal = () => {
  const singles = qsa("[data-reveal]");
  const groups = qsa("[data-reveal-group]");

  if (!singles.length && !groups.length) {
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );

  singles.forEach((el) => observer.observe(el));
  groups.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
};

export const initCardTilt = () => {
  const cards = qsa(".project-card");
  if (!cards.length) return () => {};

  const cleanups = [];

  cards.forEach((card) => {
    const onMove = (event) => {
      if (card.classList.contains("is-expanded")) return;

      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rx = clamp((py - 0.5) * -10, -6, 6);
      const ry = clamp((px - 0.5) * 10, -6, 6);

      card.style.setProperty("--tilt-x", `${rx}deg`);
      card.style.setProperty("--tilt-y", `${ry}deg`);
    };

    const reset = () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    };

    cleanups.push(on(card, "pointermove", onMove));
    cleanups.push(on(card, "pointerleave", reset));
    cleanups.push(on(card, "pointerdown", reset));
  });

  return () => cleanups.forEach((fn) => fn());
};

export const initAmbientScroll = () => {
  const root = document.documentElement;

  const update = () => {
    const max = root.scrollHeight - window.innerHeight;
    const progress = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    root.style.setProperty("--scroll-progress", progress.toFixed(4));
  };

  update();
  const cleanupScroll = on(window, "scroll", update, { passive: true });
  const cleanupResize = on(window, "resize", update);

  return () => {
    cleanupScroll();
    cleanupResize();
  };
};
