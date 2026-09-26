"use client";
import { OverviewPanel } from "./panels/overview";
import { SourcesPanel } from "./panels/sources";
import { JobsPanel } from "./panels/jobs";
import { PreferencesPanel } from "./panels/preferences";
import { PlanPanel } from "./panels/plan";
import { SchedulePanel } from "./panels/schedule";
import { ApplicationsPanel } from "./panels/applications";
import { InterviewPanel } from "./panels/interview";
import { SharePanel } from "./panels/share";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Workspace } from "@/types/workspace";
import type { PublicJob } from "@/types/public-job";
import { currentFindings, targetSkills, day } from "@/lib/workspace-selectors";
const tabs = [
  ["overview", "지금 할 일"],
  ["sources", "자료 분석"],
  ["jobs", "공고 비교·추천"],
  ["plan", "주간 계획"],
  ["schedule", "일정·알림"],
  ["applications", "지원·이력서"],
  ["interview", "면접 준비"],
  ["share", "포트폴리오 공유"],
];
export function CareerWorkspace() {
  const router = useRouter();
  const params = useSearchParams();
  const tab = tabs.some(([key]) => key === params.get("tab"))
    ? params.get("tab")!
    : "overview";
  const [state, setState] = useState<Workspace | null>(null),
    [name, setName] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState(""),
    [error, setError] = useState(""),
    [jobs, setJobs] = useState<PublicJob[]>([]),
    [jobsError, setJobsError] = useState(""),
    [shares, setShares] = useState<string[]>([]),
    [selected, setSelected] = useState<string[]>([]);
  useEffect(() => {
    let active = true;
    fetch("/api/career")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (active) {
          setState(data.workspace);
          setName(data.user.name);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  async function request(url: string, body: unknown, method = "POST") {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch(url, {
        method,
        ...(body instanceof FormData
          ? { body }
          : {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "처리하지 못했습니다.");
      if (data.workspace) setState(data.workspace);
      setNotice("서버에 저장했습니다.");
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : "요청 실패");
      return null;
    } finally {
      setBusy(false);
    }
  }
  async function save(action: string, patch: object) {
    const previous = state;
    if (action === "tasks" && state) setState({ ...state, ...patch });
    const result = await request("/api/career", { action, ...patch });
    if (!result && action === "tasks") setState(previous);
    return result;
  }
  const authenticated = !!state;
  useEffect(() => {
    if (tab !== "jobs" || !authenticated) return;
    let active = true;
    async function load() {
      try {
        const all: PublicJob[] = [];
        let offset: number | null = 0;
        while (offset !== null && offset < 300) {
          const res: Response = await fetch(
            `/api/jobs?limit=24&offset=${offset}&role=all`,
          );
          if (!res.ok)
            throw new Error(
              "공고를 불러오지 못했습니다. 페이지를 다시 열어주세요.",
            );
          const data: import("@/types/public-job").PublicJobsResponse =
            await res.json();
          all.push(...data.jobs);
          offset = data.nextOffset;
        }
        if (active) {
          setJobs(all);
          setJobsError("");
        }
      } catch (e) {
        if (active) setJobsError(String(e));
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [tab, authenticated]);
  useEffect(() => {
    if (tab !== "share") return;
    fetch("/api/share")
      .then((r) => r.json())
      .then((d) =>
        setShares((d.shares || []).map((s: { token: string }) => s.token)),
      )
      .catch(() => setError("공유 링크를 불러오지 못했습니다."));
  }, [tab]);
  if (loading) return <p role="status">계정 자료를 불러오는 중…</p>;
  if (!state)
    return (
      <div className="career-panel">
        <h1>내 자료로 시작하는 Career</h1>
        <p>{error || "로그인이 필요합니다."}</p>
        <Link className="career-primary" href="/sign-in">
          로그인·계정 만들기 <ArrowRight size={17} />
        </Link>
        <p>기존 체험 데이터와 분리된 계정 전용 공간입니다.</p>
      </div>
    );
  const findings = currentFindings(state),
    skills = [...new Set(findings.map((f) => f.skill))],
    targets = targetSkills[state.role] || targetSkills.ax;
  const gaps = targets.filter(
    (s) => !findings.some((f) => f.skill === s && f.type === "implementation"),
  );
  const next = gaps[0];
  const upcoming = state.events
    .filter((e) => e.date >= day() && e.date.slice(0, 10) <= day(7))
    .sort((a, b) => a.date.localeCompare(b.date));
  const latest = state.runs[0],
    previous =
      latest && state.runs.slice(1).find((r) => r.title === latest.title);
  const added = [
    ...new Map(
      (
        latest?.findings.filter(
          (f) => !previous?.findings.some((p) => p.skill === f.skill),
        ) || []
      ).map((f) => [f.skill, f]),
    ).values(),
  ];
  const removed = [
    ...new Map(
      (
        previous?.findings.filter(
          (f) => !latest?.findings.some((p) => p.skill === f.skill),
        ) || []
      ).map((f) => [f.skill, f]),
    ).values(),
  ];
  const jobSkills = state.job
    ? [
        ...new Set([
          ...state.job.required,
          ...state.job.preferred,
          ...state.job.unknown,
        ]),
      ]
    : [];
  const questions = (jobSkills.length ? jobSkills : targets)
    .slice(0, 6)
    .map((skill) => ({
      key: skill,
      text: `${skill}을 사용한 경험을 설명하고, 선택 이유와 한계·개선 방법을 이야기해 주세요.`,
      evidence: findings.find((f) => f.skill === skill),
    }));
  const panelProps = {
    state,
    findings,
    skills,
    gaps,
    next,
    upcoming,
    latest,
    previous,
    added,
    removed,
    jobs,
    busy,
    request,
    save,
    setNotice,
    params,
    jobsError,
    setError,
    targets,
    jobSkills,
    questions,
    shares,
    selected,
    setSelected,
    setShares,
  };
  return (
    <div className="career-workspace">
      <header className="career-heading">
        <div>
          <span className="live-label">내 계정 · 서버 저장</span>
          <h1>{name}님의 커리어</h1>
          <p>근거를 모으고, 다음 행동으로 연결하세요.</p>
        </div>
        <button
          className="plain-button"
          onClick={async () => {
            if (await request("/api/account", { action: "logout" }))
              router.push("/sign-in");
          }}
        >
          로그아웃
        </button>
      </header>
      <nav className="career-tabs" aria-label="내 계정 메뉴">
        {tabs.map(([key, label]) => (
          <Link
            aria-current={tab === key ? "page" : undefined}
            key={key}
            href={`/career?tab=${key}`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div aria-live="polite">
        {busy && (
          <p className="career-status">
            처리 중입니다. 분석에는 잠시 시간이 걸릴 수 있어요…
          </p>
        )}
        {notice && <p className="career-status">{notice}</p>}
        {error && (
          <p role="alert" className="career-error">
            {error}
          </p>
        )}
      </div>
      {tab === "overview" && <OverviewPanel {...panelProps} />}
      {tab === "sources" && <SourcesPanel {...panelProps} />}
      {tab === "jobs" && <JobsPanel {...panelProps} />}
      {(tab === "plan" || tab === "jobs") && (
        <PreferencesPanel {...panelProps} />
      )}
      {tab === "plan" && <PlanPanel {...panelProps} />}
      {tab === "schedule" && <SchedulePanel {...panelProps} />}
      {tab === "applications" && <ApplicationsPanel {...panelProps} />}
      {tab === "interview" && <InterviewPanel {...panelProps} />}
      {tab === "share" && <SharePanel {...panelProps} />}
    </div>
  );
}
