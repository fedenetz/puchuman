import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import {
  BOOKING_URL,
  BUSINESS,
  CABINS,
  CONTACT,
  FAQ_ITEMS,
  HERO_IMAGE,
  POLICY_SECTIONS,
  STAY_FACTS,
} from "../src/data.js";
import { STATIC_ROUTES } from "../src/routes.js";

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const distDir = path.join(rootDir, "dist");
const builtIndex = await readFile(path.join(distDir, "index.html"), "utf8");
const fileEnv = loadEnv(process.env.NODE_ENV || "production", rootDir, "");

const configuredOrigin = process.env.SITE_URL || fileEnv.SITE_URL;
if (!configuredOrigin) {
  throw new Error("SITE_URL is required for production canonical output.");
}

const siteOrigin = new URL(configuredOrigin);
siteOrigin.pathname = "/";
siteOrigin.search = "";
siteOrigin.hash = "";
const isDeployPreview = process.env.CONTEXT === "deploy-preview";
if (
  process.env.CONTEXT === "production" &&
  siteOrigin.origin !== BUSINESS.canonicalOrigin
) {
  throw new Error(
    `Production SITE_URL must be ${BUSINESS.canonicalOrigin}, received ${siteOrigin.origin}.`,
  );
}

const stylesheetTags = builtIndex.match(/<link rel="stylesheet"[^>]*>/g) ?? [];
const moduleScript = builtIndex.match(
  /<script type="module"[^>]*src="[^"]+"[^>]*><\/script>/,
)?.[0];

if (!moduleScript || stylesheetTags.length === 0) {
  throw new Error("Could not find built Vite assets in dist/index.html.");
}

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const absoluteUrl = (value) => new URL(value, siteOrigin).href;
const canonicalUrl = (routePath) => absoluteUrl(routePath);
const landscapeImage = "/media/social/puchuman-1200x630.jpg";

function staticPicture(image, alt, sizes = "100vw", loading = "lazy") {
  return `<picture><source type="image/avif" srcset="${escapeHtml(image.sources.avif)}" sizes="${sizes}"><source type="image/webp" srcset="${escapeHtml(image.sources.webp)}" sizes="${sizes}"><img src="${image.src}" srcset="${escapeHtml(image.sources.jpeg)}" sizes="${sizes}" alt="${escapeHtml(alt)}" width="${image.width}" height="${image.height}" loading="${loading}" decoding="async"></picture>`;
}

function pageSeo(route) {
  switch (route.kind) {
    case "home":
      return {
        title: "Cabañas Puchuman Lican Ray | Descanso junto al lago",
        description:
          "Casas y cabañas en Lican Ray para descansar entre lago, volcán y naturaleza. Conoce nuestras opciones para familias y grupos.",
        image: landscapeImage,
      };
    case "cabins":
      return {
        title: "Cabañas en Lican Ray para 4 a 8 personas | Cabañas Puchuman",
        description:
          "Compara las casas y cabañas de Cabañas Puchuman Lican Ray para familias y grupos de 4 a 8 personas.",
        image: landscapeImage,
      };
    case "cabin":
      return {
        title: `${route.cabin.name} en Lican Ray para ${route.cabin.capacity.guests} personas | Cabañas Puchuman`,
        description: `${route.cabin.longDescription} Revisa disponibilidad y tarifa para tus fechas.`,
        image: route.cabin.image.social,
      };
    case "policies":
      return {
        title: "Políticas de reserva y cancelación | Cabañas Puchuman",
        description:
          "Consulta horarios, cancelación, cambios, huéspedes, mascotas y normas para reservar en Cabañas Puchuman Lican Ray.",
        image: landscapeImage,
      };
    case "contact":
      return {
        title: "Contacto y ubicación | Cabañas Puchuman Lican Ray",
        description:
          "Contacta a Cabañas Puchuman Lican Ray por WhatsApp, email o Instagram y revisa nuestras ubicaciones.",
        image: landscapeImage,
      };
    case "privacy":
      return {
        title: "Privacidad y cookies | Cabañas Puchuman Lican Ray",
        description:
          "Información sobre privacidad, servicios externos y consentimiento de analítica de Cabañas Puchuman Lican Ray.",
        image: landscapeImage,
      };
    default:
      return {
        title: "Página no encontrada | Cabañas Puchuman Lican Ray",
        description: "La página solicitada no existe o ya no está disponible.",
        image: landscapeImage,
        noindex: true,
      };
  }
}

function businessSchema() {
  return {
    "@type": "LodgingBusiness",
    "@id": `${siteOrigin.href}#business`,
    name: BUSINESS.publicName,
    legalName: BUSINESS.legalName,
    url: siteOrigin.href,
    description: "Casas y cabañas equipadas para descansar en Lican Ray.",
    email: CONTACT.email,
    image: absoluteUrl(landscapeImage),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lican Ray",
      addressRegion: "La Araucanía",
      addressCountry: "CL",
    },
    sameAs: [`https://www.instagram.com/${CONTACT.instagram}/`],
  };
}

function breadcrumbSchema(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map(([name, routePath], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: canonicalUrl(routePath),
    })),
  };
}

function schemasForRoute(route) {
  if (route.kind === "not-found") return [];
  const schemas = [businessSchema()];

  if (route.kind === "home") {
    schemas.push({
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.slice(0, 5).map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    });
  }

  if (route.kind === "cabins") {
    schemas.push(
      breadcrumbSchema([
        ["Inicio", "/"],
        ["Cabañas", "/cabanas/"],
      ]),
      {
        "@type": "ItemList",
        itemListElement: CABINS.map((cabin, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: cabin.name,
          url: canonicalUrl(cabin.futureDetailUrl),
        })),
      },
    );
  }

  if (route.kind === "cabin") {
    const cabin = route.cabin;
    schemas.push(
      breadcrumbSchema([
        ["Inicio", "/"],
        ["Cabañas", "/cabanas/"],
        [cabin.name, cabin.futureDetailUrl],
      ]),
      {
        "@type": "Accommodation",
        "@id": `${canonicalUrl(cabin.futureDetailUrl)}#accommodation`,
        name: cabin.name,
        description: cabin.shortDescription,
        url: canonicalUrl(cabin.futureDetailUrl),
        image: absoluteUrl(cabin.image.src),
        occupancy: {
          "@type": "QuantitativeValue",
          maxValue: cabin.capacity.guests,
        },
        amenityFeature: cabin.amenities.map((amenity) => ({
          "@type": "LocationFeatureSpecification",
          name: amenity,
          value: true,
        })),
        numberOfBedrooms: cabin.bedrooms.count,
        numberOfBathroomsTotal: cabin.bathrooms.count,
        address: {
          "@type": "PostalAddress",
          streetAddress: cabin.addressCopy,
          addressLocality: "Lican Ray",
          addressRegion: "La Araucanía",
          addressCountry: "CL",
        },
        containedInPlace: { "@id": `${siteOrigin.href}#business` },
      },
    );
  }

  if (route.kind === "policies") {
    schemas.push(
      breadcrumbSchema([
        ["Inicio", "/"],
        ["Políticas de reserva", "/politicas-de-reserva/"],
      ]),
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    );
  }

  if (route.kind === "contact") {
    schemas.push(
      breadcrumbSchema([
        ["Inicio", "/"],
        ["Contacto", "/contacto/"],
      ]),
    );
  }

  return schemas;
}

function staticHeader() {
  return `<a class="skip-link" href="#main-content">Saltar al contenido</a><header class="ssg-header"><a href="/">${escapeHtml(BUSINESS.publicName)}</a><nav aria-label="Navegación principal"><a href="/cabanas/">Cabañas</a><a href="/politicas-de-reserva/">Políticas</a><a href="/contacto/">Contacto</a><a href="${escapeHtml(BOOKING_URL)}">Reservar</a></nav></header>`;
}

function staticFooter() {
  return `<footer class="ssg-footer"><p>${escapeHtml(BUSINESS.publicName)} · ${escapeHtml(CONTACT.address)}</p><p><a href="https://wa.me/${CONTACT.whatsapp}">WhatsApp</a> · <a href="mailto:${escapeHtml(CONTACT.email)}">${escapeHtml(CONTACT.email)}</a> · <a href="https://www.instagram.com/${CONTACT.instagram}/">Instagram</a> · <a href="/privacidad/">Privacidad y cookies</a></p></footer>`;
}

function cabinCards() {
  return CABINS.map(
    (cabin) =>
      `<article><h2><a href="${cabin.futureDetailUrl}">${escapeHtml(cabin.name)}</a></h2><p>${escapeHtml(cabin.shortDescription)}</p><p>${escapeHtml(cabin.capacity.label)} · ${escapeHtml(cabin.bedrooms.label)} · ${escapeHtml(cabin.bathrooms.label)}</p><a href="${escapeHtml(cabin.bookingUrl)}">Reservar ${escapeHtml(cabin.name)}</a></article>`,
  ).join("");
}

function renderStaticBody(route) {
  let content = "";
  if (route.kind === "home") {
    content = `<section>${staticPicture(HERO_IMAGE, HERO_IMAGE.alt, "100vw", "eager")}<p>Cabañas · Lican Ray · Araucanía</p><h1>Tu descanso junto al lago.</h1><p>Cabañas en Lican Ray para descansar entre lago, volcán y naturaleza.</p><a href="${escapeHtml(BOOKING_URL)}">Reservar online</a></section><section><h2>Nuestras cabañas</h2>${cabinCards()}</section><section><h2>Preguntas frecuentes</h2>${FAQ_ITEMS.slice(
      0,
      5,
    )
      .map(
        ([question, answer]) =>
          `<article><h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p></article>`,
      )
      .join(
        "",
      )}<a href="/politicas-de-reserva/">Ver todas las políticas y preguntas</a></section>`;
  } else if (route.kind === "cabins") {
    content = `<nav><a href="/">Inicio</a> / Cabañas</nav><h1>Cabañas y casas en Lican Ray</h1><p>Opciones para familias y grupos de 4 a 8 personas.</p>${cabinCards()}`;
  } else if (route.kind === "cabin") {
    const cabin = route.cabin;
    content = `<nav><a href="/">Inicio</a> / <a href="/cabanas/">Cabañas</a> / ${escapeHtml(cabin.name)}</nav><article><h1>${escapeHtml(cabin.name)}</h1><p>${escapeHtml(cabin.longDescription)}</p><p><strong>Ubicación:</strong> ${escapeHtml(cabin.addressCopy)}, ${escapeHtml(cabin.locationCopy)}.</p>${staticPicture(cabin.image, cabin.image.alt, "(max-width: 760px) 100vw, 52vw")}<h2>Información de la cabaña</h2><p>${escapeHtml(cabin.capacity.label)} · ${escapeHtml(cabin.bedrooms.label)} · ${escapeHtml(cabin.bathrooms.label)}</p><h2>Características</h2><ul>${cabin.amenities.map((amenity) => `<li>${escapeHtml(amenity)}</li>`).join("")}</ul><h2>Tarifas y disponibilidad</h2><p>${escapeHtml(STAY_FACTS.availability)}</p><p><strong>Check-in:</strong> ${escapeHtml(STAY_FACTS.checkIn)} · <strong>Check-out:</strong> ${escapeHtml(STAY_FACTS.checkOut)}</p><p>${escapeHtml(STAY_FACTS.pets)}</p><p>${escapeHtml(STAY_FACTS.clarification)}</p><p><a href="${escapeHtml(cabin.bookingUrl)}">Ver disponibilidad y tarifa</a>${cabin.googleMapsUrl ? ` · <a href="${escapeHtml(cabin.googleMapsUrl)}">Ver en Google Maps</a>` : ""} · <a href="/politicas-de-reserva/">Políticas de reserva</a></p></article>`;
  } else if (route.kind === "policies") {
    content = `<nav><a href="/">Inicio</a> / Políticas de reserva</nav><h1>Políticas de reserva</h1><p>Condiciones vigentes para reservas directas.</p>${POLICY_SECTIONS.map(({ title, paragraphs }) => `<article><h2>${escapeHtml(title)}</h2>${paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</article>`).join("")}`;
  } else if (route.kind === "contact") {
    content = `<nav><a href="/">Inicio</a> / Contacto</nav><h1>Contacto y ubicación</h1><p>${escapeHtml(CONTACT.address)}</p><p><a href="https://wa.me/${CONTACT.whatsapp}">WhatsApp ${escapeHtml(CONTACT.whatsappDisplay)}</a> · atención solo por WhatsApp; no se reciben llamadas.</p><p><a href="mailto:${escapeHtml(CONTACT.email)}">${escapeHtml(CONTACT.email)}</a></p><p><a href="https://www.instagram.com/${CONTACT.instagram}/">@${escapeHtml(CONTACT.instagram)}</a></p>`;
  } else if (route.kind === "privacy") {
    content = `<nav><a href="/">Inicio</a> / Privacidad y cookies</nav><h1>Privacidad y cookies</h1><article><h2>Responsable</h2><p>${escapeHtml(BUSINESS.legalName)} es el operador responsable de este sitio.</p></article><article><h2>Analítica opcional</h2><p>Google Analytics 4 solo se carga después de aceptar. La preferencia puede retirarse en cualquier momento desde esta página con JavaScript habilitado.</p></article><article><h2>Servicios externos</h2><p>Los enlaces de reserva, WhatsApp, Instagram, Google Maps y OpenStreetMap llevan a servicios con sus propias políticas.</p></article><article><h2>Contacto</h2><p><a href="mailto:${escapeHtml(CONTACT.privacyEmail)}">${escapeHtml(CONTACT.privacyEmail)}</a></p></article>`;
  } else {
    content = `<h1>Página no encontrada</h1><p>La dirección solicitada no existe o ya no está disponible.</p><a href="/">Volver al inicio</a>`;
  }

  return `${staticHeader()}<main id="main-content" class="ssg-content" tabindex="-1">${content}</main>${staticFooter()}`;
}

function renderDocument(route) {
  const seo = pageSeo(route);
  const canonical =
    route.kind === "not-found" ? null : canonicalUrl(route.path);
  const image = absoluteUrl(seo.image);
  const schemas = schemasForRoute(route);
  const jsonLd = schemas.length
    ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": schemas }).replaceAll("<", "\\u003c")}</script>`
    : "";

  return `<!doctype html>
<html lang="es-CL">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#0D2B52">
    <title>${escapeHtml(seo.title)}</title>
    <meta name="description" content="${escapeHtml(seo.description)}">
    ${seo.noindex || isDeployPreview ? '<meta name="robots" content="noindex,follow">' : ""}
    ${canonical ? `<link rel="canonical" href="${canonical}">` : ""}
    <meta property="og:title" content="${escapeHtml(seo.title)}">
    <meta property="og:description" content="${escapeHtml(seo.description)}">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="es_CL">
    <meta property="og:site_name" content="${escapeHtml(BUSINESS.publicName)}">
    ${canonical ? `<meta property="og:url" content="${canonical}">` : ""}
    <meta property="og:image" content="${image}">
    <meta property="og:image:alt" content="${escapeHtml(BUSINESS.publicName)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(seo.title)}">
    <meta name="twitter:description" content="${escapeHtml(seo.description)}">
    <meta name="twitter:image" content="${image}">
    <link rel="icon" type="image/png" href="/media/brand/favicon-color-64.png">
    ${route.kind === "home" ? '<link rel="preload" as="image" href="/media/hero/puchuman-hero-1280.avif" imagesrcset="/media/hero/puchuman-hero-640.avif 640w, /media/hero/puchuman-hero-1280.avif 1280w, /media/hero/puchuman-hero-1920.avif 1920w" imagesizes="100vw" type="image/avif" fetchpriority="high">' : ""}
    ${stylesheetTags.join("\n    ")}
    ${jsonLd}
  </head>
  <body>
    <div id="root">${renderStaticBody(route)}</div>
    ${moduleScript}
  </body>
</html>
`;
}

async function writeRoute(route) {
  const targetDir =
    route.path === "/"
      ? distDir
      : path.join(distDir, ...route.path.split("/").filter(Boolean));
  await mkdir(targetDir, { recursive: true });
  await writeFile(path.join(targetDir, "index.html"), renderDocument(route));
}

for (const route of STATIC_ROUTES) await writeRoute(route);

const notFoundRoute = { path: "/404.html", kind: "not-found" };
await writeFile(path.join(distDir, "404.html"), renderDocument(notFoundRoute));

const lastModified = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_ROUTES.map(({ path: routePath }) => `  <url><loc>${canonicalUrl(routePath)}</loc><lastmod>${lastModified}</lastmod></url>`).join("\n")}
</urlset>
`;

await writeFile(path.join(distDir, "sitemap.xml"), sitemap);
await writeFile(
  path.join(distDir, "robots.txt"),
  isDeployPreview
    ? "User-agent: *\nDisallow: /\n"
    : `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl("/sitemap.xml")}\n`,
);

console.log(
  `Generated ${STATIC_ROUTES.length} indexable routes, robots.txt, sitemap.xml, and 404.html for ${siteOrigin.origin}.`,
);
