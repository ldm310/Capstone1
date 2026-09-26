"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Plus, Fingerprint } from "lucide-react";
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
  RoleSelect,
  EmptyState,
} from "@/components/shared/primitives";
import { SkillCard } from "./skill-card";
import type { EvidenceSource, EvidenceType } from "@/types/career";
const filters = [
  ["all", "전체 근거"],
  ["implementation", "구현 근거"],
  ["learning", "학습 근거"],
  ["career", "경력 근거"],
  ["certificate", "자격증"],
] as const;
function SkillsContent() {
  const { data, profile, evidence, addEvidence } = useCareer();
  const params = useSearchParams();
  const focused = params.get("skill");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [adding, setAdding] = useState<string | null>(null);
  const [type, setType] = useState<EvidenceType>("implementation");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  if (!data) return null;
  const role = data.roles.find((r) => r.id === profile.role)!;
  const skillIds = [
    ...new Set([
      ...role.skills,
      ...evidence.map((e) => e.skillId),
      ...(focused ? [focused] : []),
    ]),
  ];
  const visible = data.skills
    .filter(
      (s) =>
        skillIds.includes(s.id) &&
        s.name.toLowerCase().includes(search.toLowerCase()) &&
        (filter === "all" ||
          evidence.some((e) => e.skillId === s.id && e.type === filter)),
    )
    .sort((a, b) => (a.id === focused ? -1 : b.id === focused ? 1 : 0));
  function save(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("제목과 역량 근거 설명을 입력하세요.");
      return;
    }
    let sourceUrl: string | null = null;
    if (url.trim()) {
      try {
        const parsed = new URL(url);
        if (!["https:", "http:"].includes(parsed.protocol)) throw new Error();
        sourceUrl = parsed.href;
      } catch {
        setError("http 또는 https로 시작하는 올바른 출처 URL을 입력하세요.");
        return;
      }
    }
    const source: Record<EvidenceType, EvidenceSource> = {
      implementation: "github",
      learning: "notion",
      career: "cv",
      certificate: "certificate",
    };
    addEvidence({
      id: `user-${crypto.randomUUID()}`,
      skillId: adding!,
      type,
      source: source[type],
      title: title.trim(),
      description: description.trim(),
      sourceUrl,
      detectedAt: new Date().toISOString(),
      details: [description.trim()],
    });
    setAdding(null);
    setTitle("");
    setUrl("");
    setDescription("");
    setError("");
  }
  return (
    <PageMotion>
      <PageHeading
        eyebrow="말보다 확실한 나의 기록"
        title="내 경험을 뒷받침하는 역량 근거"
        description="무엇을 할 수 있는지, 어디에서 발견했는지. 역량 근거로 확인하세요."
      >
        <RoleSelect />
        <Button onClick={() => setAdding(role.skills[0])}>
          <Plus size={14} />
          근거 추가
        </Button>
      </PageHeading>
      <div className="info-note">
        <Fingerprint size={17} />
        <span>
          구현·학습·경력·자격 근거을 구분합니다. 모든 초기 자료는 체험
          데이터이며, 직접 추가한 자료는 직접 등록로 표시합니다.
        </span>
      </div>
      <div className="skills-toolbar">
        <div className="pill-tabs">
          {filters.map(([id, label]) => (
            <button
              key={id}
              aria-pressed={filter === id}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="search-input">
          <Search size={15} />
          <input
            aria-label="역량 검색"
            placeholder="기술 이름 검색…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>
      {visible.length ? (
        <div className="skills-grid">
          {visible.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              evidence={evidence.filter((e) => e.skillId === skill.id)}
              onAdd={(id) => {
                setType("implementation");
                setAdding(id);
              }}
              highlight={focused === skill.id}
              filter={filter}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="조건에 맞는 근거가 없어요."
          description="검색어나 필터를 바꾸거나 새로운 역량 근거를 추가해보세요."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
            >
              필터 초기화
            </Button>
          }
        />
      )}
      <Dialog
        open={adding !== null}
        onOpenChange={(open) => {
          if (!open) {
            setAdding(null);
            setError("");
          }
        }}
      >
        <DialogContent className="evidence-dialog">
          <DialogTitle>역량 근거 추가</DialogTitle>
          <DialogDescription>
            직접 입력한 근거는 직접 등록로 저장됩니다. 실제 소스의 검증을
            의미하지 않습니다.
          </DialogDescription>
          <form className="form-grid" onSubmit={save}>
            <label className="field-label">
              기술
              <select
                className="native-select"
                value={adding ?? ""}
                onChange={(e) => setAdding(e.target.value)}
              >
                {data.skills.map((s) => (
                  <option value={s.id} key={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label">
              근거 유형
              <select
                className="native-select"
                value={type}
                onChange={(e) => setType(e.target.value as EvidenceType)}
              >
                {filters.slice(1).map(([id, label]) => (
                  <option value={id} key={id}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-label">
              자료 이름
              <input
                required
                maxLength={100}
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 나의 RAG 프로젝트"
              />
            </label>
            <label className="field-label">
              자료 링크 · 선택
              <input
                type="url"
                className="form-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/…"
              />
            </label>
            <label className="field-label">
              어떤 역량을 보여주는 자료인가요?
              <textarea
                required
                maxLength={1000}
                className="form-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="구현하거나 학습한 내용을 적어주세요."
                rows={3}
              />
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <Button type="submit">근거 저장하기</Button>
          </form>
        </DialogContent>
      </Dialog>
    </PageMotion>
  );
}
export function SkillsPage() {
  return (
    <Suspense fallback={<p>역량 근거를 불러오고 있어요…</p>}>
      <SkillsContent />
    </Suspense>
  );
}
