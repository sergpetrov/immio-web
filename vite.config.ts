import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import { renderCloudflareAssetHeaders } from "./src/shared/securityHeaders";

/**
 * Homepage `/` is served as a static asset, so CSP has to live in
 * `public/_headers` (Cloudflare copies that into `dist/client`). Fail the
 * build if it drifts from the Worker copy in `securityHeaders.ts`.
 */
function assertCloudflareAssetHeaders(): Plugin {
  return {
    name: "immio-assert-cloudflare-asset-headers",
    apply: "build",
    buildStart() {
      const actual = readFileSync(resolve("public/_headers"), "utf8").trim();
      const expected = renderCloudflareAssetHeaders().trim();
      if (actual !== expected) {
        throw new Error(
          "public/_headers is out of sync with src/shared/securityHeaders.ts. Update public/_headers to match renderCloudflareAssetHeaders().",
        );
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), cloudflare(), assertCloudflareAssetHeaders()],
});
