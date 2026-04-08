import { on, qs, qsa } from "./utils.js";

const layerDescription = {
  ai: "AI API 연동과 제품 맥락 설계를 통해 기능을 경험으로 연결합니다.",
  backend: "FastAPI/Java 기반으로 데이터와 비즈니스 로직을 안정적으로 구성합니다.",
  frontend:
    "사용자 흐름과 인터랙션을 중심으로 화면을 설계하며 React도 학습 중입니다.",
};

export const initSkills = () => {
  const layers = qsa(".skill-layer");
  const panel = qs(".skills-panel");
  if (!layers.length || !panel) return () => {};
  const panelTitle = qs(".skills-panel-title", panel);
  const panelBody = qs(".skills-panel-body", panel);

  const cleanups = [];

  const selectLayer = (layer) => {
    layers.forEach((item) => item.classList.remove("is-selected"));
    layer.classList.add("is-selected");

    const key = layer.dataset.layer || "";
    const title = qs("h3", layer)?.textContent || "Layer Detail";
    const body = layerDescription[key] || "레이어를 선택하면 역할 설명이 표시됩니다.";

    if (panelTitle) panelTitle.textContent = title;
    if (panelBody) panelBody.textContent = body;
    panel.classList.remove("is-open");
    requestAnimationFrame(() => {
      panel.classList.add("is-open");
    });
  };

  layers.forEach((layer) => {
    cleanups.push(on(layer, "click", () => selectLayer(layer)));
  });

  selectLayer(layers[0]);
  return () => cleanups.forEach((cleanup) => cleanup());
};
