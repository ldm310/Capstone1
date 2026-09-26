"use client";
import type { PanelProps } from "./types";
import { ExternalLink, Upload, GitBranch } from "lucide-react";
import { evidenceLabel } from "./helpers";
export function SourcesPanel({
  busy,
  request,
  findings,
}: Pick<PanelProps, "busy" | "request" | "findings">) {
  return (
    <>
      <section className="career-panel">
        <h2>자료 속 기술과 원문 찾기</h2>
        <p>
          실제 내용을 읽고 기술 패턴을 추출합니다. 기술 언급·코드 존재를
          보여주며, 숙련도·코드 실행·작성자 여부를 검증하지 않습니다.
        </p>
        <div className="career-two">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              await request("/api/analyze", {
                kind: "github",
                url: form.get("url"),
              });
            }}
          >
            <h3>
              <GitBranch size={18} /> GitHub 공개 저장소
            </h3>
            <label>
              저장소 URL
              <input
                name="url"
                type="url"
                required
                placeholder="https://github.com/owner/repository"
              />
            </label>
            <small>
              최대 20개 소스·설정 파일을 읽고 커밋·파일·행 링크를 남깁니다.
            </small>
            <button disabled={busy}>프로젝트 분석하기</button>
          </form>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const element = e.currentTarget;
              const form = new FormData(element);
              const result = await request("/api/documents", form);
              if (result) element.reset();
            }}
          >
            <h3>
              <Upload size={18} /> 이력서·Notion 내보내기
            </h3>
            <label>
              자료 종류
              <select name="source">
                <option value="cv">이력서·경력 문서</option>
                <option value="notion">Notion 학습 문서</option>
              </select>
            </label>
            <label>
              파일 선택
              <input
                required
                type="file"
                name="file"
                accept=".pdf,.docx,.md,.txt"
              />
            </label>
            <small>
              PDF·DOCX·MD·TXT / 10MB 이하. 원본 파일이 내 계정에 저장됩니다.
            </small>
            <button disabled={busy}>파일 저장하고 분석하기</button>
          </form>
        </div>
        <details>
          <summary>Notion 페이지를 직접 연결하기</summary>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const token = e.currentTarget.elements.namedItem(
                "token",
              ) as HTMLInputElement;
              const data = {
                kind: "notion",
                url: form.get("url"),
                token: form.get("token"),
              };
              token.value = "";
              await request("/api/analyze", data);
            }}
          >
            <label>
              페이지 주소
              <input name="url" type="url" required />
            </label>
            <label>
              해당 페이지에 접근 가능한 연결 토큰
              <input name="token" type="password" autoComplete="off" required />
            </label>
            <small>
              토큰은 이번 조회에만 사용하며 저장하지 않습니다. Notion에서 해당
              연결에 페이지 접근 권한을 먼저 부여하세요. 현재는 OAuth 로그인이
              아닌 연결 토큰 방식입니다.
            </small>
            <button disabled={busy}>Notion 분석하기</button>
          </form>
        </details>
      </section>
      <section className="career-panel">
        <h2>발견한 근거 · {findings.length}개</h2>
        {!findings.length && (
          <p>아직 근거가 없습니다. 자료 분석부터 시작하세요.</p>
        )}
        {findings.map((f) => (
          <article className="finding" key={f.id}>
            <span className="live-label">
              {f.skill} · {evidenceLabel(f)}
            </span>
            <h3>{f.title}</h3>
            <pre>{f.quote}</pre>
            <a href={f.url} target="_blank" rel="noreferrer">
              원문에서 확인 <ExternalLink size={13} />
            </a>
          </article>
        ))}
      </section>
    </>
  );
}
