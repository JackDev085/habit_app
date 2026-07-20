// Utility for frontend logging & error recording

const LOG_KEY = "load_app_logs";

export function logError(source, error, extra = {}) {
  const timestamp = new Date().toISOString();
  const errorObj = {
    timestamp,
    source,
    message: error?.message || String(error),
    stack: error?.stack || null,
    extra,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
  };

  console.error(`[${source}]`, error, extra);

  try {
    const existing = JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
    existing.unshift(errorObj);
    // Keep last 25 entries
    const trimmed = existing.slice(0, 25);
    localStorage.setItem(LOG_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn("Could not save log to localStorage:", e);
  }
}

export function getLogs() {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

export function clearLogs() {
  try {
    localStorage.removeItem(LOG_KEY);
  } catch (e) {}
}

export function initGlobalErrorListeners() {
  if (typeof window === "undefined") return;

  window.addEventListener("error", (event) => {
    logError("WindowError", event.error || event.message, {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    logError("UnhandledRejection", event.reason);
  });
}
