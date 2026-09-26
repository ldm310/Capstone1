import Link from "next/link";
import { db } from "@/lib/server/store";
import { notFound } from "next/navigation";
import type { Finding } from "@/types/workspace";
export const dynamic = "force-dynamic";
export default async function Shared({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const row = db()
    .prepare("SELECT data FROM shares WHERE token=?")
    .get(token) as { data: string } | undefined;
  if (!row) notFound();
  const data = JSON.parse(row.data) as {
    name: string;
    at: string;
    findings: Finding[];
  };
  return (
    <main className="share-page">
      <Link href="/">Career</Link>
      <p>공유 포트폴리오 · {data.at.slice(0, 10)} 기준</p>
      <h1>{data.name}님의 경험과 근거</h1>
      <p>
        사용자가 선택해 공개한 자료입니다. 기술 언급을 규칙으로 추출했으며
        숙련도나 작성자 여부를 인증하지 않습니다.
      </p>
      {data.findings.map((f, i) => (
        <article key={i}>
          <span>
            {f.skill} ·{" "}
            {f.type === "implementation" ? "코드에서 발견" : "문서에서 발견"}
          </span>
          <h2>{f.title}</h2>
          <pre>{f.quote}</pre>
          {f.url && (
            <a href={f.url} target="_blank" rel="noreferrer">
              GitHub 원문 보기 ↗
            </a>
          )}
        </article>
      ))}
    </main>
  );
}
