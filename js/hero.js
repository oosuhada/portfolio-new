import { clamp, on, qs, rafThrottle } from "./utils.js";

const roles = ["Developer", "Designer", "Wine Bar Owner", "Product Engineer"];

export const initHero = () => {
  const hero = qs("#hero");
  const title = qs(".hero-title", hero);
  const nextButton = qs(".hero-next", hero);
  if (!hero || !title || !nextButton) return () => {};

  let roleIndex = 0;
  const cleanups = [];

  const updateRole = () => {
    title.textContent = roles[roleIndex];
    title.setAttribute("data-index", String(roleIndex));
  };

  const moveSpotlight = rafThrottle((event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    hero.style.setProperty("--spot-x", `${clamp(x, 0, 100)}%`);
    hero.style.setProperty("--spot-y", `${clamp(y, 0, 100)}%`);

    const tiltX = (y - 50) * 0.06;
    const tiltY = (x - 50) * -0.06;
    title.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
  });

  cleanups.push(on(hero, "mousemove", moveSpotlight));
  cleanups.push(
    on(hero, "mouseleave", () => {
      title.style.transform = "";
      hero.style.setProperty("--spot-x", "50%");
      hero.style.setProperty("--spot-y", "50%");
    }),
  );

  const nextRole = () => {
    roleIndex = Math.min(roleIndex + 1, roles.length - 1);
    updateRole();
  };

  cleanups.push(on(nextButton, "click", nextRole));
  cleanups.push(on(hero, "click", nextRole));
  updateRole();

  return () => cleanups.forEach((cleanup) => cleanup());
};
