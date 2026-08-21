/**
 * GA4 config and the server-rendered `<head>` markup.
 *
 * This is also the Firebase Analytics integration — Firebase Analytics for web
 * *is* GA4, so a Firebase web config's `measurementId` is the value used here
 * and the `firebase` package is not needed.
 *
 * DOM-free so the Worker can import it; the browser half is react-app/analytics.ts.
 */

import { SITE_HOST } from "./site";

const GTAG_ORIGIN = "https://www.googletagmanager.com";

/**
 * Checked in on purpose. A GA4 measurement ID is a public identifier — it ships
 * in the page source of every site that uses it. It previously came from a
 * gitignored .env.local, which silently disabled analytics on any build that
 * ran elsewhere (Cloudflare Workers Builds has no .env.local). Dev and preview
 * traffic is kept out by `analyticsAllowedForHost`, not by hiding the ID.
 */
export const GA_MEASUREMENT_ID = "G-KVJFE2FFJ3";

/** Only the production host reports. Keeps dev and preview data out of GA4. */
export function analyticsAllowedForHost(hostname: string): boolean {
  return hostname === SITE_HOST;
}

/**
 * Google's canonical gtag.js snippet, verbatim.
 *
 * Emitted only when `enabled` — the caller passes the result of
 * `analyticsAllowedForHost`, so dev servers and preview deployments ship no
 * analytics markup at all rather than relying on a runtime check. That is what
 * lets this stay identical to the snippet in Google's own setup instructions.
 */
export function renderAnalyticsTags(enabled: boolean): string {
  if (!enabled) {
    return "";
  }

  const id = GA_MEASUREMENT_ID;

  return `<script async src="${GTAG_ORIGIN}/gtag/js?id=${encodeURIComponent(id)}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '${id}');
    </script>`;
}
