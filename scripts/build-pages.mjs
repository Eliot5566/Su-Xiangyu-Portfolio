// Generates the case-study and résumé pages from scripts/content.mjs.
// Usage: node scripts/build-pages.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CASES, RESUME, enterpriseFigure } from "./content.mjs";
import { esc, picture } from "./lib.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://eliot5566.github.io/Su-Xiangyu-Portfolio/";
const EMAIL = "a7868783@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/eliot-su-6a834227b/";
const GITHUB = "https://github.com/Eliot5566";

const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const write = (p, s) => {
  fs.mkdirSync(path.dirname(path.join(ROOT, p)), { recursive: true });
  fs.writeFileSync(path.join(ROOT, p), s);
  console.log("wrote", p);
};

const FONTS = "https://fonts.googleapis.com/css2?family=Inter:wght@400..900&display=swap";
const FONTS_MONO = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=optional";
const SPRITE = read("index.html").match(/<svg width="0" height="0"[\s\S]*?<\/svg>/)[0];

const T = {
  zh: {
    htmlLang: "zh-Hant",
    ogLocale: "zh_TW",
    siteName: "蘇祥育 Eliot Su",
    skip: "跳到主要內容",
    brandLabel: "蘇祥育 Eliot Su，回到首頁",
    brand: "蘇祥育<small>Eliot Su</small>",
    nav: [
      ["#about", "關於"],
      ["#experience", "經歷"],
      ["#work", "作品"],
      ["#skills", "技能"],
      ["#contact", "聯絡"],
    ],
    navLabel: "主要導覽",
    paletteBtn: "開啟快速選單",
    langLabel: "Switch to English",
    langText: "EN",
    langAttr: "en",
    theme: "切換深色模式",
    cta: "聯絡我",
    menu: "開啟選單",
    caseLabel: "案例研究",
    work: "作品",
    toc: "本頁內容",
    source: "原始碼",
    prev: "上一個案例",
    next: "下一個案例",
    allWork: "所有作品",
    footer: "手寫 HTML / CSS / JS，部署於 GitHub Pages",
    footerHint: "按 <kbd data-shortcut-hint>Ctrl K</kbd> 開啟快速選單",
    topLabel: "回到頁首",
    copied: "已複製 Email",
    resumeTitle: "履歷",
    resumeDesc: "蘇祥育 Eliot Su 的履歷：全端工程師，ERP / WMS 整合與企業流程數位化。",
    pdf: "下載 PDF",
    print: "列印",
    backHome: "回到作品集",
    website: "作品集網站",
    caseStudy: "案例研究",
  },
  en: {
    htmlLang: "en",
    ogLocale: "en_US",
    siteName: "Eliot Su",
    skip: "Skip to content",
    brandLabel: "Eliot Su, back to home",
    brand: "Eliot Su<small>蘇祥育</small>",
    nav: [
      ["#about", "About"],
      ["#experience", "Experience"],
      ["#work", "Work"],
      ["#skills", "Skills"],
      ["#contact", "Contact"],
    ],
    navLabel: "Main",
    paletteBtn: "Open quick menu",
    langLabel: "切換到中文",
    langText: "中",
    langAttr: "zh-Hant",
    theme: "Toggle dark mode",
    cta: "Get in touch",
    menu: "Open menu",
    caseLabel: "Case study",
    work: "Work",
    toc: "On this page",
    source: "Source",
    prev: "Previous case study",
    next: "Next case study",
    allWork: "All work",
    footer: "Hand-written HTML / CSS / JS, hosted on GitHub Pages",
    footerHint: "Press <kbd data-shortcut-hint>Ctrl K</kbd> for the quick menu",
    topLabel: "Back to top",
    copied: "Email copied",
    resumeTitle: "Résumé",
    resumeDesc: "Résumé of Eliot Su, full-stack engineer working on ERP / WMS integration and workflow digitization.",
    pdf: "Download PDF",
    print: "Print",
    backHome: "Back to portfolio",
    website: "Portfolio",
    caseStudy: "Case study",
  },
};

/* ---------- Shared chrome ---------- */

function head({ lang, title, description, pagePath, zhPath, enPath, ogImage, ogType = "website", base, jsonld }) {
  const t = T[lang];
  return `<!DOCTYPE html>
<html lang="${t.htmlLang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="author" content="${lang === "zh" ? "蘇祥育 Eliot Su" : "Eliot Su"}" />
    <link rel="canonical" href="${SITE}${pagePath}" />
    <link rel="alternate" hreflang="zh-Hant" href="${SITE}${zhPath}" />
    <link rel="alternate" hreflang="en" href="${SITE}${enPath}" />
    <link rel="alternate" hreflang="x-default" href="${SITE}${zhPath}" />

    <meta property="og:type" content="${ogType}" />
    <meta property="og:locale" content="${t.ogLocale}" />
    <meta property="og:site_name" content="${t.siteName}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${SITE}${pagePath}" />
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />

    <meta name="theme-color" content="#fafaf7" media="(prefers-color-scheme: light)" />
    <meta name="theme-color" content="#0d1014" media="(prefers-color-scheme: dark)" />
    <link rel="icon" href="${base}images/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="${base}images/apple-touch-icon.png" />
    <link rel="manifest" href="${base}manifest.webmanifest" />

    <script>
      document.documentElement.classList.add("js");
      try {
        var t = localStorage.getItem("theme");
        if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
      } catch (e) {}
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preload" as="style" href="${FONTS}" onload="this.onload=null;this.rel='stylesheet'" />
    <link rel="preload" as="style" href="${FONTS_MONO}" onload="this.onload=null;this.rel='stylesheet'" />
    <noscript><link rel="stylesheet" href="${FONTS}" /><link rel="stylesheet" href="${FONTS_MONO}" /></noscript>
    <link rel="stylesheet" href="${base}assets/css/site.css" />
    <script type="application/ld+json">${JSON.stringify(jsonld)}</script>
  </head>`;
}

function header({ lang, home, alt, current }) {
  const t = T[lang];
  return `    <a class="skip" href="#main">${t.skip}</a>
    <div class="progress" aria-hidden="true"><span></span></div>

    <header class="nav" id="top">
      <div class="container nav__inner">
        <a class="brand" href="${home}index.html" aria-label="${t.brandLabel}">
          <span class="brand__mark" aria-hidden="true">ES</span>
          <span class="brand__name">${t.brand}</span>
        </a>

        <nav class="nav__links" id="nav-links" aria-label="${t.navLabel}">
${t.nav
  .map(([h, label]) => `          <a href="${home}index.html${h}"${current === h ? ' aria-current="page"' : ""}>${label}</a>`)
  .join("\n")}
        </nav>

        <div class="nav__tools">
          <button class="icon-btn kbd-btn" type="button" data-palette-open aria-label="${t.paletteBtn}" aria-keyshortcuts="Control+K Meta+K /">
            <svg class="i"><use href="#i-search" /></svg><kbd aria-hidden="true">Ctrl K</kbd>
          </button>
          <a class="icon-btn lang" href="${alt}" hreflang="${t.langAttr}" lang="${t.langAttr}" aria-label="${t.langLabel}">${t.langText}</a>
          <button class="icon-btn" type="button" data-theme-toggle aria-label="${t.theme}">
            <svg class="i i--sun"><use href="#i-sun" /></svg>
            <svg class="i i--moon"><use href="#i-moon" /></svg>
          </button>
          <a class="btn btn--primary btn--sm nav__cta" href="${home}index.html#contact">${t.cta}</a>
          <button class="nav__toggle" type="button" aria-label="${t.menu}" aria-expanded="false" aria-controls="nav-links">
            <span></span><span></span>
          </button>
        </div>
      </div>
    </header>`;
}

function footer({ lang, base }) {
  const t = T[lang];
  return `    <footer class="footer">
      <div class="container footer__inner">
        <div>
          <p class="footer__name">${lang === "zh" ? "蘇祥育 Eliot Su" : "Eliot Su 蘇祥育"}</p>
          <p>© <span data-year>2026</span> · ${t.footer}</p>
          <p class="footer__hint">${t.footerHint}</p>
        </div>
        <ul class="footer__icons">
          <li><a href="${GITHUB}" target="_blank" rel="noopener" aria-label="GitHub"><svg class="i"><use href="#i-github" /></svg></a></li>
          <li><a href="${LINKEDIN}" target="_blank" rel="noopener" aria-label="LinkedIn"><svg class="i"><use href="#i-linkedin" /></svg></a></li>
          <li><a href="https://www.instagram.com/a7868781/" target="_blank" rel="noopener" aria-label="Instagram"><svg class="i"><use href="#i-instagram" /></svg></a></li>
          <li><a href="mailto:${EMAIL}" aria-label="Email"><svg class="i"><use href="#i-mail" /></svg></a></li>
        </ul>
      </div>
    </footer>

    <a class="to-top" href="#top" aria-label="${t.topLabel}">
      <svg class="ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" /></svg>
      <svg class="i"><use href="#i-arrow-up" /></svg>
    </a>
    <div class="toast" role="status" aria-live="polite" data-copied="${t.copied}"></div>

    <script src="${base}assets/js/site.js" defer></script>
  </body>
</html>
`;
}

const ORDER_MOCK = {
  zh: `<div class="mock">
                <div class="mock__screen mock__screen--phone"><b>顧客</b><span class="mock__row"><i></i>掃碼入桌</span><span class="mock__row"><i></i>菜單 / 購物車</span><span class="mock__row"><i></i>我的訂單</span><span class="mock__pill">送出訂單</span></div>
                <div class="mock__screen"><b>廚房看板</b><span class="mock__ticket">#A12 · 2 項<em>製作中</em></span><span class="mock__ticket">#A13 · 4 項<em>待出餐</em></span><span class="mock__ticket">#A14 · 1 項<em>新訂單</em></span></div>
                <div class="mock__screen"><b>管理後台</b><span class="mock__bars"><i style="height: 40%"></i><i style="height: 70%"></i><i style="height: 55%"></i><i style="height: 90%"></i><i style="height: 65%"></i></span><span class="mock__row"><i></i>RBAC 權限</span></div>
              </div>`,
  en: `<div class="mock">
                <div class="mock__screen mock__screen--phone"><b>Customer</b><span class="mock__row"><i></i>Scan table QR</span><span class="mock__row"><i></i>Menu / cart</span><span class="mock__row"><i></i>My orders</span><span class="mock__pill">Place order</span></div>
                <div class="mock__screen"><b>Kitchen board</b><span class="mock__ticket">#A12 · 2<em>Cooking</em></span><span class="mock__ticket">#A13 · 4<em>Ready</em></span><span class="mock__ticket">#A14 · 1<em>New</em></span></div>
                <div class="mock__screen"><b>Admin</b><span class="mock__bars"><i style="height: 40%"></i><i style="height: 70%"></i><i style="height: 55%"></i><i style="height: 90%"></i><i style="height: 65%"></i></span><span class="mock__row"><i></i>RBAC</span></div>
              </div>`,
};

/* ---------- Case study pages ---------- */

function casePage(c, i, lang) {
  const t = T[lang];
  const d = c[lang];
  const zh = lang === "zh";
  const base = zh ? "../" : "../../";
  const home = "../";
  const zhPath = `work/${c.slug}.html`;
  const enPath = `en/work/${c.slug}.html`;
  const pagePath = zh ? zhPath : enPath;
  const alt = zh ? `../en/work/${c.slug}.html` : `../../work/${c.slug}.html`;
  const prev = CASES[(i - 1 + CASES.length) % CASES.length];
  const next = CASES[(i + 1) % CASES.length];
  const num = String(i + 1).padStart(2, "0");
  const ogImage = `${SITE}images/og/${c.slug}${zh ? "" : "-en"}.jpg`;

  const links = [
    c.demo ? `<a class="btn btn--primary btn--lg" href="${c.demo}" target="_blank" rel="noopener">${d.demoLabel}<svg class="i i--arrow"><use href="#i-arrow" /></svg></a>` : "",
    `<a class="btn btn--lg${c.demo ? "" : " btn--primary"}" href="${c.repo}" target="_blank" rel="noopener"><svg class="i"><use href="#i-github" /></svg>${t.source}</a>`,
  ].join("\n              ");

  const cover = c.cover
    ? picture({ name: c.cover.src.replace(/\.jpg$/, ""), w: c.cover.w, h: c.cover.h, alt: d.coverAlt, sizes: "(max-width: 1240px) calc(100vw - 32px), 1184px", prefix: base, lazy: false, priority: true })
    : ORDER_MOCK[lang];

  const jsonld = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: d.title,
      description: d.summary,
      codeRepository: c.repo,
      url: SITE + pagePath,
      inLanguage: zh ? "zh-Hant" : "en",
      author: { "@type": "Person", name: zh ? "蘇祥育 Eliot Su" : "Eliot Su", url: SITE },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t.work, item: SITE + (zh ? "" : "en/") + "#work" },
        { "@type": "ListItem", position: 2, name: d.title, item: SITE + pagePath },
      ],
    },
  ];

  return `${head({
    lang,
    title: `${d.title}｜${t.caseLabel}｜${zh ? "蘇祥育 Eliot Su" : "Eliot Su"}`.replace(/｜/g, zh ? "｜" : " | "),
    description: d.summary,
    pagePath,
    zhPath,
    enPath,
    ogImage,
    ogType: "article",
    base,
    jsonld,
  })}
  <body>
    ${SPRITE}

${header({ lang, home, alt, current: "#work" })}

    <main id="main">
      <article class="case">
        <header class="case-hero">
          <div class="hero__bg" aria-hidden="true"></div>
          <div class="container">
            <nav class="crumbs" aria-label="${zh ? "麵包屑" : "Breadcrumb"}">
              <a href="${home}index.html#work">${t.work}</a><span aria-hidden="true">/</span><span aria-current="page">${d.title}</span>
            </nav>
            <p class="eyebrow" data-enter style="--d: 0.05s"><span>${num}</span>${t.caseLabel}</p>
            <h1 data-enter style="--d: 0.12s">${d.title}</h1>
            <p class="lead" data-enter style="--d: 0.2s">${d.tagline}</p>
            <div class="hero__actions" data-enter style="--d: 0.28s">
              ${links}
            </div>
            ${d.demoNote ? `<p class="note">${d.demoNote}</p>` : ""}
            <dl class="case-meta" data-enter style="--d: 0.36s">
${d.meta.map(([k, v]) => `              <div><dt>${k}</dt><dd>${v}</dd></div>`).join("\n")}
            </dl>
          </div>
        </header>

        <div class="container">
          <figure class="case-cover${c.cover ? "" : " case-cover--mock"}" data-enter style="--d: 0.44s">
            ${cover}
          </figure>

          <ul class="case-metrics">
${d.metrics.map(([v, l]) => `            <li><strong>${v}</strong><span>${l}</span></li>`).join("\n")}
          </ul>

          <div class="case-layout">
            <aside class="toc" aria-label="${t.toc}">
              <p class="toc__title">${t.toc}</p>
              <ol>
${d.sections.map((s) => `                <li><a href="#${s.id}">${s.title}</a></li>`).join("\n")}
              </ol>
            </aside>

            <div class="prose">
${d.sections
  .map(
    (s) => `              <section class="case-section" id="${s.id}">
                <h2>${s.title}</h2>
                ${s.html}
              </section>`
  )
  .join("\n\n")}
            </div>
          </div>
        </div>

        <nav class="case-nav container" aria-label="${zh ? "其他案例" : "More case studies"}">
          <a class="case-nav__link" href="${prev.slug}.html" rel="prev"><span>← ${t.prev}</span><strong>${prev[lang].title}</strong></a>
          <a class="case-nav__all" href="${home}index.html#work">${t.allWork}</a>
          <a class="case-nav__link case-nav__link--next" href="${next.slug}.html" rel="next"><span>${t.next} →</span><strong>${next[lang].title}</strong></a>
        </nav>
      </article>
    </main>

${footer({ lang, base })}`;
}

/* ---------- Résumé pages ---------- */

function resumePage(lang) {
  const t = T[lang];
  const r = RESUME[lang];
  const zh = lang === "zh";
  const base = zh ? "" : "../";
  const home = "";
  const pagePath = zh ? "resume.html" : "en/resume.html";
  const alt = zh ? "en/resume.html" : "../resume.html";
  const pdf = `${base}files/Eliot-Su-Resume-${zh ? "zh" : "en"}.pdf`;
  const workBase = "work/";

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: SITE + pagePath,
    mainEntity: {
      "@type": "Person",
      name: zh ? "蘇祥育" : "Eliot Su",
      alternateName: zh ? "Eliot Su" : "蘇祥育",
      jobTitle: r.role,
      worksFor: { "@type": "Organization", name: zh ? "金全益股份有限公司 MasterPiece" : "MasterPiece (金全益股份有限公司)" },
      email: "mailto:" + EMAIL,
      sameAs: [GITHUB, LINKEDIN, "https://www.cakeresume.com/siang-yu-su"],
    },
  };

  const projectSlugs = ["paper-radar", "jev-arena", "order-system", "parking-helper", "shiyueguo"];

  return `${head({
    lang,
    title: `${t.resumeTitle}｜${zh ? "蘇祥育 Eliot Su" : "Eliot Su"}`.replace(/｜/g, zh ? "｜" : " | "),
    description: t.resumeDesc,
    pagePath,
    zhPath: "resume.html",
    enPath: "en/resume.html",
    ogImage: `${SITE}images/og-image${zh ? "" : "-en"}.png`,
    ogType: "profile",
    base,
    jsonld,
  })}
  <body class="resume-body">
    ${SPRITE}

${header({ lang, home, alt })}

    <main id="main" class="resume-page">
      <div class="container resume-toolbar">
        <a class="btn btn--sm" href="${home}index.html">← ${t.backHome}</a>
        <div class="resume-toolbar__actions">
          <button class="btn btn--sm" type="button" data-print><svg class="i"><use href="#i-printer" /></svg>${t.print}</button>
          <a class="btn btn--sm btn--primary" href="${pdf}" download><svg class="i"><use href="#i-file" /></svg>${t.pdf}</a>
        </div>
      </div>

      <article class="resume" data-enter style="--d: 0.05s">
        <header class="resume__head">
          <div>
            <h1>${r.name}<span>${r.alt}</span></h1>
            <p class="resume__role">${r.role}</p>
          </div>
          <ul class="resume__contact">
            <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
            <li><a href="${GITHUB}">github.com/Eliot5566</a></li>
            <li><a href="${LINKEDIN}">linkedin.com/in/eliot-su-6a834227b</a></li>
            <li><a href="${SITE}${zh ? "" : "en/"}">eliot5566.github.io/Su-Xiangyu-Portfolio</a></li>
          </ul>
        </header>

        <p class="resume__summary">${r.summary}</p>

        <section class="resume__section">
          <h2>${r.labels.experience}</h2>
${r.jobs
  .map(
    (j) => `          <div class="resume__job">
            <div class="resume__job-head"><h3>${j.title}<span>${j.org}</span></h3><p>${j.when}</p></div>
            <ul>${j.bullets.map((b) => `<li>${b}</li>`).join("")}</ul>
          </div>`
  )
  .join("\n")}
        </section>

        <section class="resume__section">
          <h2>${r.labels.projects}</h2>
          <ul class="resume__projects">
${r.projects
  .map(
    ([name, desc], k) => `            <li><a href="${SITE}${zh ? "" : "en/"}${workBase}${projectSlugs[k]}.html"><strong>${name}</strong></a><span>${desc}</span></li>`
  )
  .join("\n")}
          </ul>
        </section>

        <div class="resume__cols">
          <section class="resume__section">
            <h2>${r.labels.skills}</h2>
            <dl class="resume__skills">
${r.skills.map(([k, v]) => `              <div><dt>${k}</dt><dd>${v}</dd></div>`).join("\n")}
            </dl>
          </section>
          <section class="resume__section">
            <h2>${r.labels.education}</h2>
${r.education.map(([s, w]) => `            <p class="resume__edu"><strong>${s}</strong><span>${w}</span></p>`).join("\n")}
            <h2>${r.labels.certs}</h2>
            <p class="resume__certs">${r.certs}</p>
          </section>
        </div>
      </article>
    </main>

${footer({ lang, base })}`;
}

/* ---------- Inject the enterprise diagram into the home pages ---------- */

function injectEnterprise(file, lang) {
  let html = read(file);
  const re = /(<!-- build:enterprise -->)[\s\S]*?(<!-- \/build:enterprise -->)/;
  if (!re.test(html)) {
    console.warn("no build:enterprise marker in", file);
    return;
  }
  html = html.replace(re, `$1\n${enterpriseFigure(lang)}\n$2`);
  write(file, html);
}

CASES.forEach((c, i) => {
  write(`work/${c.slug}.html`, casePage(c, i, "zh"));
  write(`en/work/${c.slug}.html`, casePage(c, i, "en"));
});
write("resume.html", resumePage("zh"));
write("en/resume.html", resumePage("en"));
injectEnterprise("index.html", "zh");
injectEnterprise("en/index.html", "en");
