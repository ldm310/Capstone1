import type { Application, ResumeVersion } from "@/types/career";
export const resumes: ResumeVersion[] = [
  {
    id: "cv2",
    name: "AI 엔지니어 이력서",
    version: "v2.1",
    updatedAt: "2026-09-23",
  },
  {
    id: "cv1",
    name: "데이터 엔지니어 이력서",
    version: "v1.2",
    updatedAt: "2026-09-20",
  },
];
export const applications: Application[] = [
  {
    id: "app1",
    jobId: "lg-ax",
    resumeId: "cv2",
    stage: "Interview",
    appliedAt: "2026-09-18",
    skillSnapshot: ["rag", "langgraph", "python"],
    result: "면접 예정 · 체험 데이터",
    questions: [
      "RAG 파이프라인의 품질을 어떻게 평가하나요?",
      "어떤 상황에서 하이브리드 검색을 선택하나요?",
    ],
    timeline: [
      { stage: "Applied", date: "2026-09-18", note: "이력서 v2.1 제출" },
      {
        stage: "Document",
        date: "2026-09-20",
        note: "서류 검토 완료",
      },
      {
        stage: "Coding Test",
        date: "2026-09-22",
        note: "기술 과제 완료",
      },
      {
        stage: "Interview",
        date: "2026-09-28",
        note: "기술 면접 예정",
      },
    ],
  },
  {
    id: "app2",
    jobId: "naver-ml",
    resumeId: "cv2",
    stage: "Document",
    appliedAt: "2026-09-21",
    skillSnapshot: ["python", "pytorch"],
    result: "서류 검토 대기 · 체험 데이터",
    questions: [],
    timeline: [
      { stage: "Applied", date: "2026-09-21", note: "지원 기록 등록" },
      { stage: "Document", date: "2026-09-22", note: "검토 중" },
    ],
  },
  {
    id: "app3",
    jobId: "kakao-data",
    resumeId: "cv1",
    stage: "Applied",
    appliedAt: "2026-09-24",
    skillSnapshot: ["sql", "python"],
    result: "지원 접수 · 체험 데이터",
    questions: [],
    timeline: [
      { stage: "Applied", date: "2026-09-24", note: "지원 기록 등록" },
    ],
  },
];
