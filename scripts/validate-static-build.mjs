import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { STATIC_ROUTES } from "../src/routes.js";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const distDir = path.join(rootDir, "dist");
const fileEnv = loadEnv(process.env.NODE_ENV || "production", rootDir, "");
const configuredOrigin = process.env.SITE_URL || fileEnv.SITE_URL;
if (!configuredOrigin) throw new Error("SITE_URL is required for validation.");
const expectedOrigin = new URL(configuredOrigin).origin;

function routeFile(routePath) {
  if (routePath === "/") return path.join(distDir, "index.html");
  return path.join(
    distDir,
    ...routePath.split("/").filter(Boolean),
    "index.html",
  );
}

function matches(source, expression) {
  return [...source.matchAll(expression)].map((match) => match[1]);
}

async function assertInternalLinkExists(href, sourcePath) {
  if (!href.startsWith("/") || href.startsWith("//")) return;
  const pathname = href.split("#")[0].split("?")[0] || "/";
  if (pathname === "/") {
    await access(path.join(distDir, "index.html"));
    return;
  }
  if (path.extname(pathname)) {
    await access(path.join(distDir, ...pathname.split("/").filter(Boolean)));
    return;
  }
  try {
    await access(routeFile(pathname.endsWith("/") ? pathname : `${pathname}/`));
  } catch {
    throw new Error(`Broken internal link ${href} in ${sourcePath}`);
  }
}

const titles = new Set();
const canonicals = new Set();

for (const route of STATIC_ROUTES) {
  const filename = routeFile(route.path);
  const source = await readFile(filename, "utf8");
  const title = matches(source, /<title>([^<]+)<\/title>/g)[0];
  const description = matches(
    source,
    /<meta name="description" content="([^"]+)">/g,
  )[0];
  const canonical = matches(
    source,
    /<link rel="canonical" href="([^"]+)">/g,
  )[0];
  const h1s = matches(source, /<h1[^>]*>(.*?)<\/h1>/g);

  assert.ok(title, `Missing title in ${route.path}`);
  assert.ok(description, `Missing description in ${route.path}`);
  assert.ok(canonical, `Missing canonical in ${route.path}`);
  assert.equal(new URL(canonical).origin, expectedOrigin);
  assert.equal(h1s.length, 1, `Expected one static H1 in ${route.path}`);
  assert.ok(!titles.has(title), `Duplicate title: ${title}`);
  assert.ok(!canonicals.has(canonical), `Duplicate canonical: ${canonical}`);
  titles.add(title);
  canonicals.add(canonical);

  const jsonLdBlocks = matches(
    source,
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
  );
  assert.equal(jsonLdBlocks.length, 1, `Expected JSON-LD in ${route.path}`);
  const jsonLd = JSON.parse(jsonLdBlocks[0]);
  assert.equal(jsonLd["@context"], "https://schema.org");
  assert.ok(Array.isArray(jsonLd["@graph"]) && jsonLd["@graph"].length > 0);
  assert.ok(
    jsonLd["@graph"].some((item) => item["@type"] === "LodgingBusiness"),
  );

  for (const href of matches(source, /<a[^>]+href="([^"]+)"/g)) {
    await assertInternalLinkExists(href, route.path);
  }
}

const notFound = await readFile(path.join(distDir, "404.html"), "utf8");
assert.match(notFound, /<meta name="robots" content="noindex,follow">/);
assert.doesNotMatch(notFound, /<link rel="canonical"/);
assert.match(notFound, /<h1[^>]*>Página no encontrada<\/h1>/);

const sitemap = await readFile(path.join(distDir, "sitemap.xml"), "utf8");
assert.equal(
  matches(sitemap, /<loc>([^<]+)<\/loc>/g).length,
  STATIC_ROUTES.length,
);
assert.doesNotMatch(sitemap, /404/);

const robots = await readFile(path.join(distDir, "robots.txt"), "utf8");
assert.match(robots, /User-agent: \*/);
assert.match(
  robots,
  new RegExp(`Sitemap: ${expectedOrigin.replaceAll(".", "\\.")}/sitemap\\.xml`),
);

console.log(
  `Validated ${STATIC_ROUTES.length} static routes, metadata, schemas, internal links, sitemap, robots, and 404 output.`,
);
