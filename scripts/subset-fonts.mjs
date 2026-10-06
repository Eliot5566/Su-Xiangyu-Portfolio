// Rebuilds the self-hosted Noto Sans TC subsets from every Chinese character the site uses.
//
// One-time setup (nothing is added to the repo):
//   npm install --no-save subset-font
//   curl -L -o NotoSansTC-VF.ttf "https://raw.githubusercontent.com/google/fonts/main/ofl/notosanstc/NotoSansTC%5Bwght%5D.ttf"
// Then run:
//   node scripts/subset-fonts.mjs path/to/NotoSansTC-VF.ttf
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const subsetFont = require("subset-font");
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "assets/fonts");
const SRC = process.argv[2];
if (!SRC || !fs.existsSync(SRC)) {
  console.error("Usage: node scripts/subset-fonts.mjs path/to/NotoSansTC-VF.ttf");
  process.exit(1);
}

function walk(dir, acc = []) {
  for (const f of fs.readdirSync(dir)) {
    if ([".git", ".claude", "node_modules", "fonts"].includes(f)) continue;
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(html|js|mjs)$/.test(f)) acc.push(p);
  }
  return acc;
}

const text = walk(ROOT).map((f) => fs.readFileSync(f, "utf8")).join("");
const cjk = /[⺀-⿿　-〿㄀-ㄯ㐀-䶿一-鿿豈-﫿︰-﹏＀-￯]/gu;
const extra = "，。、；：？！「」『』（）〔〕【】《》〈〉—…～‧·－＋／＝％＄";
const glyphs = [...new Set([...(text.match(cjk) || []), ...extra])].sort().join("");

const src = fs.readFileSync(SRC);
for (const weight of [400, 700, 900]) {
  const buf = await subsetFont(src, glyphs, { targetFormat: "woff2", variationAxes: { wght: weight } });
  fs.writeFileSync(path.join(OUT, `noto-sans-tc-${weight}.woff2`), buf);
  console.log(`noto-sans-tc-${weight}.woff2`, Math.round(buf.length / 1024) + " KB");
}
fs.writeFileSync(path.join(OUT, "glyphs.txt"), glyphs);
console.log([...glyphs].length, "glyphs");
