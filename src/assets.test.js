import { existsSync, readFileSync } from "node:fs";
import { globSync } from "node:fs";
import { describe, expect, it } from "vitest";

const sourceFiles = globSync("src/{content,styles}/**/*.{html,scss}");

const readSources = () =>
  sourceFiles.map((file) => ({ file, content: readFileSync(file, "utf8") }));

describe("public assets", () => {
  it("uses root-relative URLs for assets served from public", () => {
    const invalidReferences = readSources().flatMap(({ file, content }) =>
      [...content.matchAll(/\.\.\/\.\.\/(?:images|icons)\/[^)'"\s]+/g)].map(
        ([reference]) => `${file}: ${reference}`,
      ),
    );

    expect(invalidReferences).toEqual([]);
  });

  it("resolves every root-relative image, icon, font, and video URL", () => {
    const missingAssets = readSources().flatMap(({ file, content }) =>
      [
        ...content.matchAll(
          /["'(](\/(?:images|icons|fonts|videos)\/[^"')]+)["')]/g,
        ),
      ]
        .map(([, reference]) => reference.replace(/\\ /g, " "))
        .filter((reference) => !existsSync(`public${reference}`))
        .map((reference) => `${file}: ${reference}`),
    );

    expect(missingAssets).toEqual([]);
  });
});
