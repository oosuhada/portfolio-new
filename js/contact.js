import { on, qsa } from "./utils.js";

export const initContact = () => {
  const links = qsa(".contact-links a");
  if (!links.length) return () => {};

  const cleanups = links.map((link) =>
    on(link, "click", (event) => {
      const href = link.getAttribute("href");
      if (href !== "#") return;

      event.preventDefault();
    }),
  );

  return () => cleanups.forEach((cleanup) => cleanup());
};
