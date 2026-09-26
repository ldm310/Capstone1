import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mockPublicJobs } from "./public-jobs-fixture";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() =>
    sessionStorage.setItem("career:sky-intro:seen", "yes"),
  );
  await mockPublicJobs(page);
});

test("onboarding preserves role and demo connections", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "내 역량 분석 시작하기", exact: true })
    .click();
  await expect(page).toHaveURL(/career/);
  await page.goto("/onboarding");
  await page.getByRole("button", { name: /AI·머신러닝 엔지니어/ }).click();
  await page.getByRole("button", { name: "다음 단계", exact: true }).click();
  await page.getByRole("button", { name: "체험 연결" }).first().click();
  await expect(page.getByText("GitHub 체험 자료")).toBeVisible();
  await page.getByRole("button", { name: "나의 Career 만들기" }).click();
  await page.getByRole("link", { name: "내 대시보드 보기" }).click();
  await expect(page.getByLabel("희망 직무")).toHaveValue("ml");
  await expect(
    page.getByRole("heading", { name: /오늘도 한 걸음 더/ }),
  ).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("희망 직무")).toHaveValue("ml");
});

test("an action updates evidence, coverage and survives refresh", async ({
  page,
}) => {
  await page.goto("/dashboard");
  const coverage = page
    .locator(".summary-card")
    .first()
    .locator(":scope > strong");
  await expect(coverage).toHaveText("73%");
  await page.getByRole("link", { name: "커리어 코치 AI", exact: true }).click();
  const action = page.locator(".action-card").filter({
    has: page.getByRole("heading", {
      name: "RAG 프로젝트에 하이브리드 검색 구현하기",
    }),
  });
  await action.getByRole("button", { name: "활동 시작하기" }).click();
  await action.getByRole("button", { name: "체험 활동 완료하기" }).click();
  await expect(
    page.getByText("체험 근거 저장 완료 · 내 역량에서 확인하세요"),
  ).toBeVisible();
  await page.getByRole("link", { name: "대시보드", exact: true }).click();
  await expect(coverage).toHaveText("82%");
  await page.reload();
  await expect(coverage).toHaveText("82%");
  await page.getByRole("link", { name: "내 역량", exact: true }).click();
  await page.getByLabel("역량 검색").fill("Vector DB");
  await expect(page.locator(".skill-card .evidence-badge")).toHaveText(
    "구현 근거",
  );
});

test("job analyzer matches samples, validates input, and has an empty state", async ({
  page,
}) => {
  await page.goto("/job-analyzer");
  await page.getByRole("button", { name: "분석하기", exact: true }).click();
  await expect(page.locator(".form-error[role=alert]")).toBeVisible();
  await page.getByLabel("채용공고 링크 또는 기업명").fill("NAVER");
  await page.getByRole("button", { name: "분석하기", exact: true }).click();
  await expect(page.locator(".analyzed-job h2")).toHaveText(
    "AI·머신러닝 엔지니어",
  );
  await expect(page.locator(".requirement-row")).toHaveCount(4);
  await page.getByLabel("채용공고 링크 또는 기업명").fill("Unlisted Company");
  await page.getByRole("button", { name: "분석하기", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "분석할 수 있는 예시 공고가 없어요." }),
  ).toBeVisible();
  await page
    .getByLabel("채용공고 링크 또는 기업명")
    .fill("https://www.lgcns.com/careers/demo");
  await page.getByRole("button", { name: "분석하기", exact: true }).click();
  await expect(page.locator(".analyzed-job h2")).toHaveText("AX·LLM 개발자");
});

test("evidence source entry is shown and persisted", async ({ page }) => {
  await page.goto("/skills?skill=vector");
  await page
    .getByRole("button", { name: "근거 추가", exact: true })
    .first()
    .click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("combobox", { name: "기술", exact: true })
    .selectOption("vector");
  await dialog.getByLabel("자료 이름").fill("Vector index implementation");
  await dialog.getByLabel("자료 링크").fill("https://github.com/example/demo");
  await dialog
    .getByLabel("어떤 역량을 보여주는 자료인가요?")
    .fill("Metadata filtering and semantic retrieval.");
  await dialog.getByRole("button", { name: "근거 저장하기" }).click();
  await page.getByLabel("역량 검색").fill("Vector DB");
  await expect(
    page.getByText("Vector index implementation", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "출처 보기" })).toHaveAttribute(
    "href",
    "https://github.com/example/demo",
  );
  await page.reload();
  await expect(
    page.getByText("Vector index implementation", { exact: true }),
  ).toBeVisible();
});

test("application detail, filtering and local record", async ({ page }) => {
  await page.goto("/applications");
  await page.getByRole("button", { name: "LG CNS 지원 기록 보기" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByText("지원 당시의 역량", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "닫기", exact: true }).click();
  await page.getByRole("button", { name: "지원 기록 추가" }).click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByRole("combobox", { name: "지원 공고", exact: true })
    .selectOption("toss-ax");
  await dialog
    .getByRole("combobox", { name: "진행 단계", exact: true })
    .selectOption("Final");
  await dialog.getByRole("button", { name: "지원 기록 저장" }).click();
  await page.getByRole("button", { name: "최종 전형", exact: true }).click();
  await expect(page.locator(".application-table tbody tr")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: /toss AI Application Engineer/ }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: /toss AI Application Engineer/ }),
  ).toBeVisible();
});

test("all routes render without errors or mobile horizontal overflow", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    "/",
    "/onboarding",
    "/dashboard",
    "/market",
    "/skills",
    "/agent",
    "/job-analyzer",
    "/applications",
    "/settings",
    "/profile",
    "/sign-in",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();

    await expect
      .poll(
        () =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth + 1,
          ),
        { message: `Horizontal overflow at ${route}` },
      )
      .toBe(true);
  }
  expect(errors).toEqual([]);
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "메뉴 열기" }).click();
  await page.getByRole("link", { name: "채용시장", exact: true }).click();
  await expect(page).toHaveURL(/\/market$/);
  await expect(page.locator(".sidebar")).not.toHaveClass(/is-open/);
});

test("role and period filters change market data", async ({ page }) => {
  await page.goto("/market");
  await expect(page.getByText("387", { exact: true })).toBeVisible();
  await page.getByLabel("희망 직무").selectOption("data");
  await expect(page.getByText("312", { exact: true })).toBeVisible();
  await page.getByLabel("분석 기간").selectOption("6");
  await expect(
    page.getByText("2026년 4월~9월 · 예시 추이 데이터"),
  ).toBeVisible();
});

test("primary routes pass accessibility audit", async ({ page }) => {
  for (const route of [
    "/",
    "/dashboard",
    "/skills",
    "/agent",
    "/job-analyzer",
    "/applications",
  ]) {
    await page.goto(route);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toHaveCSS("opacity", "1");
    await page.locator("h1").evaluate(async (el) => {
      await Promise.all(
        el.getAnimations({ subtree: true }).map((a) => a.finished),
      );
    });
    await expect(page.locator("h1").locator("..")).toHaveCSS("opacity", "1");
    await expect
      .poll(() =>
        page.locator("h1").evaluate((el) => {
          let node: Element | null = el;
          while (node) {
            if (Number(getComputedStyle(node).opacity) < 1) return false;
            node = node.parentElement;
          }
          return true;
        }),
      )
      .toBe(true);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect
      .soft(
        result.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes
            .map((n) => ({ target: n.target, summary: n.failureSummary }))
            .slice(0, 12),
        })),
        route,
      )
      .toEqual([]);
  }
});

test("skill filters preserve the full evidence status", async ({ page }) => {
  await page.goto("/skills");
  await page.getByRole("button", { name: "학습 근거", exact: true }).click();
  const langgraph = page.locator(".skill-card").filter({
    has: page.getByRole("heading", { name: "LangGraph", exact: true }),
  });
  await expect(langgraph.locator(".evidence-badge")).toHaveText("구현 근거");
  await expect(
    langgraph.getByText("아직 직접 구현한 근거는 없어요."),
  ).toHaveCount(0);
  await expect(
    langgraph.getByText("LangGraph 학습 정리", { exact: true }),
  ).toBeVisible();
});

test("responsive layouts and chart rendering", async ({ page }, testInfo) => {
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "/",
      "/onboarding",
      "/dashboard",
      "/market",
      "/skills",
      "/agent",
      "/job-analyzer",
      "/applications",
    ]) {
      await page.goto(route);
      await expect(page.locator("h1")).toBeVisible();
      await expect
        .poll(
          () =>
            page.evaluate(
              () =>
                document.documentElement.scrollWidth <= window.innerWidth + 1,
            ),
          { message: `Overflow at ${width}px ${route}` },
        )
        .toBe(true);
      if (route === "/dashboard") {
        await expect(page.locator(".recharts-bar-rectangle path")).toHaveCount(
          6,
        );
        const rect = await page
          .locator(".recharts-bar-rectangle path")
          .first()
          .boundingBox();
        expect(rect!.width).toBeGreaterThan(25);
        await page.screenshot({
          path: testInfo.outputPath(`dashboard-${width}.png`),
          fullPage: true,
        });
      }
      if (route === "/") {
        await expect(page.locator(".sky-home")).toHaveCSS("opacity", "1");
        await page.screenshot({
          path: testInfo.outputPath(`landing-${width}.png`),
          fullPage: true,
        });
      }
    }
  }
});
