import { Logo, LinkButton } from "@/components/shared/primitives";
import { Fingerprint, ArrowRight } from "lucide-react";
export default function SignIn() {
  return (
    <main className="standalone">
      <Logo />
      <span className="analysis-orb">
        <Fingerprint size={50} />
      </span>
      <h1>
        나의 다음 커리어,
        <br />
        여기서 시작하세요.
      </h1>
      <p className="small-copy">
        현재는 인증 없이 사용할 수 있는 체험 버전입니다.
        <br />
        실제 계정 로그인은 서버 인증 연결 후 제공됩니다.
      </p>
      <LinkButton href="/dashboard">
        체험 공간 입장하기 <ArrowRight size={16} />
      </LinkButton>
      <LinkButton href="/onboarding" secondary>
        나의 Career 만들기
      </LinkButton>
    </main>
  );
}
