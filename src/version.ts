// Set at build time by vite.config.ts.
declare const __APP_VERSION__: string;

/** Which build is rendering: the demo package's version (e.g. "1.0.3"), or "dev" and
 * the commit for a local build (e.g. "dev · 2a62b2c"). */
export const APP_VERSION = __APP_VERSION__;

/** The version as shown: "v1.0.3", or a dev build's as is. */
export function displayVersion(version: string = APP_VERSION): string {
  return /^\d/.test(version) ? `v${version}` : version;
}
