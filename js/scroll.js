import { qsa } from "./utils.js";

const ACTIVE_CLASS = "is-active";

export const createSectionObserver = (options = {}) => {
  const sections = qsa("[data-section]");

  if (!sections.length) {
    return {
      disconnect: () => {},
    };
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        if (!id) return;

        const link = document.querySelector(`.global-nav a[href="#${id}"]`);
        if (!link) return;

        if (entry.isIntersecting) {
          link.classList.add(ACTIVE_CLASS);
          entry.target.classList.add(ACTIVE_CLASS);
          return;
        }

        link.classList.remove(ACTIVE_CLASS);
        entry.target.classList.remove(ACTIVE_CLASS);
      });
    },
    {
      threshold: 0.35,
      rootMargin: "-10% 0px -35% 0px",
      ...options,
    },
  );

  sections.forEach((section) => observer.observe(section));

  return observer;
};
