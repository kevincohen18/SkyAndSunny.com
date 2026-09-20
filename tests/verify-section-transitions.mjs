import { pathToFileURL } from "node:url";

const playwrightModule = process.env.PLAYWRIGHT_MODULE;

if (!playwrightModule) {
  throw new Error("Set PLAYWRIGHT_MODULE to the installed Playwright index.js path");
}

const playwrightImport = await import(pathToFileURL(playwrightModule));
const { chromium } = playwrightImport.default ?? playwrightImport;
const targetURL = process.env.NIGHT_AVIARY_URL || "http://127.0.0.1:4173/";
const viewports = [
  { width: 2000, height: 932, label: "wide Safari layout viewport", maximumHeadingLeadIn: 128 },
  { width: 390, height: 844, label: "mobile viewport", maximumHeadingLeadIn: 160 },
];
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const failures = [];

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  await page.goto(targetURL, { waitUntil: "networkidle", timeout: 45_000 });

  const geometry = await page.evaluate(() => {
    const hero = document.querySelector(".hero-habitat").getBoundingClientRect();
    const moments = document.querySelector(".moments-habitat").getBoundingClientRect();
    const heading = document.querySelector(".moments-intro h2").getBoundingClientRect();
    return {
      boundaryGap: moments.top - hero.bottom,
      headingLeadIn: heading.top - hero.bottom,
      heroBottom: hero.bottom,
    };
  });

  if (Math.abs(geometry.boundaryGap) > 1) {
    failures.push(`${viewport.label}: section boundary gap is ${geometry.boundaryGap.toFixed(2)}px`);
  }
  if (geometry.headingLeadIn > viewport.maximumHeadingLeadIn) {
    failures.push(`${viewport.label}: moments heading begins ${geometry.headingLeadIn.toFixed(2)}px after the hero (maximum ${viewport.maximumHeadingLeadIn}px)`);
  }

  if (viewport.width === 2000) {
    const boundaryY = 300;
    await page.evaluate((scrollY) => window.scrollTo(0, scrollY), geometry.heroBottom - boundaryY);
    const screenshot = await page.screenshot();
    const samples = await page.evaluate(async ({ source, y, width }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${source}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.drawImage(image, 0, 0);
      return [0.05, 0.25, 0.5, 0.75, 0.95].map((ratio) => {
        const x = Math.round(width * ratio);
        const before = [...context.getImageData(x, y - 1, 1, 1).data.slice(0, 3)];
        const after = [...context.getImageData(x, y, 1, 1).data.slice(0, 3)];
        return { ratio, delta: Math.max(...before.map((channel, index) => Math.abs(channel - after[index]))) };
      });
    }, { source: screenshot.toString("base64"), y: boundaryY, width: viewport.width });
    const worst = Math.max(...samples.map(({ delta }) => delta));
    if (worst > 6) {
      failures.push(`${viewport.label}: hero-to-moments paint seam has a maximum channel jump of ${worst} (maximum 6)`);
    }
  }

  await page.close();
}

await browser.close();

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Section transition checks passed");
