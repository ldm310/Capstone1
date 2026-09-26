"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  ArrowUp,
  Sparkles,
  TrendingUp,
  BookOpen,
  Check,
  CircleDashed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCareer } from "@/components/shared/career-provider";
import {
  PageHeading,
  PageMotion,
  RoleSelect,
  Panel,
  EmptyState,
} from "@/components/shared/primitives";
import { getGaps } from "@/lib/career-selectors";
import { ActionCard } from "./action-card";
export function AgentPage() {
  const { data, profile, evidence } = useCareer();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<
    { question: string; answer: string }[]
  >([]);
  if (!data) return null;
  const gaps = getGaps(data, profile.role, evidence);
  const priority = gaps.find((g) => g.status === "none") ?? gaps[0];
  const actions = data.actions.filter((a) => a.role === profile.role);
  const completed = actions.filter(
    (a) => profile.actionStatus[a.id] === "completed",
  );
  const next = actions.find((a) => profile.actionStatus[a.id] !== "completed");
  function ask(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setMessages((m) => [
      ...m,
      {
        question: question.trim(),
        answer: next
          ? `체험 제안: “${next.title}”부터 시작해보세요. ${next.description} 아래 활동의 단계에 따라 진행하고 역량 근거를 추가하세요. 이 답변은 현재 직무의 미완료 활동을 보여주는 규칙 기반 응답입니다.`
          : "현재 직무의 샘플 활동을 모두 완료했습니다. 공고 분석에서 새로운 공고와 비교해보세요. 이 응답은 체험 안내입니다.",
      },
    ]);
    setQuestion("");
  }
  return (
    <PageMotion>
      <PageHeading
        eyebrow="지금 필요한 행동부터"
        title="나를 위한 다음 활동"
        description="막연한 준비 대신, 지금 필요한 한 가지 행동부터 시작하세요."
      >
        <RoleSelect />
      </PageHeading>
      <div className="agent-layout">
        <div className="stack">
          <div className="priority-card">
            <div className="priority-title">
              <span className="icon-tile green">
                <Sparkles size={20} />
              </span>
              <div>
                <span className="eyebrow">가장 먼저 보완할 역량</span>
                <h2>{priority?.name ?? "경험을 쌓고 근거를 늘려보세요"}</h2>
              </div>
              <span className="subtle-badge">맞춤 추천 체험</span>
            </div>
            {priority ? (
              <div className="priority-facts">
                <div>
                  <small>시장 수요</small>
                  <strong>
                    {priority.demand >= 35 ? "높음" : "새롭게 주목"}{" "}
                    <span>{priority.demand}%의 예시 공고</span>
                  </strong>
                </div>
                <div>
                  <small>내 역량 근거</small>
                  <strong>
                    <CircleDashed size={14} />
                    {priority.status === "none"
                      ? "근거 없음"
                      : "학습 근거만 있음"}
                  </strong>
                </div>
                <div>
                  <small>수요 변화</small>
                  <strong className="green-text">
                    <TrendingUp size={15} />+{priority.trend} pp
                  </strong>
                </div>
              </div>
            ) : (
              <p className="small-copy">
                주요 시장 역량에 역량 근거가 발견되었습니다. 구현 내용을 더
                구체적으로 기록해보세요.
              </p>
            )}
          </div>
          {actions
            .filter((a) => profile.actionStatus[a.id] !== "completed")
            .map((action) => (
              <ActionCard key={action.id} action={action} />
            ))}
          {!next && (
            <EmptyState
              title="다음 역량을 만드는 작은 실천"
              description="샘플 활동을 모두 완료했습니다. 추가한 역량 근거와 바뀐 근거 확인 비율를 Dashboard에서 확인하세요."
            />
          )}
          {completed.length > 0 && (
            <Panel title="새롭게 쌓은 역량 근거" subtitle="완료한 체험 활동">
              {completed.map((action) => (
                <div className="completed-action" key={action.id}>
                  <Check size={16} />
                  <div>
                    <strong>{action.title}</strong>
                    <p>체험 근거 저장 완료 · 내 역량에서 확인하세요</p>
                  </div>
                  <ArrowUpRight size={15} />
                </div>
              ))}
            </Panel>
          )}
          <div className="agent-chat">
            <span className="eyebrow">막막할 땐 코치에게 물어보세요</span>
            <div className="agent-messages" role="log" aria-live="polite">
              {messages.map((m, i) => (
                <div key={i}>
                  <p className="chat-question">{m.question}</p>
                  <p className="chat-answer">
                    <Sparkles size={15} />
                    <span>{m.answer}</span>
                  </p>
                </div>
              ))}
            </div>
            <form onSubmit={ask}>
              <input
                aria-label="커리어 코치에게 질문"
                placeholder="준비하면서 궁금한 점을 입력하세요…"
                value={question}
                maxLength={1000}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <Button
                size="icon"
                type="submit"
                aria-label="질문 보내기"
                disabled={!question.trim()}
              >
                <ArrowUp size={16} />
              </Button>
            </form>
            <small>
              체험 안내 · 정해진 규칙으로 답변하며 실제 AI 모델은 연결되지
              않았습니다.
            </small>
          </div>
        </div>
        <aside className="agent-aside">
          <Panel
            title="작은 실천이 확실한 경험으로"
            subtitle="경험이 역량으로 이어지는 과정"
          >
            <div className="evidence-loop">
              {[
                "보완할 역량 찾기",
                "추천 활동 선택하기",
                "직접 만들고 학습하기",
                "역량 근거 추가",
                "달라진 역량 확인하기",
              ].map((text, i) => (
                <div key={text}>
                  <span>{i + 1}</span>
                  {text}
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="추천 학습 자료" subtitle="학습 자료가 모일 공간">
            <div className="resource-placeholder">
              <BookOpen size={25} />
              <h3>다음 학습을 여기서 시작하세요.</h3>
              <p>
                직무와 활동에 맞춘 문서, 튜토리얼, 예제를 연결할 예정입니다.
              </p>
              <span>학습 자료 연동 준비 중</span>
            </div>
          </Panel>
          <div className="agent-note">
            성장은 점수가 아닙니다.
            <br />
            직접 보여줄 수 있는 경험입니다.
          </div>
        </aside>
      </div>
    </PageMotion>
  );
}
