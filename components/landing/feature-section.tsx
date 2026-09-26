import {
  ArrowRight,
  Code2,
  BookOpen,
  BriefcaseBusiness,
  Award,
  Check,
  Sparkles,
} from "lucide-react";
import { LinkButton } from "@/components/shared/primitives";
export function FeatureSection() {
  return (
    <section className="features-section section-width" id="features">
      <div className="feature-copy">
        <span className="eyebrow">말보다 확실한 나의 기록</span>
        <h2>
          무엇을 할 수 있는지,
          <br />
          어떤 경험이 뒷받침하는지.
        </h2>
        <p>
          별점 대신, 근거를 보여줍니다.
          <br />
          어디에서 무엇을 구현하고 배웠는지.
          <br />
          당신의 역량을 맥락과 함께 이해하세요.
        </p>
        <LinkButton href="/skills" secondary>
          역량 근거 살펴보기 <ArrowRight size={16} />
        </LinkButton>
      </div>
      <div className="evidence-feature-card">
        {[
          {
            icon: Code2,
            title: "구현 근거",
            copy: "직접 구현한 프로젝트와 코드",
            source: "GitHub",
            color: "green",
          },
          {
            icon: BookOpen,
            title: "학습 근거",
            copy: "배우고 정리한 학습 기록",
            source: "Notion",
            color: "blue",
          },
          {
            icon: BriefcaseBusiness,
            title: "경력 근거",
            copy: "프로젝트와 업무 경험",
            source: "CV",
            color: "purple",
          },
          {
            icon: Award,
            title: "자격 근거",
            copy: "취득한 자격증과 인증",
            source: "자격증",
            color: "amber",
          },
        ].map(({ icon: Icon, title, copy, source, color }) => (
          <div className="feature-evidence-row" key={title}>
            <span className={`icon-tile ${color}`}>
              <Icon size={20} />
            </span>
            <div>
              <strong>{title}</strong>
              <p>{copy}</p>
            </div>
            <span className="source-label">{source}</span>
            <Check size={15} />
          </div>
        ))}
      </div>
    </section>
  );
}
export function ClosingCTA() {
  return (
    <section className="closing-cta section-width">
      <span className="icon-tile green">
        <Sparkles size={24} />
      </span>
      <h2>
        당신의 다음 커리어,
        <br />
        경험 속에 답이 있습니다.
      </h2>
      <p>지금까지 쌓은 것에서, 앞으로 나아갈 방향을 찾으세요.</p>
      <LinkButton href="/onboarding">
        나의 Career 만들기 <ArrowRight size={17} />
      </LinkButton>
      <span className="closing-note">작은 발견이 다음 기회를 만듭니다.</span>
    </section>
  );
}
