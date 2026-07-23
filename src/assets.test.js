import { existsSync, readFileSync } from "node:fs";
import { globSync } from "node:fs";
import { JSDOM } from "jsdom";
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

  it("keeps form labels and document ids valid", () => {
    const invalidMarkup = sourceFiles
      .filter((file) => file.endsWith(".html"))
      .flatMap((file) => {
        const document = new JSDOM(readFileSync(file, "utf8")).window.document;
        const ids = [...document.querySelectorAll("[id]")].map(
          (element) => element.id,
        );
        const duplicateIds = ids.filter(
          (id, index) => ids.indexOf(id) !== index,
        );
        const brokenLabels = [...document.querySelectorAll("label[for]")]
          .filter(
            (label) =>
              !label.htmlFor || !document.getElementById(label.htmlFor),
          )
          .map((label) => `label[for="${label.htmlFor}"]`);

        return [...new Set([...duplicateIds, ...brokenLabels])].map(
          (issue) => `${file}: ${issue}`,
        );
      });

    expect(invalidMarkup).toEqual([]);
  });
});
