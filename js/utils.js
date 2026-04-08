export const qs = (selector, scope = document) => scope.querySelector(selector);

export const qsa = (selector, scope = document) =>
  Array.from(scope.querySelectorAll(selector));

export const on = (target, eventName, handler, options) => {
  target.addEventListener(eventName, handler, options);
  return () => target.removeEventListener(eventName, handler, options);
};

export const rafThrottle = (callback) => {
  let ticking = false;

  return (...args) => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      callback(...args);
      ticking = false;
    });
  };
};

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const isMobileViewport = () =>
  window.matchMedia("(max-width: 768px)").matches;
