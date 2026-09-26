"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ChartNoAxesCombined,
  Fingerprint,
  Sparkles,
  ScanLine,
  BriefcaseBusiness,
  Settings,
  ArrowUpRight,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Logo, DemoBadge, DataBoundary } from "@/components/shared/primitives";
import { useCareer } from "@/components/shared/career-provider";
const items = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/market", label: "채용시장", icon: ChartNoAxesCombined },
  { href: "/skills", label: "내 역량", icon: Fingerprint },
  { href: "/agent", label: "커리어 코치", icon: Sparkles },
  { href: "/job-analyzer", label: "공고 분석", icon: ScanLine },
  { href: "/applications", label: "지원 현황", icon: BriefcaseBusiness },
];
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { profile } = useCareer();
  const accountMode = pathname === "/career";
  const accountRoutes: Record<string, string> = {
    "/dashboard": "/career",
    "/market": "/career?tab=jobs",
    "/skills": "/career?tab=sources",
    "/agent": "/career?tab=plan",
    "/job-analyzer": "/career?tab=jobs",
    "/applications": "/career?tab=applications",
  };
  const title =
    items.find((i) => i.href === pathname)?.label ??
    (pathname === "/career"
      ? "내 계정"
      : pathname === "/settings"
        ? "설정"
        : "내 프로필");
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        본문으로 바로가기
      </a>
      {open && (
        <button
          className="sidebar-scrim"
          onClick={() => setOpen(false)}
          aria-label="메뉴 닫기"
        />
      )}
      <aside className={`sidebar ${open ? "is-open" : ""}`}>
        <div className="sidebar-brand">
          <Logo />
          <button
            className="icon-button mobile-only"
            onClick={() => setOpen(false)}
            aria-label="메뉴 닫기"
          >
            <X size={18} />
          </button>
        </div>
        <div className="workspace-label">
          <span className="workspace-avatar">C</span>
          <div>
            나의 커리어 공간
            <small>{accountMode ? "내 계정 자료" : "샘플 체험"}</small>
          </div>
        </div>
        <p className="nav-caption">나의 커리어</p>
        <nav aria-label="서비스 메뉴">
          {items.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={accountMode ? accountRoutes[href] : href}
              onClick={() => setOpen(false)}
              className={`nav-item ${pathname === href ? "active" : ""}`}
              aria-current={pathname === href ? "page" : undefined}
            >
              <Icon size={18} />
              {label}
              {label === "커리어 코치" && !accountMode && (
                <span className="mini-badge">AI</span>
              )}
            </Link>
          ))}
          <Link
            className="nav-item account-nav"
            href="/career"
            onClick={() => setOpen(false)}
          >
            <Fingerprint size={18} /> 내 계정 · 실제 자료
          </Link>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <Sparkles size={18} />
            <strong>다음 커리어를 준비하세요.</strong>
            <p>쌓아온 경험을 보여줄 수 있는 근거로 만들어 보세요.</p>
            <Link
              href={accountMode ? "/career?tab=plan" : "/agent"}
              onClick={() => setOpen(false)}
            >
              추천 활동 확인하기 <ArrowUpRight size={14} />
            </Link>
          </div>
          <Link
            className={`nav-item ${pathname === "/settings" ? "active" : ""}`}
            href={accountMode ? "/career?tab=plan" : "/settings"}
            onClick={() => setOpen(false)}
          >
            <Settings size={18} />
            설정
          </Link>
          <Link
            className="profile-link"
            href={accountMode ? "/career" : "/profile"}
            onClick={() => setOpen(false)}
          >
            <span className="avatar">
              {accountMode ? "C" : profile.name.slice(0, 1).toUpperCase()}
            </span>
            <span>
              <strong>{accountMode ? "나의 계정" : profile.name}</strong>
              <small>내 계정</small>
            </span>
            <ChevronRight size={15} />
          </Link>
        </div>
      </aside>
      <div className="workspace-main">
        <div className="workspace-topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-only"
              aria-label="메뉴 열기"
              onClick={() => setOpen(true)}
            >
              <Menu size={20} />
            </button>
            <span>나의 커리어</span>
            <ChevronRight size={13} />
            <strong>{title}</strong>
          </div>
          {pathname === "/career" ? (
            <Link href="/career">계정별 서버 저장</Link>
          ) : (
            <DemoBadge />
          )}
        </div>
        <main id="main-content" className="workspace-content">
          {pathname === "/career" ? (
            children
          ) : (
            <>
              <p className="data-origin-note">
                체험 분석 · 아래 통계와 개인 근거는 예시입니다.{" "}
                <Link href="/career">내 실제 자료로 시작하기 →</Link>
              </p>
              <DataBoundary>{children}</DataBoundary>
            </>
          )}
        </main>
        <footer className="workspace-footer">
          경험을 근거로, 다음 커리어를 향해.
          <span>
            {pathname === "/career" ? "Career · 내 계정" : "Career · 체험 버전"}
          </span>
        </footer>
      </div>
    </div>
  );
}
