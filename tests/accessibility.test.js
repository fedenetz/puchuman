import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (file) =>
  readFile(new URL(`../${file}`, import.meta.url), "utf8");

test("all route layouts expose the skip target", async () => {
  const [home, layout, header] = await Promise.all([
    readSource("src/pages/HomePage.jsx"),
    readSource("src/components/PageLayout.jsx"),
    readSource("src/components/Header.jsx"),
  ]);
  assert.match(header, /href="#main-content"/);
  assert.match(home, /id="main-content"/);
  assert.match(layout, /id="main-content"/);
});

test("map cards use a sibling selection button instead of an interactive article", async () => {
  const source = await readSource("src/components/CabinMapExplorer.jsx");
  assert.match(source, /className="explorer-card__select"/);
  assert.match(source, /Mostrar \$\{cabin\.name\} en el mapa/);
  assert.doesNotMatch(source, /<article[\s\S]{0,400}role="button"/);
  assert.doesNotMatch(source, /<article[\s\S]{0,400}tabIndex=/);
  assert.match(source, /alt=""/);
});

test("mobile navigation and FAQ controls expose their relationships", async () => {
  const [header, faq] = await Promise.all([
    readSource("src/components/Header.jsx"),
    readSource("src/components/FAQ.jsx"),
  ]);
  assert.match(header, /aria-controls="primary-navigation"/);
  assert.match(header, /event\.key === "Escape"/);
  assert.match(header, /element\.toggleAttribute\("inert", open\)/);
  assert.match(faq, /aria-controls={`faq-panel-\$\{index\}`}/);
  assert.match(faq, /aria-labelledby={`faq-button-\$\{index\}`}/);
  assert.match(faq, /hidden={open !== index}/);
});

test("reduced motion avoids animated map movement", async () => {
  const source = await readSource("src/components/CabinMapExplorer.jsx");
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(
    source,
    /map\.setView\(position, map\.getZoom\(\), { animate: false }\)/,
  );
});

test("map attribution and application fallbacks remain available", async () => {
  const [map, boundary, consent] = await Promise.all([
    readSource("src/components/CabinMapExplorer.jsx"),
    readSource("src/components/RootErrorBoundary.jsx"),
    readSource("src/components/CookieConsent.jsx"),
  ]);
  assert.match(map, /OpenStreetMap/);
  assert.match(boundary, /Reservar online/);
  assert.match(boundary, /wa\.me/);
  assert.match(consent, /Rechazar/);
  assert.match(consent, /Aceptar analitica/);
});
