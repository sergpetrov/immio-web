/**
 * Browser half of the GA4 integration, for the client-rendered routes
 * (`/`, `/contact`). Configuration and the server-rendered `<head>` markup
 * live in shared/analytics.ts, which stays DOM-free so the Worker can import
 * it.
 */

import { GA_MEASUREMENT_ID, analyticsAllowedForHost, analyticsEnabled } from "../shared/analytics";

const GTAG_ORIGIN = "https://www.googletagmanager.com";

type GtagArgs = [command: string, ...rest: unknown[]];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArgs) => void;
  }
}

/**
 * Page views are sent manually (`send_page_view: false`) so the initial view
 * and later React Router navigations are each counted exactly once — the
 * default would fire on load and then miss every client-side navigation.
 */
export function initClientAnalytics(): void {
  if (!analyticsEnabled || typeof window === "undefined") {
    return;
  }
  // Dev servers and preview deployments run this same bundle; only the
  // production host is allowed to report.
  if (!analyticsAllowedForHost(window.location.hostname)) {
    return;
  }
  if (document.querySelector("script[data-immio-analytics]")) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `${GTAG_ORIGIN}/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  script.setAttribute("data-immio-analytics", "");
  document.head.appendChild(script);

  const dataLayer: unknown[] = window.dataLayer ?? [];
  window.dataLayer = dataLayer;
  window.gtag = function gtag(...args: GtagArgs) {
    dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true, send_page_view: false });
}

export function trackPageView(path: string): void {
  if (!analyticsEnabled || typeof window === "undefined" || !window.gtag) {
    return;
  }
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}
