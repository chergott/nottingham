import react from "@vitejs/plugin-react";
import { execFileSync } from "node:child_process";
import { defineConfig } from "vite";

/**
 * The version shown in the nav (src/version.ts): NOTTINGHAM_VERSION when set (the demo
 * package's version, from its workflow), otherwise "dev" and the commit.
 */
function appVersion(): string {
  if (process.env.NOTTINGHAM_VERSION) return process.env.NOTTINGHAM_VERSION;
  try {
    const commit = execFileSync("git", ["rev-parse", "--short", "HEAD"]).toString().trim();
    return `dev · ${commit}`;
  } catch {
    return "dev";
  }
}

// `npm run dev` serves the app on :5174 (Job Hunter's dev server has :5173).
export default defineConfig({
  plugins: [react()],
  define: { __APP_VERSION__: JSON.stringify(appVersion()) },
  server: { port: 5174 },
});
