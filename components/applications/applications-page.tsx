"use client";
import { useState } from "react";
import {
  Search,
  Plus,
  ArrowUpRight,
  FileText,
  BriefcaseBusiness,
  CalendarDays,
  MessageSquare,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCareer } from "@/components/shared/career-provider";
import {
  PageHeading,
  PageMotion,
  Panel,
  Tags,
  EmptyState,
  LinkButton,
} from "@/components/shared/primitives";
import { skillName } from "@/lib/career-selectors";
import { ApplicationTimeline } from "./application-timeline";
import { stageLabels } from "@/lib/korean";
import type { Application, ApplicationStage } from "@/types/career";
const stages: ApplicationStage[] = [
  "Applied",
  "Document",
  "Coding Test",
  "Interview",
  "Final",
];
export function ApplicationsPage() {
  const { data, profile, evidence, saveApplication } = useCareer();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Application | null>(null);
  const [adding, setAdding] = useState(false);
  const [jobId, setJobId] = useState("lg-ax");
  const [resumeId, setResumeId] = useState("cv2");
  const [stage, setStage] = useState<ApplicationStage>("Applied");
  const [date, setDate] = useState("2026-09-25");
  if (!data) return null;
  const all = [...data.applications, ...profile.applications];
  const applications = all.filter((a) => {
    const job = data.jobs.find((j) => j.id === a.jobId);
    return (
      job &&
      `${job.company} ${job.position}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === "All" || a.stage === filter)
    );
  });
  const selectedJob = selected
    ? data.jobs.find((j) => j.id === selected.jobId)
    : null;
  const selectedResume = selected
    ? data.resumes.find((r) => r.id === selected.resumeId)
    : null;
  function add(e: React.FormEvent) {
    e.preventDefault();
    const job = data!.jobs.find((j) => j.id === jobId)!;
    saveApplication({
      id: `app-${crypto.randomUUID()}`,
      jobId,
      resumeId,
      stage,
      appliedAt: date,
      skillSnapshot: job.skills.filter((id) =>
        evidence.some((e) => e.skillId === id),
      ),
      result: "직접 기록 · 체험 데이터",
      questions: [],
      timeline: [{ stage, date, note: "체험 공간에서 진행 단계 기록" }],
    });
    setAdding(false);
  }
  return (
    <PageMotion>
      <PageHeading
        eyebrow="지원 과정과 기록을 한곳에"
        title="지원부터 면접까지, 놓치지 않도록"
        description="지원한 순간의 역량과 이력서, 그리고 다음 단계를 함께 기록하세요."
      >
        <Button
          onClick={() => {
            setDate(new Date().toISOString().slice(0, 10));
            setAdding(true);
          }}
        >
          <Plus size={14} />
          지원 기록 추가
        </Button>
      </PageHeading>
      <div className="application-summary">
        <div>
          <BriefcaseBusiness size={18} />
          <strong>{all.length}</strong>
          <span>전체 지원</span>
        </div>
        <div>
          <FileText size={18} />
          <strong>
            {
              all.filter((a) =>
                ["Applied", "Document", "Coding Test"].includes(a.stage),
              ).length
            }
          </strong>
          <span>진행 중</span>
        </div>
        <div>
          <MessageSquare size={18} />
          <strong>{all.filter((a) => a.stage === "Interview").length}</strong>
          <span>면접</span>
        </div>
        <div>
          <CalendarDays size={18} />
          <strong>{all.filter((a) => a.stage === "Final").length}</strong>
          <span>최종 전형</span>
        </div>
      </div>
      <Panel className="applications-panel">
        <div className="applications-toolbar">
          <div className="pill-tabs">
            {["All", ...stages].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                aria-pressed={filter === s}
              >
                {s === "All" ? "전체" : stageLabels[s as ApplicationStage]}
              </button>
            ))}
          </div>
          <label className="search-input">
            <Search size={14} />
            <input
              aria-label="지원 기록 검색"
              placeholder="기업명 검색…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
        {applications.length ? (
          <div className="table-scroll">
            <table className="application-table">
              <thead>
                <tr>
                  <th>기업 / 지원 직무</th>
                  <th>이력서</th>
                  <th>진행 단계</th>
                  <th>지원일</th>
                  <th>
                    <span className="sr-only">상세 보기</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => {
                  const job = data.jobs.find(
                    (j) => j.id === application.jobId,
                  )!;
                  const resume = data.resumes.find(
                    (r) => r.id === application.resumeId,
                  )!;
                  return (
                    <tr key={application.id}>
                      <td>
                        <button
                          className="application-company"
                          onClick={() => setSelected(application)}
                        >
                          <span
                            className="company-letter"
                            style={{ color: job.color }}
                          >
                            {job.company.slice(0, 1)}
                          </span>
                          <span>
                            <strong>{job.company}</strong>
                            <small>{job.position}</small>
                          </span>
                        </button>
                      </td>
                      <td>
                        <span className="resume-chip">
                          <FileText size={12} />
                          {resume.version}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`stage-badge stage-${application.stage.toLowerCase().replaceAll(" ", "-")}`}
                        >
                          <i />
                          {stageLabels[application.stage]}
                        </span>
                      </td>
                      <td>{application.appliedAt.replaceAll("-", ".")}</td>
                      <td>
                        <button
                          className="icon-button"
                          aria-label={`${job.company} 지원 기록 보기`}
                          onClick={() => setSelected(application)}
                        >
                          <ArrowUpRight size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="조건에 맞는 지원 기록이 없어요."
            description="필터를 바꾸거나 새로운 지원 기록을 추가하세요."
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setFilter("All");
                  setSearch("");
                }}
              >
                필터 초기화
              </Button>
            }
          />
        )}
        <div className="application-table-footer">
          <span>{applications.length} 건의 지원 기록</span>
          <span>체험용 지원 기록입니다 · 실제 지원서는 전송되지 않습니다</span>
        </div>
      </Panel>
      <div className="info-note" style={{ marginTop: 23 }}>
        <FileText size={17} />
        <span>
          지원 당시 역량 기록은 지원 기록을 추가한 시점의 역량 근거를
          저장합니다. 이후 역량이 성장해도 당시의 기록은 그대로 유지됩니다.
        </span>
      </div>
      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent placement="right" className="application-drawer">
          {selected && selectedJob && (
            <>
              <div className="drawer-heading">
                <span className="eyebrow">지원 기록 상세</span>
                <DialogTitle>{selectedJob.company}</DialogTitle>
                <DialogDescription>
                  {selectedJob.position} · {selected.appliedAt}
                </DialogDescription>
              </div>
              <h3 className="drawer-section-title">지원 진행 과정</h3>
              <ApplicationTimeline application={selected} />
              <h3 className="drawer-section-title">공고 요구 역량</h3>
              <Tags
                items={selectedJob.skills.map((id) => skillName(data, id))}
              />
              <h3 className="drawer-section-title">지원 당시의 역량</h3>
              {selected.skillSnapshot.length ? (
                <Tags
                  items={selected.skillSnapshot.map((id) =>
                    skillName(data, id),
                  )}
                />
              ) : (
                <p className="small-copy">
                  지원 기록 당시 확인된 근거가 없어요.
                </p>
              )}
              <p className="micro-copy">
                지원 기록 당시의 근거 · 학습 근거 포함
              </p>
              <h3 className="drawer-section-title">이력서 버전</h3>
              <p className="small-copy icon-inline">
                <FileText size={14} />
                {selectedResume?.name} · {selectedResume?.version}
              </p>
              <h3 className="drawer-section-title">지원 결과</h3>
              <p className="small-copy">{selected.result}</p>
              <h3 className="drawer-section-title">면접 질문</h3>
              {selected.questions.length ? (
                <ul className="interview-questions">
                  {selected.questions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              ) : (
                <p className="small-copy">아직 기록한 면접 질문이 없어요.</p>
              )}
              <LinkButton
                href={`/job-analyzer?job=${selected.jobId}`}
                secondary
              >
                현재 역량과 비교하기 <ArrowUpRight size={14} />
              </LinkButton>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={adding} onOpenChange={setAdding}>
        <DialogContent>
          <DialogTitle>지원 기록 추가하기</DialogTitle>
          <DialogDescription>
            지원 현황만 기록합니다. 기업에 실제 지원서를 보내지 않습니다.
          </DialogDescription>
          <form className="form-grid" onSubmit={add}>
            <label className="field-label">
              지원 공고
              <select
                className="native-select"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
              >
                {data.jobs.map((j) => (
                  <option value={j.id} key={j.id}>
                    {j.company} · {j.position}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label">
              이력서 버전
              <select
                className="native-select"
                value={resumeId}
                onChange={(e) => setResumeId(e.target.value)}
              >
                {data.resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} · {r.version}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label">
              진행 단계
              <select
                className="native-select"
                value={stage}
                onChange={(e) => setStage(e.target.value as ApplicationStage)}
              >
                {stages.map((s) => (
                  <option key={s} value={s}>
                    {stageLabels[s]}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label">
              지원일
              <input
                required
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <Button type="submit">지원 기록 저장</Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageMotion>
  );
}
