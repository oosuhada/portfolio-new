import { on } from "./utils.js";

const MQ = "(max-width: 768px)";

export const initHeaderNav = () => {
  const header = document.querySelector(".site-header");
  const brand = document.querySelector(".site-header .brand");
  const mq = window.matchMedia(MQ);

  if (!header || !brand) return () => {};

  const nav = header.querySelector("#site-nav");

  const syncAria = () => {
    const open = header.classList.contains("is-nav-open");
    if (mq.matches) {
      brand.setAttribute("aria-expanded", open ? "true" : "false");
      brand.setAttribute(
        "aria-label",
        open ? "네비게이션 닫기 · oosuhada" : "네비게이션 열기 · oosuhada",
      );
      if (nav) nav.setAttribute("aria-hidden", open ? "false" : "true");
    } else {
      brand.removeAttribute("aria-expanded");
      brand.setAttribute("aria-label", "홈(히어로)으로 이동 · oosuhada");
      if (nav) nav.removeAttribute("aria-hidden");
    }
  };

  const closeNav = () => {
    header.classList.remove("is-nav-open");
    syncAria();
  };

  const openNav = () => {
    header.classList.add("is-nav-open");
    syncAria();
  };

  const toggleNav = () => {
    if (header.classList.contains("is-nav-open")) closeNav();
    else openNav();
  };

  const onBrandClick = (event) => {
    if (!mq.matches) return;
    event.preventDefault();
    toggleNav();
  };

  const onMqChange = () => {
    if (!mq.matches) closeNav();
    syncAria();
  };

  const onKeydown = (event) => {
    if (event.key === "Escape" && mq.matches) closeNav();
  };

  const cleanups = [on(brand, "click", onBrandClick), on(document, "keydown", onKeydown)];

  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", onMqChange);
    cleanups.push(() => mq.removeEventListener("change", onMqChange));
  } else if (typeof mq.addListener === "function") {
    mq.addListener(onMqChange);
    cleanups.push(() => mq.removeListener(onMqChange));
  }

  syncAria();

  return () => {
    cleanups.forEach((fn) => fn());
    closeNav();
  };
};
