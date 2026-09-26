"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useCareer } from "@/components/shared/career-provider";
import { EvidenceBadge } from "@/components/skills/evidence-badge";
import { evidenceStatus } from "@/lib/career-selectors";
export function EvidenceOverview() {
  const { data, profile, evidence } = useCareer();
  if (!data) return null;
  return (
    <div className="evidence-overview">
      {data.market[profile.role].skills.slice(0, 6).map((skill) => (
        <Link href={`/skills?skill=${skill.skillId}`} key={skill.skillId}>
          <span className="skill-initial">{skill.name.slice(0, 1)}</span>
          <strong>{skill.name}</strong>
          <EvidenceBadge type={evidenceStatus(skill.skillId, evidence)} />
          <ChevronRight size={13} />
        </Link>
      ))}
    </div>
  );
}
