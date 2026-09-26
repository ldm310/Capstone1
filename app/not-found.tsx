import Link from "next/link";
export default function NotFound() {
  return (
    <main className="standalone">
      <span className="eyebrow">404 · 페이지를 찾을 수 없어요</span>
      <h1>요청하신 페이지가 없어요.</h1>
      <Link href="/dashboard" className="cta">
        대시보드로 돌아가기
      </Link>
    </main>
  );
}
