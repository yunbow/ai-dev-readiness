// スモークE2E: 簡易診断フロー一周 + 外部送信ゼロ検証
// 前提: `vite preview --port 4173` が起動済み。実行: `node tests/e2e-smoke.mjs`
import { chromium } from "playwright";

const BASE = "http://localhost:4173";
const results = [];
const check = (name, ok) => { results.push({ name, ok }); console.log(`${ok ? "PASS" : "FAIL"}: ${name}`); };

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const externalRequests = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (!["localhost", "127.0.0.1"].includes(url.hostname)) externalRequests.push(request.url());
  });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(String(error)));

  await page.goto(`${BASE}/#/`);
  check("トップ画面が表示される", await page.getByRole("heading", { level: 1 }).first().isVisible());

  await page.getByRole("link", { name: "無料で診断する" }).click();
  await page.getByRole("link", { name: "簡易診断を始める" }).click();
  await page.waitForURL(/#\/assessment\/quick/);

  // プロフィール2問 + 簡易12問 = 14問(各先頭の選択肢を選ぶ)
  for (let step = 0; step < 14; step++) {
    await page.locator("main label").first().waitFor();
    console.log(`step ${step}:`, await page.locator("main h1").innerText());
    await page.locator("main label").first().click();
    await page.getByRole("button", { name: /次へ|診断結果を見る/ }).click({ timeout: 8000 });
  }

  await page.waitForURL(/#\/result\//, { timeout: 10000 });
  check("結果画面に遷移する", true);
  check("総合スコアが表示される", await page.getByText("/ 100").first().isVisible());
  check("推定削減率が表示される", await page.getByText("推定開発工数削減率").first().isVisible());
  check("推定値の注意書きが表示される", await page.getByText("推定値です").first().isVisible());

  const resultUrl = page.url();
  await page.reload();
  await page.getByText("/ 100").first().waitFor({ timeout: 5000 });
  check("結果画面を再読み込みしても表示できる", true);

  await page.goto(`${BASE}/#/history`);
  await page.getByRole("button", { name: "結果を開く" }).first().waitFor({ timeout: 5000 }).catch(() => {});
  check("履歴に診断結果が保存されている", await page.getByRole("link", { name: "結果を開く" }).first().isVisible().catch(() => false) || await page.getByText("点").first().isVisible().catch(() => false));

  // 途中保存の再開確認: 標準診断を2問だけ回答して中断 → 選択画面に再開UI
  await page.goto(`${BASE}/#/assessments`);
  await page.getByRole("link", { name: "標準診断を始める" }).click();
  await page.locator("main label").first().click();
  await page.getByRole("button", { name: "次へ" }).click();
  await page.locator("main label").first().click();
  await page.goto(`${BASE}/#/assessments`);
  check("回答途中データの再開UIが表示される", await page.getByRole("button", { name: "前回の続きから回答する" }).isVisible());

  check("外部への通信が発生しない", externalRequests.length === 0);
  if (externalRequests.length) console.log("external:", externalRequests);
  check("ページエラーが発生しない", pageErrors.length === 0);
  if (pageErrors.length) console.log("errors:", pageErrors);

  console.log(resultUrl);
} finally {
  await browser.close();
}
const failed = results.filter((r) => !r.ok);
if (failed.length) { console.error(`${failed.length} 件失敗`); process.exit(1); }
console.log("SMOKE OK");
