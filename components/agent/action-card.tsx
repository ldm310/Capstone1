"use client";
import {
  ArrowRight,
  Check,
  Clock3,
  Sparkles,
  Code2,
  BookOpen,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useCareer } from "@/components/shared/career-provider";
import { Tags, ArrowLink } from "@/components/shared/primitives";
import { skillName } from "@/lib/career-selectors";
import type { RecommendedAction } from "@/types/career";
export function ActionCard({
  action,
  compact = false,
}: {
  action: RecommendedAction;
  compact?: boolean;
}) {
  const { data, profile, startAction, completeAction } = useCareer();
  const status = profile.actionStatus[action.id] ?? "suggested";
  if (!data) return null;
  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`action-card ${compact ? "compact" : ""} ${action.type === "learning" ? "learning-action" : ""}`}
    >
      <div className="action-card-eyebrow">
        <span>
          <Sparkles size={14} />
          {compact
            ? "지금 시작할 추천 활동"
            : action.type === "learning"
              ? "학습 활동"
              : "추천 활동"}
        </span>
        <span className="action-duration">
          <Clock3 size={11} />
          {action.duration}
        </span>
      </div>
      <h3>{action.title}</h3>
      <p>{action.description}</p>
      <div className="expected-label">활동 후 쌓을 역량</div>
      <Tags items={action.skillIds.map((id) => skillName(data, id))} />
      {!compact && (
        <ol className="action-steps">
          {action.steps.map((step, i) => (
            <li key={step}>
              <span>
                {status === "completed" ? <Check size={12} /> : i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      )}
      <div className="action-card-bottom">
        <span className="action-type">
          {action.type === "learning" ? (
            <BookOpen size={13} />
          ) : (
            <Code2 size={13} />
          )}{" "}
          {action.type === "learning" ? "학습 근거" : "구현 근거"}
        </span>
        {status === "completed" ? (
          <span className="completed-label">
            <Check size={14} />
            체험 근거 추가 완료
          </span>
        ) : status === "active" ? (
          compact ? (
            <ArrowLink href="/agent">활동 이어하기</ArrowLink>
          ) : (
            <Button onClick={() => completeAction(action)}>
              체험 활동 완료하기 <Check size={14} />
            </Button>
          )
        ) : (
          <Button onClick={() => startAction(action.id)}>
            활동 시작하기 <ArrowRight size={14} />
          </Button>
        )}
      </div>
      {status === "active" && !compact && (
        <p className="micro-copy">
          완료를 누르면 모의 역량 근거를 추가합니다. 실제 코드 검증은 하지
          않습니다.
        </p>
      )}
    </motion.article>
  );
}
