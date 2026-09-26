"use client";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Cpu,
  Database,
  Fingerprint,
  Sparkles,
  Braces,
} from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { SourceConnector } from "./source-connector";
import { useCareer } from "@/components/shared/career-provider";
import {
  Logo,
  DemoBadge,
  LinkButton,
  DataBoundary,
} from "@/components/shared/primitives";
import { SourceIcon } from "@/components/skills/evidence-badge";
export function OnboardingFlow() {
  const { data, profile, setRole, updateProfile } = useCareer();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (step !== 3) return;
    const timer = setInterval(
      () => setProgress((p) => Math.min(p + 5, 100)),
      130,
    );
    return () => clearInterval(timer);
  }, [step]);
  const ready = progress === 100;
  return (
    <div className="onboarding-page">
      <header className="onboarding-header">
        <Logo />
        <DemoBadge />
      </header>
      <main className="onboarding-main">
        <div className="onboarding-progress">
          {["희망 직무", "내 역량 자료", "나의 Career"].map((label, i) => (
            <div key={label} className={step >= i + 1 ? "current" : ""}>
              <span>{step > i + 1 ? <Check size={12} /> : i + 1}</span>
              {label}
              {i < 2 && <i />}
            </div>
          ))}
        </div>
        <DataBoundary>
          {step === 1 ? (
            <>
              <div className="onboarding-title">
                <span className="eyebrow">첫 번째, 목표 정하기</span>
                <h1>어떤 직무를 준비하고 있나요?</h1>
                <p>
                  희망 직무를 선택하세요. 시장의 요구와 나의 역량 근거를
                  연결합니다.
                </p>
              </div>
              <div className="role-options">
                {data?.roles.map((role, i) => {
                  const Icon = [Braces, Cpu, Database][i];
                  return (
                    <button
                      key={role.id}
                      className={`role-option ${profile.role === role.id ? "selected" : ""}`}
                      onClick={() => setRole(role.id)}
                      aria-pressed={profile.role === role.id}
                    >
                      <span className="icon-tile">
                        <Icon size={22} />
                      </span>
                      <span>
                        <strong>{role.short}</strong>
                        <small>{role.description}</small>
                      </span>
                      <span className="radio-mark">
                        {profile.role === role.id && <span />}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="micro-copy">
                대표 희망 직무 · 설정에서 언제든 바꿀 수 있습니다.
              </p>
              <Button className="onboarding-next" onClick={() => setStep(2)}>
                다음 단계 <ArrowRight size={16} />
              </Button>
            </>
          ) : step === 2 ? (
            <>
              <div className="onboarding-title">
                <span className="eyebrow">두 번째, 내 기록 모으기</span>
                <h1>나의 경험을 연결해 주세요.</h1>
                <p>코드부터 학습 기록까지. 당신이 쌓아온 것에서 시작합니다.</p>
              </div>
              <SourceConnector />
              <div className="onboarding-buttons">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <ArrowLeft size={15} />
                  이전
                </Button>
                <Button
                  onClick={() => {
                    setProgress(0);
                    setStep(3);
                  }}
                >
                  나의 Career 만들기 <Sparkles size={15} />
                </Button>
              </div>
              <button
                className="skip-demo"
                onClick={() => {
                  setProgress(0);
                  setStep(3);
                }}
              >
                자료 없이 예시로 먼저 체험하기 →
              </button>
            </>
          ) : (
            <div className="analysis-onboarding">
              <div className={`analysis-orb ${ready ? "ready" : ""}`}>
                {ready ? (
                  <Check size={43} />
                ) : (
                  <Fingerprint size={57} strokeWidth={1.2} />
                )}
              </div>
              <span className="eyebrow">
                {ready ? "준비가 끝났어요" : "경험과 역량을 연결하는 중"}
              </span>
              <h1>
                {ready
                  ? "나의 Career가 준비됐어요."
                  : "나의 Career를 만들고 있어요…"}
              </h1>
              <p>
                {ready
                  ? "당신의 경험과 다음 기회를 연결했습니다."
                  : "샘플 데이터를 통해 분석 과정을 미리 보여드립니다."}
              </p>
              <div className="analysis-sources">
                {profile.connections.map((c, i) => {
                  const value = Math.max(
                    0,
                    Math.min(100, (progress - i * 18) * 2.5),
                  );
                  return (
                    <div key={c.source}>
                      <div className="row-between">
                        <span className="icon-inline">
                          <SourceIcon source={c.source} size={16} />
                          {c.source === "cv"
                            ? "CV"
                            : c.source === "certificate"
                              ? "자격증"
                              : c.source === "github"
                                ? "GitHub"
                                : "Notion"}{" "}
                          <small>
                            {c.connected ? "체험 연결" : "예시 데이터"}
                          </small>
                        </span>
                        {value >= 100 ? (
                          <Check size={15} />
                        ) : (
                          <span>{Math.round(value)}%</span>
                        )}
                      </div>
                      <div className="progress-track">
                        <motion.div
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {ready ? (
                <div
                  onClick={() =>
                    updateProfile({
                      onboarded: true,
                      analyzedAt: new Date().toISOString(),
                    })
                  }
                >
                  <LinkButton href="/dashboard">
                    내 대시보드 보기 <ArrowRight size={17} />
                  </LinkButton>
                </div>
              ) : (
                <p className="micro-copy" role="status">
                  체험 분석 · {progress}%
                </p>
              )}
            </div>
          )}
        </DataBoundary>
      </main>
      <footer className="onboarding-footer">
        쌓아온 경험에서 나의 가능성을 발견해 보세요.
      </footer>
    </div>
  );
}
