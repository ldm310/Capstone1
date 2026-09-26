import { getPublicJobs } from "@/lib/public-jobs";
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const offset = Number(params.get("offset") ?? 0),
    limit = Number(params.get("limit") ?? 4),
    role = params.get("role") ?? "all";
  if (
    !Number.isInteger(offset) ||
    offset < 0 ||
    offset > 10000 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 24 ||
    !["all", "ax", "ml", "data"].includes(role)
  )
    return Response.json({ error: "잘못된 조회 조건입니다." }, { status: 400 });
  try {
    const feed = await getPublicJobs();
    const filtered = feed.jobs.filter(
      (job) => role === "all" || job.category === role,
    );
    return Response.json(
      {
        ...feed,
        jobs: filtered.slice(offset, offset + limit),
        total: filtered.length,
        nextOffset: offset + limit < filtered.length ? offset + limit : null,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "채용공고를 불러오지 못했어요. 잠시 후 다시 시도해 주세요." },
      { status: 502 },
    );
  }
}
