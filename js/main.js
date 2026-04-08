import { createSectionObserver } from "./scroll.js";
import { initAbout } from "./about.js";
import { initBridge } from "./bridge.js";
import { initContact } from "./contact.js";
import { initHero } from "./hero.js";
import { initProjects } from "./projects.js";
import { initSkills } from "./skills.js";
import { on, qsa } from "./utils.js";

let sectionObserver;
const cleanupFns = [];

const initAnchorScroll = () => {
  const navLinks = qsa('.global-nav a[href^="#"]');

  navLinks.forEach((link) => {
    const cleanup = on(link, "click", (event) => {
      const href = link.getAttribute("href");
      if (!href) return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    cleanupFns.push(cleanup);
  });
};

const init = () => {
  sectionObserver = createSectionObserver();
  initAnchorScroll();
  cleanupFns.push(initHero());
  cleanupFns.push(initBridge());
  cleanupFns.push(initProjects());
  cleanupFns.push(initSkills());
  cleanupFns.push(initAbout());
  cleanupFns.push(initContact());
};

const destroy = () => {
  cleanupFns.forEach((cleanup) => cleanup());
  cleanupFns.length = 0;

  if (sectionObserver) {
    sectionObserver.disconnect();
    sectionObserver = null;
  }
};

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("beforeunload", destroy);
