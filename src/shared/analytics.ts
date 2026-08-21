/**
 * GA4 config and server-rendered markup. Set VITE_GA_MEASUREMENT_ID to enable.
 *
 * This is also the Firebase Analytics integration — Firebase Analytics for web
 * *is* GA4, so a Firebase web config's `measurementId` is the value to use here
 * and the `firebase` package is not needed.
 *
 * DOM-free so the Worker can import it; the browser half is react-app/analytics.ts.
 */

import { SITE_HOST } from "./site";

const GTAG_ORIGIN = "https://www.googletagmanager.com";

export const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID ?? "").trim();

/**
 * Google Search Console HTML-tag verification. Prefer DNS TXT verification —
 * it survives redesigns and covers every subdomain and protocol — and leave
 * this unset unless DNS is unavailable.
 */
export const GOOGLE_SITE_VERIFICATION = (import.meta.env.VITE_GOOGLE_SITE_VERIFICATION ?? "").trim();

/** GA4 measurement IDs are `G-` followed by an alphanumeric ID. */
export function isValidMeasurementId(id: string): boolean {
  return /^G-[A-Z0-9]+$/i.test(id);
}

export const analyticsEnabled = isValidMeasurementId(GA_MEASUREMENT_ID);

/** Only the production host reports. Keeps dev and preview data out of GA4. */
export function analyticsAllowedForHost(hostname: string): boolean {
  return hostname === SITE_HOST;
}

/**
 * `<head>` markup for the server-rendered pages; "" when unconfigured.
 *
 * gtag.js is injected by the host guard rather than sitting in a static
 * `<script src>` — a static tag would load and register the page view before
 * any check could run, putting dev and preview traffic into the property.
 */
export function renderAnalyticsTags(): string {
  if (!analyticsEnabled) {
    return "";
  }

  const id = JSON.stringify(GA_MEASUREMENT_ID);
  const host = JSON.stringify(SITE_HOST);
  const src = JSON.stringify(`${GTAG_ORIGIN}/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`);

  return `<link rel="preconnect" href="${GTAG_ORIGIN}" />
    <script>
      (function () {
        if (location.hostname !== ${host}) return;
        var s = document.createElement("script");
        s.async = true;
        s.src = ${src};
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        // Google's own snippet writes a bare \`dataLayer.push\`, relying on
        // \`window.x = …\` creating a global binding. Addressing it through
        // \`window\` explicitly does the same thing without that assumption.
        function gtag(){window.dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', ${id}, { anonymize_ip: true });
      })();
    </script>`;
}

/** Search Console's HTML-tag verification meta, when DNS verification isn't used. */
export function renderSiteVerificationTag(): string {
  if (!GOOGLE_SITE_VERIFICATION) {
    return "";
  }
  const content = GOOGLE_SITE_VERIFICATION.replace(/"/g, "&quot;");
  return `<meta name="google-site-verification" content="${content}" />`;
}
