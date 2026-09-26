import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  requireUser,
  workspace,
  saveWorkspace,
  originCheck,
  jsonBody,
  failure,
  rateLimit,
} from "@/lib/server/store";
import { github, notion, jobAnalysis } from "@/lib/server/analyze";
export const runtime = "nodejs";
export async function POST(req: Request) {
  try {
    originCheck(req);
    const u = await requireUser();
    rateLimit("analysis:" + u.id, 30);
    const input = z
      .object({
        kind: z.enum(["github", "notion", "job"]),
        url: z.string().max(2000).default(""),
        text: z.string().max(60000).default(""),
        token: z.string().max(300).default(""),
        company: z.string().max(150).default(""),
        title: z.string().max(200).default(""),
      })
      .parse(await jsonBody(req));
    if (input.kind === "job") {
      const job = await jobAnalysis(
        input.url,
        input.text,
        input.company,
        input.title,
      );
      const state = workspace(u.id);
      state.job = job;
      saveWorkspace(u.id, state);
      return Response.json({ workspace: state });
    }
    const result =
      input.kind === "github"
        ? await github(input.url)
        : await notion(input.url, input.token);
    const state = workspace(u.id);
    state.runs = [
      { id: randomUUID(), at: new Date().toISOString(), ...result },
      ...state.runs,
    ].slice(0, 30);
    saveWorkspace(u.id, state);
    return Response.json({ workspace: state });
  } catch (e) {
    return failure(e);
  }
}
