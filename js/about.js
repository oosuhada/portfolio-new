import { qsa } from "./utils.js";

export const initAbout = () => {
  const lines = qsa(".about-line");
  if (!lines.length) return () => {};

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  lines.forEach((line, index) => {
    line.style.transitionDelay = `${index * 90}ms`;
    observer.observe(line);
  });

  return () => observer.disconnect();
};
