import { copyFile, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const sourceDir = path.join(rootDir, "images");
const publicDir = path.join(rootDir, "public");
const mediaDir = path.join(publicDir, "media");
const fontsDir = path.join(publicDir, "fonts");

if (!mediaDir.startsWith(publicDir) || !fontsDir.startsWith(publicDir)) {
  throw new Error("Generated media paths must remain inside public/.");
}

await rm(mediaDir, { recursive: true, force: true });
await rm(fontsDir, { recursive: true, force: true });
await mkdir(mediaDir, { recursive: true });
await mkdir(fontsDir, { recursive: true });

const photos = [
  {
    input: "puchuman lican ray/muelle-playa-grande2.jpeg",
    output: "hero/puchuman-hero",
    widths: [640, 1280, 1920],
  },
  {
    input: "puchuman lican ray/atardecer-lago-calafquen.jpg",
    output: "cta/atardecer-lago",
    widths: [640, 1280, 1920],
  },
  {
    input: "puchuman lican ray/playa-peninsula-2.jpeg",
    output: "story/playa-peninsula",
    widths: [480, 800, 1280],
  },
  {
    input: "puchuman lican ray/casa-Rafael-Mera.jpeg",
    output: "cabins/casa-rafael-mera",
    widths: [480, 800, 1024],
  },
  {
    input: "puchuman lican ray/Casa-Coliñanco.jpg",
    output: "cabins/casa-colinanco",
    widths: [480, 800, 1024],
  },
  {
    input: "puchuman lican ray/cabaña-mariposa.jpg",
    output: "cabins/cabana-mariposa",
    widths: [480, 800, 1024],
  },
  {
    input: "puchuman lican ray/casa-cariman.jpg",
    output: "cabins/casa-cariman",
    widths: [480, 800, 1024],
  },
  {
    input: "puchuman lican ray/casa-cariman-interior.jpg",
    output: "cabins/casa-cariman-interior",
    widths: [480, 800, 1024],
  },
  {
    input: "puchuman lican ray/atardecer-lago-calafquen.jpg",
    output: "gallery/atardecer-lago-calafquen",
    widths: [480, 768, 960],
  },
  {
    input: "puchuman lican ray/muelle-playa-grande.jpg",
    output: "gallery/muelle-playa-grande",
    widths: [480, 768, 960],
  },
  {
    input: "puchuman lican ray/peninsula.jpeg",
    output: "gallery/peninsula",
    widths: [480, 768, 960],
  },
  {
    input: "puchuman lican ray/playa-chica.jpg",
    output: "gallery/playa-chica",
    widths: [480, 768, 960],
  },
  {
    input: "puchuman lican ray/senderos-peninsula.jpg",
    output: "gallery/senderos-peninsula",
    widths: [480, 768, 960],
    webpQuality: 54,
  },
  {
    input: "puchuman lican ray/paseos-lago.jpg",
    output: "gallery/paseos-lago",
    widths: [480, 768, 960],
  },
];

async function writePhoto({ input, output, widths, webpQuality = 62 }) {
  const source = path.join(sourceDir, input);
  const outputDirectory = path.join(mediaDir, path.dirname(output));
  await mkdir(outputDirectory, { recursive: true });

  for (const width of widths) {
    const base = path.join(mediaDir, `${output}-${width}`);
    const pipeline = sharp(source).rotate().resize({
      width,
      fit: "inside",
      withoutEnlargement: true,
    });
    await Promise.all([
      pipeline.clone().avif({ quality: 45, effort: 5 }).toFile(`${base}.avif`),
      pipeline
        .clone()
        .webp({ quality: webpQuality, effort: 5 })
        .toFile(`${base}.webp`),
      pipeline
        .clone()
        .jpeg({ quality: 68, mozjpeg: true, progressive: true })
        .toFile(`${base}.jpg`),
    ]);
  }
}

await Promise.all(photos.map(writePhoto));

const socialImages = [
  ["puchuman lican ray/muelle-playa-grande2.jpeg", "puchuman"],
  ...photos
    .filter(({ output }) => output.startsWith("cabins/"))
    .map(({ input, output }) => [input, path.basename(output)]),
];
await mkdir(path.join(mediaDir, "social"), { recursive: true });
await Promise.all(
  socialImages.map(([input, name]) =>
    sharp(path.join(sourceDir, input))
      .rotate()
      .resize(1200, 630, { fit: "cover", position: "attention" })
      .jpeg({ quality: 76, mozjpeg: true, progressive: true })
      .toFile(path.join(mediaDir, "social", `${name}-1200x630.jpg`)),
  ),
);

const logoSource = path.join(sourceDir, "logo/logocabaassinfondo/4.png");
const whiteLogoSource = path.join(
  sourceDir,
  "logo/logocabaassinfondo/Logo blanco una tinta.png",
);
const faviconSource = path.join(
  sourceDir,
  "logo/logoscabaaspuchumanconfondo/2.png",
);
await mkdir(path.join(mediaDir, "brand"), { recursive: true });
await Promise.all([
  sharp(logoSource)
    .resize(96, 96, { fit: "inside" })
    .webp({ quality: 85, alphaQuality: 90 })
    .toFile(path.join(mediaDir, "brand/logo-mark-96.webp")),
  sharp(logoSource)
    .resize(200, 200, { fit: "inside" })
    .webp({ quality: 85, alphaQuality: 90 })
    .toFile(path.join(mediaDir, "brand/logo-mark-200.webp")),
  sharp(whiteLogoSource)
    .resize(230, 230, { fit: "inside" })
    .webp({ quality: 85, alphaQuality: 90 })
    .toFile(path.join(mediaDir, "brand/logo-white-230.webp")),
  sharp(faviconSource)
    .trim()
    .resize(64, 64, { fit: "inside" })
    .png({ compressionLevel: 9, palette: true })
    .toFile(path.join(mediaDir, "brand/favicon-color-64.png")),
]);

const fonts = [
  [
    "@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2",
    "cormorant-garamond-500.woff2",
  ],
  [
    "@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2",
    "cormorant-garamond-600.woff2",
  ],
  ["@fontsource/inter/files/inter-latin-400-normal.woff2", "inter-400.woff2"],
  ["@fontsource/inter/files/inter-latin-500-normal.woff2", "inter-500.woff2"],
  [
    "@fontsource/montserrat/files/montserrat-latin-500-normal.woff2",
    "montserrat-500.woff2",
  ],
  [
    "@fontsource/montserrat/files/montserrat-latin-600-normal.woff2",
    "montserrat-600.woff2",
  ],
  [
    "@fontsource/montserrat/files/montserrat-latin-700-normal.woff2",
    "montserrat-700.woff2",
  ],
];

for (const [source, output] of fonts) {
  await copyFile(
    path.join(rootDir, "node_modules", source),
    path.join(fontsDir, output),
  );
}

console.log(
  `Generated ${photos.length * 9 + socialImages.length + 4} responsive media files and ${fonts.length} WOFF2 fonts.`,
);
