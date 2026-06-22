import assert from "node:assert/strict";
import test from "node:test";
import { CABINS } from "../src/data.js";
import { normalizePath, resolveRoute, STATIC_ROUTES } from "../src/routes.js";

test("static routes are unique and use trailing slashes", () => {
  const paths = STATIC_ROUTES.map(({ path }) => path);
  assert.equal(new Set(paths).size, paths.length);
  for (const path of paths) assert.ok(path === "/" || path.endsWith("/"));
});

test("every cabin future detail URL resolves to its shared cabin", () => {
  for (const cabin of CABINS) {
    const route = resolveRoute(cabin.futureDetailUrl);
    assert.equal(route.kind, "cabin");
    assert.equal(route.cabin, cabin);
  }
});

test("known core pages resolve and unknown paths do not", () => {
  assert.equal(resolveRoute("/").kind, "home");
  assert.equal(resolveRoute("/cabanas").kind, "cabins");
  assert.equal(resolveRoute("/politicas-de-reserva/").kind, "policies");
  assert.equal(resolveRoute("/contacto/index.html").kind, "contact");
  assert.equal(resolveRoute("/privacidad/").kind, "privacy");
  assert.equal(resolveRoute("/definitely-missing/").kind, "not-found");
  assert.equal(normalizePath("/contacto"), "/contacto/");
});
