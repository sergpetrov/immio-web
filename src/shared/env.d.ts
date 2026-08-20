/// <reference types="vite/client" />

/**
 * Build-time configuration. Both are public identifiers, not secrets — they
 * are inlined into the client bundle and the server-rendered HTML. Leaving
 * either unset simply omits the corresponding tags, which is what keeps local
 * and preview builds out of the production analytics property.
 */
interface ImportMetaEnv {
  /** GA4 / Firebase Analytics measurement ID, e.g. "G-XXXXXXXXXX". */
  readonly VITE_GA_MEASUREMENT_ID?: string;
  /** Google Search Console HTML-tag verification token. Prefer DNS TXT. */
  readonly VITE_GOOGLE_SITE_VERIFICATION?: string;
}
