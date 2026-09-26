"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo, LinkButton } from "@/components/shared/primitives";
export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Logo />
        <nav
          aria-label="주 메뉴"
          className={open ? "header-nav open" : "header-nav"}
        >
          <Link href="/market" onClick={() => setOpen(false)}>
            채용시장
          </Link>
          <Link href="/#how-it-works" onClick={() => setOpen(false)}>
            이용 방법
          </Link>
          <Link href="/#features" onClick={() => setOpen(false)}>
            주요 기능
          </Link>
        </nav>
        <div className="header-actions">
          <Link className="sign-in" href="/sign-in">
            로그인
          </Link>
          <LinkButton href="/career">
            시작하기 <ArrowUpRight size={15} />
          </LinkButton>
          <button
            className="icon-button mobile-only"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
