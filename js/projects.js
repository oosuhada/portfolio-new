import { on, qsa } from "./utils.js";

export const initProjects = () => {
  const cards = qsa(".project-card");
  if (!cards.length) return () => {};

  const cleanups = [];
  let expandedCard = null;

  const closeExpanded = () => {
    if (!expandedCard) return;
    expandedCard.classList.remove("is-expanded");
    document.body.style.overflow = "";
    expandedCard = null;
  };

  const openExpanded = (card) => {
    if (expandedCard === card) {
      closeExpanded();
      return;
    }
    closeExpanded();
    expandedCard = card;
    expandedCard.classList.add("is-expanded");
    document.body.style.overflow = "hidden";
  };

  cards.forEach((card) => {
    cleanups.push(on(card, "click", () => openExpanded(card)));
    cleanups.push(
      on(card, "keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openExpanded(card);
        }
      }),
    );
  });

  cleanups.push(
    on(document, "keydown", (event) => {
      if (event.key === "Escape") closeExpanded();
    }),
  );

  return () => {
    closeExpanded();
    cleanups.forEach((cleanup) => cleanup());
  };
};
