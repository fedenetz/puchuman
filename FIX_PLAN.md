# Puchuman Website Fix Plan

This plan converts the audit into reversible implementation batches. It deliberately separates data/measurement, crawl architecture, content, accessibility, performance, and reliability so defects can be isolated and rolled back. No fixes are implemented by this file.

## Preconditions That Must Be Confirmed

The following are not clearly defined in code and must be confirmed before URLs, schema, or production analytics are shipped:

- Canonical production origin and preferred hostname.
- Exact public business name, street/postal address, phone/call availability, and operator identity.
- Verified coordinates and walking/driving distance for each unit.
- Whether activities such as kayak and bicycles are included, nearby, seasonal, or paid.
- Rate source, taxes/fees, minimum stays, accepted payment methods, and whether “desde” pricing can stay synchronized.
- Review source permission, review dates, and any independently verifiable aggregate rating/count.
- GoFeels support for cross-domain GA4, campaign parameters, callbacks/webhooks, and a confirmed thank-you URL.
- Privacy/consent requirements for the markets and advertising tools the business will actually use.

Do not substitute guesses for these facts.

## Batch 1 — Data Foundation, Quality Gates, and Baseline Measurement

**Status: Completed on 2026-06-21.** Only Batch 1 was implemented. The routing, SEO page, sitemap, robots, 404, property detail, redesign, accessibility-remediation, and performance batches remain pending.

**Goal**

Create one trusted inventory model, make the current behavior testable, and measure primary outbound intent before larger changes.

**Files to edit**

- `package.json`, `package-lock.json`
- `src/data.js` (or split into `src/data/site.js`, `src/data/cabins.js`, `src/data/faq.js`)
- `src/components/Cabins.jsx`
- `src/components/CabinMapExplorer.jsx`
- `src/components/Header.jsx`
- `src/components/Hero.jsx`
- `src/components/FinalCTA.jsx`
- `src/components/Footer.jsx`
- New `src/lib/analytics.js`, `src/components/TrackedLink.jsx`
- New test/config files and `.env.example`

**Exact changes**

1. Define a single cabin schema with unique `id`/`slug`, name, type, occupancy, bedroom/bathroom counts, amenities, descriptions, image objects (src/width/height/alt), coordinates, Maps URL, and booking URL.
2. Delete the duplicate local `cabins` content model from `CabinMapExplorer.jsx`; derive map-specific presentation from shared data.
3. Add validation tests for unique slugs, required fields, sane capacity/counts, URL protocols, and image dimensions.
4. Replace `latest` with tested semver ranges; classify build/test packages as dev dependencies; remove extraneous `tslib` if no package requires it.
5. Add scripts for `lint`, `format:check`, `test`, `test:e2e`, `test:a11y`, `check:links`, and `build`. Configure CI to run `npm ci` and all checks.
6. Add a no-op-in-development/production-configured analytics adapter. Track `begin_booking`, WhatsApp lead, and email click from one `TrackedLink` component with `cta_location` and property ID where relevant.
7. Add `.env.example` with non-secret public analytics configuration names and validation. Do not commit production IDs or treat the GoFeels token as private.
8. Document event deduplication and verify React Strict Mode does not double-send view events.

**Testing required**

- `npm ci`, lint, format check, unit tests, and production build.
- Compare every displayed unit name/capacity/bed/bath/booking/Maps link before and after.
- Run at desktop and 390 px; verify all booking/contact links still open the intended destination.
- Use GA4/GTM debug mode with non-production configuration; confirm one event per click and no personal data.
- Run axe baseline and store current known failures for Batch 4 rather than hiding them.

**Risk level:** Medium. Data consolidation touches every inventory presentation and CTA.

**Rollback notes**

- Keep the old `data.js` and map array in the prior commit; rollback the entire batch if any unit mapping is wrong.
- Analytics must fail open: disabling environment IDs must restore pure navigation without blocking clicks.
- Do not mix route creation into this batch; that keeps rollback limited to data and instrumentation.

### Batch 1 implementation notes

**What changed**

- Consolidated all five cabins into one normalized `CABINS` model with verified current content, numeric capacity/room values, image metadata, coordinates, Maps/booking destinations, nullable future long descriptions, and dormant slug-based future detail URLs.
- Removed the duplicate cabin model from `CabinMapExplorer.jsx`; both cabin presentations now consume `CABINS` directly.
- Added a fail-open analytics adapter and reusable tracked link for `begin_booking`, WhatsApp `generate_lead`, `click_email`, and `get_directions`. Analytics remains off unless both public environment settings are explicitly configured. No production ID was added.
- Added public environment documentation, including the explicit warning that the browser-visible GoFeels URL/token is not a private secret and that privileged keys must never use `VITE_*` variables.
- Replaced every `latest` production/build dependency range with a tested semver range, moved build tooling to dev dependencies, removed the unused extraneous `tslib`, and added minimal lint/format/test tooling.
- Added six inventory regression tests covering uniqueness, required fields, numeric sanity, preserved booking URLs, optional Maps URLs, images, dimensions, future detail URL shape, and coordinates.

**Files modified or added**

- `.env.example`
- `package.json`, `package-lock.json`
- `eslint.config.js`
- `src/data.js`
- `src/lib/analytics.js`
- `src/components/TrackedLink.jsx`
- `src/components/Cabins.jsx`
- `src/components/CabinMapExplorer.jsx`
- `src/components/Header.jsx`
- `src/components/Hero.jsx`
- `src/components/FinalCTA.jsx`
- `src/components/Footer.jsx`
- `tests/cabins.test.js`
- `FIX_PLAN.md`

**Commands run and checks passed**

- `npm install`: dependencies installed and install audit reported 0 vulnerabilities.
- `npm prune`: removed unused extraneous `tslib`.
- `npm run lint`: passed with zero warnings/errors after adding JSX-aware React lint configuration.
- `npm run format:check`: passed for all Batch 1 source/config/test files.
- `npm test`: 6 tests passed; 0 failed.
- `npm run build`: passed with Vite 8.0.16.
- `npm list --depth=0`: clean direct dependency tree after pruning.
- Production preview verification at desktop and 390 × 844 mobile: all five names rendered in both cabin modules; all existing booking, Maps, direction, WhatsApp, email, and Instagram links were preserved; no horizontal overflow or console warnings/errors were observed; analytics produced no script or data layer with default environment settings.
- A later standalone `npm audit --json` retry could not reach the registry audit endpoint in the restricted environment; the preceding `npm install` audit completed successfully with 0 vulnerabilities.

**Known remaining issues for later batches**

- Future detail URLs are data only and deliberately unused. Existing `#preguntas` and `#cabanas` detail links remain unchanged until Batch 2 creates real routes.
- No production analytics ID, page-view tracking, booking-complete event, cross-domain GoFeels configuration, consent UI, or advertising tag was added.
- Previously audited accessibility defects in the map cards/markers, menu, FAQ, focus states, and tap targets remain for Batch 4.
- Routing/technical SEO, content expansion, media/map performance, security headers, OSM attribution, and provider fallbacks remain in their respective later batches.

## Batch 2 — Crawlable Routes and Technical SEO

**Status: Implemented and locally validated on 2026-06-22.** Production deploy-preview validation remains pending because no external deployment was requested. Only Batch 2 work was added; later conversion, accessibility, performance, and security batches remain pending.

**Goal**

Give every accommodation and core policy/location intent a stable, pre-rendered URL with correct crawl and social metadata.

**Files to edit**

- `src/App.jsx`, `src/main.jsx` or replacement route entry/template files
- Build configuration (`vite.config.js` or selected SSG/Astro configuration)
- New page templates for home, cabins index, cabin detail, policies, contact/location, and 404
- `netlify.toml`
- Generated/public `robots.txt`, `sitemap.xml`
- Head/SEO component and JSON-LD generator
- Cabin/detail links in `Cabins.jsx`, `CabinMapExplorer.jsx`, Header/Footer

**Exact changes**

1. Choose a pre-rendering architecture. For this small content-led site, prefer Astro with React islands or a Vite SSG approach; do not add a client router while still serving an empty HTML shell.
2. Generate `/`, `/cabanas/`, five property routes, `/politicas-de-reserva/`, `/contacto/`, and a true 404 page.
3. Emit meaningful body HTML for every route before JavaScript executes.
4. Add unique title, meta description, canonical, `og:*`, Twitter card, and absolute 1200×630 image per page.
5. Generate schema from Batch 1 data: organization/lodging business, property/accommodation entities, breadcrumb lists, and FAQPage where visible FAQ content is present.
6. Add `robots.txt` and sitemap with only canonical indexable URLs. Do not put a `noindex` URL in the sitemap.
7. Remove the blanket 200 rewrite. Configure unknown URLs to return the branded 404 with HTTP 404.
8. Point every “Ver detalles” to its property route; add breadcrumb and related-property links.
9. Add explicit metadata/indexability policy for policy, thank-you, and error pages.

**Testing required**

- Inspect built HTML with JavaScript disabled; each route must contain unique H1, copy, title, canonical, and JSON-LD.
- Validate status codes for all known routes, `/robots.txt`, `/sitemap.xml`, and at least two unknown paths.
- Validate canonical/OG URLs against the confirmed production origin.
- Run a structured-data validator and schema unit tests.
- Crawl the built site with a link checker; assert no internal link redirects or fragments masquerade as detail pages.
- Verify Netlify deploy preview routing, not just Vite preview.

**Risk level:** High. This changes build/deployment and URL behavior.

**Rollback notes**

- Preserve existing Netlify deployment configuration in a tagged release.
- Deploy to a preview URL and crawl it before switching production.
- If route generation fails, roll back the entire architecture batch; do not re-add a blanket 200 fallback as a partial patch.
- Add redirects only from URLs that actually existed publicly; do not invent redirect history.

### Batch 2 implementation notes

**What changed**

- Added a small Vite static-generation layer that emits meaningful HTML before JavaScript for `/`, `/cabanas/`, five cabin detail URLs, `/politicas-de-reserva/`, and `/contacto/`.
- Added route-aware React page templates for the cabins index, each cabin, reservation policies, contact/location, and the branded not-found view without introducing a client router.
- Added unique titles, descriptions, self-referencing canonicals, Open Graph/Twitter metadata, and absolute social image URLs to every generated indexable page.
- Added generated `LodgingBusiness`, `Accommodation`, `ItemList`, `BreadcrumbList`, and visible-content `FAQPage` JSON-LD graphs sourced from the normalized cabin/contact/FAQ data.
- Moved FAQ content into shared data so the visible homepage/policy content and FAQ schema cannot drift.
- Added generated `robots.txt` and `sitemap.xml`; the sitemap includes only the nine canonical/indexable routes.
- Replaced the blanket home-page rewrite with a Netlify 404 fallback. Existing files are served normally; only unknown paths reach `404.html` with status 404.
- Replaced every false cabin “Ver detalles” fragment with its generated cabin URL and added breadcrumb plus related-cabin links.
- Added explicit `noindex,follow` handling and no canonical/schema output for the 404 document.
- Added build-time static validation for unique metadata, canonical origin, one static H1, parseable JSON-LD graphs, internal links, sitemap, robots, and 404 rules.

**Production-origin safety**

- The canonical origin is resolved from `SITE_URL`, then Netlify's build-time `URL`. Local builds use `http://127.0.0.1:4173` only inside generated local `dist` output.
- CI fails when no public origin is available, preventing guessed production canonicals from being published.
- `SITE_URL` is documented in `.env.example` and should be explicitly set to the preferred custom production hostname before deployment.

**Files modified or added**

- `.env.example`
- `package.json`
- `netlify.toml`
- `src/App.jsx`, `src/main.jsx`, `src/routes.js`, `src/data.js`, `src/styles.css`
- `src/components/Cabins.jsx`, `CabinMapExplorer.jsx`, `FAQ.jsx`, `Footer.jsx`, `Header.jsx`, `PageLayout.jsx`
- `src/pages/HomePage.jsx`, `CabinsIndexPage.jsx`, `CabinDetailPage.jsx`, `PoliciesPage.jsx`, `ContactPage.jsx`, `NotFoundPage.jsx`
- `scripts/generate-static-pages.mjs`, `scripts/validate-static-build.mjs`
- `tests/routes.test.js`
- `FIX_PLAN.md`

**Commands run and checks passed**

- `npm run lint`: passed with zero warnings/errors.
- `npm run format:check`: passed.
- `npm test`: 9 tests passed; 0 failed.
- `npm run build`: Vite build passed; generated and validated nine indexable routes, `robots.txt`, `sitemap.xml`, and `404.html`.
- Generated crawl validation: all internal links resolve; titles and canonicals are unique; every indexable page has one static H1 and a parseable JSON-LD graph; 404 is excluded from the sitemap.
- Local HTTP status crawl: all nine routes, robots, and sitemap returned 200; two unknown URLs returned 404.
- Browser verification: property, cabins index, policy, and contact routes rendered their unique H1/title/content and preserved booking, Maps, WhatsApp, email, and Instagram destinations. A 390 × 844 property check had no horizontal overflow or console warnings/errors.

**Known remaining issues for later batches**

- A real Netlify deploy preview must be crawled before production release; this turn did not create or mutate an external deployment.
- The preferred custom production origin is still not clearly defined in code and must be supplied through `SITE_URL` before deployment.
- Existing source images are used for social previews with accurate absolute URLs; creating dedicated 1200 × 630 crops belongs to the Batch 5 media pipeline.
- Cabin pages intentionally contain only facts already present in the repository. Deeper galleries, pricing, verified distances, trust content, and unique long descriptions remain Batch 3 work.
- Previously audited accessibility, map-loading/media performance, security-header, OSM attribution, consent, and provider-fallback issues remain in later batches.

## Batch 3 — Property Content and Conversion Journey

**Status: Implemented and locally validated on 2026-06-22.** The user also explicitly supplied and authorized GA4 measurement ID `G-0K61Y5RX2C`; it is configured as public production analytics configuration through the existing fail-open loader.

**Goal**

Answer comparison and trust questions on-site so users reach GoFeels ready to complete, not merely curious.

**Files to edit**

- Cabin content data/modules
- Home cabin index/component
- Property detail template/components
- `Testimonials.jsx`, `FAQ.jsx`, `Experiences.jsx`, `Benefits.jsx`, `Story.jsx`
- New policy, about/trust, and contact/location content
- CTA components and optionally a date/guest availability entry component

**Exact changes**

1. Write unique property content: sleeping layout, complete amenities, exclusions, verified distance, gallery, check-in/out, pet/accessibility/heating/Wi-Fi status, and property-specific FAQs.
2. Add honest price/availability framing. If live rate synchronization is not reliable, explain that dates and guest count determine the price instead of publishing stale “desde” values.
3. Replace generic benefit claims with evidence: host identity/history, cleaning/check-in process, verified review sources, secure payment/booking explanation, and real photographs.
4. Link reviews to allowed source pages and add date/context. Add aggregate rating schema only if independently supported and visible.
5. Separate included amenities from nearby experiences; specify seasonality, cost, provider, and distance.
6. Shorten the home page: one inventory comparison, compact proof, focused location summary, top FAQs, and a clear final action. Move depth to dedicated routes.
7. Add an accessible mobile bottom action bar with “Ver disponibilidad” plus WhatsApp, respecting safe areas and not covering content.
8. Preserve property identity in booking links and analytics parameters where GoFeels supports it.

**Testing required**

- Editorial fact-check against confirmed business data; no invented amenity, distance, rate, rating, or availability claim.
- Mobile usability test from landing → property comparison → detail → booking/WhatsApp.
- Verify all CTA labels and destinations match the selected property.
- Review at 320, 375, 390, 768, 1024, and desktop widths; test 200% zoom.
- Validate analytics parameters and ensure external links remain functional without analytics.

**Risk level:** Medium. Mostly content and journey changes, but inaccurate facts can create customer disputes.

**Rollback notes**

- Keep content changes separate from pricing integration so stale rates can be disabled independently.
- Gate any dynamic availability widget behind a feature flag; retain direct GoFeels links as fallback.
- Sticky CTA must be removable through one component/config switch.

### Batch 3 implementation notes

**What changed**

- Enabled the authorized GA4 tag in `.env.production`. The existing analytics loader now initializes standard GA4 page views and retains the Batch 1 `begin_booking`, lead, email, and direction events. No private credential was added.
- Added unique, fact-only long descriptions for all five cabins using existing capacity, bedroom, bathroom, unit-count, parking, common-space, and kitchen data.
- Expanded cabin pages with honest live-rate framing, a second property-specific booking CTA, check-in/check-out, pet and smoking rules, a policy link, and a clear prompt to confirm Wi-Fi, heating, accessibility, or other requirements that are not defined in code.
- Added a pricing explanation to the cabins index. No stale “desde” price, tax, fee, payment, or minimum-stay claim was invented.
- Replaced generic benefit claims with verifiable evidence: published capacity range, online availability/rates, visible policies, and direct contact channels.
- Moved testimonials into shared data, linked each public Instagram handle, disclosed that review dates are unavailable, and explicitly avoided an unsupported aggregate score.
- Clarified the experiences section: lake/volcano/beach are the environment; quincho/parrilla is stated as included; kayak and bicycles require confirmation of availability, provider, season, and cost.
- Shortened the homepage FAQ from ten to five items and linked the complete policy page.
- Added a fixed mobile conversion bar with “Ver disponibilidad” and WhatsApp, safe-area padding, 48 px controls, fail-open tracking, and property-independent booking/contact fallbacks.
- Updated generated static HTML and homepage FAQ schema so pre-rendered content matches the visible Batch 3 journey.

**Files modified or added**

- `.env.production`
- `package.json`
- `src/data.js`, `src/main.jsx`, `src/lib/analytics.js`, `src/styles.css`
- `src/components/Benefits.jsx`, `Experiences.jsx`, `FAQ.jsx`, `Testimonials.jsx`, `MobileConversionBar.jsx`, `PageLayout.jsx`
- `src/pages/HomePage.jsx`, `CabinDetailPage.jsx`, `CabinsIndexPage.jsx`
- `scripts/generate-static-pages.mjs`
- `tests/analytics-config.test.js`
- `FIX_PLAN.md`

**Commands run and checks passed**

- `npm run lint`: passed with zero warnings/errors.
- `npm run format:check`: passed.
- `npm test`: 10 tests passed; 0 failed, including the explicit production GA4 configuration test.
- `npm run build`: passed; nine static routes and crawl files generated and validated.
- Built bundle inspection confirmed both `G-0K61Y5RX2C` and the Google tag loader URL are present.
- HTTP checks: core routes, robots, and sitemap returned 200; an unknown route returned 404.
- Browser checks confirmed the GA4 loader script and measurement ID, five homepage FAQs, three linked testimonial sources, cabin-specific booking URLs, price/policy/requirements content, and no console warnings/errors.
- Responsive checks at 320, 375, 390, 768, 1024, and desktop widths found no horizontal overflow. The mobile conversion bar appears below 760 px and is hidden at larger widths.

**Known remaining factual and implementation gaps**

- Exact rates, taxes/fees, minimum stays, payment methods, Wi-Fi, heating, accessibility, property-specific distance, and activity providers remain not clearly defined in code and were not invented.
- Review post URLs and dates are not available; profile links and an explicit date-unavailable disclosure are used instead. No aggregate rating/schema was added.
- Each property has only one confidently associated image in the repository. Property-specific galleries require verified media assignments.
- GoFeels cross-domain completion, transaction value, thank-you callback, and campaign-parameter support remain unconfirmed; `begin_booking` measures intent, not revenue.
- The authorized GA4 tag now loads in production. Consent/privacy controls remain pending and must be resolved before adding advertising tags or where legally required.
- The homepage still contains the interactive map and full gallery. Map accessibility and performance remain Batch 4/5 work rather than being mixed into this content batch.

## Batch 4 — Accessibility and Interaction Repair

**Status: Implemented and locally validated on 2026-06-22.** Only Batch 4 accessibility and interaction work was added in this batch; Batch 5 performance/media work and later reliability/security work remain pending.

**Goal**

Remove invalid interaction patterns and make navigation, selection, FAQ, and conversion usable by keyboard, screen reader, touch, and reduced-motion users.

**Files to edit**

- `src/App.jsx`
- `src/components/Header.jsx`
- `src/components/FAQ.jsx`
- `src/components/CabinMapExplorer.jsx` and extracted map components
- `src/styles.css` or refactored component styles
- Accessibility browser tests

**Exact changes**

1. Add a skip link and `main-content` target.
2. Add a global, high-contrast `:focus-visible` system and remove any `outline:0` without equivalent replacement.
3. Rebuild each map cabin item as an `<article>` with a separate “Mostrar en mapa” button and sibling booking/detail/Maps links. No interactive ancestor may contain interactive descendants.
4. Expose exactly one accessible control per Leaflet marker; hide decorative place-label markers from the accessibility tree.
5. Add keyboard selection without hover side effects. Respect reduced motion by disabling `flyTo` animation.
6. Upgrade mobile menu with `aria-controls`, Escape close, focus trap, inert background, and focus return.
7. Give each FAQ button/panel matching IDs, `aria-controls`, `aria-labelledby`, and correct `hidden` state.
8. Increase all actionable hit areas to at least 44×44 CSS px and verify spacing.
9. Darken small accent text that uses `#7ea3d4` on light backgrounds; test all states for WCAG AA.
10. Use empty alt text for repeated decorative cabin thumbnails when an adjacent heading already provides the name.

**Testing required**

- axe automated scan with zero critical/serious violations on every route and interactive state.
- Keyboard-only: skip link, menu open/close/Escape, all cards, map selection, FAQ, sticky CTA, and footer.
- Screen-reader smoke test in Spanish for heading/landmark order, collapsed FAQ state, map controls, and outbound labels.
- Test 200%/400% zoom, reduced motion, high contrast/forced colors where available, and touch targets at mobile widths.
- Ensure map remains optional and direct address/directions are available without it.

**Risk level:** Medium. Interaction markup changes can affect styling and map behavior.

**Rollback notes**

- Keep map semantics and visual restyle in separate commits; the semantic article/button structure should remain even if visual styling is rolled back.
- Retain direct booking and Maps links outside Leaflet as a permanent fallback.
- Never rollback by reintroducing nested controls; disable the interactive map instead if necessary.

### Batch 4 implementation notes

**What changed**

- Added a visible-on-focus skip link and a consistent `main-content` target to every React layout and pre-rendered document.
- Added a high-contrast global focus system, removed legacy `outline: 0` declarations, increased actionable targets to at least 44 × 44 CSS pixels, darkened small blue accent text on light backgrounds, and added reduced-motion and forced-colors handling.
- Rebuilt each map cabin card as a non-interactive article with a separate “Mostrar en el mapa” button and sibling booking, detail, and Maps links. Repeated card thumbnails now use empty alternative text.
- Reduced Leaflet markers to one keyboard-accessible control per cabin, removed focus-triggered selection, hid decorative place labels from assistive technology, and replaced animated `flyTo` with `setView` when reduced motion is requested.
- Upgraded the mobile menu with `aria-controls`, Escape handling, focus trapping, inert page content, and focus return to the toggle.
- Connected each FAQ button and panel with stable IDs, `aria-controls`, `aria-labelledby`, and native `hidden` state.
- Added axe-core checks for all ten built HTML documents and source regression tests for the live interactive accessibility contracts.

**Files modified or added**

- `package.json`, `package-lock.json`
- `src/components/Header.jsx`, `FAQ.jsx`, `CabinMapExplorer.jsx`, `PageLayout.jsx`
- `src/pages/HomePage.jsx`
- `src/styles.css`
- `scripts/generate-static-pages.mjs`, `scripts/audit-accessibility.mjs`
- `tests/accessibility.test.js`
- `FIX_PLAN.md`

**Commands run and checks passed**

- `npm install --save-dev axe-core jsdom`: installed the minimum accessibility-test dependencies; audit reported 0 vulnerabilities.
- `npm run lint`: passed with zero warnings/errors.
- `npm run format:check`: passed.
- `npm test`: 14 tests passed; 0 failed.
- `npm run build`: passed, including static-route validation and axe scans with 0 critical/serious violations across ten built documents.
- Live browser verification at desktop, 390 px, and a 320 px reflow equivalent: no horizontal overflow, no console warnings/errors, all five cabin names present, and no visible target smaller than 44 × 44 CSS pixels at mobile width.
- Keyboard and semantic smoke tests: menu focus enters the first navigation link, Escape closes and returns focus, FAQ expanded/hidden state stays synchronized, map cards contain no interactive ancestor, cabin markers expose exactly one control, and direct Maps/directions links remain available outside Leaflet.

**Known remaining issues for later batches**

- The automated build scan disables axe's `color-contrast` rule because jsdom has no layout/canvas model. Contrast-sensitive accent colors were corrected and inspected in the rendered browser, but a production deploy should still receive a native-browser axe scan and manual forced-colors check.
- Browser zoom/reflow was validated at a 320 CSS-pixel viewport; a final production acceptance pass with an actual screen reader and OS-level forced-colors mode remains advisable.
- Map loading, image/media optimization, and other performance work remain intentionally deferred to Batch 5.

## Batch 5 — Performance, Core Web Vitals, and Media Pipeline

**Status: Implemented and locally validated on 2026-06-22.** The production build generated 136 responsive media files and seven self-hosted WOFF2 fonts. Static/a11y/performance gates passed; three-run Lighthouse medians were 94 mobile and 99 desktop with CLS 0. Deploy-preview baseline approval remains pending.

**Goal**

Reduce initial network/main-thread cost and make the likely LCP asset responsive and discoverable.

**Files to edit**

- `src/components/Hero.jsx`, `Gallery.jsx`, `Cabins.jsx`, `Story.jsx`, `FinalCTA.jsx`, `Footer.jsx`
- App/map lazy boundary
- Media data and optimized generated assets
- `index.html` or route head templates
- `src/styles.css`
- Build/CI performance configuration

**Exact changes**

1. Replace hero CSS background with semantic `<picture>` using mobile/desktop AVIF and WebP plus JPEG fallback, width/height, `srcset`, `sizes`, and `fetchpriority="high"`.
2. Generate responsive variants for all cabin/gallery images and include intrinsic dimensions.
3. Replace 2,000 px PNG logos with cleaned SVG or correctly sized optimized raster assets; remove embedded metadata/raster-heavy SVG exports.
4. Self-host the minimum WOFF2 font subsets/weights and configure metric-compatible fallbacks.
5. Dynamic-import Leaflet only when the map approaches viewport or the user requests it. Do not fetch OSM tiles before activation.
6. Delete unused/superseded CSS and split component styles. Remove unused public assets from the publish tree.
7. Add bundle/image budgets and Lighthouse CI thresholds based on an approved baseline.

**Testing required**

- Compare visual crops at all responsive breakpoints and high-density displays.
- Verify hero is the LCP element and loads with high priority; below-fold images remain lazy.
- Run Lighthouse mobile/desktop at least three times on a production-like preview and report medians.
- Confirm no CLS from images/fonts and no map code/tile requests before activation.
- Test slow 4G/CPU throttling, JavaScript-disabled content, and map failure fallback.
- Confirm built deployment and initial page transfer sizes against budgets.

**Risk level:** Medium. Asset crops and lazy boundaries can regress visual quality or map initialization.

**Rollback notes**

- Keep original source media outside the publish directory.
- Preserve JPEG fallbacks; roll back formats/crops independently per component.
- The lazy map must fall back to the static location card if chunk loading fails.

## Batch 6 — Security Headers, Provider Compliance, and Operational Reliability

**Status: Implemented and locally validated on 2026-06-22, with production activation steps pending.** CSP is report-only; HSTS is deliberately deferred until the canonical HTTPS host is confirmed. Error delivery requires a same-origin `VITE_ERROR_MONITORING_ENDPOINT`, the scheduled GitHub monitor requires repository variable `SITE_URL`, and Netlify response headers/CSP violations must be validated on a real deploy preview before enforcement.

**Goal**

Harden production delivery and make external conversion/location dependencies observable and recoverable.

**Files to edit**

- `netlify.toml`
- Map provider/configuration components
- Root error boundary and fallback components
- Privacy page/consent configuration
- CI/scheduled monitoring workflows

**Exact changes**

1. Add a tested CSP for self-hosted assets, analytics (after consent decision), OSM/tile provider, and required APIs; add `nosniff`, referrer policy, permissions policy, frame policy, and HSTS only after HTTPS/host confirmation.
2. Restore visible OpenStreetMap/provider attribution and confirm production tile usage terms. Replace the public community tile endpoint if volume/SLA requires it.
3. Add an app-level error boundary with direct booking and WhatsApp fallback.
4. Add production error monitoring with source maps handled securely and personal data scrubbing.
5. Add scheduled checks for home, all property URLs, booking links, map/directions links, sitemap/robots, and status-code correctness.
6. Publish privacy/cookie information and implement consent/withdrawal for non-essential tags actually used.
7. Add dependency update automation gated by the full test/build suite.

**Testing required**

- Validate headers on the actual Netlify preview/production response.
- Run CSP in report-only mode first; review violations, then enforce.
- Simulate blocked fonts, map tiles, analytics, and booking host; core content/contact fallbacks must remain usable.
- Trigger an intentional test error and confirm the user fallback and scrubbed monitoring event.
- Confirm unknown paths still return 404 after header/routing changes.

**Risk level:** Medium–High. An incorrect CSP can block critical assets or analytics.

**Rollback notes**

- Introduce CSP as `Content-Security-Policy-Report-Only`; enforce in a separate deploy after clean reports.
- Keep security header changes isolated so CSP can be rolled back without reverting routing or content.
- Booking and contact links must remain plain functional anchors even if monitoring/analytics fails.

## Release Order and Acceptance Gate

Recommended order: Batch 1 → Batch 2 → Batch 3 → Batch 4 → Batch 5 → Batch 6. Batch 4 may begin in parallel only after Batch 1 data consolidation is stable; accessibility fixes must ship before any new map/card design is declared complete.

Each batch is accepted only when:

- Production build passes from a clean `npm ci`.
- Automated lint, unit, browser, accessibility, and link checks pass at the level applicable to that batch.
- Desktop and mobile smoke tests pass.
- No business fact was invented or left inconsistent across card, page, schema, analytics, and booking destination.
- Rollback was rehearsed through a deploy preview or an isolated revertable commit.
