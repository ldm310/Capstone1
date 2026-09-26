import {
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  Fingerprint,
  Compass,
} from "lucide-react";
import { LinkButton } from "@/components/shared/primitives";
import type { getHeroPreview } from "@/lib/career-selectors";
export function SkyHero({
  preview,
}: {
  preview: ReturnType<typeof getHeroPreview>;
}) {
  return (
    <section className="sky-hero">
      <div className="home-sky-photo" aria-hidden="true" />
      <div className="sky-hero-copy">
        <span className="sky-eyebrow">나의 경험에서 시작하는 다음 커리어</span>
        <h1 tabIndex={-1}>
          가능성은 더 넓게.
          <br />
          <span>다음 걸음은 더 선명하게.</span>
        </h1>
        <p>
          시장이 찾는 역량과 내가 쌓아온 경험을 연결하세요.
          <br />
          GitHub, 이력서, Notion의 기록에서 나만의 다음 방향을 찾습니다.
        </p>
        <div className="sky-hero-actions">
          <LinkButton href="/onboarding">
            내 역량 분석 시작하기
            <ArrowRight size={17} />
          </LinkButton>
          <LinkButton href="#market-preview" secondary>
            채용공고 둘러보기
            <ArrowUpRight size={17} />
          </LinkButton>
        </div>
        <small>개인 역량 분석은 예시 데이터로 먼저 체험할 수 있어요.</small>
      </div>
      <div className="sky-preview-grid">
        <a href="/market" className="sky-preview-card">
          <div className="sky-card-label">
            <ChartNoAxesCombined size={18} />
            시장이 찾는 역량<span>01</span>
          </div>
          <h2>
            지금 필요한 기술을
            <br />
            먼저 알아보세요.
          </h2>
          <div className="sky-mini-bars">
            {preview.market.map((s) => (
              <div key={s.skillId}>
                <span>{s.name}</span>
                <i>
                  <b style={{ width: `${s.demand}%` }} />
                </i>
                <strong>{s.demand}%</strong>
              </div>
            ))}
          </div>
          <footer>
            시장 동향 살펴보기
            <ArrowUpRight size={15} />
          </footer>
        </a>
        <a href="/skills" className="sky-preview-card">
          <div className="sky-card-label">
            <Fingerprint size={18} />
            나의 역량 근거<span>02</span>
          </div>
          <h2>
            해온 일들이 모여
            <br />
            나의 역량이 됩니다.
          </h2>
          <div className="sky-evidence-preview">
            <span>GitHub · {preview.evidenceTitle}</span>
            <div>
              {preview.evidenceSkills.map((s) => (
                <b key={s}>{s}</b>
              ))}
            </div>
            <small>프로젝트 구현 기록에서 발견한 근거</small>
          </div>
          <footer>
            내 경험의 근거 확인하기
            <ArrowUpRight size={15} />
          </footer>
        </a>
        <a href="/agent" className="sky-preview-card">
          <div className="sky-card-label">
            <Compass size={18} />
            나를 위한 다음 활동<span>03</span>
          </div>
          <h2>
            막연한 준비 대신,
            <br />
            오늘 할 수 있는 한 걸음.
          </h2>
          <div className="sky-action-preview">
            <span>다음에 쌓을 역량</span>
            <strong>{preview.opportunity}</strong>
            <small>배우고, 직접 만들고, 기록으로 남겨보세요.</small>
          </div>
          <footer>
            추천 활동 확인하기
            <ArrowUpRight size={15} />
          </footer>
        </a>
      </div>
      <p className="sky-preview-caption">
        역량·통계 카드는 체험 데이터 예시이며, 실력 점수가 아닙니다.
      </p>
    </section>
  );
}
