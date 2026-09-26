"use client";
import { useState } from "react";
import { ArrowRight, TrendingUp, Layers3 } from "lucide-react";
import { useCareer } from "@/components/shared/career-provider";
import {
  PageHeading,
  PageMotion,
  RoleSelect,
  Panel,
} from "@/components/shared/primitives";
import { MarketSkillChart, SkillTrendChart } from "./charts";
import { LiveJobsSection } from "@/components/landing/live-jobs-section";
export function MarketPage() {
  const { data, profile } = useCareer();
  const [period, setPeriod] = useState("3");
  if (!data) return null;
  const market = data.market[profile.role];
  const trend = market.trend.slice(period === "3" ? -3 : 0);
  return (
    <PageMotion>
      <PageHeading
        eyebrow="채용시장의 흐름 읽기"
        title="지금 기업이 찾는 역량"
        description="시장이 반복해서 찾는 역량과 새롭게 떠오르는 기술을 확인하세요."
      >
        <RoleSelect />
        <select
          aria-label="분석 기간"
          className="native-select"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="3">최근 3개월</option>
          <option value="6">최근 6개월</option>
        </select>
      </PageHeading>
      <div className="market-context">
        <span>
          <Layers3 size={15} />
          2026년 9월 기준 예시 공고 <strong>{market.total}</strong>개 · 실제
          시장 통계가 아닙니다
        </span>
        <span className="micro-copy">
          최근 {period}개월 추이 · 순위는 동일한 예시 데이터 기준
        </span>
      </div>
      <div className="trend-stats">
        {[...market.skills]
          .sort((a, b) => b.change - a.change)
          .slice(0, 3)
          .map((s) => (
            <div key={s.skillId}>
              <div>
                <span>{s.name}</span>
                <strong>
                  +{s.change}
                  <small>pp</small>
                </strong>
              </div>
              <span className="trend-spark">
                <TrendingUp size={26} />
                <small>6월 대비 · 예시</small>
              </span>
            </div>
          ))}
      </div>
      <div className="two-column equal-columns">
        <Panel
          title="가장 많이 요구하는 기술"
          subtitle="예시 공고 중 해당 기술을 요구하는 비율"
        >
          <MarketSkillChart skills={market.skills.slice(0, 6)} />
        </Panel>
        <Panel
          title="기술별 수요 변화"
          subtitle={`2026년 ${trend[0].month}~9월 · 예시 추이 데이터`}
        >
          <SkillTrendChart
            data={trend}
            names={market.skills.slice(0, 3).map((s) => s.name)}
          />
        </Panel>
      </div>
      <Panel
        title="함께 알아두면 좋은 기술"
        subtitle="기술 간 연결을 살펴보고 다음 프로젝트의 방향을 정해보세요."
      >
        <div className="skill-relationships">
          {market.relationships.map((chain, i) => (
            <div className="relationship-chain" key={i}>
              {chain.map((node, j) => (
                <div key={node}>
                  {j > 0 && <ArrowRight size={13} />}
                  <span className={j === 0 ? "root-node" : ""}>{node}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Panel>
      <LiveJobsSection />
    </PageMotion>
  );
}
