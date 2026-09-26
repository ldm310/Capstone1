import type { RecommendedAction } from "@/types/career";
export const actions: RecommendedAction[] = [
  {
    id: "hybrid-search",
    role: "ax",
    title: "RAG 프로젝트에 하이브리드 검색 구현하기",
    description:
      "현재 RAG 프로젝트에 Vector DB와 Keyword Search를 결합하세요. 검색 품질을 비교하고 구현 근거를 남겨보세요.",
    type: "implementation",
    skillIds: ["vector", "hybrid", "retrieval"],
    duration: "2~3일",
    steps: [
      "벡터 데이터베이스에 문서 색인 만들기",
      "의미 기반 검색과 키워드 검색 결합하기",
      "검색 결과를 비교하고 구현 과정 기록하기",
    ],
  },
  {
    id: "dockerize",
    role: "ax",
    title: "프로젝트를 Docker로 실행하기",
    description:
      "Docker 학습을 구현 역량 근거로 연결하세요. Dockerfile과 재현 가능한 실행 방법을 저장소에 추가하세요.",
    type: "implementation",
    skillIds: ["docker"],
    duration: "1일",
    steps: [
      "Dockerfile 작성하기",
      "컨테이너에서 앱 실행하기",
      "빌드와 실행 명령어 문서화하기",
    ],
  },
  {
    id: "vector-study",
    role: "ax",
    title: "벡터 데이터베이스의 기본 구조 학습하기",
    description:
      "벡터 인덱스, 유사도 검색, 메타데이터 필터링을 학습하고 Notion에 정리하세요.",
    type: "learning",
    skillIds: ["vector"],
    duration: "45분",
    steps: [
      "벡터 인덱스 개념 학습하기",
      "유사도 측정 방식 비교하기",
      "학습 내용을 짧게 정리하기",
    ],
  },
  {
    id: "mcp-tool",
    role: "ax",
    title: "간단한 MCP 도구 서버 만들기",
    description:
      "기존 프로젝트의 기능 하나를 도구로 노출하고 호출 예제를 기록하세요.",
    type: "implementation",
    skillIds: ["mcp"],
    duration: "1~2일",
    steps: ["도구 하나 정의하기", "서버 구현하기", "도구 호출 예시 기록하기"],
  },
  {
    id: "model-serving",
    role: "ml",
    title: "재현 가능한 모델 API 배포하기",
    description:
      "모델을 컨테이너로 패키징하고 Kubernetes 배포 설정과 테스트 결과를 기록하세요.",
    type: "implementation",
    skillIds: ["docker", "kubernetes", "mlflow"],
    duration: "2~3일",
    steps: [
      "MLflow로 실험 기록하기",
      "추론 서비스를 컨테이너로 만들기",
      "Kubernetes 배포 설정 추가하기",
    ],
  },
  {
    id: "ml-study",
    role: "ml",
    title: "모델 평가 방법 정리하기",
    description: "평가 지표와 데이터 분리 전략을 학습 노트로 정리하세요.",
    type: "learning",
    skillIds: ["evaluation"],
    duration: "45분",
    steps: ["평가 지표 선택하기", "검증 전략 살펴보기", "평가 방법 정리하기"],
  },
  {
    id: "data-pipeline",
    role: "data",
    title: "정기 실행 데이터 파이프라인 만들기",
    description:
      "Airflow와 Spark로 작은 ETL 파이프라인을 구현하고 실행 결과를 남겨보세요.",
    type: "implementation",
    skillIds: ["airflow", "spark", "aws"],
    duration: "2~3일",
    steps: [
      "Airflow DAG 만들기",
      "Spark로 데이터 변환하기",
      "AWS 배포 과정 기록하기",
    ],
  },
  {
    id: "data-study",
    role: "data",
    title: "데이터 플랫폼 기본 개념 정리하기",
    description: "배치 처리와 데이터 오케스트레이션 개념을 정리하세요.",
    type: "learning",
    skillIds: ["airflow"],
    duration: "45분",
    steps: ["DAG 개념 살펴보기", "재시도 전략 알아보기", "학습 노트 작성하기"],
  },
];
