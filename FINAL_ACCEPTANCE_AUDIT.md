# Final Acceptance Audit

Audit date: 2026-06-22  
Workspace: `C:\Users\neto_\OneDrive\Documentos\Puchuman`  
Scope: final acceptance of all six batches in `FIX_PLAN.md`; no product fixes were made.

## Executive Summary

The six batches are present in the codebase and most local automated checks pass, but the site is **not ready for production**. The clean build emits ten crawlable, content-filled routes plus `robots.txt`, `sitemap.xml`, and `404.html`; lint, formatting, 21 tests, static validation, axe, performance budgets, Lighthouse, and `npm audit` pass. The initial map bundle is genuinely lazy and the local Lighthouse medians are 97 mobile and 100 desktop.

Acceptance is blocked by evidence and correctness gaps rather than by a failed compilation:

1. No canonical production origin or preferred hostname is defined. The audited build therefore contains `http://127.0.0.1:4173` canonicals, Open Graph URLs, robots sitemap URL, and sitemap locations. A Netlify build may substitute its `URL`, but the preferred public hostname is owner-unconfirmed.
2. There is no known deployed URL to test. Netlify 404 behavior, response headers, CSP reports, HSTS/HTTPS redirects, and live canonical output are not verified. Vite preview returns the home page with HTTP 200 for both tested unknown URLs; the intended Netlify `404` rule is source-only evidence.
3. Business facts used in visible content and policy/FAQ content remain owner-unconfirmed, including coordinates, “a una cuadra,” included parrilla/quincho, capacities and room counts, check-in/out, cancellation and payment deductions, guest surcharges, pet guarantee, smoking fine, and heater charge. Property and business schema must not be treated as fully trusted until those facts are confirmed.
4. `test:e2e` and `check:links` are missing even though Batch 1 required both. The scheduled monitor exists, but its local acceptance run failed on the Vite soft 404 and external destinations could not be conclusively verified.
5. A rendered mobile check found Leaflet cabin markers at 42×52 CSS px and zoom controls at 30×30 CSS px, below the specified 44×44 target.
6. The production GA4 ID is committed in `.env.production` and asserted verbatim in a test, contrary to the acceptance requirement that production IDs not be hardcoded. `view_item`, `select_item`, and other planned discovery events are absent; the root error fallback booking/WhatsApp links are untracked.
7. The privacy page’s hydrated React content uses `puchumancabanas@gmail.com`, while shared data, footer/contact pages, schema, and the no-JavaScript privacy HTML use `puchuman.licanray@gmail.com`.

`POST_BATCH_1_AUDIT.md` does not exist.

## Production Readiness Decision

**NOT READY**

The site may be deployed to a non-indexed deploy preview for final verification. It should not be published as the production, indexable website until the canonical hostname and owner facts are confirmed, a real Netlify response pass proves routes/404/headers/CSP, the accessibility regression is fixed, and missing critical gates/config contradictions are resolved.

### Blocking issues

- Canonical production origin and preferred hostname are not confirmed.
- Actual deployed status codes, generated absolute URLs, security headers, and CSP behavior are not verified.
- Owner-unconfirmed facts are published in visible content, policy copy, and JSON-LD.
- Mobile map controls do not meet the stated 44×44 CSS px acceptance target.
- `test:e2e` and `check:links` scripts are missing.
- Production analytics configuration is hardcoded in the repository and the tracking plan is incomplete.
- Privacy contact email is inconsistent.

### Non-blocking issues

- CSS still contains repeated/superseded `.map-tooltip` rules and is not demonstrably dead-code-clean.
- The largest generated image is 399,758 bytes, only 9,842 bytes below the 400 KiB budget.
- CSP remains report-only and HSTS is deliberately absent.
- No real screen-reader, OS forced-colors, or production-native axe pass was completed.
- Error monitoring is implemented but has no configured endpoint/release in the inspected production environment.

## Batch Completion Matrix

| Batch | Intended goal | Status | Evidence in code | Evidence from commands/tests | Remaining risk | Required action |
|---|---|---|---|---|---|---|
| 1. Data Foundation, Quality Gates, and Baseline Measurement | Centralize inventory, validate data, stabilize dependencies, add gates and baseline tracking | **Partial** | `src/data.js` is the shared inventory; analytics adapter and tracked links exist; CI and tests exist | `npm ci`, lint, format, 21 tests, build, audit pass | Missing `test:e2e` and `check:links`; production GA ID is committed; external links and facts are not owner-verified | Add the two gates, remove environment-specific ID from committed config/test, confirm inventory and destinations |
| 2. Crawlable Routes and Technical SEO | Emit crawlable routes, metadata, schema, sitemap, robots, and real 404 | **Partial** | Ten pre-rendered routes; unique SEO; JSON-LD; `robots.txt`, sitemap, `404.html`; Netlify 404 rule | Static validator passes all ten routes; meaningful no-JS HTML confirmed; Vite HTTP check returns 200 for unknown paths | Real Netlify 404 and canonical output unverified; local build uses localhost origin | Confirm hostname, build with it, deploy preview, verify two unknown URLs return 404 and all headers/absolute URLs are correct |
| 3. Property Content and Conversion Journey | Add useful detail pages, truthful decision content, policies, trust, and conversion tracking | **Partial** | Five detail pages, policy/contact/privacy routes, source-labelled testimonials, persistent mobile CTA | Detail routes render with unique content and valid internal links; tests pass | Many facts and review permissions unconfirmed; no synchronized pricing; tracking plan incomplete | Owner fact sign-off; omit unsupported claims; verify GoFeels capability; complete agreed events |
| 4. Accessibility and Interaction Repair | Repair semantics, menu/FAQ/map behavior, focus, reduced motion, contrast, touch targets | **Partial** | Skip link; focus styles; article map cards; one marker control; menu/FAQ ARIA; reduced-motion logic | axe: 0 critical/serious over 11 built docs; manual menu Escape/focus return and FAQ state pass; no nested controls | Markers are 42 px wide and zoom controls 30×30 at 390 px; contrast excluded from jsdom axe; no real screen-reader test | Fix rendered target sizes; run native-browser axe including contrast, keyboard suite, forced-colors and Spanish screen-reader smoke |
| 5. Performance, Core Web Vitals, and Media Pipeline | Responsive semantic media, self-hosted fonts, lazy map, budgets and Lighthouse | **Partial** | Responsive AVIF/WebP/JPEG, dimensions, self-hosted WOFF2, dynamic map import, budgets | Build: initial JS 73,781 B gzip, CSS 15,170 B gzip, dist 11,317,709 B; Lighthouse median 97 mobile/100 desktop, CLS 0 | Dead CSS remains; largest image nearly exhausts budget; production/deploy-preview run absent | Remove confirmed dead CSS, add margin to image budget, repeat Lighthouse on deploy preview |
| 6. Security Headers, Provider Compliance, and Operational Reliability | Headers/CSP, provider compliance, error fallback, privacy, monitoring, dependency automation | **Partial** | Netlify headers; report-only CSP; OSM attribution; root/map fallbacks; privacy page; monitor workflow; Dependabot | Security/unit tests pass; rendered OSM attribution visible; local monitor exposes soft-404 limitation | Deployed headers/CSP unverified; HSTS absent; tile-volume/SLA decision missing; monitoring variables/error endpoint unconfigured | Validate a real deploy, review CSP reports then enforce, decide HSTS/provider, configure and prove monitoring |

## Command Verification

| Command | Result | Output summary | Blocking errors | Warnings that matter | Blocks production? |
|---|---|---|---|---|---|
| `npm ci` | **Pass** | 501 packages installed; 502 audited; 0 vulnerabilities | First `npm` PowerShell alias attempt was blocked by execution policy; `npm.cmd ci` then passed | Initial sandboxed attempt also hit npm-cache EPERM; approved clean run passed | No |
| `npm run build` | **Pass** | 1,813 modules; 10 routes; static/schema/link/robots/sitemap/404 validation; axe and performance budget passed | None | Build used fallback origin `http://127.0.0.1:4173` | **Yes**, until production origin is supplied and rebuilt |
| `npm run lint` | **Pass** | ESLint completed with zero warnings/errors | None | None | No |
| `npm run format:check` | **Pass** | All selected files match Prettier | None | CSS, Markdown, Netlify config, and env files are outside the format command | No |
| `npm run test` | **Pass** | 21/21 tests passed | None | Mostly source/static contract tests, not browser end-to-end behavior | No |
| `npm run test:e2e` | **Missing** | npm reports missing script | No E2E script | Required by Batch 1 | **Yes** |
| `npm run test:a11y` | **Pass** | axe reports 0 critical/serious violations across 11 built documents | None | `color-contrast` is disabled because jsdom lacks layout/canvas | Not alone; manual regression still blocks |
| `npm run check:links` | **Missing** | npm reports missing script | No dedicated link checker | Static internal-link validation exists, but external destinations are not covered reliably | **Yes** |
| `npm audit` | **Pass** | 0 known vulnerabilities | None | Snapshot only; continue Dependabot/CI | No |
| `npm run lighthouse -- http://127.0.0.1:4173/` | **Pass** | 3 runs/profile; median mobile 97, LCP 2,422 ms, TBT 12 ms, CLS 0; desktop 100, LCP 636 ms, CLS 0 | None | Chrome cleanup emitted `EBUSY`; it did not invalidate completed reports | No, but repeat on deploy preview |
| `npm run monitor:production -- http://127.0.0.1:4173` | **Fail** | Known routes/robots/sitemap were reachable; generated missing URL returned 200 instead of expected 404; external fetches were inconclusive in the restricted run | Vite preview soft 404 | An escalated retry did not complete in a reasonable time and was terminated | **Yes**, because no actual production run passed |

## Routing and SEO Acceptance

The emitted HTML has one H1, unique title, unique description, a self-referencing canonical, Open Graph/Twitter fields, valid parseable JSON-LD, internal navigation, and meaningful no-JavaScript content for every indexable route. The static validator also proves unique titles/canonicals and checks every emitted internal link. This is build-artifact evidence, not deployed-origin evidence.

| Route | HTTP evidence | Title/description/H1 | Canonical/social/indexability | Schema/breadcrumbs | Internal/detail/no-JS result | Acceptance |
|---|---|---|---|---|---|---|
| `/` | Local preview 200 | Unique; one H1 | Canonical + OG + Twitter; indexable | `LodgingBusiness` + `FAQPage`; no breadcrumb needed | Five real detail links; substantial static body | Partial: absolute origin is localhost in audited artifact |
| `/cabanas/` | Local preview 200 | Unique; one H1 | Complete; indexable | Business + `BreadcrumbList` + `ItemList` | Links to all five real details and booking destinations; static body | Partial: deployed origin/status unverified |
| `/cabanas/casa-rafael-mera/` | Local preview 200 | Unique property title/description/H1 | Property social image; indexable | Business + breadcrumb + `Accommodation` | Static facts, image, amenities, booking, Maps, policies | Partial: owner facts unverified |
| `/cabanas/casa-colinanco/` | Local preview 200 | Unique property title/description/H1 | Property social image; indexable | Business + breadcrumb + `Accommodation` | Meaningful static property body | Partial: owner facts unverified |
| `/cabanas/cabana-mariposa/` | Local preview 200 | Unique property title/description/H1 | Property social image; indexable | Business + breadcrumb + `Accommodation` | Meaningful static property body | Partial: owner facts/unusual “4 units” claim unverified |
| `/cabanas/casa-cariman/` | Local preview 200 | Unique property title/description/H1 | Property social image; indexable | Business + breadcrumb + `Accommodation` | Meaningful static property body | Partial: owner facts unverified |
| `/cabanas/casa-cariman-interior/` | Local preview 200 | Unique property title/description/H1 | Property social image; indexable | Business + breadcrumb + `Accommodation` | Meaningful static property body | Partial: owner facts unverified |
| `/politicas-de-reserva/` | Local preview 200 | Unique; one H1 | Complete; indexable | Business + breadcrumb + full `FAQPage` | All ten policy answers exist in static HTML | Partial: monetary/legal/business rules need owner sign-off |
| `/contacto/` | Local preview 200 | Unique; one H1 | Complete; indexable | Business + breadcrumb | WhatsApp, email, Instagram and locality in static HTML | Partial: business identity/address/call policy incomplete |
| `/privacidad/` | Local preview 200 | Unique; one H1 | Complete; indexable | Business only; no breadcrumb schema | Consent explanation/static contacts exist | Fail on consistency: hydrated privacy email differs from shared/static email |
| `/robots.txt` | Local preview 200 | N/A | Valid syntax and sitemap declaration | N/A | Contains `Allow: /` | Partial: sitemap URL is localhost in audited build |
| `/sitemap.xml` | Local preview 200 | N/A | Ten canonical indexable URLs only; excludes 404 | Valid XML shape | All ten generated routes included | Partial: all locations are localhost in audited build; `lastmod` is build date rather than content date |
| `/no-existe-a/` | Local preview **200 home page** | Home metadata/H1 | Home canonical | Home schema | Vite fallback | Fail in the tested server; intended Netlify 404 not deployed/verified |
| `/cabanas/no-existe-b/` | Local preview **200 home page** | Home metadata/H1 | Home canonical | Home schema | Vite fallback | Fail in the tested server; intended Netlify 404 not deployed/verified |

`dist/404.html` itself is correct for a branded error document: it has `noindex,follow`, no canonical, one “Página no encontrada” H1, social tags, and meaningful HTML. Only a real Netlify response can prove that unknown requests receive that file with status 404.

## Data and Content Fact Check

All five accommodations are derived from the same `CABINS` array. Card, detail, map, generated schema, sitemap route, and tracked item parameters use the same object, so no code-level name/capacity/bed/bath mismatch was found. `item_id` and `item_name` are consistent wherever property-specific analytics exists. Coordinates are not emitted in accommodation JSON-LD, so schema cannot contradict them, but they are still public map inputs.

| Accommodation | Required fields and media | Routes/destinations | Coordinates | Schema/analytics consistency | Fact risk |
|---|---|---|---|---|---|
| Casa Rafael Mera (`rafael-mera`, `casa-rafael-mera`) | 8 guests; 3 rooms; 2 baths; 3 amenities; responsive image, dimensions and alt | Real detail route; GoFeels room 4056; unique Maps short URL | -39.489361, -72.160417 | Name/ID consistent; Accommodation occupancy 8 and amenities derived from source | All counts, amenities, image association, coordinates and destination ownership require owner confirmation |
| Casa Coliñanco (`colinanco`, `casa-colinanco`) | 8 guests; 4 rooms; 1 bath; responsive image/alt | Real detail; GoFeels 4140; unique Maps URL | -39.489917, -72.159944 | Consistent across code/schema/events | Coordinates exactly equal Cabaña Mariposa despite a different Maps URL; verify co-location and all facts |
| Cabaña Mariposa (`mariposa`, `cabana-mariposa`) | 4 guests; 2 bedrooms; 1 bath; claim of 4 units; responsive image/alt | Real detail; GoFeels 4058; unique Maps URL | -39.489917, -72.159944 | Consistent across code/schema/events | “4 unidades” and exact co-location with Coliñanco require explicit confirmation |
| Casa Cariman (`cariman`, `casa-cariman`) | 6 guests; 3 rooms; 1 bath; parking; responsive image/alt | Real detail; GoFeels 4430; Maps URL | -39.489667, -72.150944 | Consistent across code/schema/events | Coordinates and Maps URL exactly shared with Cariman Interior; verify this is intentional |
| Casa Cariman Interior (`cariman-interior`, `casa-cariman-interior`) | 5 guests; 3 rooms; 1 bath; equipped kitchen; responsive image/alt | Real detail; GoFeels 4431; same Maps URL as Cariman | -39.489667, -72.150944 | Consistent across code/schema/events | Relationship/location and all unit facts need owner confirmation |

### Unverified or contradictory business content

- The public business name is variously presented as “Puchuman Cabañas,” “Puchuman Cabañas Lican Ray,” and unaccented fallback text. No legal/operator identity is defined.
- The site publishes a phone number as a WhatsApp destination, but call availability and a `tel:` action are not defined.
- The address is only “Lican Ray, Región de La Araucanía”; no street/postal address is verified.
- “Estamos a una cuadra de Playa Grande,” included quincho/parrilla, parking, equipped kitchens, capacities, bedroom/bathroom counts, and property coordinates are not backed by an owner confirmation artifact.
- Policy content publishes exact operational/financial facts: 15:00/11:00 hours, late arrival after 19:00, age >3 counting as guest, CLP 10,000 extra-person surcharge, free cancellation until 15 days, 5% card refund deduction, changes until 7 days, a one-night pet guarantee, 0.5 UF smoking fine, and CLP 6,000/day electric-heater charge. These must be owner-approved before publication/schema use.
- Testimonials link to profile pages, not the original review posts. Permission and dates are not proven. No aggregate rating is emitted, which is correct while evidence is missing.
- Kayak and bicycles are explicitly described as unconfirmed, which avoids an inclusion claim; the icon presentation still makes owner clarification advisable.
- No “desde” price is shown. Availability/rate is delegated to GoFeels, avoiding stale price claims but leaving taxes, fees, minimum stay, accepted payments, and rate source undisclosed.
- The hydrated privacy page email (`puchumancabanas@gmail.com`) contradicts `CONTACT.email`, footer/contact/schema/static privacy HTML (`puchuman.licanray@gmail.com`).
- External GoFeels/Maps destinations have syntactically valid HTTPS URLs, but their current ownership/content could not be conclusively verified in this audit.

## Analytics and Tracking Acceptance

Analytics is fail-open: tracking exceptions do not block navigation, event names and parameters are allowlisted, full query strings are removed from `outbound_url`, and no personal fields are accepted. GA4 loads only after stored consent is `granted`; users can deny or withdraw consent. Click events are attached directly to links, so React Strict Mode does not duplicate them. There are no view effects to duplicate.

However, the production measurement ID is hardcoded in `.env.production` and its exact value is asserted in `tests/analytics-config.test.js`. This fails the stated configuration acceptance rule even though a GA measurement ID is public rather than secret. A previously granted visitor does not initialize GA/pageview on load; initialization waits until the next tracked click. No cross-domain configuration is implemented or documented as supported.

| Event | Trigger | Status | Parameters | Tested method | Remaining issue |
|---|---|---|---|---|---|
| `begin_booking` | Header, hero, cabin cards/index/detail, map, final CTA, mobile bar | **Partial** | `cta_location`, property `item_id`/`item_name` where known, sanitized `outbound_url` | Source inventory + rendered CTA inspection | Root error fallback booking link is untracked; no live GA DebugView/E2E assertion; no currency parameter |
| `generate_lead` | Footer/contact/mobile WhatsApp | **Partial** | `cta_location`, sanitized outbound URL | Source inspection | Root error fallback WhatsApp is untracked; no live GA assertion |
| `click_email` | Footer and contact email | **Pass in code** | `cta_location`, sanitized outbound URL | Source inspection | Privacy email link is untracked and inconsistent; no live GA assertion |
| `get_directions` | Detail, map fallback/cards/panel, general directions | **Pass in code** | `cta_location`, `item_id`, `item_name`, sanitized URL as available | Source + rendered map/fallback inspection | No destination parameter and no live analytics assertion |
| `select_item` | Detail choice | **Missing** | None | Source search | Planned high-priority discovery event absent |
| `view_item` | Property detail view | **Missing** | None | Source search | Planned high-priority property interest event absent |
| `view_item_list` | Cabin list view | **Missing** | None | Source search | Planned high-priority inventory discovery event absent |
| `view_map` | Lazy map activation | **Missing** | None | Source/browser inspection | Map value cannot be measured |
| `faq_open` | FAQ expansion | **Missing** | None | Source search | Low-priority plan item absent |
| `booking_complete` | Confirmed GoFeels callback/thank-you | **Correctly not implemented** | None | Source search | Must remain absent until GoFeels confirms callback/thank-you/webhook and cross-domain behavior |

## Accessibility Acceptance

### Automated axe result

`npm run test:a11y` passed with **0 critical/serious violations across 11 built documents**. The scan uses jsdom and disables `color-contrast`; therefore it is not evidence that contrast passes WCAG AA in a native browser.

### Keyboard-only result

- Skip link and `#main-content` exist on all layouts.
- At 390×844, the mobile menu opened, moved focus to the first navigation link, responded to Escape, closed, and returned focus to the “Abrir menú” button. `aria-controls="primary-navigation"` and expanded state were correct.
- FAQ buttons and panels have matching `aria-controls`/`aria-labelledby`; collapsed panels use native `hidden`.
- No nested interactive ancestor was found before or after map activation.
- Map cards are articles with sibling/select controls and separate links.
- Each cabin marker exposed exactly one `role="button"`, `tabindex="0"`, and property-specific accessible label; decorative place labels were `aria-hidden` with no role/tabindex.
- Reduced-motion code switches map movement from `flyTo` to non-animated `setView`.

### Screen-reader smoke result

No actual NVDA, JAWS, VoiceOver, or TalkBack session was available. DOM/accessibility-tree inspection in Spanish showed coherent landmarks, headings, menu labels, FAQ expanded/collapsed states, one marker control per property, and hidden decorative labels. This is **not a completed screen-reader acceptance test**.

### Remaining violations and gaps

- Rendered mobile marker controls are 42 px wide; Leaflet zoom controls are 30×30 px. Both fail the project’s 44×44 requirement.
- Leaflet attribution links render around 12 px high; they also do not meet a blanket 44×44 rule, though WCAG target-size exceptions/spacing may apply. The brief requested at least 44×44 for touch targets, so this remains open.
- Native-browser color contrast, 200%/400% zoom, forced colors, and real screen-reader use are not fully verified.
- Horizontal overflow was absent at 390 px.

## Performance Acceptance

| Check | Result | Evidence / risk |
|---|---|---|
| Semantic hero LCP | Pass | Rendered `<picture><img>` rather than CSS background on home |
| AVIF/WebP/JPEG fallback | Pass | `<source>` elements plus JPEG `img` |
| Hero dimensions/srcset/sizes/priority | Pass | 1920×1080, responsive sets, `sizes="100vw"`, eager, `fetchpriority="high"` |
| Below-fold lazy images | Pass | Browser inspection found 14 subsequent main images with `loading="lazy"` |
| Intrinsic dimensions | Pass | Data/tests and rendered hero verify width/height |
| Logos optimized | Pass | Published logo rasters are 96/200/230 WebP plus 64 PNG favicon; original design exports are outside `public` |
| Fonts | Pass | Seven self-hosted WOFF2 files; no Google Fonts request in generated HTML |
| Leaflet/map lazy | Pass | Initial page had only the index script, no map stylesheet, no Leaflet canvas; map chunk/style appeared only after viewport activation |
| Tiles before activation | Pass by DOM/bundle evidence | No Leaflet container/map code existed initially, so TileLayer could not request tiles before activation |
| CSS dead code removed | Fail | `src/styles.css` is ~50 KB source and retains repeated/superseded `.map-tooltip` blocks despite no current JSX owner |
| Budgets | Pass narrowly | Initial JS 73,781 B gzip ≤112,640; CSS 15,170 ≤18,432; largest image 399,758 ≤409,600; total dist 11,317,709 ≤12,582,912 |
| Lighthouse | Pass locally | Mobile median 97, FCP 1,815 ms, LCP 2,422 ms, TBT 12 ms, CLS 0; desktop median 100, FCP 453 ms, LCP 636 ms, TBT 0, CLS 0 |

Initial bundle: 240.60 KB raw / 74.55 KB gzip JS and 38.83 KB raw / 8.86 KB gzip main CSS. Lazy map: 161.21 KB raw / 47.34 KB gzip JS and 15.09 KB raw / 6.36 KB gzip CSS. The likely LCP candidate is the semantic hero image. No CLS was observed in the six Lighthouse runs. Largest asset is `media/gallery/senderos-peninsula-960.webp` at 399,758 bytes. The remaining performance risk is limited budget headroom, dead CSS, and lack of a production-network Lighthouse run.

## Security and Reliability Acceptance

| Control | Status | Evidence / remaining risk |
|---|---|---|
| Security headers | Configured, not deployed-verified | Netlify config includes CSP Report-Only, nosniff, strict-origin referrer policy, permissions policy, and DENY framing |
| CSP | Partial | Report-only permits self, GA/GTM, OSM tiles and data images; no real violation report reviewed; not enforced |
| HSTS | Missing by design | Deferred until canonical HTTPS host/redirects are confirmed |
| Unknown-route 404 | Not accepted | Netlify rule intends status 404; local Vite preview returned 200 home for two unknown paths; real Netlify response absent |
| OSM attribution | Pass in rendered map | “Leaflet | © OpenStreetMap contributors” visible |
| Tile-provider compliance | Partial | Community OSM tiles are used; final volume/SLA/caching/provider decision is not documented |
| Root error boundary | Pass in code | Booking, WhatsApp, reload fallback; scrubbed optional beacon reporting |
| Map failure fallback | Pass in code | Direct Maps links remain without Leaflet; chunk failure boundary exists |
| Error monitoring | Partial | Same-origin endpoint design and PII-reduced envelope exist; endpoint/release not configured or end-to-end tested |
| Scheduled checks | Partial | Six-hour GitHub workflow checks routes, robots, sitemap, unknown 404, booking and map URLs; requires repository `SITE_URL`; no passing production run shown |
| Dependency automation | Pass in config | Weekly npm and monthly GitHub Actions Dependabot configuration |
| Privacy/consent | Partial | Privacy route, opt-in banner, withdrawal controls exist; actual market/legal requirements are owner/legal inputs |

## Original Audit Issue Status

| Original issue | Original severity | Current status | Evidence | Remaining action |
|---|---:|---|---|---|
| No crawlable accommodation detail pages | High | **Partially fixed** | Five static, meaningful detail documents emitted | Confirm production host/deploy and owner facts |
| False “Ver detalles” links | High | **Fixed in code/build** | All cards/map actions point to real property routes | Verify deployed links/statuses |
| No analytics/conversion events | High | **Partially fixed** | Four allowlisted click event families and consent gate | Remove hardcoded production config; add planned discovery events; live debug test |
| Missing robots/sitemap | High | **Partially fixed** | Valid emitted files with ten routes | Rebuild with confirmed production origin and verify live |
| Soft 404 behavior | High | **Still open in tested preview** | Two unknown URLs returned home/200; Netlify source rule is unverified | Prove actual deploy returns branded 404 with HTTP 404 |
| Invalid nested controls | High | **Fixed** | DOM inspection before/after map found none; source tests pass | Keep E2E regression coverage |
| Eager map loading | High | **Fixed** | Initial browser had no map chunk/style/DOM; dynamic import after viewport/user activation | Add request-level E2E assertion |
| Oversized media | High | **Partially fixed** | Responsive pipeline and budgets; dist 11.3 MB | Largest image nearly at cap; continue optimization |
| Weak trust/pricing/property decision content | High | **Partially fixed / blocked by owner** | Detail/policy/trust disclosures added; no invented price | Confirm facts, rates, fees, stays, payments, review permission/media |
| Missing schema/social metadata | Medium | **Partially fixed** | Route-specific OG/Twitter/canonical/JSON-LD | Production origin and owner-backed schema facts still missing |
| No quality gates | Medium | **Partially fixed** | CI, lint, format, unit, a11y, static, performance | Add missing E2E and dedicated link gate |
| Missing security headers | High | **Partially fixed** | Netlify config present | Verify deployed headers/CSP, decide enforcement/HSTS |
| OSM attribution/provider compliance | High | **Partially fixed** | Attribution visible | Confirm tile usage volume/provider terms/SLA decision |
| Missing privacy/consent | High | **Partially fixed** | Privacy page, opt-in banner, withdrawal | Resolve market/legal requirements and email contradiction |
| Missing owner facts | High | **Still open / blocked by owner** | Preconditions remain undocumented; visible policies contain exact claims | Complete `OWNER_GO_LIVE_CHECKLIST.md` before publishing |

## Regressions Found

1. Mobile Leaflet marker and zoom-control hit areas do not meet the 44×44 target.
2. Privacy contact email differs between hydrated React and shared/static content.
3. The exact production GA4 ID is committed and tested verbatim despite the plan/acceptance requirement to keep production IDs out of committed configuration.
4. `test:e2e` and `check:links` remain missing despite being explicit Batch 1 deliverables.
5. Vite preview still behaves as a soft-404 server, so the standard production-like preview command cannot validate route status acceptance.
6. Dead/superseded map tooltip CSS remains after the performance cleanup batch.
7. Root error-boundary booking and WhatsApp fallbacks bypass the shared tracking component.

## Blocking Issues

- Confirm and configure the canonical HTTPS origin/preferred hostname; rebuild and inspect absolute URLs.
- Obtain owner sign-off or remove/qualify every unverified business, property, distance, review, and policy fact.
- Deploy a Netlify preview and prove all known routes are 200, at least two unknown routes are 404, headers are present, and CSP reports are clean.
- Fix 44×44 rendered map controls and rerun native accessibility tests.
- Add `test:e2e` and `check:links`, including status, map lazy-request, and external destination assertions.
- Resolve analytics configuration hardcoding/tracking gaps and the privacy email contradiction.

## Non-Blocking Issues

- Remove confirmed dead CSS and improve largest-image budget headroom.
- Add a real screen-reader/forced-colors/zoom acceptance record.
- Configure optional error monitoring only after endpoint ownership/retention/privacy are approved.
- Move CSP from report-only to enforced only after clean deploy evidence.
- Add HSTS only after stable HTTPS/hostname redirects are proven.

## Recommended Next Actions

### Immediate, before any public/indexable release

1. Owner completes the critical sections of `OWNER_GO_LIVE_CHECKLIST.md`, starting with hostname, public identity/contact, unit facts/coordinates, policies/rates, and GoFeels capabilities.
2. Developers fix the privacy email mismatch and mobile map target sizes.
3. Developers add browser E2E and dedicated link/status checks; cover unknown-path 404, no-JS route content, metadata, map pre-activation requests, menu/FAQ keyboard behavior, and CTA events.
4. Move the production GA4 value to deployment configuration, keep only an empty example, and decide which planned events are required at launch.
5. Build with the confirmed `SITE_URL`, deploy a preview, then run the production monitor, header/CSP inspection, native axe/keyboard checks, and three-run Lighthouse against that URL.

### Post-launch backlog

- Enforce CSP after a clean report-only period; then consider HSTS.
- Select a tile provider appropriate to traffic/SLA and document compliance.
- Add verified property galleries, travel distances, pricing/fees/payment details, and review provenance.
- Remove dead CSS and further optimize the near-budget gallery image.
- Configure privacy-reviewed error monitoring and alert ownership.
