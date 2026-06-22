import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import puppeteer from "puppeteer-core";
import { STATIC_ROUTES } from "../src/routes.js";

const distDir = path.resolve("dist");
await access(path.join(distDir, "index.html"));

const contentTypes = {
  ".css": "text/css",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};
const securityHeaders = {
  "Content-Security-Policy-Report-Only": "default-src 'self'",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "X-Frame-Options": "DENY",
};

async function localHandler(request, response) {
  const pathname = decodeURIComponent(
    new URL(request.url, "http://local").pathname,
  );
  const clean = path.normalize(pathname).replace(/^([/\\])+/, "");
  let filename = path.join(distDir, clean);
  let statusCode = 200;
  try {
    const info = await stat(filename);
    if (info.isDirectory()) filename = path.join(filename, "index.html");
    await access(filename);
  } catch {
    filename = path.join(distDir, "404.html");
    statusCode = 404;
  }
  const body = await readFile(filename);
  response.writeHead(statusCode, {
    ...securityHeaders,
    "Content-Type":
      contentTypes[path.extname(filename)] || "application/octet-stream",
  });
  response.end(body);
}

let server;
let baseUrl = process.env.E2E_BASE_URL;
if (!baseUrl) {
  server = createServer((request, response) => {
    localHandler(request, response).catch((error) => {
      response.writeHead(500);
      response.end(error.message);
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
}

const expectedCanonicalOrigin = new URL(
  process.env.SITE_URL ||
    (await readFile(path.join(distDir, "sitemap.xml"), "utf8")).match(
      /<loc>(https?:\/\/[^/]+)/,
    )?.[1],
).origin;

for (const route of STATIC_ROUTES) {
  const response = await fetch(new URL(route.path, baseUrl));
  assert.equal(response.status, 200, `${route.path} should return 200`);
  const html = await response.text();
  assert.match(html, /<main[^>]+id="main-content"/);
  assert.equal(
    new URL(html.match(/<link rel="canonical" href="([^"]+)">/)[1]).origin,
    expectedCanonicalOrigin,
  );
}
const missingResponse = await fetch(
  new URL("/definitely-missing-e2e/", baseUrl),
);
assert.equal(missingResponse.status, 404);
assert.match(await missingResponse.text(), /Página no encontrada/);

const executableCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);
let executablePath;
for (const candidate of executableCandidates) {
  try {
    await access(candidate);
    executablePath = candidate;
    break;
  } catch {
    // Try the next common browser location.
  }
}
assert.ok(executablePath, "Set CHROME_PATH to a Chrome/Chromium executable.");

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.evaluateOnNewDocument(() => {
    window.__PUCHUMAN_ANALYTICS_TEST__ = true;
    try {
      localStorage.setItem("puchuman.analytics-consent", "granted");
    } catch {
      // The initial blank document has no storage origin; navigation does.
    }
  });
  const mapRequests = [];
  page.on("request", (request) => {
    if (/leaflet|tile\.openstreetmap/i.test(request.url()))
      mapRequests.push(request.url());
  });
  await page.goto(new URL("/", baseUrl), { waitUntil: "networkidle0" });
  assert.equal(mapRequests.length, 0, "Leaflet/tile requests must be lazy");

  const menuButton = await page.$(".menu-toggle");
  assert.ok(menuButton);
  await menuButton.click();
  assert.equal(
    await menuButton.evaluate((node) => node.getAttribute("aria-expanded")),
    "true",
  );
  await page.keyboard.press("Escape");
  assert.equal(
    await menuButton.evaluate((node) => node.getAttribute("aria-expanded")),
    "false",
  );
  await page.waitForFunction(() =>
    document.activeElement?.classList.contains("menu-toggle"),
  );
  assert.equal(
    await page.evaluate(() =>
      document.activeElement?.classList.contains("menu-toggle"),
    ),
    true,
  );

  const faqButton = await page.$(".accordion button");
  await faqButton.click();
  assert.equal(
    await faqButton.evaluate((node) => node.getAttribute("aria-expanded")),
    "false",
  );
  await faqButton.click();
  assert.equal(
    await faqButton.evaluate((node) => node.getAttribute("aria-expanded")),
    "true",
  );

  await page.$eval(".map-loader button", (button) => button.click());
  await page.waitForSelector(".leaflet-cabin-pin");
  const markerBoxes = await page.$$eval(".leaflet-cabin-pin", (nodes) =>
    nodes.map((node) => {
      const box = node.getBoundingClientRect();
      return [box.width, box.height];
    }),
  );
  const zoomBoxes = await page.$$eval(".leaflet-control-zoom a", (nodes) =>
    nodes.map((node) => {
      const box = node.getBoundingClientRect();
      return [box.width, box.height];
    }),
  );
  for (const [width, height] of [...markerBoxes, ...zoomBoxes]) {
    assert.ok(width >= 44 && height >= 44, `Map control is ${width}x${height}`);
  }

  const events = await page.evaluate(() =>
    (window.dataLayer || [])
      .filter((entry) => entry?.[0] === "event")
      .map((entry) => entry[1]),
  );
  assert.equal(events.filter((name) => name === "view_item_list").length, 1);
  assert.equal(events.filter((name) => name === "view_map").length, 1);

  await page.evaluate(() => {
    const link = document.querySelector(
      '.cabin-card a[href^="https://reservation.gofeels.com"]',
    );
    link.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });
    link.click();
  });
  const bookingEvents = await page.evaluate(
    () =>
      (window.dataLayer || []).filter(
        (entry) => entry?.[0] === "event" && entry[1] === "begin_booking",
      ).length,
  );
  assert.equal(bookingEvents, 1);
} finally {
  await browser.close();
  if (server) await new Promise((resolve) => server.close(resolve));
}

console.log(
  `E2E passed for ${STATIC_ROUTES.length} routes, 404, no-JS, metadata, keyboard, lazy map, touch targets, and analytics.`,
);
