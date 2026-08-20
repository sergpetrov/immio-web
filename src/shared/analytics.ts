/**
 * Google Analytics 4 (gtag.js) configuration and server-rendered markup.
 *
 * Kept DOM-free so the Worker bundle can import it — the browser half lives
 * in react-app/analytics.ts, which compiles against the DOM lib.
 *
 * This is also the Firebase Analytics integration: Firebase Analytics for web
 * *is* GA4 — the `measurementId` in a Firebase web config is the same
 * `G-XXXXXXXXXX` used here, and events land in the same GA4 property. Loading
 * gtag.js directly rather than the Firebase SDK keeps ~45 KB of JS off a
 * marketing site that needs none of Firebase's other services.
 *
 * Configure with VITE_GA_MEASUREMENT_ID in .env.local (and in the deploy
 * environment). Unset — the default — means no analytics code is emitted at
 * all.
 *
 * There are two independent gates, because the ID has to be baked in at build
 * time and the same bundle then runs everywhere:
 *   1. build time  — no measurement ID configured, no markup emitted;
 *   2. run time    — the page is not on the production host, so nothing loads.
 * The second is what keeps `npm run dev`, `wrangler dev`, and preview
 * deployments out of the production property. Without it, every local page
 * load would be a real session in the reports.
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
 * `<head>` markup for the server-rendered pages. Returns "" when analytics is
 * not configured, so the tag never ships half-wired.
 *
 * gtag.js is injected by the guard rather than sitting in a static `<script
 * src>`, so a non-production host makes no request to Google at all — a
 * static tag would load and register the page before any check could run.
 * These pages are full document loads, so GA4's default page_view is correct
 * here; only the SPA routes send views manually.
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
