import { clamp, isMobileViewport, on, qs, rafThrottle } from "./utils.js";

export const initBridge = () => {
  const bridge = qs("#bridge");
  if (!bridge) return () => {};

  // wheelProgress는 RAF 밖에서 즉시 업데이트해야
  // 연속 wheel 이벤트에서 경계 판정이 stale 값으로 작동하는 문제를 막는다.
  let wheelProgress = 0;

  const commitProgress = (value) => {
    bridge.style.setProperty("--bridge-progress", value.toFixed(3));
  };

  const scheduleCommit = rafThrottle(commitProgress);

  const applyProgress = (nextProgress) => {
    wheelProgress = clamp(nextProgress, 0, 1);
    scheduleCommit(wheelProgress);
  };

  // Bridge 중앙이 뷰포트 안에 있을 때만 wheel을 가로챈다.
  // inView 판정을 좁게 유지해서 섹션 경계에서 오작동하지 않도록 한다.
  const isBridgeActive = (rect) => {
    const vh = window.innerHeight;
    const centerY = rect.top + rect.height / 2;
    return centerY > vh * 0.1 && centerY < vh * 0.9;
  };

  const onWheel = (event) => {
    if (isMobileViewport()) return;

    const rect = bridge.getBoundingClientRect();
    if (!isBridgeActive(rect)) return;

    const delta = clamp(event.deltaY / 1200, -0.12, 0.12);
    const atStart = wheelProgress <= 0.001 && delta < 0;
    const atEnd   = wheelProgress >= 0.999 && delta > 0;

    // 경계에서는 기본 세로 스크롤을 통과시킨다.
    if (atStart || atEnd) return;

    // 중간 진행 구간에서만 가로챈다.
    event.preventDefault();
    applyProgress(wheelProgress + delta);
  };

  // scroll 이벤트는 모바일 리셋 및 페이지 점프(앵커 이동 등) 보정 용도로만 사용.
  // 데스크탑에서는 wheel이 주도권을 가지므로 scroll로 덮어쓰지 않는다.
  const onScroll = rafThrottle(() => {
    if (!isMobileViewport()) return;
    applyProgress(0);
  });

  const onResize = rafThrottle(() => {
    if (isMobileViewport()) applyProgress(0);
  });

  const cleanupWheel  = on(window, "wheel",  onWheel,  { passive: false });
  const cleanupScroll = on(window, "scroll", onScroll, { passive: true });
  const cleanupResize = on(window, "resize", onResize);

  return () => {
    cleanupWheel();
    cleanupScroll();
    cleanupResize();
  };
};