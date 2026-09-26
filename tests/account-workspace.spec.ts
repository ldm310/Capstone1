import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { randomUUID } from "node:crypto";

test("account data is isolated, persists across sessions, links documents, compares jobs, and revokes shares", async ({
  page,
  browser,
  baseURL,
}) => {
  const email = `career-test-${randomUUID()}@example.com`,
    password = "Career-test-2026!";
  await page.goto("/sign-in");
  await page.getByRole("button", { name: "처음이신가요? 계정 만들기" }).click();
  await page.getByLabel("이름", { exact: true }).fill("검증 사용자");
  await page.getByLabel("이메일", { exact: true }).fill(email);
  await page.getByLabel("비밀번호", { exact: true }).fill(password);
  await page.getByRole("button", { name: "계정 만들기", exact: true }).click();
  await expect(page).toHaveURL(/\/career/);
  await expect(
    page.getByRole("heading", { name: "검증 사용자님의 커리어" }),
  ).toBeVisible();
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(audit.violations).toEqual([]);
  const headers = { Origin: baseURL! };
  const api = page.request;
  const upload = await api.post("/api/documents", {
    headers,
    multipart: {
      file: {
        name: "my-resume.txt",
        mimeType: "text/plain",
        buffer: Buffer.from(
          "프로젝트: Python API를 개발했습니다.\nDocker 컨테이너 배포를 수행했습니다.\nSQL 쿼리를 작성했습니다.",
        ),
      },
      source: "cv",
    },
  });
  expect(upload.ok()).toBeTruthy();
  const uploaded = await upload.json();
  const doc = uploaded.workspace.documents[0].id;
  expect(
    uploaded.workspace.runs[0].findings.map((f: { skill: string }) => f.skill),
  ).toContain("Docker");
  expect((await api.get(`/api/documents/${doc}`)).ok()).toBeTruthy();
  const job = await api.post("/api/analyze", {
    headers,
    data: {
      kind: "job",
      text: "자격요건\nPython과 SQL 경험이 필요합니다.\n우대사항\nDocker 및 Kubernetes 활용 경험을 우대합니다.",
      company: "테스트 기업",
      title: "개발자",
    },
  });
  expect(job.ok()).toBeTruthy();
  const analyzed = (await job.json()).workspace;
  expect(analyzed.job.required).toContain("Python");
  expect(analyzed.job.preferred).toContain("Docker");
  const record = await api.post("/api/career", {
    headers,
    data: {
      action: "applications",
      applications: [
        {
          id: randomUUID(),
          company: "테스트 기업",
          title: "개발자",
          url: "",
          stage: "지원 준비",
          date: "2026-09-26",
          resumeId: doc,
          snapshot: ["Python"],
          notes: "테스트",
        },
      ],
    },
  });
  expect(record.ok()).toBeTruthy();
  const event = await api.post("/api/career", {
    headers,
    data: {
      action: "events",
      events: [
        {
          id: randomUUID(),
          title: "면접",
          date: "2026-10-01T14:00",
          type: "면접",
        },
      ],
    },
  });
  expect(event.ok()).toBeTruthy();
  const second = await browser.newContext();
  await second.request.post(`${baseURL}/api/account`, {
    headers,
    data: { action: "login", email, password },
  });
  expect(
    (await (await second.request.get(`${baseURL}/api/career`)).json()).workspace
      .applications,
  ).toHaveLength(1);
  const stranger = await browser.newContext();
  expect((await stranger.request.get(`${baseURL}/api/career`)).status()).toBe(
    401,
  );
  expect(
    (await stranger.request.get(`${baseURL}/api/documents/${doc}`)).status(),
  ).toBe(401);
  await stranger.request.post(`${baseURL}/api/account`, {
    headers,
    data: {
      action: "register",
      email: `career-test-${randomUUID()}@example.com`,
      password,
      name: "다른 계정",
    },
  });
  expect(
    (await stranger.request.get(`${baseURL}/api/documents/${doc}`)).status(),
  ).toBe(404);
  expect(
    (await (await stranger.request.get(`${baseURL}/api/career`)).json())
      .workspace.runs,
  ).toHaveLength(0);
  const share = await api.post("/api/share", {
    headers,
    data: { ids: [uploaded.workspace.runs[0].findings[0].id] },
  });
  expect(share.ok()).toBeTruthy();
  const shareUrl = (await share.json()).url;
  expect((await stranger.request.get(baseURL + shareUrl)).ok()).toBeTruthy();
  await api.delete("/api/share", {
    headers,
    data: { token: shareUrl.split("/").pop() },
  });
  const revoked = await stranger.request.get(baseURL + shareUrl);
  expect(await revoked.text()).not.toContain("검증 사용자님의 경험과 근거");
  expect(
    (
      await api.post("/api/career", {
        headers: { Origin: "https://untrusted.example" },
        data: { action: "tasks", tasks: [] },
      })
    ).ok(),
  ).toBeFalsy();
  await page.goto("/career?tab=sources");
  await expect(
    page.getByText("my-resume.txt", { exact: true }).first(),
  ).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await second.close();
  await stranger.close();
});

test("weekly plan, schedule export, interview and account views work on desktop and mobile", async ({
  page,
  baseURL,
}) => {
  await page.request.post("/api/account", {
    headers: { Origin: baseURL! },
    data: {
      action: "register",
      email: `career-test-${randomUUID()}@example.com`,
      password: "Career-test-2026!",
      name: "계획 검증",
    },
  });
  await page.goto("/career?tab=plan");
  await page.getByRole("button", { name: "준비 조건으로 계획 추가" }).click();
  await expect(page.locator(".career-task")).toHaveCount(18);
  await page.locator(".career-task input[type=checkbox]").first().check();
  await expect(
    page.locator(".career-task input[type=checkbox]").first(),
  ).toBeChecked();
  await page.reload();
  await expect(
    page.locator(".career-task input[type=checkbox]").first(),
  ).toBeChecked();
  await page.goto("/career?tab=schedule");
  await page.getByLabel("일정 이름").fill("회사 면접");
  await page.getByLabel("날짜·시간").fill("2026-10-02T10:30");
  await page.getByRole("button", { name: "일정 추가", exact: true }).click();
  await expect(page.getByText("회사 면접", { exact: true })).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /캘린더에 추가할 파일/ }).click();
  expect((await downloadPromise).suggestedFilename()).toBe(
    "career-schedule.ics",
  );
  await page.goto("/career?tab=interview");
  await page
    .locator("textarea")
    .first()
    .fill("실제 경험을 바탕으로 답변을 정리했습니다.");
  await page.getByRole("button", { name: "답변 저장" }).first().click();
  await page.reload();
  await expect(page.locator("textarea").first()).toHaveValue(
    "실제 경험을 바탕으로 답변을 정리했습니다.",
  );
  for (const tab of [
    "overview",
    "sources",
    "jobs",
    "plan",
    "schedule",
    "applications",
    "interview",
    "share",
  ]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/career?tab=${tab}`);
    await expect(page.locator(".career-tabs")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      tab,
    ).toBeTruthy();
  }
  await page.getByRole("button", { name: "로그아웃", exact: true }).click();
  await expect(page).toHaveURL(/sign-in/);
  expect((await page.request.get("/api/career")).status()).toBe(401);
});
