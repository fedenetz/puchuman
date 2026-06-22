import lighthouse from "lighthouse";
import { launch } from "chrome-launcher";
import { existsSync } from "node:fs";

const url = process.argv[2] || "http://127.0.0.1:4174/";
const chromePath =
  process.env.CHROME_PATH ||
  [
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  ].find(existsSync);
const chrome = await launch({
  chromePath,
  chromeFlags: [
    "--headless",
    "--no-sandbox",
    "--disable-gpu",
    "--no-first-run",
  ],
});

const profiles = {
  mobile: undefined,
  desktop: {
    extends: "lighthouse:default",
    settings: {
      formFactor: "desktop",
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
        requestLatencyMs: 0,
        downloadThroughputKbps: 0,
        uploadThroughputKbps: 0,
      },
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false,
      },
    },
  },
};

const results = {};
try {
  for (const [profile, config] of Object.entries(profiles)) {
    results[profile] = [];
    for (let run = 1; run <= 3; run += 1) {
      const report = await lighthouse(
        url,
        {
          port: chrome.port,
          logLevel: "silent",
          output: "json",
          onlyCategories: ["performance"],
        },
        config,
      );
      const { audits, categories } = report.lhr;
      results[profile].push({
        run,
        performance: Math.round(categories.performance.score * 100),
        fcp: Math.round(audits["first-contentful-paint"].numericValue),
        lcp: Math.round(audits["largest-contentful-paint"].numericValue),
        tbt: Math.round(audits["total-blocking-time"].numericValue),
        cls: Number(audits["cumulative-layout-shift"].numericValue.toFixed(3)),
      });
    }
  }
} finally {
  try {
    await chrome.kill();
  } catch (error) {
    console.warn(`Chrome cleanup warning: ${error.code || error.message}`);
  }
}

const median = (values) => [...values].sort((a, b) => a - b)[1];
const medians = Object.fromEntries(
  Object.entries(results).map(([profile, runs]) => [
    profile,
    Object.fromEntries(
      ["performance", "fcp", "lcp", "tbt", "cls"].map((metric) => [
        metric,
        median(runs.map((run) => run[metric])),
      ]),
    ),
  ]),
);

console.log(JSON.stringify({ url, runs: results, medians }, null, 2));
