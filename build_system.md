# 🏗️ Build System — 프로젝트 기술 설계 및 구현 기준
> AI는 코드를 작성하기 전, 반드시 이 문서의 아키텍처와 규칙을 준수해야 합니다.

## 📁 프로젝트 구조 (SPA 구조)

portfolio-new/
├── index.html              # 단일 HTML 파일 (SPA 구조)
├── css/
│   ├── reset.css           # 브라우저 기본 스타일 초기화
│   ├── variables.css       # CSS Custom Properties (색상, 폰트, 간격 등)
│   ├── typography.css      # 폰트 및 텍스트 스타일
│   ├── layout.css          # 전체 레이아웃, 섹션 구조
│   ├── animations.css      # 공통 애니메이션 & keyframes
│   └── sections/
│       ├── hero.css, bridge.css, projects.css, skills.css, copilot.css, about.css, contact.css
├── js/
│   ├── main.js             # 진입점, 초기화, 이벤트 바인딩
│   ├── scroll.js           # Intersection Observer, 스크롤 트리거
│   ├── utils.js            # 공통 유틸 함수
│   └── [섹션명].js         # hero.js, bridge.js, projects.js, skills.js, copilot.js, about.js
├── api/                    # Python FastAPI 백엔드 (AI Co-Pilot용)
│   ├── main.py             # FastAPI 앱 진입점
│   ├── routes/copilot.py   # /api/copilot 엔드포인트
│   ├── services/rag.py     # RAG 로직, 벡터 검색
│   ├── data/portfolio.md   # AI가 학습할 포트폴리오 원본 데이터
│   └── requirements.txt
└── assets/                 # fonts/, images/, icons/

---

## 🎨 CSS 변수 설계 (variables.css)
*모든 스타일링은 아래 변수를 사용하여 일관성을 유지합니다.*

:root {
  /* ── Colors ── */
  --bg-primary: #0A0A0A;
  --bg-secondary: #111111;
  --bg-glass: rgba(255, 255, 255, 0.04);
  --text-primary: #F5F5F5;
  --text-secondary: #888888;
  --text-muted: #444444;
  --accent: #7B2D3E;          /* 와인 레드 포인트 */
  --accent-hover: #9E3A4F;
  --accent-glow: rgba(123, 45, 62, 0.3);

  /* ── Typography & Spacing ── */
  --font-display: 'Editorial New', 'Playfair Display', serif;
  --font-body: 'Neue Haas Grotesk', 'Helvetica Neue', sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --section-padding: clamp(80px, 12vw, 160px);
  --container-max: 1280px;

  /* ── Motion & Glass ── */
  --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-base: 300ms;
  --glass-blur: blur(16px);
  --glass-border: 1px solid rgba(255, 255, 255, 0.08);
}

[data-theme="light"] {
  /* Light Mode (Wine Bar theme) 색상 재정의 */
  --bg-primary: #FAFAF8;
  --text-primary: #1A1A1A;
  --bg-glass: rgba(0, 0, 0, 0.03);
  --glass-border: 1px solid rgba(0, 0, 0, 0.08);
}

---

## 🧩 섹션별 핵심 구현 지침

1. **Hero**: 100vh 레이아웃, `data-index` 기반 텍스트 전환, `mousemove`를 이용한 spotlight 및 3D tilt 효과 적용.
2. **Bridge**: `position: sticky`를 활용한 수평 스크롤 (wheel -> translateX 변환). 스크롤 진행도(`--bridge-progress`)에 따른 배경색 및 SVG 애니메이션 연동.
3. **Projects**: CSS Grid 기반 Bento 레이아웃. 카드 클릭 시 Fullscreen 확장 (position fixed + scale). Glassmorphism 적용.
4. **Skills**: 3단 레이어 다이어그램. 투명 카드 레이아웃. 클릭 시 슬라이드인 확장, 호버 시 `translateY -4px`.
5. **AI Co-Pilot**: `window.getSelection()`을 이용한 드래그 감지. FastAPI(RAG + OpenAI) 백엔드와 연결하여 컨텍스트 기반 팝업/채팅 제공.
6. **About**: Intersection Observer를 활용한 순차적(delay) 문장 fade-in 효과.

---

## 📱 모바일 대응 원칙 (max-width: 768px)
- Bridge 수평 스크롤은 세로 스크롤로 폴백(fallback) 처리.
- Bento Grid는 단일 컬럼(`grid-template-columns: 1fr`)으로 변경.
- Hero 텍스트 크기는 `clamp()`를 활용하여 자동 축소.

---

## ⚠️ 절대 지켜야 할 코딩 규칙 (AI 필수 확인)
1. **Vanilla JS 전용**: React, Vue, jQuery 등 절대 사용 금지.
2. **CSS 변수 중심**: 인라인 스타일 금지. 모든 색상, 간격은 `variables.css` 참조.
3. **성능 최적화**: 애니메이션은 CSS transition/animation, `transform`, `opacity`만 사용. JS `setTimeout` 애니메이션 금지.
4. **이벤트 관리**: 스크롤 애니메이션은 반드시 `Intersection Observer` 사용.
5. **단일 책임 원칙**: 각 JS 파일은 자신의 섹션만 담당 (`js/섹션명.js`).
6. **코드 완성도**: 코드를 생략하지 말고, 실행 가능한 완전한 코드를 작성할 것.