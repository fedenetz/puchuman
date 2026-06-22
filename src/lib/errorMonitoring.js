const endpoint = import.meta.env?.VITE_ERROR_MONITORING_ENDPOINT?.trim();
let initialized = false;

function safeMessage(error) {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/https?:\/\/[^\s]+/g, "[url]").slice(0, 300);
}

export function reportError(error, source = "window") {
  if (!endpoint || typeof navigator === "undefined") return false;

  try {
    const body = JSON.stringify({
      source,
      name: error instanceof Error ? error.name : "Error",
      message: safeMessage(error),
      release: import.meta.env?.VITE_APP_RELEASE || "unknown",
      page: window.location.pathname,
    });
    return navigator.sendBeacon(
      endpoint,
      new Blob([body], { type: "application/json" }),
    );
  } catch {
    return false;
  }
}

export function initializeErrorMonitoring() {
  if (initialized || !endpoint || typeof window === "undefined") return;
  initialized = true;
  window.addEventListener("error", (event) =>
    reportError(event.error || event.message, "window_error"),
  );
  window.addEventListener("unhandledrejection", (event) =>
    reportError(event.reason, "unhandled_rejection"),
  );
}
