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

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_ORIGIN).toString();
}

/** Production is the only host allowed into the index. */
export function shouldIndexHost(host: string): boolean {
  return host === SITE_HOST;
}
