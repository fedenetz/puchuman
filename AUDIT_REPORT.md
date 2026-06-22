# Website Audit Report

## Executive Summary

Puchuman is a visually polished but technically shallow single-page booking site for cabins and holiday homes in Lican Ray. The page communicates the broad category and destination well, renders cleanly, and has a strong mobile first screen. It does not yet provide the crawlable page architecture, accommodation detail, measurable conversion funnel, accessibility discipline, or operational safeguards expected of a serious lodging website.

The largest commercial problem is not aesthetics. Five distinct accommodations are compressed into one client-rendered document, while every “Ver detalles” link leads to either the FAQ or the same cabins section instead of real details. This prevents each property from ranking for its own intent and forces high-intent visitors into an external booking engine before they can inspect rates, policies, room detail, or a fuller gallery. The site also has no analytics at all, so bookings, WhatsApp leads, email clicks, and booking-engine exits are invisible.

The production build succeeds and `npm audit` reports no known dependency vulnerabilities. However, `/robots.txt`, `/sitemap.xml`, and arbitrary nonexistent paths all return the home HTML with HTTP 200 in local production preview. This creates missing crawl controls and a soft-404 architecture. The JavaScript bundle is 375.61 kB (115.33 kB gzip), primarily because the Leaflet experience is loaded eagerly. The complete deployment is 17.7 MB because every public image and oversized logo is copied to production. Lighthouse is not installed, so performance conclusions below are code- and browser-based rather than lab scores.

Scores (1 = poor, 10 = excellent):

| Area | Score | Basis |
|---|---:|---|
| Technical SEO | 4/10 | Good language, title, description, headings, and basic schema; missing canonical, robots, sitemap, real 404s, crawlable property URLs, and complete social metadata. |
| Content SEO | 4/10 | Clear category and location, but generic H1, thin property copy, no rates or detailed amenities, and no intent-specific pages. |
| Performance | 5/10 | Build is healthy and most content images are lazy-loaded; LCP is a CSS background, images are not responsive, fonts and map are eager, and assets are oversized. |
| Mobile UX | 6/10 | Strong first screen and no horizontal page overflow at 375 px; the page is about 14,260 px tall and several controls are undersized. |
| Conversion clarity | 5/10 | Booking CTAs are prominent, but “Ver detalles” is false affordance, trust is thin, pricing is absent, and there is no persistent mobile lead action. |
| Accessibility | 4/10 | Useful semantics and reduced-motion CSS exist; nested interactive controls, missing focus treatment, incomplete accordion/menu behavior, and small targets are material barriers. |
| Code quality | 5/10 | Small understandable component tree and clean build; duplicated property models, a 34 kB append-only stylesheet, dead CSS, no quality gates, and `latest` dependencies increase risk. |
| Analytics readiness | 1/10 | No GA4, GTM, pixel, consent handling, or business event instrumentation exists. |

Audit evidence and checks performed:

- Inspected all repository source, configuration, content data, and public assets.
- Ran `npm run build`: passed with Vite 8.0.16.
- Ran `npm audit --json`: 0 known vulnerabilities.
- Ran `npm list --depth=0`: one extraneous package (`tslib@2.8.1`).
- Inspected the production preview at desktop and 390 × 844 mobile viewport.
- Verified DOM headings, metadata, images, targets, links, responsive overflow, menu behavior, and interactive nesting.
- Checked `/`, `/robots.txt`, `/sitemap.xml`, and a nonexistent path. All returned the same 1,969-byte HTML document with status 200.
- No lint, typecheck, test, link-check, accessibility, or Lighthouse command is available in `package.json`.

## Inferred Website Context

| Context | Inference | Confidence | Evidence |
|---|---|---:|---|
| Business type | Direct-booking lodging business offering houses and cabins. | High | `LodgingBusiness` schema in `index.html:18-20`; five units in `src/data.js:10-16`. |
| Main offer | Five family/group accommodations for 4–8 guests near Lago Calafquén. | High | Capacities, bedrooms, bathrooms, images, and booking URLs in `src/data.js:10-16` and `src/components/CabinMapExplorer.jsx:10-86`. |
| Primary audience | Spanish-speaking Chilean families and groups seeking a nature/lake stay. Couples are mentioned once, but no two-person offer is defined. | Medium | Hero and cabin copy in `src/components/Hero.jsx:8-13`, `Cabins.jsx:7-16`, and map intro in `CabinMapExplorer.jsx:179-182`. |
| Geographic market | Lican Ray, Región de La Araucanía, Chile; nearby Villarrica and Coñaripe. | High | `src/data.js:5`; map coordinates and directions in `CabinMapExplorer.jsx:24-94,242-243`; `es_CL` metadata in `index.html:12`. |
| Main conversion goal | Complete a reservation in the external GoFeels booking engine. Secondary goals are WhatsApp, email, Instagram, and map directions. | High | `BOOKING_URL` in `src/data.js:8`; booking CTAs throughout; contact links in `Footer.jsx:3`. |
| Main SEO targets | “cabañas en Lican Ray,” family cabins/houses, lake accommodation, and individual property names. | Medium | Title/description in `index.html:7-10`; H1 and headings in `Hero.jsx:9` and `CabinMapExplorer.jsx:180`. No explicit keyword map exists. |
| Pricing/value proposition | Not clearly defined in code. | High | No rate, seasonal price, minimum stay, payment method summary, guarantee, or direct-booking benefit is shown before the external engine. |
| Street address/business identity | Not clearly defined in code. | High | Only locality/region is present in `src/data.js:5` and the schema. No legal/business name, street address, registration, or consistent property-level address exists. |
| Deployment domain | Not clearly defined in code. | High | There is Netlify configuration but no production URL, canonical base, environment example, or deploy documentation. This blocks correct absolute canonical and social URLs. |

Architecture discovered:

- Stack: React 19.2.7, Vite 8.0.16, JavaScript/JSX, plain CSS, Lucide icons, Leaflet/React Leaflet.
- Routing: none. A single `App` renders one document; Netlify rewrites every path to `index.html`.
- Content source: hardcoded arrays in `src/data.js` and several components.
- Styling: one global `src/styles.css` file, minified into long lines and repeatedly overridden.
- Image handling: Vite `publicDir` points at `images`; images are referenced as encoded root URLs. No image pipeline exists.
- Forms: none. Conversion exits to GoFeels; contact exits to WhatsApp/email/Instagram.
- Tracking: none found.
- Environment variables: none found.
- Third parties: Google Fonts, OpenStreetMap tiles, GoFeels, Google Maps, WhatsApp, Instagram.

## Top 10 Issues Hurting the Website

1. **High — No crawlable accommodation detail pages.** `src/App.jsx:15-30`, `src/data.js:10-16`. Five inventory items share one URL and a few sentences, forfeiting property-name, capacity, amenity, and long-tail search demand. Create an index plus a stable URL for each unit.
2. **High — “Ver detalles” does not show details.** `src/components/Cabins.jsx:15` points to the FAQ; `CabinMapExplorer.jsx:22,37,52,67,82` points back to `#cabanas`. This breaks the promise at the exact comparison stage. Link to real property routes or remove the action until those routes exist.
3. **High — No analytics or conversion events.** No tracking code exists in `index.html`, `src`, or configuration. The business cannot distinguish traffic from revenue-producing sessions. Implement consent-aware GA4/GTM and the tracking plan below.
4. **High — Missing crawl controls and soft-404 handling.** No robots/sitemap files exist; `netlify.toml:5-8` rewrites every path with 200. Verified robots, sitemap, and a nonexistent URL all return the home page. Add real files and a 404 route/response strategy.
5. **High — Invalid nested interactive controls.** Each `role="button"` map card contains three links (`CabinMapExplorer.jsx:185-213`), and Leaflet markers contain nested button semantics (`:99-103,130-136`). This creates ambiguous keyboard and screen-reader behavior. Make the card a non-interactive article with a separate selection button.
6. **High — Eager map and oversized media weaken performance.** `CabinMapExplorer` and Leaflet are imported synchronously in `src/App.jsx:8,25`; tiles load on initial render even far below the fold. The hero LCP is a CSS background (`styles.css:5`), and no `srcset`, `sizes`, or explicit intrinsic dimensions are used.
7. **High — Trust and decision content are too thin.** Testimonials are unlinked Instagram quotes without dates or review count (`Testimonials.jsx:2-7`); property cards omit rates, distance, rules summary, full amenities, bed configuration, and property-specific galleries. Visitors must leave the site to resolve basic objections.
8. **Medium — Schema and social metadata are incomplete.** `index.html:9-20` lacks canonical, `og:url`, absolute social image, Twitter cards, business URL/phone/geo/sameAs, property entities, FAQ schema, and breadcrumbs.
9. **Medium — Mobile journey is excessively long and repetitive.** At 375 px the rendered document is about 14,260 px tall. Cabins are presented once as large cards and again as interactive map cards; generic value, story, gallery, map, FAQ, and final CTA create scroll fatigue before a persistent conversion option appears.
10. **Medium — No engineering quality gates and unstable dependency declarations.** `package.json:6-9` has only dev/build/preview; five core packages use `latest` (`:12,14-16,18`). There is no lint, typecheck, unit test, browser test, accessibility test, or link checker.

## Codebase Health Summary

### What is healthy

- The repository is small, understandable, and componentized by page section.
- Shared contact, booking, gallery, and primary cabin data are partially centralized in `src/data.js`.
- Production build is fast and clean; npm reports zero known vulnerabilities.
- React effects in `Header.jsx:9-18` remove the scroll listener and restore body overflow.
- Most below-fold editorial images use native lazy loading.
- Reduced-motion CSS exists in `src/styles.css:7`.

### Structural and code-quality findings

| Issue | Location | Severity | Why it matters | Recommended fix and implementation |
|---|---|---:|---|---|
| Two cabin data models can drift | `src/data.js:10-16`; `CabinMapExplorer.jsx:8-86` | High | Names, capacity, bedrooms, bathrooms, features, URLs, and coordinates are split and partially duplicated. A content edit can produce contradictory cards, map data, or schema. | Define one normalized cabin object per unit in `data.js` (slug, copy, media, amenities, geo, booking URL). Derive cards, map, routes, and schema from it. Add schema validation in a test. |
| CSS is append-only and repeatedly overridden | `src/styles.css:2-22` | Medium | The same map selectors and media queries are declared multiple times, while old `.location`, `.map-placeholder`, `.map-tooltip`, `.map-explorer-pin`, and `.cabin-map__footer` systems remain. This makes the cascade hard to predict and inflates CSS to 47.33 kB built. | Split tokens/base/layout/components; remove selectors with no JSX owner; keep one mobile/tablet/desktop rule set per component; run Stylelint and visual regression checks. |
| Large component owns data, map mechanics, cards, and actions | `CabinMapExplorer.jsx:1-263` | Medium | A 263-line component couples content, Leaflet imperative code, accessibility, layout, and conversion links. Changes are risky. | Extract `CabinSelector`, `CabinMap`, `CabinMarker`, and `SelectedCabinActions`; move data out; lazy-load the map boundary. |
| Hardcoded content is spread across components | `Benefits.jsx:3-8`, `Experiences.jsx:2`, `Testimonials.jsx:2-6`, `FAQ.jsx:3-14` | Medium | Content cannot be reused for schema, detail pages, localization, or editorial QA. | Move structured content into typed modules or a CMS-compatible content layer; generate FAQ schema from the same array. |
| No routes or page templates | `src/App.jsx:15-30`; no router dependency | High | The architecture cannot create indexable detail, policy, location, or 404 pages without a redesign. | Add static/pre-rendered routing. For this small site, prefer Astro/React or Vite SSG over a fully client-only router. |
| Unstable manifest ranges | `package.json:12,14-16,18` | Medium | `latest` makes a clean install unpredictable despite the current lock file and may introduce breaking majors. | Replace `latest` with tested semver ranges, move build tooling to `devDependencies`, remove extraneous `tslib`, and use `npm ci` in deployment. |
| Missing developer tooling | `package.json:6-9` | Medium | Broken links, ARIA regressions, formatting drift, and content mistakes reach production undetected. | Add ESLint, Prettier, Stylelint, `vite --host` smoke test, Vitest, Playwright, axe, and a link checker; run in CI. |
| Public folder ships all source assets | `vite.config.js:6`; `images/` | Low | The deploy contains 35 files/17.7 MB, including large unused brand variants. It wastes deployment bandwidth/storage and obscures the true asset set. | Move only used, optimized assets to a managed asset folder; archive design originals outside the publish tree. |
| Image naming is inconsistent | `images/puchuman lican ray/` | Low | Spaces, accents, mixed casing (`Casa-Coliñanco.jpg`), and typo `moemntos-...` make URLs and automation brittle. | Rename with lowercase ASCII hyphenated slugs and update references through a manifest. |

## Technical SEO Audit

| Issue | Location | Severity | SEO impact | Business impact | Exact fix / implementation steps |
|---|---|---:|---|---|---|
| Single client-rendered URL for all inventory | `src/App.jsx:15-30` | High | Search engines receive one HTML shell and one metadata set; accommodation entities cannot earn individual relevance or links. | Property-name and long-tail discovery is suppressed. | Create `/cabanas/`, `/cabanas/casa-rafael-mera/`, `/cabanas/casa-colinanco/`, `/cabanas/cabana-mariposa/`, `/cabanas/casa-cariman/`, and `/cabanas/casa-cariman-interior/`; pre-render meaningful HTML and unique metadata. |
| Missing canonical URL | `index.html` head | High | Duplicate host/protocol/query variants have no preferred URL. | Authority can fragment and reports become noisy. | Once the production domain is defined, emit one absolute self-referencing canonical per route. Do not invent the domain before it is confirmed. |
| Missing robots and sitemap | Repository/public assets | High | Crawlers receive HTML when requesting both expected discovery files. | New pages will be slower to discover and crawl policy is undefined. | Add valid `/robots.txt` linking the absolute sitemap and generated `/sitemap.xml` containing only canonical, indexable URLs with real modification dates. |
| Soft 404 for every unknown path | `netlify.toml:5-8` | High | Arbitrary paths return 200 and home content; search engines can classify soft 404s and waste crawl. | Broken campaign links look valid and hide defects. | Replace blanket fallback with route-aware output. Add a branded 404 and ensure unknown paths return HTTP 404 on Netlify. Test status, not just UI. |
| Incomplete social metadata | `index.html:9-13` | Medium | No `og:url`, `og:site_name`, image dimensions/alt, or Twitter card. `og:image` is relative and square logo artwork. | Shared links may render weakly or fail to show a compelling property image. | Generate route-specific OG/Twitter tags with absolute 1200×630 images, URL, alt, site name, title, and description. |
| Basic schema is incomplete and detached from inventory | `index.html:18-20` | Medium | `LodgingBusiness` lacks URL, telephone, image, geo, sameAs, price range, check-in/out, and property relationships. FAQ content has no FAQPage schema. | Rich-result eligibility and entity confidence are limited. | Generate JSON-LD from shared data: business entity, `PostalAddress` only with verified fields, `GeoCoordinates`, contact/sameAs, `makesOffer` or lodging units, and `FAQPage`. Add breadcrumbs on detail pages. Never add ratings not independently supported. |
| H1 is attractive but weakly descriptive | `Hero.jsx:9` | Medium | “Tu descanso junto al lago” omits the primary category and location; the keyword appears only in surrounding text. | Users and crawlers need an extra step to identify the offer. | Use a clear H1 such as “Cabañas en Lican Ray junto al lago Calafquén”; retain the emotional line as a supporting heading or subline. |
| Detail links are semantically false | `Cabins.jsx:15`; `CabinMapExplorer.jsx:22,37,52,67,82,212,260` | High | Internal anchors do not lead to details and create no crawlable property graph. | High-intent visitors bounce or enter booking without confidence. | Point every detail link at its canonical property URL and use distinct descriptive anchor text. |
| No breadcrumb/internal hierarchy | Entire app | Medium | Only section anchors exist; there is no route hierarchy or contextual cross-linking. | Users cannot move between comparable units or understand site depth. | Add Home → Cabañas → Property breadcrumbs and related-property links on detail pages, with matching schema. |
| JavaScript is required for all body content | `index.html:22-24`; `src/main.jsx:6-8` | Medium | Crawlers/social/low-capability clients initially see an empty `#root`. Google can render, but rendering is delayed and not universal. | Discovery and resilience are weaker than necessary for a small brochure site. | Pre-render or server-render route HTML. Keep hydration only for menu, FAQ, booking controls, and map. |
| No indexability policy per page | No route metadata layer | Medium | There is nowhere to set unique title, description, canonical, robots, or OG data. | Future policy/thank-you/search pages can be indexed accidentally. | Create a route metadata schema and explicit `index,follow`/`noindex` decisions. |
| Image SEO is only partially implemented | `src/data.js:11-15,18-25`; gallery/components | Medium | Alts are generally useful, but file names are inconsistent and repeated cards reuse generic alt text. No image sitemap or intrinsic responsive variants exist. | Image search opportunity and performance are limited. | Use property/scene-specific filenames and alt text; decorative repeats should use empty alt; generate AVIF/WebP variants and optionally include key images in the sitemap. |
| No hreflang | Entire repository | Low | Only Spanish content exists, so hreflang is not currently required. | None today; adding incorrect hreflang would be worse. | Keep `lang="es"`; if country-specific translations are introduced, use valid reciprocal locale URLs. Consider `es-CL` if all content is Chile-specific. |

Positive SEO signals: `lang="es"`, one H1, logical H2/H3 structure, relevant title and meta description, descriptive section IDs, basic OG tags, and valid visible local/category copy are present. There is no evidence of duplicate route content because there are no routes yet.

## Content SEO and Search Intent Audit

The page clearly says it offers cabins in Lican Ray, for families/groups, near the lake, with direct online reservation. It does not clearly explain why booking Puchuman is better than alternatives, what each accommodation costs, the exact verified walk/drive distances, complete amenities, bed layouts, accessibility, heating, Wi-Fi, seasonal suitability, or what “equipadas” includes. “Natural / Cercana / Auténtica / Confiable” in `Benefits.jsx:3-8` is brand language, not evidence.

| Finding | Location | Severity | Why it fails intent/conversion | Exact recommendation |
|---|---|---:|---|---|
| Generic hero proposition | `Hero.jsx:8-13` | Medium | Category/location are present, but no differentiator, capacity range, or proof is above the fold. | Make category/location the H1; add “casas y cabañas para 4–8 personas,” verified proximity, and one concrete direct-booking reason. |
| Property copy is thin | `src/data.js:11-15` | High | Each unit has one sentence and three feature labels. That cannot satisfy comparison or property-name search intent. | Add unique 500–900 word pages with overview, sleeping layout, full amenities, gallery, location, policies, availability CTA, and FAQs. |
| No price framing | Entire source | High | A user cannot estimate fit before leaving the domain. | Show “desde” pricing only if reliably synced, or explain that date/guest selection produces the final rate; include currency CLP, taxes/fees, and minimum-stay caveats. |
| Weak proof | `Testimonials.jsx:2-7` | High | Quotes are unattributed beyond handles, not linked, dated, or summarized. | Link to permitted source posts/review platform, show date and verified context, add aggregate counts only when sourced, and add real property photos rather than generic trust adjectives. |
| Unsupported/ambiguous proximity | `FAQ.jsx:4`; `CabinMapExplorer.jsx:181-182` | Medium | “A una cuadra” is strong but not tied to every property; map units have different coordinates. | Store verified distance/time per unit and state it on each page. Avoid one claim for all units unless true. |
| Experiences are icons, not content | `Experiences.jsx:2-4` | Medium | “Kayak,” “Bicicletas,” and “Parrilla” can be read as included amenities, but the code does not clarify availability, ownership, cost, or season. | Separate on-site amenities from nearby activities and explain access, seasonality, provider, price, and distance. |
| Policy content exists only in accordion | `FAQ.jsx:3-14` | Medium | Useful cancellation/pet/check-in content is hidden in a long home page and has no stable policy URL. | Create booking policies page and summarize policy-specific details per unit; keep a short homepage FAQ. |
| Audience definition is broad | Multiple sections | Low | Families/groups are clear, but couples, remote workers, accessibility needs, pet owners, and seasonal travelers are not addressed consistently. | Only create audience pages supported by actual product evidence; first validate pet-friendly and group/family propositions from inventory. |

## Content Gap Map

| Missing or weak page | Search intent | Suggested URL | Suggested title tag | Suggested H1 | Suggested sections | Priority |
|---|---|---|---|---|---|---:|
| Cabins index | Compare lodging options in Lican Ray | `/cabanas/` | `Cabañas en Lican Ray para 4 a 8 personas | Puchuman` | `Cabañas y casas en Lican Ray` | Filters/comparison, capacity, “desde” rate or availability logic, verified distances, amenities, map, reviews, FAQ | Critical |
| Casa Rafael Mera | Property-name/capacity intent | `/cabanas/casa-rafael-mera/` | `Casa Rafael Mera en Lican Ray para 8 personas | Puchuman` | `Casa Rafael Mera: alojamiento para 8 en Lican Ray` | Unique gallery, sleeping plan, 2 bathrooms, amenities, location, rates, policies, availability | High |
| Casa Coliñanco | Large family/group stay | `/cabanas/casa-colinanco/` | `Casa Coliñanco en Lican Ray para 8 personas | Puchuman` | `Casa Coliñanco para familias y grupos` | Four bedrooms, common spaces, full amenities, gallery, location, rates, FAQ | High |
| Cabaña Mariposa | Cabin for four / multiple units | `/cabanas/cabana-mariposa/` | `Cabaña Mariposa en Lican Ray para 4 personas | Puchuman` | `Cabaña Mariposa: cabañas para 4 en Lican Ray` | Explain four units, differences/availability, two bedrooms, gallery, location, rates | High |
| Casa Cariman | Six-person family house | `/cabanas/casa-cariman/` | `Casa Cariman en Lican Ray para 6 personas | Puchuman` | `Casa Cariman para 6 personas en Lican Ray` | Sleeping plan, parking, amenities, gallery, verified distance, rates, booking | High |
| Casa Cariman Interior | Five-person quiet stay | `/cabanas/casa-cariman-interior/` | `Casa Cariman Interior en Lican Ray para 5 | Puchuman` | `Casa Cariman Interior para 5 personas` | Clarify difference from Casa Cariman, kitchen, rooms, gallery, rates, location | High |
| Location guide | Destination and local-intent research | `/lican-ray/` | `Qué hacer y dónde alojar en Lican Ray | Puchuman` | `Guía de Lican Ray y lago Calafquén` | Beaches, verified distances, seasonal activities, transport, dining, map, property links | Medium |
| Policies | Pre-booking transactional questions | `/politicas-de-reserva/` | `Políticas de reserva, cancelación y mascotas | Puchuman` | `Políticas de reserva de Puchuman` | Check-in/out, cancellation, rescheduling, guests, pets, smoking, heating, payments | High |
| Contact/location | Branded/local navigation | `/contacto/` | `Contacto y ubicación | Puchuman Cabañas Lican Ray` | `Contacto y cómo llegar` | Phone/WhatsApp/email, verified address, directions, response hours, map fallback | Medium |
| About/trust | Brand validation | `/nosotros/` | `Sobre Puchuman Cabañas en Lican Ray` | `Hospitalidad familiar en Lican Ray` | Real operator story, team/host, operating history, proof, responsible tourism | Medium |

## Performance and Core Web Vitals Audit

No Lighthouse executable or script is installed. Findings are based on production bundle output, asset inspection, DOM/network behavior, and mobile rendering. Real-user data is not available.

| Issue | Location | CWV | Why it matters | Recommended fix | Expected impact |
|---|---|---|---|---|---|
| Hero LCP is a CSS background | `src/styles.css:5`; `Hero.jsx:5` | LCP | The browser discovers it after CSS, cannot use `fetchpriority`, and receives one 2000×1125 JPEG (~370 kB) for every viewport. | Render a `<picture>`/`img` with AVIF/WebP/JPEG sources, `srcset`, `sizes`, dimensions, `fetchpriority="high"`, and appropriate preload. Keep overlay as CSS. | Large LCP improvement, especially mobile. |
| Interactive map is eager | `src/App.jsx:8,25`; `CabinMapExplorer.jsx:3-4,223-238` | INP/LCP/TBT | Leaflet/React Leaflet are in the initial 375.61 kB JS bundle and OSM tiles load even though the map is far below the fold. | Dynamic-import the map near viewport using IntersectionObserver or a user “Ver mapa” action; provide static HTML/location fallback. | Lower initial JS and network contention; better responsiveness. |
| No responsive image pipeline | `src/data.js:10-25`; all image components | LCP/CLS | Square 1,200–1,254 px card images and 2,000 px gallery images are sent without `srcset/sizes`; JPEG is used everywhere. | Generate multiple AVIF/WebP widths, preserve JPEG fallback, and choose accurate `sizes` per grid. | 40–75% image transfer reduction is realistic. |
| Missing intrinsic dimensions/aspect ratios | JSX `<img>` elements | CLS | Most images have CSS dimensions but no width/height attributes; layout depends on stylesheet arrival and component rules. | Store width/height/aspect ratio with media data and emit attributes on every image. | More stable layout and predictable lazy loading. |
| Oversized logos | Header/Footer/FinalCTA; assets | LCP/network | 2,000×2,000 PNGs of ~221–501 kB render at 40–115 px. Some unused brand SVGs are 1–2 MB. | Use optimized SVG without embedded raster/metadata, or tiny WebP/PNG variants. | Hundreds of kB saved on loaded chrome; smaller deploy. |
| Render-blocking remote fonts | `index.html:15-17` | LCP/CLS | Three families and seven requested weights depend on Google Fonts. `display=swap` helps, but fallback metrics can shift and third-party latency remains. | Self-host only used WOFF2 subsets/weights, preload the critical face, use `font-display: swap/optional`, and metric-compatible fallbacks. | More consistent LCP/CLS and privacy posture. |
| CSS contains dead and duplicate systems | `src/styles.css:2-22` | LCP | 47.33 kB built CSS contains superseded hero URLs, legacy map styles, and repeated breakpoints/selectors. | Remove dead blocks, split component CSS, and add coverage review. | Smaller blocking CSS and safer maintenance. |
| Map selection animates on focus/hover | `CabinMapExplorer.jsx:111-120,195-197` | INP | Keyboard focus and pointer hover trigger state updates and `flyTo`; moving across cards can cause repeated map work. | Select on deliberate click/keyboard activation; avoid fly animation for incidental focus/hover; honor reduced-motion in Leaflet options. | Less main-thread churn and motion. |
| No measured performance budget | `package.json:6-9` | All | Bundle/image regressions are invisible. | Add Lighthouse CI or WebPageTest checks plus bundle and image budgets in CI. | Prevents regression; does not itself improve metrics. |

Positive findings: the build outputs hashed assets, gzip sizes are reasonable for a small React app, most below-fold editorial images are lazy, no video exists, and CSS includes a reduced-motion rule. Hydration errors and console errors were not observed during the local review.

## Mobile UX and Conversion Audit

The 390 × 844 first screen is the strongest part of the site: branding, place, H1, short description, booking button, and secondary cabin link are all visible and legible. At the tested size there was no document-level horizontal overflow. The rest of the mobile journey is much less disciplined.

The full page is approximately 14,260 px tall at a 375 px CSS viewport. The cabin list is followed by testimonials, values, story, experiences, gallery, a second cabin selector, map, ten FAQs, and a final CTA. That is a brochure assembled by accumulation rather than a conversion sequence. The map selector also repeats the same five cabins after users already compared them.

## Conversion Friction Report

| Friction point | File/component | User consequence | Revenue consequence | Recommended fix | Priority |
|---|---|---|---|---|---:|
| “Ver detalles” goes to unrelated/same content | `Cabins.jsx:15`; `CabinMapExplorer.jsx:22-82,212,260` | User cannot inspect the chosen property. | High-intent visitors abandon or enter booking unprepared. | Build property routes and link directly; until then, remove the false action. | Critical |
| No rate/availability context before external exit | All cards and CTAs | User does not know whether the offer fits budget or dates. | More booking-engine exits and lower completion. | Add date/guest availability entry or honest rate framing with CLP, fees, and restrictions. | High |
| No analytics on exits | All `BOOKING_URL`, room, WhatsApp, email links | Funnel failure is invisible. | Marketing spend and UX changes cannot be tied to bookings/leads. | Instrument the tracking plan before redesign experiments. | Critical |
| Excessive scroll and duplicate inventory | `App.jsx:18-28`; `Cabins`; `CabinMapExplorer` | Comparison is repeated; map and supporting sections arrive very late. | Decision fatigue and lower CTA re-engagement. | Keep one canonical comparison module, lazy map, shorten values/gallery, move deep content to dedicated pages. | High |
| No persistent mobile contact/booking action | Global layout | CTA disappears after the hero; no sticky WhatsApp or booking control. | Urgent questions and returning intent leak during long scroll. | Add a compact accessible bottom bar with “Ver disponibilidad” and WhatsApp; do not obscure content. | High |
| Weak trust before booking | `Testimonials.jsx:2-7` | Quotes cannot be verified and do not answer property-specific concerns. | Users defer to OTAs or competitors with stronger proof. | Add source-linked reviews, count/date, real host identity, payment/security reassurance, and property photos. | High |
| Map dominates mobile | `CabinMapExplorer`; `styles.css:18,22` | A 500 px interactive canvas plus controls interrupts the decision path and can trap gestures. | Users spend effort navigating rather than booking. | Default to a static location summary; open interactive map on demand. | Medium |
| Small tap targets | `Header.jsx:23`; text links; Leaflet controls; footer | Tested menu is ~36×33 px; many text links are 19–24 px tall; zoom controls ~38×38 px. | Mis-taps and abandonment, especially one-handed. | Provide at least 44×44 CSS px target boxes with visible focus, without merely increasing glyph size. | High |
| No direct phone link | `Footer.jsx:3`; `CONTACT` has no phone field | Users who prefer calling cannot do so. | Lost high-intent contact channel if the business accepts calls. | If a call channel exists, add `tel:` and track it. Otherwise state WhatsApp response expectations. | Medium |
| Third-party booking continuity is weak | All external booking links | New tab loses on-site context and there is no visible success/return state. | Attribution and recovery are weak. | Pass supported campaign/property parameters, document return/thank-you behavior, and measure cross-domain completion if GoFeels supports it. | High |

## Accessibility Audit

| Issue | Location | Severity | User impact | Fix |
|---|---|---:|---|---|
| Interactive elements nested inside `role="button"` cards | `CabinMapExplorer.jsx:185-213` | High | Keyboard and screen-reader users encounter a button containing links; activation and focus behavior are ambiguous and invalid. | Make `<article>` non-interactive. Add a distinct “Mostrar en mapa” button, followed by independent links. |
| Nested marker button semantics | `CabinMapExplorer.jsx:99-103,130-136` | High | Leaflet already exposes marker interactivity, while injected HTML adds another `role=button`; the accessibility tree showed button-in-button structures and duplicate names. | Use one focusable element per marker. Do not inject role/tabindex inside an already interactive marker; validate with axe and keyboard. |
| Decorative place labels exposed as buttons | `CabinMapExplorer.jsx:88-96,105-109,236` | High | The accessibility tree exposed Lican Ray, lake, beaches, and route labels as buttons despite `interactive={false}`. | Render labels in a non-interactive overlay or explicitly hide decorative markers from assistive tech. Keep meaningful location text in HTML. |
| No global visible focus style | `src/styles.css` | High | Most links/buttons rely on browser defaults or hover styles; several rules set `outline:0`. Keyboard location is inconsistent. | Add high-contrast `:focus-visible` rings for links, buttons, cards, map controls, and menu items; never remove outline without replacement. |
| Mobile menu lacks dialog-grade keyboard behavior | `Header.jsx:8-27` | Medium | Menu opens and locks body scroll, but there is no Escape handler, focus trap, focus return logic, `aria-controls`, or inert background. | Associate toggle/nav IDs, close on Escape, trap focus while modal nav is open, make background inert, and restore focus to toggle. |
| Accordion relationship/hidden state is incomplete | `FAQ.jsx:16-17` | Medium | Buttons have `aria-expanded` but no `aria-controls`; panels have no IDs/`role=region`/`aria-labelledby`. Collapsed answer text remained in the accessibility snapshot. | Give each control/panel stable IDs, connect attributes, and apply `hidden` when collapsed while preserving animation appropriately. |
| Tap targets below 44×44 px | Header, text links, map controls, footer; measured live | Medium | Users with motor impairments face avoidable mis-taps. | Increase hit areas to 44×44 px minimum and maintain spacing; prioritize menu, map zoom/directions, inline details, and footer contacts. |
| Small low-contrast accent text | `.cabin-card__type` and other `var(--blue)` text in `styles.css:2` | Medium | `#7ea3d4` on white/light backgrounds is unsuitable for tiny 0.61–0.69 rem text and likely fails WCAG AA. | Use a darker blue for text, reserve the light blue for non-text decoration, and run automated plus manual contrast checks. |
| No skip link | `Header.jsx` / `App.jsx` | Medium | Keyboard users must traverse the full fixed header/navigation on every visit. | Add a first-focusable “Saltar al contenido” link targeting `<main id="main-content">`. |
| Reduced motion does not cover map movement | `styles.css:7`; `CabinMapExplorer.jsx:115` | Medium | CSS transitions stop, but Leaflet `flyTo` still animates. | Read `prefers-reduced-motion` and use `setView`/zero duration when requested. |
| Repeated image alt can be noisy | Cabin cards and map cards | Low | The same accommodation image/name is announced multiple times. | Keep informative alt on the primary card/detail page; use `alt=""` for decorative repeats beside an already named heading. |
| No automated accessibility testing | `package.json:6-9` | Medium | Existing invalid patterns are not caught before release. | Add axe-core browser tests and keyboard smoke tests; verify at 200% zoom and with a screen reader. |

Positive findings: the document has one H1 and a coherent heading hierarchy; sections use semantic elements; buttons/links generally have names; `lang="es"` is present; gallery alt text is descriptive; menu exposes `aria-expanded`; FAQ uses real buttons; and reduced-motion CSS exists.

## Analytics and Tracking Audit

No GA4, Google Tag Manager, Meta Pixel, data layer, event utility, consent manager, or thank-you logic exists. No environment variable or configuration differentiates production tracking from development. Every business conversion is therefore unmeasured.

Implement tracking only after defining the production domain, data controller/privacy disclosures, and consent requirements for the actual markets. Essential first-party measurement may be treated differently from advertising tags; that legal classification is not clearly defined in code and should not be guessed.

## Tracking Plan

| Event name | Trigger | Parameters | Business purpose | Implementation location | Priority |
|---|---|---|---|---|---:|
| `view_item_list` | Cabins comparison becomes visible | `item_list_id`, unit IDs/names, capacities | Measure inventory discovery | `Cabins.jsx` via shared analytics utility | High |
| `select_item` | User chooses a cabin/detail | `item_id`, `item_name`, `item_list_id`, `position` | Identify demand by unit | Cabin card/detail links | High |
| `begin_booking` | Any booking CTA opens GoFeels | `item_id` when known, `cta_location`, `outbound_url`, `currency: CLP` | Primary funnel start | Shared tracked-link component used by Header/Hero/cards/map/FinalCTA | Critical |
| `generate_lead` | WhatsApp click | `method: whatsapp`, `cta_location`, `item_id` if relevant | Measure messaging leads | `Footer.jsx` and future sticky CTA/property pages | Critical |
| `click_phone` | `tel:` click, if phone is offered | `cta_location`, `item_id` | Measure call intent | Header/footer/contact/property page | High |
| `click_email` | Email link click | `cta_location` | Measure email leads | `Footer.jsx` / contact page | Medium |
| `view_item` | Property detail page view | `item_id`, `item_name`, `capacity`, `currency`, `value` only when real | Compare property interest with booking starts | Property page template | High |
| `view_map` | User deliberately opens interactive map | `location_section`, `item_id` | Validate map value and delay map loading | Lazy map boundary | Medium |
| `get_directions` | Google Maps/direction link click | `item_id`, `destination` | Measure arrival/location intent | Map and contact page | Medium |
| `faq_open` | FAQ expands | `question`, `page_path` | Discover objections | `FAQ.jsx` | Low |
| `booking_complete` | Confirmed reservation callback/thank-you | `transaction_id`, `value`, `currency`, `items`, dates/nights if permitted | Revenue attribution | Prefer server/webhook or verified GoFeels cross-domain callback; never infer from outbound click | Critical |
| `booking_error` | Booking engine returns a known error | `error_code`, `step`, no personal data | Detect lost revenue | Booking integration/callback if supported | High |

Guardrails:

- Never send names, email addresses, phone numbers, free-text WhatsApp content, or other personal data to analytics.
- Deduplicate events with one shared listener/component; React Strict Mode must not double-fire view events in development.
- Use production-only IDs through validated environment variables and document them in `.env.example` without secrets.
- For advertising tags, gate loading by consent and provide withdrawal controls.
- Cross-domain booking measurement must be configured with GoFeels support; an outbound click is not a purchase.

## Security and Reliability Audit

| Issue | Location | Severity | Practical risk | Exact fix |
|---|---|---:|---|---|
| No security headers defined | `netlify.toml` | Medium | The app has no code-defined CSP, frame policy, referrer policy, MIME sniffing protection, or permissions policy. | Add Netlify headers: CSP tailored to self, fonts, OSM tiles, and required services; `X-Content-Type-Options: nosniff`; `Referrer-Policy`; `Permissions-Policy`; frame protection via CSP; HSTS after confirming HTTPS/domain. |
| Blanket SPA fallback hides broken routes | `netlify.toml:5-8` | High | Broken URLs return a convincing 200 home page, masking campaign and routing defects. | Use generated static routes and a true 404 response. Add status assertions to CI. |
| OSM attribution is disabled | `CabinMapExplorer.jsx:223-233` | High | OpenStreetMap tiles are displayed without attribution, creating provider/terms and reliability risk. | Restore Leaflet attribution and comply with the selected tile provider’s usage policy; consider a production tile provider with documented SLA. |
| Third-party map has no fallback | `CabinMapExplorer.jsx:223-243` | Medium | Tile or script failure leaves a large unusable panel. | Provide static address/location text and direct map links outside the map; show a compact error fallback. |
| External booking is a hard dependency | `src/data.js:8,11-15` | High | If GoFeels changes URLs or is unavailable, the primary conversion path fails across the site. | Centralize URL generation, add automated HTTP/link smoke checks, visible contact fallback, and a monitored booking-health check. |
| Public booking token is embedded | `src/data.js:8` | Low | The token is necessarily client-visible and should be treated as a public identifier, not a secret. Risk rises only if the provider grants privileged operations to it. | Confirm provider semantics; never place privileged API credentials in client code. Document the identifier as public configuration. |
| Dependency policy is weak | `package.json:12-18` | Medium | `latest` ranges and no automated update/testing policy threaten reproducibility. | Pin tested ranges, use `npm ci`, add Dependabot/Renovate plus build/test checks. Current `npm audit` is clean. |
| No error boundary or route error UI | `src/main.jsx`, `App.jsx` | Medium | A runtime component error can blank the entire page, including contact routes. | Add an error boundary with booking/WhatsApp fallback and production error monitoring stripped of personal data. |
| No automated broken-link checks | `package.json:6-9` | Medium | Property, map, social, and booking URLs can silently rot. | Add internal/external link checks with allowlisted rate limits and a scheduled production smoke test. |
| No privacy/cookie documentation | Entire repository | Medium | Analytics cannot be responsibly added without disclosure/consent decisions. | Add privacy page and consent implementation appropriate to actual tags/markets before enabling non-essential tracking. |

No exposed private API secret, form endpoint, upload surface, or user-input form was found. Therefore form validation and spam controls are not currently applicable. The repository contains public contact data and a booking-engine token only.

## Prioritized Roadmap

| Order | Category / priority | Issue | File/location | Why it matters | Complexity | Expected impact |
|---:|---|---|---|---|---|---|
| 1 | Critical | Define production domain, canonical data model, and normalized cabins | `src/data.js`, new site config | Unblocks correct URLs, schema, routes, tracking, and content consistency. | Medium | Foundation for every high-impact fix. |
| 2 | Critical | Replace false detail links with real property pages | `App.jsx`, cards/map, new route templates | Direct SEO and conversion loss occurs today. | High | Major organic landing-page and decision-quality gain. |
| 3 | Critical | Add measurement foundation and booking/lead events | New analytics utility; all CTAs | The business currently cannot see outcomes. | Medium | Makes subsequent work measurable. |
| 4 | Critical | Fix robots, sitemap, canonicals, and true 404 | Public/generated files, Netlify config | Prevents crawl waste and soft-404 behavior. | Medium | Strong technical hygiene and discoverability. |
| 5 | High-impact conversion | Add property decision content, verified trust, and policy page | Data/content/property templates | Resolves objections before external booking. | High | Higher booking-engine completion and lead confidence. |
| 6 | Accessibility | Remove nested controls and repair map/menu/FAQ semantics | `CabinMapExplorer`, `Header`, `FAQ`, CSS | Current patterns block keyboard/screen-reader use. | Medium | Material usability and compliance improvement. |
| 7 | Performance/CWV | Convert hero to responsive priority image; optimize logos/images | Hero, image data/assets | Hero is the likely LCP and assets are oversized. | Medium | Faster mobile first render and lower transfer. |
| 8 | Performance/CWV | Lazy-load Leaflet/map on intent or proximity | `App.jsx`, `CabinMapExplorer` | Cuts eager JS and tile traffic. | Medium | Better initial responsiveness and network use. |
| 9 | High-impact SEO | Complete route metadata, OG/Twitter, lodging/FAQ/breadcrumb schema | Page head generation | Improves snippets, sharing, and entity clarity. | Medium | Better SERP/share presentation. |
| 10 | Mobile conversion | Shorten/reorder home and add accessible sticky actions | `App.jsx`, section components, CSS | Current 14,260 px journey dilutes action. | Medium | More repeated booking/contact opportunities. |
| 11 | Code quality | Consolidate data and delete dead CSS | `data.js`, `CabinMapExplorer`, `styles.css` | Prevents drift and lowers change risk. | Medium | Faster, safer ongoing work. |
| 12 | Accessibility | Add skip link, focus styles, 44 px targets, map reduced motion | Header/App/CSS/map | Fixes cross-site keyboard/motor issues. | Low–Medium | Broad inclusive usability gain. |
| 13 | Code quality | Add lint/type/test/axe/link/Lighthouse CI gates | `package.json`, CI config | Stops regressions before deploy. | Medium | Reliability and maintainability. |
| 14 | Security/reliability | Add security headers, OSM attribution, error fallback/monitoring | Netlify/map/root | Reduces realistic operational and provider risk. | Medium | Better resilience and compliance. |
| 15 | Nice-to-have | Destination guide and supported audience content | New content routes | Expands top/mid-funnel reach after core pages exist. | High | Incremental organic demand. |

Recommended implementation order is the order above. Do not begin with decorative redesign. Establish URLs/data, fix false navigation and crawl behavior, measure conversions, then improve content, accessibility, and performance.

## Fix Plan

The implementation should be delivered in safe batches rather than one rewrite:

1. **Foundation and observability:** confirm production URL/business facts, normalize cabin data, add quality scripts, analytics utility and baseline events.
2. **Crawlable architecture:** add pre-rendered routes, property templates, unique metadata, canonical, sitemap, robots, and real 404 behavior.
3. **Conversion content:** populate property pages, verified reviews, policy/contact pages, and honest rate/availability framing; repair every detail link.
4. **Accessibility repair:** restructure map controls, menu, FAQ, focus, skip link, target sizes, and reduced motion.
5. **Performance/media:** responsive hero and gallery pipeline, optimized logo, self-hosted fonts, lazy map, CSS deletion.
6. **Reliability/security:** security headers, OSM attribution/provider compliance, error fallbacks, link checks, monitoring, and CI budgets.

The exact files, changes, tests, risks, and rollback instructions for each batch are in `FIX_PLAN.md`.

## Recommended First Implementation Batch

Start with a foundation batch that does not alter the visual design:

1. Confirm and record the production origin, exact business/street identity, supported contact channels, verified unit locations/distances, and whether GoFeels supports cross-domain analytics or a booking callback. These items are **not clearly defined in code**.
2. Replace the two cabin models with one normalized schema in `src/data.js`, including stable slug, name, type, capacity, bedroom/bathroom counts, amenities, media metadata, location, booking URL, and future SEO fields.
3. Add lint, format, unit, browser smoke, axe, link-check, and build scripts. Pin tested dependency ranges and remove extraneous `tslib`.
4. Add a consent-aware analytics abstraction and instrument `begin_booking`, WhatsApp `generate_lead`, and email clicks without sending personal data. Confirm events in debug mode before production IDs are enabled.
5. Add regression tests that assert every cabin has a unique slug, valid internal detail URL, booking URL, required image metadata, and consistent capacity/room data.

This batch is first because every route, schema object, card, map selection, booking event, and future CMS entry should consume the same trusted property data. Implementing pages or tracking directly on the duplicated model would harden the current inconsistency.

“I have completed the audit only. I have not changed code yet. The recommended first implementation batch is listed above.”
