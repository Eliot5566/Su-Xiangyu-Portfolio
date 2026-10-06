// Creates the WebP and 640px variants that <picture> elements expect for each project image.
//
// One-time setup: npm install --no-save sharp
// Usage:          node scripts/optimize-images.mjs            (all images in images/projects)
//                 node scripts/optimize-images.mjs new.jpg    (just one)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../images/projects");

const targets = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync(DIR).filter((f) => /\.jpg$/.test(f) && !/-640\.jpg$/.test(f));

for (const file of targets) {
  const base = path.join(DIR, file.replace(/\.jpg$/, ""));
  const src = `${base}.jpg`;
  await sharp(src).webp({ quality: 78 }).toFile(`${base}.webp`);
  await sharp(src).resize({ width: 640 }).webp({ quality: 76 }).toFile(`${base}-640.webp`);
  await sharp(src).resize({ width: 640 }).jpeg({ quality: 80, mozjpeg: true }).toFile(`${base}-640.jpg`);
  console.log("optimized", path.basename(src));
}
