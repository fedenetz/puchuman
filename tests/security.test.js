import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (file) =>
  readFile(new URL(`../${file}`, import.meta.url), "utf8");

test("Netlify security policy starts in report-only mode", async () => {
  const source = await readSource("netlify.toml");
  assert.match(source, /Content-Security-Policy-Report-Only/);
  assert.match(source, /X-Content-Type-Options = "nosniff"/);
  assert.match(source, /Referrer-Policy = "strict-origin-when-cross-origin"/);
  assert.match(source, /Permissions-Policy/);
  assert.match(source, /X-Frame-Options = "DENY"/);
  assert.doesNotMatch(source, /Strict-Transport-Security\s*=/);
});

test("analytics requires explicit stored consent", async () => {
  const source = await readSource("src/lib/analytics.js");
  assert.match(source, /getAnalyticsConsent\(\) !== "granted"/);
  assert.match(source, /analytics_storage: "denied"/);
  assert.match(source, /ALLOWED_PARAMETERS/);
});

test("operational workflows are configured", async () => {
  const [monitor, dependabot, ci] = await Promise.all([
    readSource(".github/workflows/production-monitor.yml"),
    readSource(".github/dependabot.yml"),
    readSource(".github/workflows/ci.yml"),
  ]);
  assert.match(monitor, /schedule:/);
  assert.match(monitor, /SITE_URL/);
  assert.match(dependabot, /package-ecosystem: npm/);
  assert.match(ci, /npm run build/);
});
