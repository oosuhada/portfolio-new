# 📋 Workflow & Todo — 작업 현황 및 AI 요청 가이드
> AI는 이 문서를 확인하여 현재 프로젝트의 진행 상황을 파악하고, 다음 작업 스텝을 설정합니다.

## 🟢 현재 상태 (Status)
- **현재 진행 중인 작업**: []
- **최근 완료된 작업**: []

---

## 📝 To-Do List (작업 순서)
*AI가 코드를 작성한 후, 완료된 항목은 `[x]`로 변경하여 상태를 업데이트해 주세요.*

### Step 1: 환경 세팅 및 디자인 토큰
- [x] 폴더 및 파일 구조 생성 (`index.html`, `css/`, `js/` 등)
- [x] `variables.css` 구현 (디자인 토큰)
- [x] `reset.css` 및 `typography.css` 폰트 설정

### Step 2: 기초 뼈대 및 공통 로직
- [x] `index.html` 섹션별 마크업 뼈대 작성
- [x] `layout.css` 전체 레이아웃 및 컨테이너 설정
- [x] `main.js` 진입점 세팅 및 `utils.js` 유틸 함수 작성
- [x] `scroll.js` Intersection Observer 공통 로직 구현

### Step 3: 섹션별 구현 (순차적 진행 권장)
- [x] **Hero 섹션**: `hero.html` + `hero.css` + `hero.js` (Spotlight, Tilt, Text 모프)
- [x] **Bridge 섹션**: 수평 스크롤 전환 로직 및 SVG 애니메이션
- [x] **Projects 섹션**: Bento Grid 레이아웃 및 Fullscreen 확장 로직
- [x] **Skills 섹션**: 3D 레이어 시각화 및 인터랙션
- [x] **About & Contact 섹션**: 순차적 스크롤 fade-in 애니메이션

### Step 4: AI Co-Pilot & 백엔드 연결
- [ ] **Front**: `copilot.css`, `copilot.js` (드래그 감지 및 UI)
- [ ] **Back**: FastAPI 세팅 및 RAG 파이프라인 구현 (`routes/copilot.py`)
- [ ] API 연동 테스트 및 스트리밍 응답 UI 적용

### Step 5: 폴리싱 (마무리)
- [ ] 모바일 반응형 테스팅 (768px 이하)
- [ ] Dark/Light 모드 테마 전환 테스트
- [ ] Vercel (FE) / Render (BE) 배포

---

## 🤖 AI 프롬프트 템플릿 (요청 방법)

사용자(Human)가 AI에게 작업을 요청할 때 사용하는 템플릿입니다.

### 📌 신규 섹션 작업 요청 시
```text
[design.md]의 기획 의도와 [build_system.md]의 구현 기준을 참고하여 아래 작업을 진행해 줘.

작업: [예: Projects 섹션 (Bento Grid) 구현]
관련 파일: `index.html`, `projects.css`, `projects.js`
요구사항:
1. build_system.md에 정의된 섹션별 지침을 엄격히 따를 것.
2. variables.css의 CSS 변수를 적극 활용할 것.
3. 완전한 형태의 코드를 작성하고, 복잡한 로직은 한국어 주석을 달아줄 것.
4. 작업이 끝나면 workflow.md의 To-Do 리스트 상태를 업데이트(가상)해 줄 것.