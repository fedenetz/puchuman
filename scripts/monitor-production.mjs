import assert from "node:assert/strict";
import { STATIC_ROUTES } from "../src/routes.js";

const targetValue = process.argv[2] || process.env.SITE_URL;
if (!targetValue) throw new Error("Pass a deployed URL or set SITE_URL.");
const target = new URL(targetValue);
const canonicalOrigin = new URL(
  process.env.CANONICAL_SITE_URL || process.env.SITE_URL || target.origin,
).origin;
const failures = [];

async function responseFor(pathname, expectedStatus = 200) {
  const url = new URL(pathname, target);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      headers: { "user-agent": "Puchuman-Uptime-Monitor/1.0" },
    });
    assert.equal(response.status, expectedStatus, `${url} status`);
    return { response, body: await response.text(), url };
  } catch (error) {
    failures.push(`${url}: ${error.message}`);
    return null;
  }
}

for (const route of STATIC_ROUTES) {
  const result = await responseFor(route.path);
  if (!result) continue;
  try {
    const canonical = result.body.match(
      /<link rel="canonical" href="([^"]+)">/,
    )?.[1];
    assert.ok(canonical, `${route.path} canonical missing`);
    assert.equal(new URL(canonical).origin, canonicalOrigin);
    for (const header of [
      "content-security-policy-report-only",
      "x-content-type-options",
      "referrer-policy",
      "permissions-policy",
      "x-frame-options",
    ]) {
      assert.ok(
        result.response.headers.get(header),
        `${route.path} missing ${header}`,
      );
    }
  } catch (error) {
    failures.push(error.message);
  }
}

await responseFor(`/monitor-missing-${Date.now()}/`, 404);
const robotsResult = await responseFor("/robots.txt");
const sitemapResult = await responseFor("/sitemap.xml");
try {
  assert.match(robotsResult.body, /User-agent: \*/);
  assert.match(
    robotsResult.body,
    new RegExp(
      `Sitemap: ${canonicalOrigin.replaceAll(".", "\\.")}\/sitemap\\.xml`,
    ),
  );
  for (const route of STATIC_ROUTES) {
    assert.ok(
      sitemapResult.body.includes(new URL(route.path, canonicalOrigin).href),
    );
  }
  assert.doesNotMatch(sitemapResult.body, /404/);
} catch (error) {
  failures.push(error.message);
}

if (failures.length)
  throw new Error(`Production checks failed:\n${failures.join("\n")}`);
console.log(
  `Verified ${STATIC_ROUTES.length} routes, canonical metadata, headers, robots, sitemap, and a real 404 at ${target.origin}.`,
);
