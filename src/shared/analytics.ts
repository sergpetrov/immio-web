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
 * `<head>` markup for the server-rendered pages.
 *
 * gtag.js is injected by the host guard rather than sitting in a static
 * `<script src>` — a static tag would load and register the page view before
 * any check could run, putting dev and preview traffic into the property.
 */
export function renderAnalyticsTags(): string {
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
