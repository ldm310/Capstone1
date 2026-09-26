import type { CareerService } from "@/types/career";
import { jobs } from "@/mock/jobs";
import { roles, skills, evidence } from "@/mock/skills";
import { market } from "@/mock/market";
import { actions } from "@/mock/actions";
import { applications, resumes } from "@/mock/applications";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
/** Replace this adapter with typed HTTP calls when the backend is ready. */
export const careerService: CareerService = {
  mode: "demo",
  async getDataset() {
    await delay(300);
    return {
      roles,
      skills,
      evidence,
      jobs,
      market,
      actions,
      applications,
      resumes,
    };
  },
  async getJobs() {
    return jobs;
  },
  async analyzeJob(query) {
    await delay(850);
    const normalized = query.trim().toLowerCase();
    if (!normalized) throw new Error("기업명 또는 채용공고 URL을 입력하세요.");
    if (/^https?:\/\//i.test(normalized)) {
      let host: string;
      try {
        host = new URL(normalized).hostname.replace(/^www\./, "");
      } catch {
        throw new Error("올바른 URL을 입력하세요.");
      }
      return (
        jobs.find((job) => {
          const domain = new URL(job.url).hostname.replace(/^www\./, "");
          return host === domain || host.endsWith(`.${domain}`);
        }) ?? null
      );
    }
    const aliases: Record<string, string> = {
      엘지: "lg cns",
      네이버: "naver",
      카카오: "kakao",
      토스: "toss",
      당근: "karrot",
      업스테이지: "upstage",
    };
    const term = aliases[normalized] ?? normalized;
    return jobs.find((job) => job.company.toLowerCase().includes(term)) ?? null;
  },
};
