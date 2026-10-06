# 蘇祥育 Eliot Su · Portfolio

Personal site of Eliot Su, full-stack engineer at MasterPiece (金全益).

- 中文：https://eliot5566.github.io/Su-Xiangyu-Portfolio/
- English: https://eliot5566.github.io/Su-Xiangyu-Portfolio/en/

## Structure

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

No build step and no dependencies: edit the HTML and push to `main`, and GitHub Pages publishes it.

When you change content, update both `index.html` and `en/index.html` so the two languages stay in sync.
