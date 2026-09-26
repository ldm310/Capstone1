import type { Dispatch, SetStateAction } from "react";
import type {
  Workspace,
  Finding,
  CareerEvent,
  AnalysisRun,
} from "@/types/workspace";
import type { PublicJob } from "@/types/public-job";
export interface ServerResult {
  workspace?: Workspace;
  url?: string;
  ok?: boolean;
}
export interface PanelProps {
  state: Workspace;
  busy: boolean;
  notice: string;
  error: string;
  request: (
    url: string,
    body: unknown,
    method?: string,
  ) => Promise<ServerResult | null>;
  save: (action: string, patch: object) => Promise<ServerResult | null>;
  setNotice: Dispatch<SetStateAction<string>>;
  setError: Dispatch<SetStateAction<string>>;
  findings: Finding[];
  skills: string[];
  targets: string[];
  gaps: string[];
  next: string | undefined;
  upcoming: CareerEvent[];
  latest: AnalysisRun | undefined;
  previous: AnalysisRun | undefined;
  added: Finding[];
  removed: Finding[];
  params: { get(name: string): string | null };
  jobs: PublicJob[];
  jobsError: string;
  jobSkills: string[];
  questions: { key: string; text: string; evidence: Finding | undefined }[];
  shares: string[];
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  setShares: Dispatch<SetStateAction<string[]>>;
}
