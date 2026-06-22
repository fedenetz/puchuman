import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { BOOKING_URL, CABINS, CONTACT } from "../src/data.js";
import { STATIC_ROUTES } from "../src/routes.js";

const distDir = path.resolve("dist");
const routeFile = (routePath) =>
  routePath === "/"
    ? path.join(distDir, "index.html")
    : path.join(distDir, ...routePath.split("/").filter(Boolean), "index.html");

const hrefPattern = /<a[^>]+href="([^"]+)"/g;
for (const route of STATIC_ROUTES) {
  const source = await readFile(routeFile(route.path), "utf8");
  for (const [, href] of source.matchAll(hrefPattern)) {
    if (href.startsWith("mailto:")) {
      assert.equal(href, `mailto:${CONTACT.email}`);
      continue;
    }
    if (href.startsWith("https://wa.me/")) {
      assert.equal(new URL(href).pathname, `/${CONTACT.whatsapp}`);
      continue;
    }
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const pathname = new URL(href, "https://example.com").pathname;
    if (path.extname(pathname)) {
      await access(path.join(distDir, ...pathname.split("/").filter(Boolean)));
    } else {
      await access(
        routeFile(pathname.endsWith("/") ? pathname : `${pathname}/`),
      );
    }
  }
}

const bookingUrls = [
  BOOKING_URL,
  ...CABINS.map(({ bookingUrl }) => bookingUrl),
];
for (const value of bookingUrls) {
  const url = new URL(value);
  assert.equal(url.protocol, "https:");
  assert.equal(url.hostname, "reservation.gofeels.com");
}
for (const cabin of CABINS) {
  assert.match(
    cabin.bookingUrl,
    new RegExp(`/room-detail/${cabin.goFeelsRoomId}(?:\\?|$)`),
  );
  if (!cabin.googleMapsUrl) continue;
  const url = new URL(cabin.googleMapsUrl);
  assert.equal(url.protocol, "https:");
  assert.equal(url.hostname, "maps.app.goo.gl");
}

const robots = await readFile(path.join(distDir, "robots.txt"), "utf8");
const sitemap = await readFile(path.join(distDir, "sitemap.xml"), "utf8");
assert.match(robots, /Sitemap: https:\/\/[^\s]+\/sitemap\.xml/);
const sitemapOrigin = new URL(sitemap.match(/<loc>([^<]+)<\/loc>/)[1]).origin;
for (const route of STATIC_ROUTES) {
  assert.ok(sitemap.includes(new URL(route.path, sitemapOrigin).href));
}

console.log(
  `Checked links for ${STATIC_ROUTES.length} routes and ${CABINS.length} GoFeels/Maps configurations.`,
);
