import Link from "next/link";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import type { SkillGap } from "@/types/career";
import { EvidenceBadge } from "@/components/skills/evidence-badge";
import { EmptyState } from "@/components/shared/primitives";
export function SkillGapCard({ gaps }: { gaps: SkillGap[] }) {
  return (
    <div className="gap-list">
      {gaps.length ? (
        gaps.slice(0, 3).map((gap, i) => (
          <Link
            href={`/skills?skill=${gap.skillId}`}
            key={gap.skillId}
            className="gap-row"
          >
            <span className="gap-number">0{i + 1}</span>
            <div>
              <strong>{gap.name}</strong>
              <p>
                {gap.demand}%의 예시 공고 <span>·</span>{" "}
                {gap.trend >= 5 ? (
                  <>
                    <TrendingUp size={10} />+{gap.trend} pp
                  </>
                ) : (
                  "시장 수요"
                )}
              </p>
            </div>
            <EvidenceBadge type={gap.status === "none" ? "none" : "learning"} />
            <ArrowUpRight size={14} />
          </Link>
        ))
      ) : (
        <EmptyState
          title="희망 직무의 역량 근거"
          description="모든 주요 역량에 구현 또는 경험 역량 근거가 있습니다. 새로운 시장 요구를 계속 살펴보세요."
        />
      )}
    </div>
  );
}
