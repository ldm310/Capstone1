import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CareerProvider } from "@/components/shared/career-provider";
import "./globals.css";
import "./korean.css";
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: {
    default: "Career — 내 경험에서 시작하는 다음 커리어",
    template: "%s | Career",
  },
  description:
    "기업 공식 채용공고를 살펴보고, 나의 경험과 역량 근거를 연결해 다음 커리어를 준비하세요. 개인 분석은 체험 데이터로 제공됩니다.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <CareerProvider>{children}</CareerProvider>
      </body>
    </html>
  );
}
