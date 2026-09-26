import { Header } from "@/components/layout/header";
import { SourceStrip, HowItWorks } from "@/components/landing/hero";
import { SkyExperience } from "@/components/landing/sky-experience";
import { SkyHero } from "@/components/landing/sky-hero";
import "./sky.css";
import { LiveJobsSection } from "@/components/landing/live-jobs-section";
import {
  FeatureSection,
  ClosingCTA,
} from "@/components/landing/feature-section";
import { Logo } from "@/components/shared/primitives";
import { careerService } from "@/lib/career-service";
import Link from "next/link";
import { getHeroPreview } from "@/lib/career-selectors";
export default async function Home() {
  const data = await careerService.getDataset();
  return (
    <SkyExperience>
      <Header />
      <main>
        <SkyHero preview={getHeroPreview(data)} />
        <SourceStrip />
        <LiveJobsSection />
        <HowItWorks />
        <FeatureSection />
        <ClosingCTA />
      </main>
      <footer className="site-footer section-width">
        <Logo />
        <span>© 2026 Career. 경험을 근거로, 더 나은 커리어.</span>
        <Link href="/dashboard">체험 공간 둘러보기 ↗</Link>
      </footer>
    </SkyExperience>
  );
}
