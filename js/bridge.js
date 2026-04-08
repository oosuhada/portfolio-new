import { clamp, isMobileViewport, on, qs, rafThrottle } from "./utils.js";

export const initBridge = () => {
  const bridge = qs("#bridge");
  if (!bridge) return () => {};

  const updateProgress = rafThrottle(() => {
    if (isMobileViewport()) {
      bridge.style.setProperty("--bridge-progress", "0");
      return;
    }

    const rect = bridge.getBoundingClientRect();
    const viewport = window.innerHeight || 1;
    const progress = clamp((viewport - rect.top) / (viewport + rect.height), 0, 1);
    bridge.style.setProperty("--bridge-progress", progress.toFixed(3));
  });

  updateProgress();
  const cleanupScroll = on(window, "scroll", updateProgress, { passive: true });
  const cleanupResize = on(window, "resize", updateProgress);

  return () => {
    cleanupScroll();
    cleanupResize();
  };
};
