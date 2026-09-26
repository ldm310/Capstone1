"use client";
import { useState } from "react";
import { ArrowUpRight, ChevronDown, Plus, AlertCircle } from "lucide-react";
import type { Evidence, Skill } from "@/types/career";
import { EvidenceBadge, SourceIcon } from "./evidence-badge";
import { evidenceStatus } from "@/lib/career-selectors";
import { Button } from "@/components/ui/button";
export function EvidenceCard({ evidence }: { evidence: Evidence }) {
  return (
    <div className="evidence-source">
      <div className="row-between">
        <div className="icon-inline">
          <SourceIcon source={evidence.source} size={15} />
          <strong>{evidence.title}</strong>
        </div>
        <span className="evidence-kind">
          {
            {
              implementation: "구현 근거",
              learning: "학습 근거",
              career: "경력 근거",
              certificate: "자격 근거",
            }[evidence.type]
          }
        </span>
      </div>
      <ul>
        {evidence.details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
      <div className="evidence-source-footer">
        <span>
          {evidence.detectedAt.slice(0, 10)} ·{" "}
          {evidence.id.startsWith("user-") ? "직접 등록" : "체험 근거"}
        </span>
        {evidence.sourceUrl ? (
          <a href={evidence.sourceUrl} target="_blank" rel="noreferrer">
            출처 보기 <ArrowUpRight size={11} />
          </a>
        ) : (
          <span>예시 자료</span>
        )}
      </div>
    </div>
  );
}
export function SkillCard({
  skill,
  evidence,
  onAdd,
  highlight = false,
  filter = "all",
}: {
  skill: Skill;
  evidence: Evidence[];
  onAdd: (id: string) => void;
  highlight?: boolean;
  filter?: string;
}) {
  const [expanded, setExpanded] = useState(highlight);
  const status = evidenceStatus(skill.id, evidence);
  const filtered = evidence.filter(
    (e) => filter === "all" || e.type === filter,
  );
  const shown = expanded ? filtered : filtered.slice(0, 2);
  return (
    <article
      className={`skill-card ${highlight ? "highlighted" : ""}`}
      id={`skill-${skill.id}`}
    >
      <div className="skill-card-heading">
        <span className="skill-initial">{skill.name.slice(0, 1)}</span>
        <div>
          <h3>{skill.name}</h3>
          <small>역량 근거 {evidence.length}개</small>
        </div>
        <EvidenceBadge type={status} />
      </div>
      {shown.map((item) => (
        <EvidenceCard evidence={item} key={item.id} />
      ))}
      {filtered.length > 2 && (
        <button
          className="expand-evidence"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded ? "접기" : `근거 ${filtered.length - 2}개 더보기`}
          <ChevronDown size={12} />
        </button>
      )}
      {status !== "implementation" && (
        <div className="skill-warning">
          <AlertCircle size={13} />
          {status === "none"
            ? "아직 확인된 근거가 없어요."
            : "아직 직접 구현한 근거는 없어요."}
        </div>
      )}
      <Button
        variant="ghost"
        className="add-evidence-button"
        onClick={() => onAdd(skill.id)}
      >
        <Plus size={13} />
        {status === "implementation" ? "근거 추가" : "구현 근거 추가"}
      </Button>
    </article>
  );
}
