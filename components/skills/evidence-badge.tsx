import { Github } from "@/components/shared/github-icon";
import {
  Code2,
  BookOpen,
  BriefcaseBusiness,
  Award,
  CircleDashed,
  FileText,
} from "lucide-react";
import type { EvidenceSource, EvidenceType } from "@/types/career";
export const evidenceLabels = {
  implementation: "구현 근거",
  learning: "학습 근거만 있음",
  career: "경력 근거",
  certificate: "자격 근거",
  none: "근거 없음",
};
const icons = {
  implementation: Code2,
  learning: BookOpen,
  career: BriefcaseBusiness,
  certificate: Award,
  none: CircleDashed,
};
export function EvidenceBadge({ type }: { type: EvidenceType | "none" }) {
  const Icon = icons[type];
  return (
    <span className={`evidence-badge evidence-${type}`}>
      <Icon size={13} />
      {evidenceLabels[type]}
    </span>
  );
}
export function SourceIcon({
  source,
  size = 18,
}: {
  source: EvidenceSource;
  size?: number;
}) {
  const Icon = {
    github: Github,
    notion: BookOpen,
    cv: FileText,
    certificate: Award,
  }[source];
  return <Icon size={size} />;
}
