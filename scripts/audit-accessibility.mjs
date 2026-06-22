import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import axe from "axe-core";
import { JSDOM } from "jsdom";
import { STATIC_ROUTES } from "../src/routes.js";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const distDir = path.join(rootDir, "dist");
const documents = [
  ...STATIC_ROUTES.map((route) => ({
    route: route.path,
    file:
      route.path === "/"
        ? path.join(distDir, "index.html")
        : path.join(distDir, route.path, "index.html"),
  })),
  { route: "/404.html", file: path.join(distDir, "404.html") },
];

const failures = [];

for (const document of documents) {
  const html = await readFile(document.file, "utf8");
  const dom = new JSDOM(html, {
    pretendToBeVisual: true,
    runScripts: "outside-only",
    url: `http://127.0.0.1:4173${document.route}`,
  });
  dom.window.eval(axe.source);
  const result = await dom.window.axe.run(dom.window.document, {
    resultTypes: ["violations"],
    rules: {
      // jsdom has no layout/canvas model; visual contrast is checked in-browser.
      "color-contrast": { enabled: false },
    },
  });
  const severe = result.violations.filter(({ impact }) =>
    ["critical", "serious"].includes(impact),
  );
  failures.push(
    ...severe.map((violation) => ({
      route: document.route,
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.map((node) => node.target.join(" ")),
    })),
  );
  dom.window.close();
}

if (failures.length > 0) {
  console.error(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
} else {
  console.log(
    `axe: 0 critical/serious violations across ${documents.length} built documents.`,
  );
}
