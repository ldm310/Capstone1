"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export function AuthForm() {
  const router = useRouter();
  const [register, setRegister] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <main className="auth-page">
      <Link href="/" className="auth-brand">
        Career
      </Link>
      <h1>{register ? "나의 커리어 공간 만들기" : "다시 만나서 반가워요"}</h1>
      <p>자료·계획·지원 기록을 계정에 저장하고 이어서 준비하세요.</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError("");
          const form = new FormData(e.currentTarget);
          try {
            const res = await fetch("/api/account", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: register ? "register" : "login",
                email: form.get("email"),
                password: form.get("password"),
                ...(register ? { name: form.get("name") } : {}),
              }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            router.push("/career");
          } catch (e) {
            setError(e instanceof Error ? e.message : "로그인 실패");
          } finally {
            setBusy(false);
          }
        }}
      >
        {register && (
          <label>
            이름
            <input name="name" autoComplete="name" required maxLength={60} />
          </label>
        )}
        <label>
          이메일
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label>
          비밀번호
          <input
            name="password"
            aria-label="비밀번호"
            type="password"
            autoComplete={register ? "new-password" : "current-password"}
            minLength={10}
            maxLength={128}
            required
          />
          <small>10자 이상 입력하세요.</small>
        </label>
        {error && <p role="alert">{error}</p>}
        <button disabled={busy}>
          {busy ? "확인 중…" : register ? "계정 만들기" : "로그인"}
        </button>
      </form>
      <button
        className="plain-button"
        onClick={() => {
          setRegister(!register);
          setError("");
        }}
      >
        {register ? "이미 계정이 있어요" : "처음이신가요? 계정 만들기"}
      </button>
      <Link href="/dashboard">샘플 데이터로 먼저 둘러보기 →</Link>
      <small>
        현재 실행 중인 Career 서버에 저장됩니다. 이메일 인증·비밀번호 재설정
        메일은 아직 제공하지 않습니다.
      </small>
    </main>
  );
}
