export const IMMIO_APP_STORE_URL = "https://apps.apple.com/gb/app/tax-residency-tracker-immio/id6747927306";
export const IMMIO_GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=com.immio.app";

/**
 * TEMPORARY: Android downloads are paused -- the Play badge is hidden and every
 * "Get the app" link points at the App Store, on Android devices too. Set back
 * to true to restore Play links and the badge.
 */
export const ANDROID_STORE_ENABLED = false;

/** Shared by the client (navigator.userAgent) and the worker (request User-Agent header). */
export function getAppDownloadUrlForUserAgent(userAgent: string): string {
  if (ANDROID_STORE_ENABLED && /Android/i.test(userAgent)) {
    return IMMIO_GOOGLE_PLAY_URL;
  }
  return IMMIO_APP_STORE_URL;
}
