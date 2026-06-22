import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (file) =>
  readFile(new URL(`../${file}`, import.meta.url), "utf8");

test("hero uses a responsive high-priority semantic image", async () => {
  const [hero, image] = await Promise.all([
    readSource("src/components/Hero.jsx"),
    readSource("src/components/ResponsiveImage.jsx"),
  ]);
  assert.match(hero, /fetchPriority="high"/);
  assert.match(hero, /loading="eager"/);
  assert.match(image, /<picture/);
  assert.match(image, /type="image\/avif"/);
  assert.match(image, /type="image\/webp"/);
  assert.match(image, /srcSet=/);
});

test("Leaflet is behind a user or viewport activated dynamic import", async () => {
  const [home, boundary] = await Promise.all([
    readSource("src/pages/HomePage.jsx"),
    readSource("src/components/LazyCabinMapExplorer.jsx"),
  ]);
  assert.doesNotMatch(home, /from "\.\.\/components\/CabinMapExplorer"/);
  assert.match(boundary, /lazy\(\(\) => import\("\.\/CabinMapExplorer"\)\)/);
  assert.match(boundary, /IntersectionObserver/);
  assert.match(boundary, /Cargar mapa interactivo/);
  assert.match(boundary, /map_fallback/);
});

test("published assets come from the managed public directory", async () => {
  const [vite, index] = await Promise.all([
    readSource("vite.config.js"),
    readSource("index.html"),
  ]);
  assert.match(vite, /publicDir: "public"/);
  assert.doesNotMatch(index, /fonts\.googleapis\.com/);
  assert.match(index, /puchuman-hero-1280\.avif/);
});
