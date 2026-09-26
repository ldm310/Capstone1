"use client";
import { useEffect, useRef, useState } from "react";
import {
  Bookmark,
  BriefcaseBusiness,
  ExternalLink,
  MapPin,
  RefreshCw,
  Search,
} from "lucide-react";
import type { PublicJob, PublicJobsResponse } from "@/types/public-job";
import { roleLabels } from "@/lib/korean";
const storageKey = "career-twin:saved-public-jobs:v1";
export function LiveJobsSection() {
  const [savedCards, setSavedCards] = useState<PublicJob[]>([]);
  const [feed, setFeed] = useState<PublicJobsResponse | null>(null);
  const [role, setRole] = useState("all"),
    [savedOnly, setSavedOnly] = useState(false),
    [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const controller = useRef<AbortController | null>(null);
  async function load(offset: number, selectedRole: string, term = query) {
    controller.current?.abort();
    const current = new AbortController();
    controller.current = current;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/jobs?offset=${offset}&limit=4&role=${selectedRole}&q=${encodeURIComponent(term)}`,
        { signal: current.signal },
      );
      if (!response.ok)
        throw new Error(
          "공고를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.",
        );
      const next: PublicJobsResponse = await response.json();
      if (current.signal.aborted) return;
      try {
        const ids: unknown = JSON.parse(
          localStorage.getItem(storageKey) ?? "[]",
        );
        if (Array.isArray(ids)) {
          const recovered = next.jobs.filter((job) => ids.includes(job.id));
          if (recovered.length)
            setSavedCards((previous) => {
              const cards = [
                ...new Map(
                  [...previous, ...recovered].map((job) => [job.id, job]),
                ).values(),
              ];
              try {
                localStorage.setItem(
                  storageKey + ":cards",
                  JSON.stringify(cards),
                );
              } catch {}
              return cards;
            });
        }
      } catch {}

      setFeed((previous) => ({
        ...next,
        jobs:
          offset && previous
            ? [
                ...new Map(
                  [...previous.jobs, ...next.jobs].map((job) => [job.id, job]),
                ).values(),
              ]
            : next.jobs,
      }));
      setMessage(`${next.jobs.length}개 공고를 불러왔어요.`);
    } catch (reason) {
      if (!current.signal.aborted)
        setError(
          reason instanceof Error ? reason.message : "연결을 확인해 주세요.",
        );
    } finally {
      if (!current.signal.aborted) setLoading(false);
    }
  }
  useEffect(() => {
    let mounted = true;
    Promise.resolve().then(() => {
      if (!mounted) return;
      try {
        const cards = JSON.parse(
          localStorage.getItem(storageKey + ":cards") ?? "[]",
        );
        if (Array.isArray(cards))
          setSavedCards(
            cards.filter(
              (j) =>
                typeof j.id === "string" &&
                typeof j.url === "string" &&
                j.url.startsWith("https://jobs.lever.co/"),
            ),
          );
      } catch {}
      try {
        const value: unknown = JSON.parse(
          localStorage.getItem(storageKey) ?? "[]",
        );
        if (Array.isArray(value))
          setSaved(value.filter((id): id is string => typeof id === "string"));
      } catch {
        /* Storage is optional. */
      }
    });
    return () => {
      mounted = false;
      controller.current?.abort();
    };
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!savedOnly) void load(0, role, query);
    }, 350);
    return () => clearTimeout(timer);
    // load changes with input; request cancellation handles stale results.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, role, savedOnly]);
  function toggle(id: string) {
    const next = saved.includes(id)
      ? saved.filter((value) => value !== id)
      : [...saved, id];
    setSaved(next);
    const card = feed?.jobs.find((j) => j.id === id);
    const cards = saved.includes(id)
      ? savedCards.filter((j) => j.id !== id)
      : card
        ? [...savedCards.filter((j) => j.id !== id), card]
        : savedCards;
    setSavedCards(cards);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      localStorage.setItem(storageKey + ":cards", JSON.stringify(cards));
      setMessage(
        next.includes(id)
          ? "공고를 이 브라우저에 저장했어요."
          : "저장한 공고에서 삭제했어요.",
      );
    } catch {
      setMessage(
        "브라우저 저장소를 사용할 수 없어 이번 방문 중에만 저장됩니다.",
      );
    }
  }
  const visible =
    (savedOnly
      ? [
          ...new Map(
            [
              ...savedCards,
              ...(feed?.jobs ?? []).filter((j) => saved.includes(j.id)),
            ].map((j) => [j.id, j]),
          ).values(),
        ]
      : (feed?.jobs ?? [])
    ).filter(
      (job) =>
        (!savedOnly || saved.includes(job.id)) &&
        (role === "all" || job.category === role) &&
        `${job.company} ${job.title} ${roleLabels[job.category]}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    ) ?? [];
  return (
    <section
      className="public-jobs section-width"
      id="market-preview"
      aria-labelledby="public-jobs-title"
    >
      <div className="public-jobs-heading">
        <div>
          <span className="eyebrow">
            <span className="status-dot" />
            기업 공식 채용공고
          </span>
          <h2 id="public-jobs-title">지금, 다음 기회를 찾아보세요.</h2>
          <p>실제 채용공고를 살펴보고 관심 있는 기회를 저장하세요.</p>
        </div>
        <span className="public-source-note">
          채널코퍼레이션 · 매치그룹 제공
        </span>
      </div>
      <div className="public-jobs-toolbar">
        <div className="public-job-tabs">
          <button aria-pressed={!savedOnly} onClick={() => setSavedOnly(false)}>
            전체 공고
          </button>
          <button aria-pressed={savedOnly} onClick={() => setSavedOnly(true)}>
            저장한 공고 <span>{saved.length}</span>
          </button>
        </div>
        <div className="public-job-filters">
          <select
            aria-label="공고 직무"
            value={role}
            onChange={(event) => {
              setRole(event.target.value);
              setFeed(null);
              void load(0, event.target.value);
            }}
          >
            <option value="all">모든 직무</option>
            {Object.entries(roleLabels).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
          <label>
            <Search size={17} />
            <input
              aria-label="전체 연동 공고 검색"
              placeholder="회사명·직무 검색"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
      </div>
      <p className="public-feed-count">
        {feed
          ? `전체 ${feed.total}개 중 ${feed.jobs.length}개 불러옴 · 최신 등록순`
          : "공식 채용 페이지에서 공고를 가져오고 있어요."}{" "}
        · 검색은 전체 연동 공고에 적용됩니다. 저장 목록은 저장 당시 정보를
        보관합니다.
      </p>
      {!!feed?.unavailableSources.length && (
        <p role="status">
          {feed.unavailableSources.join(", ")} 공고는 일시적으로 연결되지
          않았어요. 나머지 공고를 먼저 확인하세요.
        </p>
      )}
      <div className="public-job-grid">
        {visible.map((job) => (
          <article className="public-job-card" key={job.id}>
            <div className="public-company">
              <span className="public-company-mark" aria-hidden="true">
                {job.company.slice(0, 1)}
              </span>
              <strong>{job.company}</strong>
              <span className="official-label">공식 공고</span>
            </div>
            <span className="public-job-category">
              {roleLabels[job.category]}
            </span>
            <h3>
              <a href={job.url} target="_blank" rel="noopener noreferrer">
                {job.title}
                <span className="sr-only"> (새 창)</span>
              </a>
            </h3>
            <div className="public-job-meta">
              <span>
                <MapPin size={15} />
                {job.location}
              </span>
              <span>
                <BriefcaseBusiness size={15} />
                {job.employment}
              </span>
              {job.workplace && <span>{job.workplace}</span>}
            </div>
            <div className="public-job-bottom">
              <span>마감일 원문 확인</span>
              <button
                className="icon-button"
                aria-label={`${job.title} ${saved.includes(job.id) ? "저장 취소" : "저장"}`}
                aria-pressed={saved.includes(job.id)}
                onClick={() => toggle(job.id)}
              >
                <Bookmark
                  size={21}
                  fill={saved.includes(job.id) ? "currentColor" : "none"}
                />
              </button>
            </div>
            <a
              className="public-job-source"
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              채용공고 원문 보기 <ExternalLink size={14} />
              <span className="sr-only"> (새 창)</span>
            </a>
            <a
              className="public-job-source"
              href={`/career?tab=jobs&url=${encodeURIComponent(job.url)}`}
            >
              내 실제 자료와 비교하기 →
            </a>
          </article>
        ))}
        {loading &&
          !feed &&
          Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="public-job-skeleton" aria-hidden="true" />
          ))}
      </div>
      {!loading && !error && !visible.length && (
        <div className="public-job-empty">
          <h3>조건에 맞는 공고가 없어요.</h3>
          <p>
            검색어나 직무 필터를 바꿔보세요. 저장한 공고의 마감 여부는 원문에서
            확인하세요.
          </p>
          <button
            onClick={() => {
              setQuery("");
              setSavedOnly(false);
            }}
          >
            검색 조건 초기화
          </button>
        </div>
      )}
      {error && (
        <div className="public-job-empty" role="alert">
          <p>{error}</p>
          <button onClick={() => void load(feed?.nextOffset ?? 0, role)}>
            다시 시도
          </button>
        </div>
      )}
      <div className="public-job-more">
        {feed?.nextOffset != null ? (
          <button
            disabled={loading}
            onClick={() => void load(feed.nextOffset!, role)}
          >
            <RefreshCw size={19} className={loading ? "spin" : ""} />
            {loading ? "공고 불러오는 중…" : "새로운 공고 더보기"}
          </button>
        ) : feed && !loading && !error ? (
          <>
            <p>현재 제공되는 공고를 모두 확인했어요.</p>
            <button onClick={() => void load(0, role)}>
              <RefreshCw size={18} />
              공고 새로고침
            </button>
          </>
        ) : null}
      </div>
      <div className="public-jobs-disclosure">
        <span>
          기업이 등록한 제목을 그대로 표시합니다. 자격요건·마감 여부는 원문에서
          확인하세요.
        </span>
        <span>
          {feed &&
            `마지막 확인 ${new Date(feed.checkedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`}{" "}
          · 내 계정에서 실제 자료와 비교할 수 있습니다.
        </span>
      </div>
      <span className="sr-only" role="status">
        {message}
      </span>
    </section>
  );
}
