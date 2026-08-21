/**
 * Site identity, shared by the worker pages, the SPA, and the build scripts.
 *
 * Canonical/OG URLs use SITE_ORIGIN rather than the request origin so preview
 * hosts never advertise themselves as canonical; `shouldIndexHost` noindexes
 * them to match.
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
 * `aggregateRating` for the MobileApplication schema. Owner-supplied, not
 * store-derived, and not rendered anywhere on the site — note that Google
 * expects a marked-up rating to be visible on the page carrying it. Anyone can
 * check these against the store, so keep them current:
 *   curl -s "https://itunes.apple.com/us/lookup?id=6747927306"
 * (that is one storefront; the worldwide figure is the count-weighted mean.)
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
