export const IMMIO_APP_STORE_URL = "https://apps.apple.com/gb/app/tax-residency-tracker-immio/id6747927306";
export const IMMIO_GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.immio.app";

/** Shared by the client (navigator.userAgent) and the worker (request User-Agent header). */
export function getAppDownloadUrlForUserAgent(userAgent: string): string {
  if (/Android/i.test(userAgent)) {
    return IMMIO_GOOGLE_PLAY_URL;
  }
  return IMMIO_APP_STORE_URL;
}
