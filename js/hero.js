import { clamp, on, qs, rafThrottle } from "./utils.js";

const identities = [
  {
    label: "Developer",
    subtitle:
      "나는 코드를 짜는 사람이 아니라, 경험을 빚는 사람입니다.",
  },
  {
    label: "Designer",
    subtitle:
      "나는 화면을 꾸미는 사람이 아니라, 이해와 선택을 돕는 맥락을 설계하는 사람입니다.",
  },
  {
    label: "Wine Bar Owner",
    subtitle:
      "나는 잔을 채우는 사람이 아니라, 사람과 순간을 잇는 공간을 만드는 사람입니다.",
  },
  {
    label: "Product Engineer",
    subtitle:
      "나는 기능을 나열하는 사람이 아니라, 문제 끝까지 책임지는 제품을 완성하는 사람입니다.",
  },
];

export const initHero = () => {
  const hero = qs("#hero");
  const title = qs(".hero-title", hero);
  const subtitle = qs(".hero-subtitle", hero);
  const prevButton = qs(".hero-prev", hero);
  const nextButton = qs(".hero-next", hero);
  if (!hero || !title || !subtitle || !prevButton || !nextButton) return () => {};

  let roleIndex = 0;
  const cleanups = [];

  const updateRole = () => {
    const current = identities[roleIndex];
    title.textContent = current.label;
    title.setAttribute("data-index", String(roleIndex));
    subtitle.textContent = current.subtitle;

    const isFirst = roleIndex === 0;
    const isLast = roleIndex === identities.length - 1;
    prevButton.toggleAttribute("hidden", isFirst);
    nextButton.toggleAttribute("hidden", isLast);
    prevButton.setAttribute("aria-hidden", isFirst ? "true" : "false");
    nextButton.setAttribute("aria-hidden", isLast ? "true" : "false");
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

  const markIdentityNavigated = () => {
    hero.classList.remove("hero--identity-pristine");
  };

  const prevRole = () => {
    const nextIndex = Math.max(roleIndex - 1, 0);
    if (nextIndex === roleIndex) return;
    markIdentityNavigated();
    roleIndex = nextIndex;
    updateRole();
  };

  const nextRole = () => {
    const nextIndex = Math.min(roleIndex + 1, identities.length - 1);
    if (nextIndex === roleIndex) return;
    markIdentityNavigated();
    roleIndex = nextIndex;
    updateRole();
  };

  const onPrevClick = (event) => {
    event.stopPropagation();
    prevRole();
  };
  const onNextClick = (event) => {
    event.stopPropagation();
    nextRole();
  };
  cleanups.push(on(prevButton, "click", onPrevClick));
  cleanups.push(on(nextButton, "click", onNextClick));

  const onHeroClick = (event) => {
    if (event.target.closest("button, a")) return;
    if (roleIndex >= identities.length - 1) return;
    nextRole();
  };
  cleanups.push(on(hero, "click", onHeroClick));

  updateRole();

  return () => cleanups.forEach((cleanup) => cleanup());
};
