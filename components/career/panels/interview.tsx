"use client";
import type { PanelProps } from "./types";
export function InterviewPanel({
  state,
  busy,
  save,
  questions,
}: Pick<PanelProps, "state" | "busy" | "save" | "questions">) {
  return (
    <section className="career-panel">
      <span className="live-label">공고·근거 기반 질문 템플릿</span>
      <h2>내 경험으로 답변 준비하기</h2>
      <p>
        {state.job
          ? `${state.job.company} 공고에서 추출한 기술을 기준으로 구성했습니다.`
          : "공고가 없어 목표 직무의 기본 기술로 구성했습니다."}{" "}
        AI 채점이나 합격 예측은 하지 않습니다.
      </p>
      {questions.map((q) => (
        <form
          key={q.key}
          className="finding"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            void save("answers", {
              answers: {
                ...state.answers,
                [q.key]: String(f.get("answer")),
              },
            });
          }}
        >
          <h3>{q.text}</h3>
          {q.evidence ? (
            <p>
              답변에 활용할 근거:{" "}
              <a href={q.evidence.url} target="_blank" rel="noreferrer">
                {q.evidence.title} ↗
              </a>
            </p>
          ) : (
            <p>
              관련 근거가 없습니다. 경험을 지어내지 말고 학습한 내용과 구현
              계획을 구분해서 준비하세요.
            </p>
          )}
          <label>
            상황 → 내 역할 → 선택 이유 → 결과
            <textarea
              name="answer"
              rows={4}
              defaultValue={state.answers[q.key] || ""}
              maxLength={10000}
            />
          </label>
          <button disabled={busy}>답변 저장</button>
        </form>
      ))}
    </section>
  );
}
