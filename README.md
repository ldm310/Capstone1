# Career

## 하늘 인트로

홈 첫 진입 시 구름과 하늘 배경 위에 CSS 입체 텍스트 `Career`가 표시됩니다. 마우스 움직임에 따라 조금 기울어지며 화면 클릭, Enter/Space 또는 Escape로 홈페이지에 진입합니다. 인트로가 사라지면 같은 사진과 블루그레이 색상을 사용하는 홈페이지가 이어집니다. 같은 탭에서는 한 번만 표시하고 하단의 ‘인트로 다시 보기’로 재생할 수 있습니다. 해시 링크는 인트로를 건너뜁니다. 저장소 사용이 불가능해도 진입은 가능합니다.

`SkyExperience`가 전환·초점·스크롤을 관리하며, 인트로 중 뒤쪽 콘텐츠는 inert 처리합니다. reduced-motion 설정에서는 움직임과 긴 전환을 생략합니다. `SkyHero`는 기존 분석 예시 데이터를 그대로 받으며 실제 공고 API는 유지됩니다. 홈의 새로운 색상은 `.sky-experience`에 한정되어 있습니다.

하늘 사진: [CHUTTERSNAP / Unsplash](https://unsplash.com/photos/clouds-during-daytime-M2-_GRvWWg0). 웹 표시용 파일은 `public/images/career-sky.jpg`에 저장해 외부 이미지 서버 장애와 독립적으로 표시합니다.

Evidence 중심의 AI Career Intelligence 서비스 Frontend 프로토타입입니다. 별점이나 AI 능력 점수 대신 시장 요구 기술, Evidence의 종류·출처, Skill Gap, Next Action을 연결합니다.

## 실행

Node.js 20.9 이상 및 npm이 필요합니다.

```sh
cd /Users/idongmin/Desktop/capstone1-career
npm install
npm run dev
```

브라우저에서 http://localhost:3000 을 엽니다.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

브라우저 흐름 및 접근성 테스트:

```sh
npx playwright install chromium
npm run test:e2e
```

Playwright는 실행 중인 로컬 개발 서버를 재사용하거나 직접 시작합니다. 결과는 Git에서 제외되는 `work/test-results/`에 저장합니다. UI 라이브러리의 기존 버전을 유지했고, 검증용 개발 의존성으로 Playwright, axe-core, Prettier를 추가했습니다.

## 화면

| Route                   | 동작                                                |
| ----------------------- | --------------------------------------------------- |
| `/`                     | 한국어 랜딩, 기업 공식 채용공고 카드, 더보기·저장·검색 |
| `/onboarding`           | 직무 선택 → 모의 소스 연결 → 분석 진행 → Dashboard  |
| `/sign-in`              | 실제 인증 없이 Demo workspace로 진입                |
| `/dashboard`            | Coverage·Evidence·Gap·Action 요약, 차트, 재분석     |
| `/market`               | 직무별 예시 통계·추이, 기술 관계, 실제 채용공고 목록 |
| `/skills`               | Evidence 필터·검색·출처 상세·직접 추가              |
| `/agent`                | 우선순위·실행 단계·Action 시작/완료·모의 상담       |
| `/job-analyzer`         | 기업명/URL 샘플 매칭, 역량 비교, 빈 상태, 지원 기록 |
| `/applications`         | 검색·단계 필터·기록 추가·상세 Drawer·타임라인       |
| `/settings`, `/profile` | 소스/직무/이름 관리, 로컬 Demo 초기화               |

## 구조

```text
app/
  (workspace)/        # Sidebar를 공유하는 실제 페이지별 라우트
  onboarding/        # 3단계 온보딩
  sign-in/
  page.tsx           # Server-rendered landing composition
  globals.css        # Tokens, responsive layouts, CSS 3D and reduced motion
  korean.css         # 한국어 타이포그래피와 실제 공고 카드 반응형 레이아웃
  api/jobs/route.ts   # 기업 공개 채용 API를 조회하는 서버 엔드포인트
components/
  ui/                # 기존 shadcn/Base UI primitives
  shared/            # Provider, reusable page/panel/link primitives
  layout/            # Header, app shell and sidebar
  landing/           # Hero, job cards, product explanations
  onboarding/        # Role flow, source connectors
  dashboard/         # Summary, evidence overview, priority gaps
  market/            # Recharts bar/line charts, market view
  skills/            # Evidence badges/cards and entry form
  agent/             # Action cards and focused agent UI
  jobs/              # Job input and requirements comparison
  applications/      # Table, timeline and drawer
  settings/
mock/                # Jobs, skills/evidence, market, actions, applications
lib/
  career-service.ts  # Typed read/analyze adapter: replace with backend HTTP
  career-selectors.ts# Derived coverage, evidence status, gaps, hero preview
  public-jobs.ts     # Lever 기업별 공개 공고 검증·정규화·정렬
  korean.ts          # 직무·지원 단계 한국어 표시 이름
  utils.ts
 types/career.ts     # Domain types and service contract
 tests/              # End-to-end flows, responsive and axe checks
```

`CareerProvider`는 어댑터에서 초기 데이터를 받아 화면에 전달합니다. 역할 선택, 소스 연결 정보, 추가 Evidence, Action 진행 상태, 추가 지원 기록은 Context와 localStorage(`career-twin:prototype:v1`)에 유지됩니다. 데이터 변경 로직은 Provider에 모아 API mutation으로 옮길 수 있습니다. 저장소 접근이 제한되면 현재 세션 상태로 계속 사용할 수 있습니다.

## 데이터와 해석

- 직무는 AX / LLM, AI / ML, Data Engineer 3종입니다. `targetRoles` 배열을 준비하되 UI는 primary role 하나를 선택합니다.
- Evidence는 `implementation / learning / career / certificate`, 출처는 `github / notion / cv / certificate`로 구분합니다.
- **Market Coverage = 선택 직무의 요구 Skill 중 Evidence가 하나 이상 있는 Skill 수 / 전체 요구 Skill 수.** 학습 근거도 포함하며, 실력 점수가 아닙니다.
- AX의 초기 Coverage는 데이터에서 계산한 **8/11 ≈ 73%**입니다. 예시의 고정 72%를 하드코딩하지 않았습니다.
- Gap은 Evidence가 없거나 Learning만 있는 역량입니다. 초기 AX Gap은 5개이며 Dashboard는 그중 시장 수요 상위 3개를 표시합니다.
- 초기 Evidence는 전체 14개입니다. Dashboard Evidence 수는 선택 직무에 관련된 Evidence만 집계합니다.
- Market 랭킹은 2026-09-25의 고정 샘플 스냅샷입니다. 기간 선택은 추이 차트의 3/6개월 범위를 변경합니다. 변화량은 percentage points(pp)로 표시합니다.
- Application snapshot은 지원 기록을 생성한 시점의 Evidence가 있는 요구 Skill ID를 저장합니다. 이후 Evidence 변경에 영향을 받지 않습니다.

## 실제 채용공고 연동

랜딩과 채용시장 하단은 `GET /api/jobs?offset=0&limit=4&role=all`을 통해 **기업이 공개한 실제 채용공고**를 조회합니다. 서버가 [Lever 공개 채용 API](https://github.com/lever/postings-api)의 `zoyi`(채널코퍼레이션), `matchgroup`(매치그룹) 보드를 읽고 국내 AI·ML·데이터 직무를 추립니다. 별도 API 키는 필요하지 않으며 서버의 외부 네트워크 접근이 필요합니다.

- 제목은 원문을 보존하고, 근무지·고용형태를 한국어로 표시합니다. 원문 링크를 새 창에서 열어 전체 자격요건과 지원 방법을 확인할 수 있습니다.
- 첫 4개 이후 **새로운 공고 더보기**로 나머지를 추가합니다. 직무 필터, 불러온 공고 검색, 브라우저별 저장 기능을 지원합니다. 저장 목록은 현재 불러온 공고 기준이며 `career-twin:saved-public-jobs:v1`에 공고 ID를 저장합니다.
- 출처·마지막 조회 시각·연동 기업 범위를 표시합니다. 마감일·경력·학력·인기도 등 원문에 없는 데이터는 만들어내지 않습니다. 전체 국내 채용시장을 대표하는 목록은 아닙니다.
- 소스별 10초 타임아웃, 부분 실패 안내, 전체 실패 시 재시도, 빈 상태를 처리합니다. 장애 시 가짜 공고로 대체하지 않습니다.
- `PublicJob` / `PublicJobsResponse`는 개인 분석용 `JobPosting`과 분리되어 있습니다. 연동 기업 추가는 `lib/public-jobs.ts`의 소스 어댑터에서 처리합니다.

## 여전히 체험 데이터인 부분

- 개인 분석·시장 차트·공고 분석·지원 기록은 `mock/`의 예시 데이터입니다. 실제 채용공고 목록과 연결된 분석 결과가 아닙니다. `CareerService.mode`는 개인 분석 어댑터의 체험 상태를 나타냅니다.
- GitHub/Notion은 OAuth 연결 대신 샘플 소스 연결 상태를 보여줍니다.
- CV는 확장자와 크기(10MB 이하)를 확인하고 **파일명만 로컬 저장**합니다. 내용 파싱·전송·업로드는 하지 않습니다.
- 자격증 입력은 이름을 연결 메타데이터로 저장합니다. 실제 자격증 검증은 하지 않습니다.
- 온보딩/재분석은 샘플 데이터의 분석 상태를 재현합니다. 실제 계정 자료를 읽지 않습니다.
- Action 완료는 명시적으로 모의 Evidence를 추가합니다. GitHub 코드를 검사한 결과가 아닙니다.
- 직접 입력한 Evidence는 `Self-reported`로 표시합니다. 실제 출처가 검증된 것으로 표현하지 않습니다.
- Job Analyzer는 LG CNS, NAVER, Kakao, toss, Karrot, Upstage의 회사명/알려진 도메인과 매칭합니다. 같은 도메인의 URL은 하나의 샘플 공고를 반환합니다. 특정 URL의 내용을 분석하지 않습니다. 다른 기업/도메인은 빈 상태를 보여줍니다.
- Agent 입력은 미완료 Action을 안내하는 규칙 기반 응답입니다. 실제 LLM 호출이 없습니다.
- 지원 기록은 로컬 관리 데이터입니다. 실제 기업에 지원서를 전송하지 않습니다.

## Backend 연결 계획

UI 컴포넌트 대신 `lib/career-service.ts`의 `CareerService` 구현과 Provider의 mutation을 교체합니다. `/api/jobs`를 제외한 아래 경로는 제안 계약이며 아직 구현되어 있지 않습니다.

| 제안 API                                   | 연결할 곳                                      |
| ------------------------------------------ | ---------------------------------------------- |
| `GET /api/jobs?role=...&offset=...&limit=...` | **구현 완료** · 랜딩/채용시장의 실제 공고 목록 |
| `GET /api/market?role=...&period=...`      | Market dataset, ranking/trend snapshot         |
| `GET /api/me/career-twin`                  | `getDataset`의 개인 데이터와 분석 결과         |
| `POST /api/analysis` + status/SSE          | Onboarding, Re-analyze 진행 상황               |
| GitHub/Notion OAuth endpoints              | SourceConnector의 `connect`                    |
| `POST /api/documents`, `/api/certificates` | 실제 파일 전송 및 검증                         |
| `GET/POST /api/evidence`                   | 개인 Evidence 목록/등록 및 provenance          |
| `GET/PATCH /api/actions/:id`               | Action 상태와 실제 Evidence 검증               |
| `POST /api/jobs/analyze`                   | 기업/공고의 실제 요구 기술 추출                |
| `POST /api/agent/messages`                 | 근거 기반 LLM 응답과 대화 기록                 |
| `GET/POST/PATCH /api/applications`         | 지원 이력, 단계, 질문, 결과                    |
| `GET/POST /api/resumes`                    | ResumeVersion과 실제 문서                      |
| Auth/profile endpoints                     | Demo sign-in 및 Profile 상태                   |

운영 연결 시 인증/권한, 런타임 응답 검증, server-side token 보관, 실제 timestamp, 실패/재시도 처리, 개인정보 저장 정책을 API 경계에 구현해야 합니다. Live 표시는 실제 수집·연동이 동작할 때만 활성화합니다.

## 디자인과 상호작용

화이트·soft green 표면, 읽기 쉬운 진회색/녹색 텍스트, Geist, 12px 내외 카드 radius, 최소한의 border/shadow를 사용했습니다. 설치된 Motion의 `motion/react`를 사용하고 Three.js는 추가하지 않았습니다.

요청에 따라 3D 채용 카드 대신 읽기 쉬운 4열 카드 목록으로 바꿨습니다. 태블릿은 2열, 모바일은 1열로 표시하고 카드에 가벼운 hover만 적용합니다. 전체 메뉴·온보딩·분석·활동·지원 관리·빈 화면·오류 안내를 한국어로 정리했습니다. 기술명과 실제 공고 원문 제목은 보존합니다. `prefers-reduced-motion`을 존중하며 Dialog는 Base UI로 focus trap/escape/복귀를 처리합니다.

자동 테스트는 외부 채용 데이터 변동과 분리된 fixture로 페이지 이동, 활동과 근거 저장, 공고 더보기·저장·필터·오류 복구, 모바일 레이아웃과 접근성을 검증합니다. 실제 API는 별도로 호출해 연결 상태를 확인합니다.

참고: https://21st.dev/ (구성 방향), https://imweb.me/theme/ (요청된 light white + green 방향; 직접 접근은 403 응답).
