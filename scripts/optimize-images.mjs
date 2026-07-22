import { glob, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const minimumSize = 50 * 1024;
const imagePaths = [];

for await (const imagePath of glob(
  "assets/source-images/**/*.{jpg,jpeg,png}",
)) {
  if ((await stat(imagePath)).size >= minimumSize) imagePaths.push(imagePath);
}

const results = await Promise.all(
  imagePaths.map(async (sourcePath) => {
    const outputPath = sourcePath
      .replace("assets/source-images", "public/images")
      .replace(/\.(?:jpe?g|png)$/i, ".webp");
    const sourceSize = (await stat(sourcePath)).size;

    await sharp(sourcePath).webp({ quality: 82, effort: 6 }).toFile(outputPath);

    const outputSize = (await stat(outputPath)).size;
    return { sourcePath, outputPath, sourceSize, outputSize };
  }),
);

const totalSourceSize = results.reduce((sum, item) => sum + item.sourceSize, 0);
const totalOutputSize = results.reduce((sum, item) => sum + item.outputSize, 0);

console.table(
  results.map(({ sourcePath, outputPath, sourceSize, outputSize }) => ({
    source: path.relative("assets/source-images", sourcePath),
    output: path.relative("public", outputPath),
    beforeKb: Math.round(sourceSize / 1024),
    afterKb: Math.round(outputSize / 1024),
  })),
);
console.log(
  `Optimized ${results.length} images: ${Math.round(totalSourceSize / 1024)} KB → ${Math.round(totalOutputSize / 1024)} KB`,
);
