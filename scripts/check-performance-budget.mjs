import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const distDir = path.join(rootDir, "dist");

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (
    await Promise.all(
      entries.map((entry) => {
        const target = path.join(directory, entry.name);
        return entry.isDirectory() ? listFiles(target) : target;
      }),
    )
  ).flat();
}

const files = await listFiles(distDir);
const assets = files.filter((file) =>
  file.includes(`${path.sep}assets${path.sep}`),
);
const initialJs = assets.filter(
  (file) => path.basename(file).startsWith("index-") && file.endsWith(".js"),
);
const css = assets.filter((file) => file.endsWith(".css"));
const images = files.filter((file) => /\.(?:avif|webp|jpe?g|png)$/i.test(file));

const gzipBytes = async (file) => gzipSync(await readFile(file)).byteLength;
const totalBytes = (
  await Promise.all(files.map(async (file) => (await stat(file)).size))
).reduce((sum, bytes) => sum + bytes, 0);
const initialJsGzip = (await Promise.all(initialJs.map(gzipBytes))).reduce(
  (sum, bytes) => sum + bytes,
  0,
);
const cssGzip = (await Promise.all(css.map(gzipBytes))).reduce(
  (sum, bytes) => sum + bytes,
  0,
);
const imageSizes = await Promise.all(
  images.map(async (file) => ({ file, bytes: (await stat(file)).size })),
);
const largestImage = imageSizes.sort((a, b) => b.bytes - a.bytes)[0];

// Caps are regression budgets derived from the audited 115.33 kB initial JS
// gzip and 17.7 MB publish baseline. They are not production SLO claims.
const budgets = {
  initialJsGzip: 110 * 1024,
  cssGzip: 18 * 1024,
  largestImage: 400 * 1024,
  totalDist: 12 * 1024 * 1024,
};
const measurements = {
  initialJsGzip,
  cssGzip,
  largestImage: largestImage?.bytes ?? 0,
  totalDist: totalBytes,
};
const failures = Object.entries(budgets).filter(
  ([name, limit]) => measurements[name] > limit,
);

console.log(
  JSON.stringify(
    {
      measurements,
      budgets,
      largestImage: largestImage
        ? path.relative(distDir, largestImage.file)
        : null,
    },
    null,
    2,
  ),
);

if (failures.length) {
  throw new Error(
    `Performance budget exceeded: ${failures.map(([name]) => name).join(", ")}`,
  );
}
