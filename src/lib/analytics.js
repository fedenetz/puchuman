const env = import.meta.env ?? {};

const ALLOWED_EVENTS = new Set([
  "begin_booking",
  "generate_lead",
  "click_email",
  "get_directions",
  "view_item",
  "select_item",
  "view_item_list",
  "view_map",
]);

const ALLOWED_PARAMETERS = new Set([
  "cta_location",
  "item_id",
  "item_name",
  "outbound_url",
]);

const measurementId = env.VITE_GA_MEASUREMENT_ID?.trim();
const analyticsEnabled =
  env.VITE_ANALYTICS_ENABLED === "true" &&
  /^G-[A-Z0-9]+$/i.test(measurementId ?? "");

let initialized = false;
const dispatchedOnce = new Set();
const CONSENT_KEY = "puchuman.analytics-consent";

export function getAnalyticsConsent() {
  if (typeof window === "undefined") return "pending";
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "granted" || value === "denied" ? value : "pending";
}

export function setAnalyticsConsent(value) {
  if (value !== "granted" && value !== "denied") return false;
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent("puchuman:analytics-consent"));
  if (value === "granted") initializeAnalytics();
  if (value === "denied" && window.gtag) {
    window.gtag("consent", "update", { analytics_storage: "denied" });
  }
  return true;
}

function safeOutboundUrl(value) {
  if (!value) return undefined;

  try {
    const url = new URL(value, window.location.origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return `${url.origin}${url.pathname}`;
  } catch {
    return undefined;
  }
}

function sanitizeParameters(parameters) {
  return Object.fromEntries(
    Object.entries(parameters)
      .filter(
        ([key, value]) =>
          ALLOWED_PARAMETERS.has(key) &&
          (typeof value === "string" || typeof value === "number"),
      )
      .map(([key, value]) => [
        key,
        key === "outbound_url" ? safeOutboundUrl(value) : value,
      ])
      .filter(([, value]) => value !== undefined && value !== ""),
  );
}

export function initializeAnalytics() {
  const testMode = window.__PUCHUMAN_ANALYTICS_TEST__ === true;
  if (
    initialized ||
    (!analyticsEnabled && !testMode) ||
    typeof window === "undefined" ||
    getAnalyticsConsent() !== "granted"
  )
    return;

  initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  window.gtag("js", new Date());
  window.gtag("config", measurementId);

  if (testMode) return;

  if (
    !document.querySelector(`script[data-ga-measurement-id="${measurementId}"]`)
  ) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.gaMeasurementId = measurementId;
    document.head.appendChild(script);
  }
}

export function trackEvent(eventName, parameters = {}) {
  if (
    (!analyticsEnabled && window.__PUCHUMAN_ANALYTICS_TEST__ !== true) ||
    getAnalyticsConsent() !== "granted" ||
    !ALLOWED_EVENTS.has(eventName)
  )
    return false;

  try {
    initializeAnalytics();
    window.gtag?.("event", eventName, sanitizeParameters(parameters));
    return true;
  } catch {
    return false;
  }
}

export function trackEventOnce(key, eventName, parameters = {}) {
  if (dispatchedOnce.has(key)) return false;
  const tracked = trackEvent(eventName, parameters);
  if (tracked) dispatchedOnce.add(key);
  return tracked;
}
