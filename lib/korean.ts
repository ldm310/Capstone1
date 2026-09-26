import type { ApplicationStage } from "@/types/career";
export const roleLabels = {
  ax: "AX·LLM 개발",
  ml: "AI·머신러닝",
  data: "데이터 엔지니어링",
};
export const stageLabels: Record<ApplicationStage, string> = {
  Applied: "지원 완료",
  Document: "서류 전형",
  "Coding Test": "코딩 테스트",
  Interview: "면접",
  Final: "최종 전형",
};
