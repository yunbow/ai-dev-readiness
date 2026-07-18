import { chromium } from "playwright";
const out = process.argv[2] ?? ".";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto("http://localhost:4173/#/");
await page.screenshot({ path: `${out}/home.png`, fullPage: true });
await page.goto("http://localhost:4173/#/assessment/quick");
for (let step = 0; step < 14; step++) {
  await page.locator("main label").first().waitFor();
  await page.locator("main label").first().click();
  await page.getByRole("button", { name: /次へ|診断結果を見る/ }).click();
}
await page.waitForURL(/#\/result\//);
await page.getByText("/ 100").first().waitFor();
await page.screenshot({ path: `${out}/result.png`, fullPage: true });
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://localhost:4173/#/assessment/quick");
await mobile.locator("main label").first().waitFor();
await mobile.screenshot({ path: `${out}/assessment-mobile.png` });
await browser.close();
console.log("screenshots saved");
