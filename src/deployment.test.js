import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const vercelConfig = JSON.parse(readFileSync("vercel.json", "utf8"));
const packageManifest = JSON.parse(readFileSync("package.json", "utf8"));

describe("deployment configuration", () => {
  it("declares the Vercel schema and SPA fallback", () => {
    expect(vercelConfig.$schema).toBe("https://openapi.vercel.sh/vercel.json");
    expect(vercelConfig.rewrites).toContainEqual({
      source: "/(.*)",
      destination: "/index.html",
    });
  });

  it("sets baseline security headers for every route", () => {
    const globalHeaders = vercelConfig.headers?.find(
      ({ source }) => source === "/(.*)",
    )?.headers;

    expect(globalHeaders).toEqual(
      expect.arrayContaining([
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "DENY" },
      ]),
    );
  });

  it("caches fingerprinted build assets immutably", () => {
    const assetHeaders = vercelConfig.headers?.find(
      ({ source }) => source === "/assets/(.*)",
    )?.headers;

    expect(assetHeaders).toContainEqual({
      key: "Cache-Control",
      value: "public, max-age=31536000, immutable",
    });
  });

  it("ships crawl directives for production", () => {
    expect(existsSync("public/robots.txt")).toBe(true);
  });

  it("pins a supported Node runtime and provides a CI quality gate", () => {
    expect(packageManifest.engines?.node).toBe("^22.13.0 || >=24.0.0");
    expect(packageManifest.scripts?.check).toBeTruthy();
    expect(existsSync(".github/workflows/ci.yml")).toBe(true);
  });
});
