"use client";
import type { PanelProps } from "./types";
export function SharePanel({
  busy,
  request,
  setNotice,
  findings,
  shares,
  selected,
  setSelected,
  setShares,
}: Pick<
  PanelProps,
  | "busy"
  | "request"
  | "setNotice"
  | "findings"
  | "shares"
  | "selected"
  | "setSelected"
  | "setShares"
>) {
  return (
    <section className="career-panel">
      <h2>공개할 근거만 골라 공유하기</h2>
      <p>
        선택한 기술·자료 이름·발췌문·이름이 공개됩니다. 이력서 원본, Notion
        비공개 링크, 지원 기록은 공개하지 않습니다. 민감한 발췌문이 없는지
        아래에서 확인하세요.
      </p>
      {findings.map((f) => (
        <label className="share-choice" key={f.id}>
          <input
            type="checkbox"
            checked={selected.includes(f.id)}
            onChange={() =>
              setSelected((s) =>
                s.includes(f.id) ? s.filter((x) => x !== f.id) : [...s, f.id],
              )
            }
          />
          <span>
            <strong>
              {f.skill} · {f.title}
            </strong>
            <pre>{f.quote}</pre>
          </span>
        </label>
      ))}
      {!findings.length && (
        <p>자료 분석 후 공유할 근거를 선택할 수 있습니다.</p>
      )}
      <button
        disabled={busy || !selected.length}
        onClick={async () => {
          const data = await request("/api/share", { ids: selected });
          if (data?.url) {
            setShares((s) => [data.url!.split("/").pop()!, ...s]);
            setNotice("선택한 근거로 공유 링크를 만들었습니다.");
          }
        }}
      >
        선택한 {selected.length}개 근거 공개 링크 만들기
      </button>
      <h3>공개 중인 링크</h3>
      {shares.map((token) => (
        <div className="career-row" key={token}>
          <a href={`/share/${token}`} target="_blank" rel="noreferrer">
            포트폴리오 열기 ↗
          </a>
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(
                `${location.origin}/share/${token}`,
              );
              setNotice("링크를 복사했습니다.");
            }}
          >
            링크 복사
          </button>
          <button
            disabled={busy}
            onClick={async () => {
              if (await request("/api/share", { token }, "DELETE"))
                setShares((s) => s.filter((t) => t !== token));
            }}
          >
            공유 중단
          </button>
        </div>
      ))}
      <small>
        공유 링크는 생성 시점의 사본입니다. 업데이트하려면 새 링크를 만들고 이전
        링크를 중단하세요.
      </small>
    </section>
  );
}
