"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  ScanLine,
  CircleCheck,
  CircleDashed,
  ExternalLink,
  LoaderCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCareer } from "@/components/shared/career-provider";
import { careerService } from "@/lib/career-service";
import { evidenceStatus, skillName } from "@/lib/career-selectors";
import { EvidenceBadge } from "@/components/skills/evidence-badge";
import {
  PageHeading,
  PageMotion,
  Panel,
  Tags,
  EmptyState,
  LinkButton,
} from "@/components/shared/primitives";
import type { JobPosting } from "@/types/career";
export function JobRequirementComparison({ job }: { job: JobPosting }) {
  const { data, evidence } = useCareer();
  if (!data) return null;
  return (
    <div className="requirement-comparison">
      <div className="comparison-head">
        <span>기업이 요구하는 역량</span>
        <span>내 역량 근거</span>
      </div>
      {job.skills.map((id) => (
        <div className="requirement-row" key={id}>
          <span>
            <span className="skill-initial">
              {skillName(data, id).slice(0, 1)}
            </span>
            <strong>{skillName(data, id)}</strong>
          </span>
          <EvidenceBadge type={evidenceStatus(id, evidence)} />
        </div>
      ))}
    </div>
  );
}
function JobAnalyzerContent() {
  const { data, evidence, profile, saveApplication, setRole } = useCareer();
  const params = useSearchParams();
  const requested = params.get("job");
  const initialJob = data?.jobs.find((j) => j.id === requested) ?? null;
  const [query, setQuery] = useState(initialJob?.company ?? "");
  const [result, setResult] = useState<JobPosting | null>(initialJob);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(!!initialJob);
  const [error, setError] = useState("");
  if (!data) return null;
  const dataset = data;
  const gaps =
    result?.skills.filter((id) =>
      ["none", "learning"].includes(evidenceStatus(id, evidence)),
    ) ?? [];
  const matched =
    result?.skills.filter((id) => evidenceStatus(id, evidence) !== "none")
      .length ?? 0;
  const recorded =
    result &&
    [...data.applications, ...profile.applications].some(
      (a) => a.jobId === result.id,
    );
  const recommendations = result
    ? data.actions.filter(
        (a) =>
          a.role === result.category &&
          a.type === "implementation" &&
          a.skillIds.some((id) => gaps.includes(id)),
      )
    : [];
  async function analyze(e?: React.FormEvent, override?: string) {
    e?.preventDefault();
    const input = override ?? query;
    if (!input.trim()) {
      setError("기업명 또는 공고 URL을 입력하세요.");
      return;
    }
    setError("");
    setLoading(true);
    setSearched(false);
    setResult(null);
    try {
      const job = await careerService.analyzeJob(input);
      setResult(job);
      setSearched(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "분석에 실패했습니다. 다시 시도해주세요.",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <PageMotion>
      <PageHeading
        eyebrow="관심 공고와 내 역량 비교"
        title="이 공고, 나는 얼마나 준비됐을까요?"
        description="채용공고가 원하는 것과 내가 가진 역량 근거를 나란히 비교하세요."
      />
      <section className="analyzer-hero">
        <span className="analyzer-icon">
          <ScanLine size={28} />
        </span>
        <h2>하나의 공고에서 준비할 방향을 찾으세요.</h2>
        <p>기업명 또는 채용공고 URL을 입력해보세요.</p>
        <form className="analyzer-input" onSubmit={analyze}>
          <Search size={19} />
          <input
            aria-label="채용공고 링크 또는 기업명"
            placeholder="채용공고 링크 또는 기업명을 입력하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={2000}
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <LoaderCircle className="animate-spin" size={15} />
            ) : (
              <>
                분석하기 <ArrowRight size={15} />
              </>
            )}
          </Button>
        </form>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <div className="try-companies">
          <span>예시 공고로 체험하기</span>
          {data.jobs.slice(0, 3).map((j) => (
            <button
              key={j.id}
              disabled={loading}
              onClick={() => {
                setQuery(j.company);
                void analyze(undefined, j.company);
              }}
            >
              {j.company}
              <ArrowUpRight size={10} />
            </button>
          ))}
        </div>
        <p className="analyzer-disclaimer">
          아래 기업의 예시 공고로 분석을 체험할 수 있어요:{" "}
          {data.jobs.map((j) => j.company).join(", ")}. 실제 공고 내용을
          수집하거나 분석하지 않습니다.
        </p>
      </section>
      {loading ? (
        <div className="analysis-loading" role="status">
          <ScanLine className="pulse" size={30} />
          <h3>요구 역량과 내 근거를 비교하고 있어요…</h3>
          <p>샘플 요구 역량과 역량 근거를 비교하고 있습니다.</p>
          <div className="skeleton" />
        </div>
      ) : result ? (
        <div className="analysis-result">
          <div className="analyzed-job">
            <div className="job-company-icon" style={{ color: result.color }}>
              {result.company.slice(0, 1)}
            </div>
            <div>
              <span>
                {result.company} <span className="subtle-badge">예시 공고</span>
              </span>
              <h2>{result.position}</h2>
              <p>{result.location}</p>
            </div>
            <div className="analyzed-job-actions">
              <a
                href={result.url}
                target="_blank"
                rel="noreferrer"
                className="arrow-link"
              >
                기업 홈페이지 <ExternalLink size={12} />
              </a>
              <Button
                variant="outline"
                disabled={!!recorded}
                onClick={() =>
                  saveApplication({
                    id: `app-${crypto.randomUUID()}`,
                    jobId: result.id,
                    resumeId: dataset.resumes[0].id,
                    stage: "Applied",
                    appliedAt: new Date().toISOString().slice(0, 10),
                    skillSnapshot: result.skills.filter((id) =>
                      evidence.some((e) => e.skillId === id),
                    ),
                    result:
                      "직접 기록 · 체험 데이터 · 실제 지원서는 전송되지 않음",
                    questions: [],
                    timeline: [
                      {
                        stage: "Applied",
                        date: new Date().toISOString().slice(0, 10),
                        note: "체험 공간에서 직접 기록",
                      },
                    ],
                  })
                }
              >
                {recorded ? "지원 현황에 기록됨" : "체험 지원 기록 추가"}
              </Button>
            </div>
          </div>
          <div className="two-column">
            <Panel
              title="기업 요구 역량과 내 근거 비교"
              subtitle={`${matched} of ${result.skills.length} required skills have evidence · includes learning`}
            >
              <JobRequirementComparison job={result} />
            </Panel>
            <div className="stack">
              <Panel
                title="내가 보완할 역량"
                subtitle="지원 전 우선 준비하면 좋은 역량"
              >
                {gaps.length ? (
                  <>
                    <Tags items={gaps.map((id) => skillName(data, id))} />
                    <p className="small-copy" style={{ marginTop: 17 }}>
                      학습 역량 근거만 있거나 아직 근거가 없는 역량입니다. 실제
                      구현과 연결하면 더 명확한 이야기가 됩니다.
                    </p>
                  </>
                ) : (
                  <p className="icon-inline green-text">
                    <CircleCheck size={17} />
                    모든 요구 역량에서 구현 또는 경력 근거가 확인됐어요.
                  </p>
                )}
              </Panel>
              <Panel
                title="지원 전 추천 활동"
                subtitle="지금 시작할 수 있는 준비"
              >
                <div className="before-applying">
                  {recommendations.length ? (
                    recommendations.map((action) => (
                      <div key={action.id}>
                        <CircleDashed size={16} />
                        <span>{action.title}</span>
                      </div>
                    ))
                  ) : (
                    <p className="small-copy">
                      프로젝트 README에 구현 방법과 결과를 정리하고, 공고에 맞는
                      경험을 이력서에 강조하세요.
                    </p>
                  )}
                </div>
                <LinkButton
                  href="/agent"
                  secondary
                  onClick={() => setRole(result.category)}
                >
                  커리어 코치에서 활동 보기 <ArrowUpRight size={14} />
                </LinkButton>
              </Panel>
            </div>
          </div>
        </div>
      ) : searched ? (
        <EmptyState
          title="분석할 수 있는 예시 공고가 없어요."
          description="이 기업의 샘플 데이터가 없습니다. 위의 체험 기업을 선택하거나 기업 홈페이지 URL을 입력하세요. 실제 공고 분석은 Backend 연결 후 가능합니다."
        />
      ) : (
        <div className="analyzer-empty">
          <div>
            <ScanLine size={21} />
            <strong>요구 역량을 확인하고,</strong>
            <p>공고의 핵심 기술을 확인하고</p>
          </div>
          <ArrowRight size={18} />
          <div>
            <CircleCheck size={21} />
            <strong>내 경험과 비교한 뒤,</strong>
            <p>이미 쌓아온 근거와 비교하고</p>
          </div>
          <ArrowRight size={18} />
          <div>
            <ArrowUpRight size={21} />
            <strong>다음 준비를 시작하세요.</strong>
            <p>지원 전 준비할 행동을 정하세요</p>
          </div>
        </div>
      )}
    </PageMotion>
  );
}
function JobAnalyzerRoute() {
  const params = useSearchParams();
  return <JobAnalyzerContent key={params.get("job") ?? "empty"} />;
}
export function JobAnalyzerPage() {
  return (
    <Suspense fallback={<p>공고 분석을 준비하고 있어요…</p>}>
      <JobAnalyzerRoute />
    </Suspense>
  );
}
