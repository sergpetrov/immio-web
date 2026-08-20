/**
 * Canonical identity of the site, shared by the worker-rendered pages, the
 * client SPA, and the build-time asset scripts.
 *
 * Canonical/OG URLs deliberately use SITE_ORIGIN rather than the request's own
 * origin: preview deployments and *.workers.dev hosts must never advertise
 * themselves as canonical, or they end up competing with production in the
 * index. `shouldIndexHost` covers the other half of that — those hosts get a
 * noindex instead.
 */

export const SITE_ORIGIN = "https://immio.app";
export const SITE_HOST = "immio.app";
export const SITE_NAME = "Immio";
export const SITE_TAGLINE = "Tax Residency & Travel Day Tracker";
export const SUPPORT_EMAIL = "support@immio.app";

/** Kept under 160 characters so it survives untruncated as a meta description. */
export const SITE_DESCRIPTION =
  "Track days across countries and stay inside tax residency, visa, and immigration limits. Automatic trip tracking, threshold alerts, private by design.";

export const DEFAULT_OG_IMAGE_PATH = "/og/immio-default.png";
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const DEFAULT_OG_IMAGE_ALT = "Immio — track your days across countries and stay within tax and visa limits.";

export const LOGO_PATH = "/logo.svg";

/**
 * Public profiles for the Organization schema's `sameAs`. Only add profiles
 * Immio actually controls — sameAs pointing at unowned accounts is a trust
 * signal that works against you.
 */
export const SOCIAL_PROFILES: string[] = [];

/**
 * App rating for the MobileApplication schema's `aggregateRating`.
 *
 * `ratingValue` is owner-supplied, not derived from a store API. For
 * reference, the public App Store lookup API on 2026-08-20 gave a worldwide
 * count-weighted average of 4.619 across 21 ratings (gb 4.889×9, us 4.625×8,
 * ca 1.0×1, tr/cy/ru 5.0×1) — individual storefronts vary widely, GB alone
 * reading 4.9. `ratingCount` is the API figure, since a count is required for
 * valid markup.
 *
 * Two things to keep in mind when changing this:
 *  - The value is not currently rendered anywhere on the site. Google's
 *    structured-data guidelines expect a marked-up rating to be visible on the
 *    page carrying the markup.
 *  - Whatever is published here is checkable by anyone against the store, so
 *    keep it close to reality and refresh it when the store numbers move:
 *      curl -s "https://itunes.apple.com/us/lookup?id=6747927306"
 */
export const APP_STORE_RATING = "4.8";
export const APP_STORE_RATING_COUNT = 100;

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_ORIGIN).toString();
}

/** Production is the only host allowed into the index. */
export function shouldIndexHost(host: string): boolean {
  return host === SITE_HOST;
}
