"use client";
import { useState } from "react";
import {
  ChartNoAxesCombined,
  Fingerprint,
  CircleDashed,
  Zap,
  RefreshCw,
  ArrowUpRight,
  Check,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCareer } from "@/components/shared/career-provider";
import {
  PageHeading,
  PageMotion,
  RoleSelect,
  Panel,
  ArrowLink,
  LinkButton,
} from "@/components/shared/primitives";
import { getCoverage, getGaps } from "@/lib/career-selectors";
import { SummaryCard } from "./summary-card";
import { EvidenceOverview } from "./evidence-overview";
import { SkillGapCard } from "./skill-gap-card";
import { MarketSkillChart } from "@/components/market/charts";
import { ActionCard } from "@/components/agent/action-card";
export function DashboardPage() {
  const { data, profile, evidence, updateProfile, notify } = useCareer();
  const [analyzing, setAnalyzing] = useState(false);
  if (!data) return null;
  const coverage = getCoverage(data, profile.role, evidence);
  const gaps = getGaps(data, profile.role, evidence);
  const actions = data.actions.filter((a) => a.role === profile.role);
  const next =
    actions.find((a) => profile.actionStatus[a.id] !== "completed") ??
    actions[0];
  const role = data.roles.find((r) => r.id === profile.role)!;
  const roleEvidence = evidence.filter((e) => role.skills.includes(e.skillId));
  async function analyze() {
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 1100));
    updateProfile({ analyzedAt: new Date().toISOString() });
    setAnalyzing(false);
    notify(
      "체험 역량 근거를 기준으로 시장 근거 확인 비율와 보완할 역량을 다시 계산했습니다.",
    );
  }
  return (
    <PageMotion>
      <PageHeading
        eyebrow="한눈에 보는 나의 커리어"
        title={`${profile.name}님, 오늘도 한 걸음 더`}
        description="지금까지 쌓아온 역량과 다음 기회를 한눈에 확인하세요."
      >
        <RoleSelect />
        <Button variant="outline" disabled={analyzing} onClick={analyze}>
          <RefreshCw size={13} className={analyzing ? "animate-spin" : ""} />
          {analyzing ? "분석 중…" : "다시 분석하기"}
        </Button>
      </PageHeading>
      <div className="dashboard-meta">
        <span>
          <span className="status-dot" />
          최신 체험 분석 결과입니다
        </span>
        <span>
          <CalendarDays size={11} />
          최근 분석 · {profile.analyzedAt.slice(0, 10).replaceAll("-", ".")}
        </span>
      </div>
      <div className="summary-grid">
        <SummaryCard
          label="근거가 확인된 역량"
          value={coverage.percent}
          suffix="%"
          note={`요구 역량 ${coverage.total}개 중 ${coverage.count}개에서 근거 확인`}
          icon={ChartNoAxesCombined}
          tooltip="실력 점수가 아닙니다. 선택 직무의 시장 주요 요구 역량 중 한 종류 이상의 역량 근거가 발견된 역량의 비율입니다. 학습 근거도 포함됩니다."
        />
        <SummaryCard
          label="역량 근거"
          value={roleEvidence.length}
          note="경험을 뒷받침하는 기록과 출처"
          icon={Fingerprint}
        />
        <SummaryCard
          label="보완할 역량"
          value={gaps.length}
          note="근거가 없거나 학습 기록만 있는 역량"
          icon={CircleDashed}
        />
        <SummaryCard
          label="진행 중 활동"
          value={
            actions.filter((a) => profile.actionStatus[a.id] === "active")
              .length
          }
          note="지금 실천하고 있는 추천 활동"
          icon={Zap}
        />
      </div>
      <div className="two-column">
        <Panel
          title="시장이 찾는 역량"
          subtitle={`${role.short} · 예시 공고 ${data.market[profile.role].total}개`}
          action={<ArrowLink href="/market">시장 자세히 보기</ArrowLink>}
        >
          <MarketSkillChart
            skills={data.market[profile.role].skills.slice(0, 6)}
          />
          <div className="chart-footnote">
            예시 공고 중 해당 기술을 요구하는 비율
          </div>
        </Panel>
        <Panel
          title="내가 쌓아온 역량"
          subtitle="출처와 함께 확인하는 내 역량 근거"
          action={<ArrowLink href="/skills">전체 근거</ArrowLink>}
        >
          <EvidenceOverview />
        </Panel>
      </div>
      <div className="two-column">
        <Panel
          title="다음 성장을 위한 기회"
          subtitle="시장 수요를 기준으로 정리한 보완 우선순위"
          action={<span className="subtle-badge">{gaps.length} 개 역량</span>}
        >
          <SkillGapCard gaps={gaps} />
          <div className="panel-bottom-note">
            <span className="icon-inline">
              <Check size={12} /> 부족한 역량은 다음 성장의 방향입니다.
            </span>
            <ArrowLink href="/agent">추천 활동 보기</ArrowLink>
          </div>
        </Panel>
        <ActionCard action={next} compact />
      </div>
      <div className="dashboard-bottom-banner">
        <span className="icon-tile">
          <Fingerprint size={20} />
        </span>
        <div>
          <strong>관심 있는 채용공고를 찾으셨나요?</strong>
          <p>기업의 요구 역량과 내 경험을 비교해 보세요.</p>
        </div>
        <LinkButton href="/job-analyzer" secondary>
          공고 분석하기 <ArrowUpRight size={15} />
        </LinkButton>
      </div>
    </PageMotion>
  );
}
