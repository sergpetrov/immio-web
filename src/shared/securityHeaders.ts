/**
 * HTTP security headers shared by Worker-rendered pages and static assets.
 *
 * Static files (including `/`) skip the Worker; Cloudflare reads `public/_headers`
 * for those. Keep that file identical to `renderCloudflareAssetHeaders()`.
 *
 * `'unsafe-inline'` is required for `script-src` and `style-src`: the Rule Guide
 * ships many inline boot scripts, JSON-LD and the GA4 snippet are inline, and
 * React sets inline styles on the SPA. Hashes/nonces would need a per-request
 * Worker rewrite of every HTML page.
 */
export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://www.googletagmanager.com https://*.google-analytics.com",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

export const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": CONTENT_SECURITY_POLICY,
  // CSP `frame-ancestors 'none'` is the modern clickjacking control; this
  // duplicate exists because scanners still look for the legacy header.
  "X-Frame-Options": "DENY",
};

/** Cloudflare `_headers` file body for static asset responses. */
export function renderCloudflareAssetHeaders(): string {
  const rules = Object.entries(SECURITY_HEADERS)
    .map(([name, value]) => `  ${name}: ${value}`)
    .join("\n");
  return `/*\n${rules}\n`;
}
