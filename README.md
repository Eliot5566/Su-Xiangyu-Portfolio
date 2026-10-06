# 蘇祥育 Eliot Su · Portfolio

Personal site of Eliot Su, full-stack engineer at MasterPiece (金全益).

- 中文：https://eliot5566.github.io/Su-Xiangyu-Portfolio/
- English: https://eliot5566.github.io/Su-Xiangyu-Portfolio/en/

## Structure

```
index.html                 中文首頁
en/index.html              English home
work/*.html                中文案例研究（generated）
en/work/*.html             English case studies (generated)
resume.html, en/resume.html  Résumé pages (generated)
files/                     Résumé PDFs
404.html                   Not-found page served by GitHub Pages
assets/css/site.css        All styles (light / dark tokens, layout, print)
assets/js/site.js          Theme, menu, scrollspy, quick menu, filters, GitHub feed
assets/fonts/              Self-hosted Noto Sans TC subsets (OFL)
scripts/                   Page generator and its content
images/                    Favicon, social images, project screenshots
```
index.html          中文首頁
en/index.html       English home
404.html            Not-found page served by GitHub Pages
assets/css/site.css All styles (light / dark tokens, layout, print)
assets/js/site.js   Theme toggle, menu, scrollspy, filters, copy-to-clipboard
images/             Favicon, social preview images, project screenshots
```

## Features

- Light / dark theme with a circular reveal transition, remembered per visitor
- Quick menu: press Ctrl K (⌘K on Mac) or / to jump to any section, project or action
- Live "Recently on GitHub" panel and star counts from the GitHub API (cached for an hour, static fallback)
- Project search and category filters, expandable certificates, copy-email and a mailto message composer
- Print / save-as-PDF résumé layout, English and Chinese pages, Open Graph images, sitemap and 404 page
- Motion respects prefers-reduced-motion

The home pages are plain HTML: edit them and push to `main`, and GitHub Pages publishes it.

Case studies and résumés are generated from `scripts/content.mjs` with no dependencies:

```bash
node scripts/build-pages.mjs
```

The script also redraws the architecture diagram inside the home pages between the `build:enterprise` markers. After changing the résumé, print `resume.html` and `en/resume.html` to PDF (A4) and replace the files in `files/`.

When you change content, update both `index.html` and `en/index.html` so the two languages stay in sync.

## Performance notes

- Chinese text uses a self-hosted Noto Sans TC subset containing only the characters on this site (about 135 KB per weight). After adding new Chinese text, rebuild it with `scripts/subset-fonts.mjs`; characters missing from the subset fall back to the system font.
- Every project image has WebP and 640px variants used by `<picture>`. After adding an image, run `scripts/optimize-images.mjs`.
- Sections below the fold use `content-visibility` during the first load and are fully rendered on the first interaction.

Both tools need a one-time `npm install --no-save` of their library; see the comment at the top of each script.
