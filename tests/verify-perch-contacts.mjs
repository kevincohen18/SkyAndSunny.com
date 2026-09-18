import { pathToFileURL } from "node:url";

const playwrightModule = process.env.PLAYWRIGHT_MODULE;

if (!playwrightModule) {
  throw new Error("Set PLAYWRIGHT_MODULE to the installed Playwright index.js path");
}

const playwrightImport = await import(pathToFileURL(playwrightModule));
const { chromium } = playwrightImport.default ?? playwrightImport;
const targetURL = process.env.NIGHT_AVIARY_URL || "http://127.0.0.1:4173/";
const counterfactual = process.argv.includes("--counterfactual-10px");
const viewports = [
  [1440, 900], [1440, 1000],
  [1024, 900], [1024, 1000],
  [900, 900], [900, 1000],
  [800, 900], [800, 1000],
  [390, 667], [390, 844],
  [320, 667], [320, 844],
];
const expectedSubjects = ["sunny", "sky", "watermelon", "strawberries", "obsessions"];
const expectedPadCounts = {
  sunny: 2,
  sky: 1,
  watermelon: 1,
  strawberries: 2,
  obsessions: 1,
};
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
});
const results = [];
const failures = [];

for (const [width, height] of viewports) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  const requestFailures = [];
  const badResponses = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => pageErrors.push(String(error)));
  page.on("requestfailed", (request) => requestFailures.push(`${request.url()}: ${request.failure()?.errorText}`));
  page.on("response", (response) => {
    if (response.status() >= 400) badResponses.push(`${response.status()} ${response.url()}`);
  });
  const response = await page.goto(targetURL, { waitUntil: "networkidle", timeout: 45_000 });
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, document.documentElement.scrollHeight);
    await Promise.all([...document.images].map((image) => image.decode?.().catch(() => {})));
    window.scrollTo(0, 0);
  });

  if (counterfactual) {
    await page.locator('[data-support-svg="sky"]').evaluate((support) => {
      support.style.transform = "translateY(10px)";
    });
  }

  const state = await page.evaluate(async (subjects) => {
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    };
    const toScreen = (path, point) => {
      const matrix = path.getScreenCTM();
      const transformed = new DOMPoint(point.x, point.y).matrixTransform(matrix);
      return { x: transformed.x, y: transformed.y };
    };
    const nearestOnPath = (path, anchor) => {
      const length = path.getTotalLength();
      const samples = Math.max(2400, Math.ceil(length * 3));
      let best = { distance: Number.POSITIVE_INFINITY, at: 0, point: null };
      for (let index = 0; index <= samples; index += 1) {
        const at = length * index / samples;
        const point = toScreen(path, path.getPointAtLength(at));
        const distance = Math.hypot(point.x - anchor.x, point.y - anchor.y);
        if (distance < best.distance) best = { distance, at, point };
      }
      let span = length / samples;
      for (let pass = 0; pass < 8; pass += 1) {
        const candidates = [best.at - span, best.at - span / 2, best.at, best.at + span / 2, best.at + span]
          .map((at) => Math.max(0, Math.min(length, at)));
        for (const at of candidates) {
          const point = toScreen(path, path.getPointAtLength(at));
          const distance = Math.hypot(point.x - anchor.x, point.y - anchor.y);
          if (distance < best.distance) best = { distance, at, point };
        }
        span /= 2;
      }
      return { distance: best.distance, ratio: best.at / length, point: best.point };
    };
    const alphaCanvases = new Map();
    const sampleAlpha = (image, x, y) => {
      if (!alphaCanvases.has(image)) {
        const canvas = document.createElement("canvas");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        context.drawImage(image, 0, 0);
        alphaCanvases.set(image, context);
      }
      const context = alphaCanvases.get(image);
      const left = Math.max(0, Math.round(x) - 4);
      const top = Math.max(0, Math.round(y) - 4);
      const width = Math.min(9, image.naturalWidth - left);
      const height = Math.min(9, image.naturalHeight - top);
      const pixels = context.getImageData(left, top, width, height).data;
      const values = [];
      for (let index = 3; index < pixels.length; index += 4) values.push(pixels[index]);
      return {
        exact: context.getImageData(Math.round(x), Math.round(y), 1, 1).data[3],
        neighborhoodMax: Math.max(...values),
        neighborhoodSolidPixels: values.filter((alpha) => alpha >= 128).length,
      };
    };
    const contours = [...document.querySelectorAll("[data-support-contour]")].filter((path) => getComputedStyle(path).display !== "none" && visible(path.closest("svg")) && path.getTotalLength() > 0);
    const contacts = contours.flatMap((path) => {
      const subject = path.dataset.supportContour;
      const image = document.querySelector(path.dataset.supportBird);
      const imageRect = image?.getBoundingClientRect();
      const imageStyle = getComputedStyle(image);
      const scale = imageStyle.objectFit === "contain"
        ? Math.min(imageRect.width / image.naturalWidth, imageRect.height / image.naturalHeight)
        : null;
      const renderedWidth = scale ? image.naturalWidth * scale : imageRect.width;
      const renderedHeight = scale ? image.naturalHeight * scale : imageRect.height;
      const imageOffsetX = (imageRect.width - renderedWidth) / 2;
      const imageOffsetY = (imageRect.height - renderedHeight) / 2;
      const anchors = (path.dataset.supportAnchors || "").split(";").filter(Boolean).map((pair) => pair.split(",").map(Number));
      return anchors.map(([x, y], index) => {
        const anchor = {
          x: imageRect.left + imageOffsetX + (x / image.naturalWidth) * renderedWidth,
          y: imageRect.top + imageOffsetY + (y / image.naturalHeight) * renderedHeight,
        };
        const nearest = nearestOnPath(path, anchor);
        const support = path.closest("svg");
        const supportZ = Number.parseInt(getComputedStyle(support).zIndex, 10);
        const birdZ = Number.parseInt(getComputedStyle(image).zIndex, 10);
        const domOrder = Boolean(support.compareDocumentPosition(image) & Node.DOCUMENT_POSITION_FOLLOWING);
        const alpha = sampleAlpha(image, x, y);
        const owner = path.dataset.supportOwner ? support.querySelector(path.dataset.supportOwner) : null;
        const ownerMatrix = owner?.getScreenCTM()?.inverse();
        const ownerContainsSupport = owner && ownerMatrix
          ? [-1, 0, 1].some((dx) => [-1, 0, 1].some((dy) => {
              const local = new DOMPoint(nearest.point.x + dx, nearest.point.y + dy).matrixTransform(ownerMatrix);
              return owner.isPointInFill(local);
            }))
          : null;
        return {
          subject,
          pad: index + 1,
          distance: Number(nearest.distance.toFixed(3)),
          pathRatio: Number(nearest.ratio.toFixed(4)),
          anchor: { x: Number(anchor.x.toFixed(2)), y: Number(anchor.y.toFixed(2)) },
          supportPoint: { x: Number(nearest.point.x.toFixed(2)), y: Number(nearest.point.y.toFixed(2)) },
          alpha,
          supportZ,
          birdZ,
          birdAboveSupport: domOrder && Number.isFinite(supportZ) && Number.isFinite(birdZ) && supportZ < birdZ,
          ownerContainsSupport,
        };
      });
    });
    const obsessionsContour = contours.find((path) => path.dataset.supportContour === "obsessions");
    const obsessionsSVG = obsessionsContour?.closest("svg");
    const obsessionsMain = obsessionsSVG?.querySelector(".branch-main.segment-three");
    const layerNumber = (element, pseudo = null) => Number.parseInt(getComputedStyle(element, pseudo).zIndex, 10);
    const compositions = ["watermelon", "strawberries", "obsessions"].map((subject) => {
      const moment = document.querySelector(`.moment-${subject}`);
      const context = moment.querySelector(".moment-context");
      const bird = moment.querySelector(".moment-bird");
      const caption = moment.querySelector(".moment-copy");
      const link = moment.querySelector(".moment-image-link");
      const body = [...document.querySelectorAll(`[data-support-body="${subject}"]`)].find((candidate) => visible(candidate.closest("svg")));
      const branchLayer = body?.closest("svg");
      link.focus({ preventScroll: true });
      const contextRect = context.getBoundingClientRect();
      const bodyRect = body.getBoundingClientRect();
      const left = Math.max(contextRect.left, bodyRect.left);
      const right = Math.min(contextRect.right, bodyRect.right);
      const top = Math.max(contextRect.top + contextRect.height * 0.45, bodyRect.top);
      const bottom = Math.min(contextRect.bottom, bodyRect.bottom);
      const inverse = body.getScreenCTM()?.inverse();
      const step = 2;
      const rows = [];
      if (inverse && right > left && bottom > top) {
        for (let y = top; y <= bottom; y += step) {
          const xs = [];
          for (let x = left; x <= right; x += step) {
            const local = new DOMPoint(x, y).matrixTransform(inverse);
            if (body.isPointInFill(local) || body.isPointInStroke(local)) xs.push(x);
          }
          if (xs.length) rows.push({ y, min: Math.min(...xs), max: Math.max(...xs) });
        }
      }
      const paintOrder = {
        context: layerNumber(context),
        branch: layerNumber(branchLayer),
        bird: layerNumber(bird),
        caption: layerNumber(caption),
        focus: layerNumber(link, "::after"),
      };
      return {
        subject,
        paintOrder,
        ordered: paintOrder.context < paintOrder.branch
          && paintOrder.branch < paintOrder.bird
          && paintOrder.bird < paintOrder.caption
          && paintOrder.caption < paintOrder.focus,
        overlap: {
          width: Number((rows.length ? Math.max(...rows.map((row) => row.max - row.min + step)) : 0).toFixed(2)),
          height: Number((rows.length ? rows.at(-1).y - rows[0].y + step : 0).toFixed(2)),
          sampledRows: rows.length,
        },
      };
    });
    const sharedSupportPaths = [...document.querySelectorAll("[data-shared-support]")].filter(visible);
    const sharedSupportRects = sharedSupportPaths.map((path) => path.getBoundingClientRect());
    const sharedIntersection = sharedSupportRects.length === 2 ? {
      left: Math.max(sharedSupportRects[0].left, sharedSupportRects[1].left),
      right: Math.min(sharedSupportRects[0].right, sharedSupportRects[1].right),
      top: Math.max(sharedSupportRects[0].top, sharedSupportRects[1].top),
      bottom: Math.min(sharedSupportRects[0].bottom, sharedSupportRects[1].bottom),
    } : null;
    const sharedHitPoints = [];
    if (sharedIntersection && sharedIntersection.right > sharedIntersection.left && sharedIntersection.bottom > sharedIntersection.top) {
      const inverses = sharedSupportPaths.map((path) => path.getScreenCTM()?.inverse());
      for (let y = sharedIntersection.top; y <= sharedIntersection.bottom; y += 2) {
        for (let x = sharedIntersection.left; x <= sharedIntersection.right; x += 2) {
          const insideBoth = sharedSupportPaths.every((path, index) => {
            if (!inverses[index]) return false;
            const local = new DOMPoint(x, y).matrixTransform(inverses[index]);
            return path.isPointInFill(local);
          });
          if (insideBoth) sharedHitPoints.push({ x, y });
        }
      }
    }
    const internalTerminals = [...document.querySelectorAll("[data-internal-terminal]")].filter(visible).map((path) => {
      const [x, y] = path.dataset.internalTerminal.split(",").map(Number);
      const point = toScreen(path, { x, y });
      const offscreen = point.x <= -4 || point.x >= innerWidth + 4 || point.y <= -4 || point.y >= innerHeight + 4;
      const otherSupports = sharedSupportPaths.filter((candidate) => candidate !== path);
      const covered = [[0, 0], [4, 0], [-4, 0], [0, 4], [0, -4], [3, 3], [3, -3], [-3, 3], [-3, -3]].every(([dx, dy]) => otherSupports.some((support) => {
        const inverse = support.getScreenCTM()?.inverse();
        if (!inverse) return false;
        return support.isPointInFill(new DOMPoint(point.x + dx, point.y + dy).matrixTransform(inverse));
      }));
      return {
        support: path.dataset.sharedSupport,
        point: { x: Number(point.x.toFixed(2)), y: Number(point.y.toFixed(2)) },
        offscreen,
        covered,
        hidden: offscreen || covered,
      };
    });
    const sunnyFigureRect = document.querySelector(".resident-sunny").getBoundingClientRect();
    const sunnyCaptionRect = document.querySelector(".resident-sunny figcaption").getBoundingClientRect();
    const expandedCaptionRect = {
      left: sunnyCaptionRect.left - 8,
      right: sunnyCaptionRect.right + 8,
      top: sunnyCaptionRect.top - 8,
      bottom: sunnyCaptionRect.bottom + 8,
    };
    let captionWoodClear = true;
    for (let y = expandedCaptionRect.top; y <= expandedCaptionRect.bottom && captionWoodClear; y += 1) {
      for (let x = expandedCaptionRect.left; x <= expandedCaptionRect.right; x += 1) {
        if (sharedSupportPaths.some((path) => {
          const inverse = path.getScreenCTM()?.inverse();
          if (!inverse) return false;
          return path.isPointInFill(new DOMPoint(x, y).matrixTransform(inverse));
        })) {
          captionWoodClear = false;
          break;
        }
      }
    }
    const openBranchShadows = [...document.querySelectorAll(".habitat-branch .branch-shadow:not(.branch-fill-shadow)")];
    const filledBranchShadows = [...document.querySelectorAll(".habitat-branch .branch-fill-shadow")];
    return {
      contacts,
      compositions,
      subjects: [...new Set(contacts.map((contact) => contact.subject))].sort(),
      images: [...document.images].map((image) => ({ complete: image.complete, width: image.naturalWidth, height: image.naturalHeight })),
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      obsessions: {
        localTwig: Boolean(document.querySelector(".moment-obsessions .moment-perch")),
        continuous: obsessionsContour?.dataset.continuousMain === "true",
        mainPresent: Boolean(obsessionsMain),
        mainFilled: obsessionsMain ? getComputedStyle(obsessionsMain).fill !== "none" : false,
      },
      sharedHero: {
        pathCount: sharedSupportPaths.length,
        overlapSamples: sharedHitPoints.length,
        overlapWidth: sharedHitPoints.length ? Number((Math.max(...sharedHitPoints.map(({ x }) => x)) - Math.min(...sharedHitPoints.map(({ x }) => x)) + 2).toFixed(2)) : 0,
        overlapHeight: sharedHitPoints.length ? Number((Math.max(...sharedHitPoints.map(({ y }) => y)) - Math.min(...sharedHitPoints.map(({ y }) => y)) + 2).toFixed(2)) : 0,
        sunnyLeft: sharedSupportRects[0] ? Number(sharedSupportRects[0].left.toFixed(2)) : null,
        skyRight: sharedSupportRects[1] ? Number(sharedSupportRects[1].right.toFixed(2)) : null,
        labelFeetGap: Number((sunnyCaptionRect.top - sunnyFigureRect.bottom).toFixed(2)),
        captionWoodClear,
        internalTerminals,
      },
      shadows: {
        openFills: openBranchShadows.map((path) => getComputedStyle(path).fill),
        filledFills: filledBranchShadows.map((path) => getComputedStyle(path).fill),
      },
      tikTokLinks: [...document.querySelectorAll('a[href*="tiktok.com/@skyandsunny.com/video/"]')].map((link) => link.href),
    };
  }, expectedSubjects);

  const viewportFailures = [];
  if (response?.status() !== 200) viewportFailures.push(`root status ${response?.status()}`);
  if (state.images.length !== 8 || state.images.some((image) => !image.complete || image.width === 0 || image.height === 0)) viewportFailures.push("image decode");
  if (state.overflow) viewportFailures.push("horizontal overflow");
  if (JSON.stringify(state.subjects) !== JSON.stringify([...expectedSubjects].sort())) viewportFailures.push(`subjects ${state.subjects.join(",")}`);
  const actualPadCounts = Object.fromEntries(expectedSubjects.map((subject) => [subject, state.contacts.filter((contact) => contact.subject === subject).length]));
  if (state.contacts.length !== 7) viewportFailures.push(`pad total ${state.contacts.length}`);
  for (const [subject, count] of Object.entries(expectedPadCounts)) {
    if (actualPadCounts[subject] !== count) viewportFailures.push(`${subject}: expected ${count} pads, got ${actualPadCounts[subject]}`);
  }
  for (const contact of state.contacts) {
    if (contact.distance > 2) viewportFailures.push(`${contact.subject} pad ${contact.pad}: ${contact.distance}px`);
    if (contact.alpha.exact < 128 || contact.alpha.neighborhoodSolidPixels < 5) viewportFailures.push(`${contact.subject} pad ${contact.pad}: invalid alpha ${contact.alpha.exact}`);
    if (!contact.birdAboveSupport) viewportFailures.push(`${contact.subject}: support is not before bird`);
    if (contact.subject === "obsessions" && !contact.ownerContainsSupport) viewportFailures.push("obsessions contour is not on solid main branch");
    if (contact.subject === "obsessions" && (contact.pathRatio < 0.05 || contact.pathRatio > 0.95)) viewportFailures.push("obsessions contact is at branch endpoint");
  }
  for (const composition of state.compositions) {
    if (!composition.ordered) viewportFailures.push(`${composition.subject}: paint order ${JSON.stringify(composition.paintOrder)}`);
    if (composition.overlap.width < 10 || composition.overlap.height < 4) {
      viewportFailures.push(`${composition.subject}: branch/context overlap ${composition.overlap.width}x${composition.overlap.height}px`);
    }
  }
  if (state.obsessions.localTwig || !state.obsessions.continuous || !state.obsessions.mainPresent || !state.obsessions.mainFilled) viewportFailures.push("obsessions continuous main branch contract");
  if (state.sharedHero.pathCount !== 2 || state.sharedHero.overlapSamples === 0) viewportFailures.push(`hero shared support join ${JSON.stringify(state.sharedHero)}`);
  if (state.sharedHero.internalTerminals.length === 0 || state.sharedHero.internalTerminals.some((terminal) => !terminal.hidden)) viewportFailures.push(`exposed internal support terminal ${JSON.stringify(state.sharedHero.internalTerminals)}`);
  if (state.sharedHero.sunnyLeft > 0.5 || state.sharedHero.skyRight < width - 0.5) viewportFailures.push(`hero support scene-edge continuity ${JSON.stringify(state.sharedHero)}`);
  if (state.sharedHero.labelFeetGap < 8 || !state.sharedHero.captionWoodClear) viewportFailures.push(`Sunny label clearance ${JSON.stringify(state.sharedHero)}`);
  if (state.shadows.openFills.some((fill) => fill !== "none") || state.shadows.filledFills.some((fill) => fill === "none")) viewportFailures.push(`branch shadow fill contract ${JSON.stringify(state.shadows)}`);
  if (state.tikTokLinks.length !== 6) viewportFailures.push("TikTok link count");
  if (consoleErrors.length || pageErrors.length || requestFailures.length || badResponses.length) viewportFailures.push("runtime/network errors");
  const entry = {
    viewport: `${width}x${height}`,
    contacts: state.contacts,
    compositions: state.compositions,
    sharedHero: state.sharedHero,
    shadows: state.shadows,
    errors: consoleErrors.length + pageErrors.length + requestFailures.length + badResponses.length,
    failures: viewportFailures,
  };
  results.push(entry);
  if (viewportFailures.length) failures.push(entry);
  await context.close();
}

await browser.close();
console.log(JSON.stringify({ counterfactual, results, failures }, null, 2));
if (failures.length) process.exitCode = 1;
