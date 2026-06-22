# Owner Go-Live Checklist

This checklist contains facts and decisions that cannot be safely inferred from the website code. “Confirm” means provide an explicit written answer and, where relevant, a source URL/document. Unsupported facts should be omitted rather than guessed.

## Critical Before Publishing

| Needed input | Owner decision required | Where it affects the site | Risk if missing | Recommended answer format |
|---|---|---|---|---|
| Canonical production origin and preferred hostname | **Still required before production.** Choose the one HTTPS origin and redirect policy (`www` or apex) | Canonicals, OG URLs, sitemap, robots, schema IDs, monitoring, HSTS | Localhost/Netlify subdomain can be indexed; duplicate-host signals; broken monitoring | `Preferred origin: https://…; redirect https://other-host → preferred; HTTPS confirmed: yes/no` |
| Exact public business name | **Still required before production.** State public brand and legal/operator name if different | Header/footer, titles, `LodgingBusiness`, privacy/controller identity | Misidentification and weak trust/legal disclosure | `Public name: …; legal/operator name: …; registration/tax ID if intended: …` |
| Street and postal address | **Required but can publish with omission.** Confirm whether a precise address may be public | Contact page, business schema, directions | Wrong guest arrival information/privacy exposure; incomplete schema | `Public address: street, number, locality, region, postal code, country` or `Do not publish street address; show locality only` |
| Phone and call availability | **Still required before production.** Confirm the number, WhatsApp ownership, and whether calls are accepted | Footer/contact/mobile CTA, possible `tel:` event/schema | Guests may call an unsupported number; misleading contact channel | `WhatsApp: +56…; calls accepted: yes/no; call hours/timezone: …` |
| Operator/host identity and privacy contact | **Still required before production.** Name the responsible operator/data controller and one approved email | Privacy page, trust content, error/analytics governance | Incomplete privacy/controller disclosure; current email contradiction | `Operator/controller: …; privacy email: …; general email: …` |
| Verified facts for each unit | **Still required before production.** Confirm name, type, guest capacity, bedrooms, bathrooms, units, amenities, parking/kitchen, and assigned photos | Cards, detail pages, map, schema, analytics labels, booking links | Materially misleading accommodation listing/schema | One row per slug: `slug | approved name | guests | bedrooms | bathrooms | units | included amenities | approved image IDs` |
| Verified coordinates and Maps destination for each unit | **Still required before production.** Confirm exact pin and short URL ownership | Interactive map, direction links, arrival journey | Guests sent to wrong property; privacy/safety issue | `slug | latitude (6 decimals) | longitude (6 decimals) | approved Google Maps URL` |
| Reservation/policy rules | **Still required before production.** Approve every current time, deadline, surcharge, fine, guarantee, refund deduction, and heater rule | FAQ, policy route, FAQ schema, booking expectations | Financial/legal disputes and misleading schema | Mark each current rule `approved / replace with … / remove`, with effective date |
| GoFeels property links and account ownership | **Still required before production.** Confirm master URL and room IDs 4056, 4140, 4058, 4430, 4431 | Every primary conversion CTA and monitoring | Reservations may go to wrong/stale inventory | `Master URL approved: yes/no; slug | GoFeels room URL | active: yes/no` |

## Required Before Enabling SEO Schema Fully

| Needed input | Owner decision required | Where it affects the site | Risk if missing | Recommended answer format |
|---|---|---|---|---|
| Preferred hostname | **Still required before production** | All JSON-LD IDs/URLs and canonical graph | Schema points to temporary/local origin | Exact HTTPS origin |
| Public business/operator identity | **Still required before production** | `LodgingBusiness.name`, privacy/controller, `sameAs` | Entity ambiguity | Approved public name and operator name |
| Address publication level | **Required but can publish with locality-only omission** | `PostalAddress` | False or overly precise address | Full approved fields or explicit locality-only instruction |
| Verified unit coordinates | **Still required before production if geo is added; currently omitted from schema** | Future `geo` per Accommodation; current visible map | False structured/location data | Per-unit latitude/longitude plus verification source/date |
| Verified amenities and occupancy | **Still required before production** | `Accommodation.occupancy` and `amenityFeature` | Search engines receive unsupported claims | Per-unit approved occupancy and amenity list |
| Exact public phone | **Required but can publish with omission; currently absent from schema** | Business contact schema | Lost rich entity information or wrong number | E.164 number and call/WhatsApp designation |
| Aggregate rating/count | **Required but can publish with omission.** Do not add unless independently verifiable | Potential rating schema and trust content | Spam-policy/manual-action risk | `Source URL | rating | count | retrieval date | permission`; otherwise `Do not publish` |
| Review source permission and dates | **Still required before publishing current reviews as endorsed testimonials** | Testimonial cards and future review schema | Copyright/permission/provenance risk | Per review: `handle | original post URL | date | permission yes/no | approved quote` |

## Required Before Showing Pricing

| Needed input | Owner decision required | Where it affects the site | Risk if missing | Recommended answer format |
|---|---|---|---|---|
| Authoritative rate source | **Still required; current site appropriately omits prices** | Cards/details/schema/analytics values | Stale or false advertised rates | `Source system/owner: …; API/feed/manual: …; update owner/frequency: …` |
| Taxes and mandatory fees | **Still required before any displayed price** | Price disclosure and booking expectation | Drip pricing/consumer dispute | `Tax included: yes/no + rate; mandatory fee name/amount/basis; refundable deposit: …` |
| Minimum stays | **Still required before any displayed price/availability claim** | Detail pages, seasonal notices, booking policies | Unbookable advertised offer | `Date/season | unit | minimum nights | exceptions` |
| Accepted payment methods | **Still required** | Policy/detail/trust content | Checkout abandonment and inaccurate promises | Approved list plus payment timing/deposit rules |
| “Desde” synchronization | **Still required before using “desde”** | Cards, metadata, ads | Stale bait price | `Use “desde”: yes/no; source; refresh frequency; owner; fallback when unavailable` |
| Currency and price analytics | **Required but can remain omitted** | `begin_booking`/future revenue events | Misleading analytics value | `Currency: CLP/…; send value only when sourced from …` |

## Required Before Publishing Reviews

| Needed input | Owner decision required | Where it affects the site | Risk if missing | Recommended answer format |
|---|---|---|---|---|
| Permission to quote each review | **Still required before production** | Three Instagram testimonials | Unauthorized reuse | Per handle: `Permission obtained yes/no, date, evidence location` |
| Original review/post URL | **Still required; profile links are insufficient provenance** | Source links | Visitors cannot verify quote | Exact post/comment URL per quote |
| Review date | **Still required or explicitly keep “fecha no disponible”** | Testimonial disclosure | Stale/ambiguous trust evidence | ISO date `YYYY-MM-DD` or `Unknown—retain disclosure` |
| Editing approval | **Still required** | Quote punctuation/wording | Misquotation | `Exact approved quote: “…”` |
| Aggregate rating and count | **Required but can publish with omission; currently omitted** | Trust block/schema | Unsupported rating claim | Verifiable source URL, rating, count, as-of date, permission |

## Required Before Enabling Production Analytics

| Needed input | Owner decision required | Where it affects the site | Risk if missing | Recommended answer format |
|---|---|---|---|---|
| Production GA4 property/measurement ID | **Already defined in code, but placement must change.** Confirm account ownership and deployment-variable use | Analytics loader and reporting | Data sent to wrong property; hardcoded environment config | `GA4 property owner: …; measurement ID: G-…; configure in host env: approved yes/no` |
| Analytics enablement and consent markets | **Still required before production** | Banner, loader, privacy text | Noncompliant collection or missing measurement | `Launch markets: …; analytics legal basis/consent required: …; approver/date: …` |
| Data retention and access owners | **Still required** | GA4 admin/privacy disclosure | Excess retention/unauthorized access | `Retention: … months; admins: …; review cadence: …` |
| Required launch events | **Still required** | Event allowlist and E2E tests | Incomplete funnel/reporting | Approve launch list: `begin_booking, generate_lead, click_email, get_directions, select_item, view_item, view_item_list, view_map, …` |
| GoFeels cross-domain GA4 support | **Still required** | Linker/cross-domain configuration | Sessions/campaigns split at booking engine | `Supported yes/no; required domains; vendor documentation/contact/date` |
| GoFeels campaign-parameter support | **Still required** | UTM/gclid preservation | Paid traffic attribution lost | `Parameters preserved: list; test URL/result; vendor confirmation date` |
| GoFeels callback/webhook support | **Still required** | Reliable `booking_complete` | False conversions or no revenue attribution | `Callback/webhook supported yes/no; documentation; fields; auth; privacy terms` |
| Confirmed thank-you URL | **Still required** | Client conversion trigger/funnel QA | Completion cannot be distinguished from booking intent | Exact URL/pattern and whether it is on owned or GoFeels domain |
| Error monitoring project/endpoint/DSN | **Required but can publish with omission.** Current client endpoint is unset | Error reporting and CSP/privacy | Silent failures if omitted; data governance risk if guessed | `Provider/project: …; same-origin endpoint: …; retention: …; PII scrub approval: …`; or `Disabled at launch` |

## Required Before Advertising Traffic

| Needed input | Owner decision required | Where it affects the site | Risk if missing | Recommended answer format |
|---|---|---|---|---|
| Confirmed production domain and redirects | **Still required** | Ad destinations, canonicals, analytics, monitor | Spend sent to temporary/wrong host | Preferred HTTPS URL and redirect matrix |
| Paid-media tags/tools | **Still required** | Consent/CSP/privacy/tag manager | Undisclosed tracking or blocked campaigns | `Platforms: …; tag IDs: …; markets: …; consent categories: …` |
| Privacy/consent requirements for target markets | **Still required** | Banner language, blocking behavior, records | Regulatory/reputation risk | Country/market list plus legal/privacy approver decision |
| Campaign parameter preservation through GoFeels | **Still required** | Attribution | Paid conversions become unattributed | Vendor-confirmed list and end-to-end test evidence |
| Booking-complete mechanism | **Still required** | Conversion bidding/ROAS | Optimizing ads to outbound clicks instead of bookings | Confirmed callback/webhook/thank-you design; never infer purchase from `begin_booking` |
| Final rates/fees/availability claims used in ads | **Still required** | Landing copy and ads | Misleading advertising | Approved offer sheet with validity dates and inventory constraints |
| Conversion and privacy QA owner | **Still required** | Launch operations | Broken tags go unnoticed | `Named owner | backup | launch test checklist | alert channel` |

## Nice To Have

| Needed input | Owner decision required | Where it affects the site | Risk if missing | Recommended answer format |
|---|---|---|---|---|
| Verified walking/driving distance per unit | **Required but can publish with omission; current “a una cuadra” should be removed unless confirmed** | Detail pages, FAQ, map, ads | Misleading proximity claim | `slug | destination | mode | distance | typical time | source/date` |
| Kayak/bicycle/service classification | **Required but can publish with explicit omission/qualification.** Current copy says unconfirmed | Experiences/detail content | Guests assume inclusion | Per item: `included / nearby third party / seasonal / paid / unavailable`, provider and dates |
| Parrilla/quincho details | **Still required because current copy says included** | FAQ/experiences/amenities | Guest expectation mismatch | `Included yes/no; shared/private; seasonal; booking/cost; unit applicability` |
| Final OSM/tile provider decision | **Still required before material traffic growth** | Interactive map/CSP/provider terms | Community-tile policy/SLA risk | `Provider: …; plan/license: …; attribution text: …; expected monthly map loads: …` |
| Property-specific galleries | **Required but can publish with one approved image** | Detail-page confidence/image SEO | Lower conversion, not a correctness failure | `slug | approved image files | alt/caption | photographer/rights` |
| Accessibility contact/accommodation information | **Required but can publish with omission** | Property details and support | Guests cannot assess suitability | Per unit: step access, door widths, bathroom access, parking path, assistance contact |
| Wi-Fi/heating/bed configuration | **Required but can publish with current “ask before booking” qualification** | Detail decision content | More support questions/booking uncertainty | Per unit structured inventory with inclusions, limits and seasonality |
