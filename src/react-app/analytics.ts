/** Browser half of the GA4 integration, for the SPA routes. Config: shared/analytics.ts. */

import { GA_MEASUREMENT_ID, analyticsAllowedForHost } from "../shared/analytics";

const GTAG_ORIGIN = "https://www.googletagmanager.com";

type GtagArgs = [command: string, ...rest: unknown[]];

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: GtagArgs) => void;
  }
}

/**
 * Page views are sent manually (`send_page_view: false`): the default fires on
 * load and then misses every client-side navigation.
 */
export function initClientAnalytics(): void {
  if (typeof window === "undefined") {
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
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}

export function trackPageView(path: string): void {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

/** mobile / tablet / desktop, mirroring the Rule Guide's inline detection. */
function deviceType(): string {
  const ua = navigator.userAgent || "";
  const w = window.innerWidth || document.documentElement.clientWidth || 0;
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return "tablet";
  if (/Mobi|iPhone|iPod|Android|Windows Phone/i.test(ua) || w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

/**
 * Custom event from the client-rendered routes. The Rule Guide fires its own
 * from an inline script (pageShell.ts) — this is the SPA half, and the two
 * must keep sending the same parameter names.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }
  window.gtag("event", name, { device_type: deviceType(), in_app: false, ...params });
}

export function trackAppDownload(platform: "ios" | "android", clickSource: string): void {
  trackEvent("app_download_click", { platform, source: clickSource });
}
