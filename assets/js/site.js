(function () {
  "use strict";

  var root = document.documentElement;
  var EN = (root.lang || "").toLowerCase().indexOf("en") === 0;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  var GH_USER = "Eliot5566";
  var langLink = document.querySelector(".nav__tools .lang");
  var siteBase = (function () {
    var css = document.querySelector('link[href$="assets/css/site.css"]');
    return css ? css.getAttribute("href").replace("assets/css/site.css", "") : "";
  })();
  var langBase = EN ? siteBase + "en/" : siteBase;

  var T = EN
    ? {
        openMenu: "Open menu",
        closeMenu: "Close menu",
        copied: "Email copied",
        opening: "Opening your email app…",
        needMessage: "Add a short message first.",
        composeHint: "This opens your email app with everything filled in.",
        subjectFrom: function (name) {
          return name ? "Message from " + name : "Hello from your portfolio";
        },
        count: function (n, total) {
          return n === total ? "Showing all " + total + " projects" : "Showing " + n + " of " + total + " projects";
        },
        empty: "No projects match. Try another keyword.",
        paletteLabel: "Quick menu",
        palettePh: "Search sections, projects and actions…",
        navigate: "Navigate",
        select: "Select",
        close: "Close",
        noResults: "Nothing found",
        gNav: "Sections",
        gWork: "Projects",
        gActions: "Actions",
        gLinks: "Links",
        more: "More projects",
        certs: "Courses & certificates",
        theme: "Toggle dark mode",
        lang: "切換到中文",
        copy: "Copy email",
        mail: "Send an email",
        print: "Print / save as PDF résumé",
        top: "Back to top",
        gToc: "On this page",
        gCases: "Case studies",
        caseHint: "Read the case study",
        resume: "Open résumé",
        pdf: "Download résumé (PDF)",
        langHint: "這個網站也有中文版。",
        langGo: "前往中文版",
        dismiss: "Dismiss",
        justNow: "just now",
        synced: "Synced with GitHub",
        cached: "Showing saved data",
      }
    : {
        openMenu: "開啟選單",
        closeMenu: "關閉選單",
        copied: "已複製 Email",
        opening: "正在開啟郵件程式…",
        needMessage: "請先寫幾句想聊的內容。",
        composeHint: "按下後會開啟你的郵件程式，內容已經幫你填好。",
        subjectFrom: function (name) {
          return name ? name + " 的來信" : "來自作品集網站的來信";
        },
        count: function (n, total) {
          return n === total ? "共 " + total + " 個專案" : "顯示 " + n + " / " + total + " 個專案";
        },
        empty: "沒有符合的專案，換個關鍵字試試。",
        paletteLabel: "快速選單",
        palettePh: "搜尋段落、作品或動作…",
        navigate: "移動",
        select: "選擇",
        close: "關閉",
        noResults: "找不到結果",
        gNav: "前往段落",
        gWork: "作品",
        gActions: "動作",
        gLinks: "連結",
        more: "更多作品",
        certs: "進修與證書",
        theme: "切換深色／淺色模式",
        lang: "Switch to English",
        copy: "複製 Email",
        mail: "寄信給我",
        print: "列印／存成 PDF 履歷",
        top: "回到頁首",
        gToc: "本頁內容",
        gCases: "案例研究",
        caseHint: "閱讀案例研究",
        resume: "開啟線上履歷",
        pdf: "下載履歷 PDF",
        langHint: "This site is also available in English.",
        langGo: "View in English",
        dismiss: "關閉",
        justNow: "剛剛",
        synced: "已同步 GitHub",
        cached: "顯示快取資料",
      };

  /* ---------- Helpers ---------- */
  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }

  function $$(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) {}
    return null;
  }

  function icon(name) {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "i");
    svg.setAttribute("aria-hidden", "true");
    var use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#i-" + name);
    svg.appendChild(use);
    return svg;
  }

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }

  function scrollToEl(target) {
    if (!target) return;
    root.classList.add("cv-done");
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  function norm(s) {
    return (s || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  /* ---------- Toast ---------- */
  var toast = $(".toast");
  var toastTimer;

  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 2400);
  }

  /* ---------- Theme ---------- */
  var themeBtn = $("[data-theme-toggle]");
  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function currentTheme() {
    return root.getAttribute("data-theme") || (darkQuery.matches ? "dark" : "light");
  }

  function syncTheme() {
    var dark = currentTheme() === "dark";
    if (themeBtn) themeBtn.setAttribute("aria-pressed", String(dark));
    $$('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute("content", dark ? "#0c0f13" : "#fafaf7");
    });
  }

  function applyTheme(next) {
    root.setAttribute("data-theme", next);
    store("theme", next);
    syncTheme();
  }

  function toggleTheme(origin) {
    var next = currentTheme() === "dark" ? "light" : "dark";
    if (!document.startViewTransition || reduceMotion) {
      applyTheme(next);
      return;
    }
    var x = origin ? origin.x : window.innerWidth - 80;
    var y = origin ? origin.y : 34;
    var r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    root.classList.add("theme-vt");
    var vt = document.startViewTransition(function () {
      applyTheme(next);
    });
    vt.ready
      .then(function () {
        root.animate(
          { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + r + "px at " + x + "px " + y + "px)"] },
          { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)", pseudoElement: "::view-transition-new(root)" }
        );
      })
      .catch(function () {});
    vt.finished.then(
      function () {
        root.classList.remove("theme-vt");
      },
      function () {
        root.classList.remove("theme-vt");
      }
    );
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function (e) {
      var rect = themeBtn.getBoundingClientRect();
      toggleTheme({ x: e.clientX || rect.left + rect.width / 2, y: e.clientY || rect.top + rect.height / 2 });
    });
  }
  if (darkQuery.addEventListener) darkQuery.addEventListener("change", syncTheme);
  syncTheme();

  /* ---------- Mobile menu ---------- */
  var nav = $(".nav");
  var toggle = $(".nav__toggle");
  var links = $("#nav-links");

  function setMenu(open) {
    links.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? T.closeMenu : T.openMenu);
  }

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      setMenu(!links.classList.contains("is-open"));
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    document.addEventListener("click", function (e) {
      if (links.classList.contains("is-open") && !nav.contains(e.target)) setMenu(false);
    });
  }

  /* ---------- Scroll: nav, progress, back-to-top ring, scrollspy ---------- */
  var bar = $(".progress span");
  var toTop = $(".to-top");
  var ring = $(".to-top .ring circle");
  var ringLen = 138.2;
  var navLinks = $$('.nav__links a[href^="#"]');
  var spySections = navLinks
    .map(function (a) {
      return $(a.getAttribute("href"));
    })
    .filter(Boolean);
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(y / max, 1) : 0;
    nav.classList.toggle("is-scrolled", y > 8);
    if (bar) bar.style.transform = "scaleX(" + p + ")";
    if (toTop) toTop.classList.toggle("is-visible", y > window.innerHeight * 0.9);
    if (ring) ring.style.strokeDashoffset = String(ringLen * (1 - p));

    var line = window.innerHeight * 0.35;
    var active = null;
    spySections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= line) active = s;
    });
    if (y >= max - 4) active = spySections[spySections.length - 1];
    navLinks.forEach(function (a) {
      if (active && a.getAttribute("href") === "#" + active.id) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", onScroll);
  onScroll();

  var tocLinks = $$('.toc a[href^="#"]');
  if (tocLinks.length) {
    var tocTargets = tocLinks.map(function (a) {
      return document.getElementById(a.getAttribute("href").slice(1));
    });
    var tocTick = false;
    var tocSpy = function () {
      var line = window.innerHeight * 0.3;
      var current = 0;
      tocTargets.forEach(function (s, k) {
        if (s && s.getBoundingClientRect().top <= line) current = k;
      });
      tocLinks.forEach(function (a, k) {
        if (k === current) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
      tocTick = false;
    };
    window.addEventListener(
      "scroll",
      function () {
        if (!tocTick) {
          requestAnimationFrame(tocSpy);
          tocTick = true;
        }
      },
      { passive: true }
    );
    tocSpy();
  }

  /* ---------- Hero spotlight ---------- */
  var hero = $(".hero");
  var spot = $(".hero__spot");
  if (hero && spot && finePointer && !reduceMotion) {
    var spotRaf;
    hero.addEventListener("pointermove", function (e) {
      cancelAnimationFrame(spotRaf);
      spotRaf = requestAnimationFrame(function () {
        var r = spot.getBoundingClientRect();
        spot.style.setProperty("--hx", e.clientX - r.left + "px");
        spot.style.setProperty("--hy", e.clientY - r.top + "px");
        hero.classList.add("is-lit");
      });
    });
    hero.addEventListener("pointerleave", function () {
      hero.classList.remove("is-lit");
    });
  }

  /* ---------- Pointer glow + tilt ---------- */
  var GLOW = ".card, .pillar, .skill, .area, .timeline > li, .certs a, .contact__links a, .metrics li, .compose, .decision";

  if (finePointer) {
    document.addEventListener(
      "pointermove",
      function (e) {
        var g = e.target.closest && e.target.closest(GLOW);
        if (!g) return;
        var r = g.getBoundingClientRect();
        g.style.setProperty("--mx", e.clientX - r.left + "px");
        g.style.setProperty("--my", e.clientY - r.top + "px");
      },
      { passive: true }
    );
  }

  if (finePointer && !reduceMotion) {
    $$(".feature__media").forEach(function (m) {
      var raf;
      m.addEventListener("pointermove", function (e) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          var r = m.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - 0.5;
          var py = (e.clientY - r.top) / r.height - 0.5;
          m.classList.add("is-tilting");
          m.style.transform = "perspective(1100px) rotateX(" + (-py * 6).toFixed(2) + "deg) rotateY(" + (px * 8).toFixed(2) + "deg)";
          m.style.setProperty("--gx", (px + 0.5) * 100 + "%");
          m.style.setProperty("--gy", (py + 0.5) * 100 + "%");
        });
      });
      m.addEventListener("pointerleave", function () {
        cancelAnimationFrame(raf);
        m.classList.remove("is-tilting");
        m.style.transform = "";
      });
    });
  }

  /* ---------- Count up ---------- */
  function countUp(node) {
    var target = parseFloat(node.getAttribute("data-count"));
    var decimals = parseInt(node.getAttribute("data-decimals") || "0", 10);
    var start = null;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / 1400, 1);
      node.textContent = (target * (1 - Math.pow(1 - p, 3))).toFixed(decimals);
      if (p < 1) window.requestAnimationFrame(frame);
    }
    window.requestAnimationFrame(frame);
  }

  /* ---------- Reveal on scroll (staggered) ---------- */
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var t = entry.target;
          t.classList.add("is-visible");
          revealIO.unobserve(t);
          var delay = parseFloat(t.style.transitionDelay) || 0;
          setTimeout(function () {
            t.classList.remove("reveal", "is-visible");
            t.style.transitionDelay = "";
          }, 800 + delay * 1000);
        });
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    $$(
      ".section__head, .feature, .card, .pillar, .job, .timeline > li, .steps li, .skill, .certs li:not(.is-extra), .about__story, .contact__inner > *, .activity, .case-metrics li, .decision, .feature-item, .gallery figure, .case-section > h2, .case-nav__link"
    ).forEach(function (n) {
      var idx = n.parentElement ? Array.prototype.indexOf.call(n.parentElement.children, n) : 0;
      if (n.matches(".card, .pillar, .timeline > li, .steps li, .skill, .certs li, .case-metrics li, .decision, .gallery figure")) n.style.transitionDelay = Math.min(idx % 6, 5) * 0.07 + "s";
      n.classList.add("reveal");
      revealIO.observe(n);
    });

    var countIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            countUp(entry.target);
            countIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    $$("[data-count]").forEach(function (n) {
      countIO.observe(n);
    });
  }

  /* ---------- Finish deferred rendering when the page is idle ---------- */
  (function () {
    var deferred = $$("#about, #experience, #work, #more, #skills, #certificates, .case-layout");
    if (!deferred.length) return;
    var idle = function (fn, opts) {
      return window.requestIdleCallback ? window.requestIdleCallback(fn, opts) : setTimeout(fn, 60);
    };
    function next() {
      var el = deferred.shift();
      if (!el) {
        root.classList.add("cv-done");
        return;
      }
      el.classList.add("cv-ready");
      idle(next, { timeout: 600 });
    }
    // Start on the visitor's first interaction, so the extra rendering never
    // competes with the initial load.
    var started = false;
    var events = ["scroll", "wheel", "pointerdown", "keydown", "touchstart"];
    var start = function () {
      if (started) return;
      started = true;
      events.forEach(function (ev) {
        window.removeEventListener(ev, start, true);
      });
      idle(next, { timeout: 600 });
    };
    events.forEach(function (ev) {
      window.addEventListener(ev, start, { capture: true, passive: true });
    });
    // In-page jumps should never land on an estimated position.
    document.addEventListener(
      "click",
      function (e) {
        var link = e.target.closest && e.target.closest('a[href^="#"]');
        if (link && !root.classList.contains("cv-done")) root.classList.add("cv-done");
      },
      true
    );
  })();

  /* ---------- Only animate the current-role border while it is visible ---------- */
  var job = $(".job");
  if (job && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      job.classList.toggle("is-onscreen", entries[0].isIntersecting);
    }).observe(job);
  }

  /* ---------- Process line draws in ---------- */
  var steps = $(".steps");
  if (steps) {
    if (reduceMotion || !("IntersectionObserver" in window)) steps.classList.add("is-drawn");
    else {
      var stepsIO = new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            steps.classList.add("is-drawn");
            stepsIO.disconnect();
          }
        },
        { threshold: 0.4 }
      );
      stepsIO.observe(steps);
    }
  }

  /* ---------- Diagrams flow when visible ---------- */
  var diagrams = $$(".diagram");
  if (diagrams.length && "IntersectionObserver" in window && !reduceMotion) {
    var dgIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          entry.target.classList.toggle("is-flowing", entry.isIntersecting);
        });
      },
      { threshold: 0.25 }
    );
    diagrams.forEach(function (d) {
      dgIO.observe(d);
    });
  }

  /* ---------- Project filter + search ---------- */
  var chips = $$("[data-filter]");
  var cards = $$("#project-grid .card");
  var search = $("[data-project-search]");
  var status = $("[data-grid-status]");
  var empty = $("[data-grid-empty]");
  var activeFilter = "all";
  if (empty) empty.textContent = T.empty;

  function applyFilter(animate) {
    var q = norm(search ? search.value : "");
    var shown = 0;
    cards.forEach(function (card) {
      var show = (activeFilter === "all" || card.getAttribute("data-cat") === activeFilter) && (!q || norm(card.textContent).indexOf(q) > -1);
      var wasHidden = card.hidden;
      card.hidden = !show;
      if (show) shown++;
      if (show && animate && !reduceMotion && wasHidden !== card.hidden) {
        card.classList.remove("is-entering");
        void card.offsetWidth;
        card.classList.add("is-entering");
      }
    });
    if (status) status.textContent = T.count(shown, cards.length);
    if (empty) empty.hidden = shown > 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      activeFilter = chip.getAttribute("data-filter");
      chips.forEach(function (c) {
        c.setAttribute("aria-pressed", String(c === chip));
      });
      cards.forEach(function (c) {
        c.hidden = true;
      });
      applyFilter(true);
    });
  });

  if (search) {
    search.addEventListener("input", function () {
      applyFilter(false);
    });
    search.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && search.value) {
        search.value = "";
        applyFilter(false);
        e.stopPropagation();
      }
    });
  }
  if (cards.length) applyFilter(false);

  /* ---------- Certificates ---------- */
  var certBtn = $("[data-cert-toggle]");
  if (certBtn) {
    certBtn.addEventListener("click", function () {
      var list = document.getElementById(certBtn.getAttribute("aria-controls"));
      var open = list.classList.toggle("is-open");
      certBtn.setAttribute("aria-expanded", String(open));
      certBtn.textContent = open ? certBtn.getAttribute("data-less") : certBtn.getAttribute("data-more");
    });
  }

  /* ---------- Copy email ---------- */
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "absolute";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (e) {}
    document.body.removeChild(ta);
  }

  function copyText(text) {
    var done = function () {
      showToast(T.copied);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, function () {
        fallbackCopy(text);
        done();
      });
    } else {
      fallbackCopy(text);
      done();
    }
  }

  var EMAIL = "a7868783@gmail.com";
  $$("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      copyText(btn.getAttribute("data-copy"));
    });
  });

  /* ---------- Print résumé ---------- */
  function printResume() {
    var list = $("#cert-list");
    $$("details").forEach(function (d) {
      d.open = true;
    });
    if (list) list.classList.add("is-open");
    window.print();
  }

  $$("[data-print]").forEach(function (btn) {
    btn.addEventListener("click", printResume);
  });

  /* ---------- Contact composer (mailto) ---------- */
  var compose = $("[data-compose]");
  if (compose) {
    var hint = $(".compose__hint", compose);
    var msg = compose.elements.message;
    compose.addEventListener("submit", function (e) {
      e.preventDefault();
      var text = msg.value.trim();
      if (!text) {
        msg.setAttribute("aria-invalid", "true");
        hint.textContent = T.needMessage;
        hint.classList.add("is-error");
        msg.focus();
        return;
      }
      var topic = (compose.querySelector('input[name="topic"]:checked') || {}).value || "";
      var name = compose.elements.name.value.trim();
      var subject = (topic ? "[" + topic + "] " : "") + T.subjectFrom(name);
      var body = text + (name ? "\n\n— " + name : "");
      window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
      showToast(T.opening);
    });
    msg.addEventListener("input", function () {
      if (msg.getAttribute("aria-invalid") === "true" && msg.value.trim()) {
        msg.removeAttribute("aria-invalid");
        hint.textContent = T.composeHint;
        hint.classList.remove("is-error");
      }
    });
  }

  /* ---------- GitHub live data ---------- */
  var LANG_COLORS = {
    Python: "#3572A5",
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    HTML: "#e34c26",
    CSS: "#563d7c",
    PHP: "#4F5D95",
  };
  var REPO_DESC = EN
    ? {
        "JEV-Paper-Radar": "Reads every new arXiv paper and surfaces the few worth reading",
        "jev-arena": "Real-time bot battles with fighters written in plain English",
        orderSystem: "Mobile ordering: customer, kitchen and admin views",
        algorithm: "FAQ management API with similarity matching",
        "Parking-Helper": "LINE bot that finds nearby parking in real time",
        "US-stock-monitoring-and-query-system": "US stock monitor with technical indicators",
        pokemon: "Sales and inventory tracker for 3D-printed products",
        "E-Commerce-Website": "Full-stack e-commerce site for Japanese sweets",
      }
    : {
        "JEV-Paper-Radar": "每天讀完 arXiv 新論文，只挑出值得讀的幾篇",
        "jev-arena": "用白話寫戰士，讓模型即時對戰",
        orderSystem: "手機點餐系統：顧客、廚房、後台三種介面",
        algorithm: "FAQ 管理 API，依提問做相似度比對",
        "Parking-Helper": "LINE 停車神隊友，即時查附近車位",
        "US-stock-monitoring-and-query-system": "美股監控查詢與技術指標",
        pokemon: "3D 列印商品銷售與庫存紀錄",
        "E-Commerce-Website": "拾月菓日式和菓子全端電商",
      };
  var CASE_LIST = [
    ["paper-radar", "Paper Radar", "Paper Radar"],
    ["jev-arena", "Jev Arena", "Jev Arena"],
    ["order-system", "手機點餐系統", "Mobile ordering system"],
    ["parking-helper", "停車神隊友", "Parking Helper"],
    ["shiyueguo", "拾月菓", "ShiYueGuo"],
  ];
  var SKIP_REPOS = { Eliot5566: 1, "Su-Xiangyu-Portfolio": 1 };
  var rtf = window.Intl && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat(EN ? "en" : "zh-TW", { numeric: "auto" }) : null;

  function relTime(iso) {
    var diff = (new Date(iso).getTime() - Date.now()) / 1000;
    var units = [
      ["year", 31536000],
      ["month", 2592000],
      ["week", 604800],
      ["day", 86400],
      ["hour", 3600],
      ["minute", 60],
    ];
    if (!rtf) return iso.slice(0, 10);
    for (var k = 0; k < units.length; k++) {
      if (Math.abs(diff) >= units[k][1]) return rtf.format(Math.round(diff / units[k][1]), units[k][0]);
    }
    return T.justNow;
  }

  function refreshTimes() {
    $$("[data-pushed]").forEach(function (n) {
      n.textContent = relTime(n.getAttribute("data-pushed"));
    });
  }

  function renderActivity(repos) {
    var list = $("#gh-activity");
    if (!list) return;
    var rows = repos
      .filter(function (r) {
        return !r.f && !SKIP_REPOS[r.n] && (REPO_DESC[r.n] || r.d);
      })
      .sort(function (a, b) {
        return new Date(b.p) - new Date(a.p);
      })
      .slice(0, 5);
    if (!rows.length) return;
    list.textContent = "";
    rows.forEach(function (r) {
      var li = el("li");
      var a = el("a", "activity__row");
      a.href = r.u;
      a.target = "_blank";
      a.rel = "noopener";
      var name = el("span", "activity__name", r.n);
      name.style.setProperty("--c", LANG_COLORS[r.l] || "var(--muted)");
      var desc = el("span", "activity__desc", REPO_DESC[r.n] || r.d || "");
      var meta = el("span", "activity__meta");
      if (r.l) meta.appendChild(el("span", null, r.l));
      if (r.s > 0) {
        var star = el("span");
        star.appendChild(icon("star"));
        star.appendChild(document.createTextNode(String(r.s)));
        meta.appendChild(star);
      }
      var time = el("span");
      time.setAttribute("data-pushed", r.p);
      time.textContent = relTime(r.p);
      meta.appendChild(time);
      a.appendChild(name);
      a.appendChild(desc);
      a.appendChild(meta);
      li.appendChild(a);
      list.appendChild(li);
    });
  }

  function renderStars(repos) {
    $$("[data-gh-stars]").forEach(function (n) {
      var name = n.getAttribute("data-gh-stars");
      for (var k = 0; k < repos.length; k++) {
        if (repos[k].n === name) {
          n.textContent = String(repos[k].s);
          break;
        }
      }
    });
  }

  function loadGitHub() {
    var KEY = "gh-cache-v1";
    var liveLabel = $("[data-gh-status]");
    var cached = null;
    try {
      cached = JSON.parse(store(KEY) || "null");
    } catch (e) {}

    function apply(data, label) {
      renderActivity(data);
      renderStars(data);
      if (liveLabel && label) liveLabel.textContent = label;
    }

    if (cached && Date.now() - cached.t < 3600000) {
      apply(cached.d, T.synced + " · " + relTime(new Date(cached.t).toISOString()));
      return;
    }
    if (!window.fetch) return;
    fetch("https://api.github.com/users/" + GH_USER + "/repos?per_page=100&sort=pushed", {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then(function (res) {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then(function (repos) {
        var data = repos.map(function (r) {
          return { n: r.name, d: r.description, l: r.language, s: r.stargazers_count, p: r.pushed_at, f: r.fork, u: r.html_url };
        });
        store(KEY, JSON.stringify({ t: Date.now(), d: data }));
        apply(data, T.synced + " · " + T.justNow);
      })
      .catch(function () {
        if (cached) apply(cached.d, T.cached);
        refreshTimes();
      });
  }

  refreshTimes();
  var activity = $(".activity");
  if (activity && "IntersectionObserver" in window) {
    var ghIO = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          ghIO.disconnect();
          loadGitHub();
        }
      },
      { rootMargin: "600px 0px" }
    );
    ghIO.observe(activity);
  } else if (activity) {
    loadGitHub();
  }

  /* ---------- Command palette ---------- */
  var paletteBtn = $("[data-palette-open]");
  var palette;
  var palInput;
  var palList;
  var palItems = [];
  var palShown = [];
  var palIndex = 0;
  var lastFocus = null;

  if (paletteBtn) {
    var kbdHint = $("kbd", paletteBtn);
    if (kbdHint) kbdHint.textContent = isMac ? "⌘K" : "Ctrl K";
  }
  $$("[data-shortcut-hint]").forEach(function (n) {
    n.textContent = isMac ? "⌘K" : "Ctrl K";
  });

  function buildPaletteItems() {
    var items = [];
    $$(".nav__links a").forEach(function (a) {
      var href = a.getAttribute("href");
      items.push({
        group: T.gNav,
        label: a.textContent.trim(),
        icon: "hash",
        run: href.charAt(0) === "#" ? scrollToEl.bind(null, $(href)) : function () { window.location.href = href; },
      });
    });
    $$(".toc a").forEach(function (a) {
      items.push({ group: T.gToc, label: a.textContent.trim(), icon: "hash", run: scrollToEl.bind(null, $(a.getAttribute("href"))) });
    });
    if ($("#more")) items.splice(3, 0, { group: T.gNav, label: T.more, icon: "hash", run: scrollToEl.bind(null, $("#more")) });
    if ($("#certificates")) items.splice(items.length - 1, 0, { group: T.gNav, label: T.certs, icon: "hash", run: scrollToEl.bind(null, $("#certificates")) });
    $$(".feature").forEach(function (f) {
      var h = $("h3", f);
      var tag = $(".feature__tagline", f);
      var keys = $$(".tags li, .feature__kicker", f).map(function (n) { return n.textContent; }).join(" ") + " " + $$("a[href]", f).map(function (n) { return n.getAttribute("href").split("/").pop(); }).join(" ");
      items.push({ group: T.gWork, label: h.textContent.trim(), hint: tag ? tag.textContent.trim() : "", keys: keys, icon: "box", run: scrollToEl.bind(null, f) });
    });
    if (!$(".feature")) CASE_LIST.forEach(function (cs) {
      items.push({ group: T.gCases, label: cs[EN ? 2 : 1], hint: T.caseHint, icon: "box", keys: cs[0], run: function () { window.location.href = langBase + "work/" + cs[0] + ".html"; } });
    });
    items.push({ group: T.gActions, label: T.resume, icon: "file", run: function () { window.location.href = langBase + "resume.html"; } });
    items.push({ group: T.gActions, label: T.pdf, icon: "arrow-down", run: function () { window.location.href = siteBase + "files/Eliot-Su-Resume-" + (EN ? "en" : "zh") + ".pdf"; } });
    items.push({ group: T.gActions, label: T.theme, icon: "moon", run: function () { toggleTheme(null); } });
    items.push({ group: T.gActions, label: T.lang, icon: "globe", run: function () { window.location.href = langLink ? langLink.getAttribute("href") : EN ? "../" : "en/"; } });
    items.push({ group: T.gActions, label: T.copy, hint: EMAIL, icon: "copy", run: function () { copyText(EMAIL); } });
    items.push({ group: T.gActions, label: T.mail, hint: EMAIL, icon: "mail", run: function () { window.location.href = "mailto:" + EMAIL; } });
    items.push({ group: T.gActions, label: T.print, icon: "printer", run: printResume });
    items.push({ group: T.gActions, label: T.top, icon: "arrow-up", run: function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); } });
    [
      ["GitHub", "github.com/Eliot5566", "github", "https://github.com/Eliot5566"],
      ["LinkedIn", "Eliot Su", "linkedin", "https://www.linkedin.com/in/eliot-su-6a834227b/"],
      ["CakeResume", "cakeresume.com/siang-yu-su", "file", "https://www.cakeresume.com/siang-yu-su"],
    ].forEach(function (l) {
      items.push({ group: T.gLinks, label: l[0], hint: l[1], icon: l[2], external: true, run: function () { window.open(l[3], "_blank", "noopener"); } });
    });
    return items;
  }

  function buildPalette() {
    palette = el("div", "palette");
    palette.hidden = true;
    palette.setAttribute("role", "dialog");
    palette.setAttribute("aria-modal", "true");
    palette.setAttribute("aria-label", T.paletteLabel);

    var backdrop = el("div", "palette__backdrop");
    backdrop.addEventListener("click", closePalette);

    var panel = el("div", "palette__panel");
    var searchRow = el("div", "palette__search");
    searchRow.appendChild(icon("search"));
    palInput = el("input");
    palInput.type = "text";
    palInput.setAttribute("role", "combobox");
    palInput.setAttribute("aria-expanded", "true");
    palInput.setAttribute("aria-controls", "palette-list");
    palInput.setAttribute("aria-autocomplete", "list");
    palInput.setAttribute("autocomplete", "off");
    palInput.setAttribute("spellcheck", "false");
    palInput.placeholder = T.palettePh;
    palInput.setAttribute("aria-label", T.palettePh);
    searchRow.appendChild(palInput);
    var esc = el("kbd", null, "Esc");
    searchRow.appendChild(esc);

    palList = el("ul", "palette__list");
    palList.id = "palette-list";
    palList.setAttribute("role", "listbox");
    palList.setAttribute("aria-label", T.paletteLabel);

    var foot = el("div", "palette__foot");
    var f1 = el("span");
    f1.appendChild(el("kbd", null, "↑"));
    f1.appendChild(el("kbd", null, "↓"));
    f1.appendChild(document.createTextNode(T.navigate));
    var f2 = el("span");
    f2.appendChild(el("kbd", null, "↵"));
    f2.appendChild(document.createTextNode(T.select));
    var f3 = el("span");
    f3.appendChild(el("kbd", null, "Esc"));
    f3.appendChild(document.createTextNode(T.close));
    foot.appendChild(f1);
    foot.appendChild(f2);
    foot.appendChild(f3);

    panel.appendChild(searchRow);
    panel.appendChild(palList);
    panel.appendChild(foot);
    palette.appendChild(backdrop);
    palette.appendChild(panel);
    document.body.appendChild(palette);

    palInput.addEventListener("input", function () {
      palIndex = 0;
      renderPalette();
    });
    palInput.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!palShown.length) return;
        palIndex = (palIndex + (e.key === "ArrowDown" ? 1 : -1) + palShown.length) % palShown.length;
        markActive();
      } else if (e.key === "Enter") {
        e.preventDefault();
        runItem(palShown[palIndex]);
      } else if (e.key === "Tab") {
        e.preventDefault();
      }
    });
    palette.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        e.preventDefault();
        closePalette();
      }
    });
  }

  function renderPalette() {
    var q = norm(palInput.value);
    palShown = palItems.filter(function (it) {
      return !q || norm(it.label + " " + (it.hint || "") + " " + (it.keys || "") + " " + it.group).indexOf(q) > -1;
    });
    palList.textContent = "";
    if (!palShown.length) {
      palList.appendChild(el("li", "palette__empty", T.noResults));
      palInput.removeAttribute("aria-activedescendant");
      return;
    }
    var group = null;
    palShown.forEach(function (it, k) {
      if (it.group !== group) {
        group = it.group;
        var g = el("li", "palette__group", group);
        g.setAttribute("role", "presentation");
        palList.appendChild(g);
      }
      var li = el("li", "palette__item");
      li.id = "pal-opt-" + k;
      li.setAttribute("role", "option");
      li.appendChild(icon(it.icon));
      var label = el("span", "palette__label", it.label);
      if (it.hint) label.appendChild(el("small", null, it.hint));
      li.appendChild(label);
      if (it.external) li.appendChild(icon("arrow"));
      li.addEventListener("mousemove", function () {
        if (palIndex !== k) {
          palIndex = k;
          markActive(true);
        }
      });
      li.addEventListener("click", function () {
        runItem(it);
      });
      palList.appendChild(li);
    });
    markActive();
  }

  function markActive(fromPointer) {
    $$(".palette__item", palList).forEach(function (li, k) {
      var on = k === palIndex;
      li.setAttribute("aria-selected", String(on));
      if (on) {
        palInput.setAttribute("aria-activedescendant", li.id);
        if (!fromPointer) li.scrollIntoView({ block: "nearest" });
      }
    });
  }

  function runItem(it) {
    if (!it) return;
    closePalette(true);
    setTimeout(it.run, 10);
  }

  function openPalette() {
    if (!palette) buildPalette();
    palItems = buildPaletteItems();
    lastFocus = document.activeElement;
    palette.hidden = false;
    palInput.value = "";
    palIndex = 0;
    renderPalette();
    root.style.overflow = "hidden";
    palInput.focus();
  }

  function closePalette(keepFocus) {
    if (!palette || palette.hidden) return;
    palette.hidden = true;
    root.style.overflow = "";
    if (keepFocus !== true && lastFocus && lastFocus.focus) lastFocus.focus();
  }

  if (paletteBtn) paletteBtn.addEventListener("click", openPalette);

  document.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
    if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (palette && !palette.hidden) closePalette();
      else openPalette();
    } else if (e.key === "/" && !typing && !(palette && !palette.hidden)) {
      e.preventDefault();
      openPalette();
    }
  });

  /* ---------- Language hint ---------- */
  (function () {
    var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
    var first = String(langs[0] || "").toLowerCase();
    var wantsOther = EN ? first.indexOf("zh") === 0 : first.indexOf("en") === 0;
    if (!wantsOther || store("lang-hint-dismissed")) return;
    setTimeout(function () {
      var box = el("div", "lang-hint");
      box.setAttribute("role", "region");
      box.setAttribute("aria-label", T.lang);
      box.lang = EN ? "zh-Hant" : "en";
      box.appendChild(el("span", null, T.langHint));
      var go = el("a", null, T.langGo);
      go.href = langLink ? langLink.getAttribute("href") : EN ? "../" : "en/";
      box.appendChild(go);
      var x = el("button");
      x.type = "button";
      x.setAttribute("aria-label", T.dismiss);
      x.appendChild(icon("x"));
      x.addEventListener("click", function () {
        store("lang-hint-dismissed", "1");
        box.remove();
      });
      box.appendChild(x);
      document.body.appendChild(box);
    }, 1600);
  })();

  /* ---------- Year ---------- */
  $$("[data-year]").forEach(function (n) {
    n.textContent = new Date().getFullYear();
  });

  /* ---------- Hello, developer ---------- */
  if (window.console && console.log) {
    console.log(
      "%c👋 Hi, developer!%c\n" +
        (EN ? "This site is hand-written HTML, CSS and JS. Source: " : "這個網站是手寫的 HTML、CSS 與 JS，原始碼在 ") +
        "https://github.com/Eliot5566/Su-Xiangyu-Portfolio\n" +
        (EN ? "Tip: press " : "小技巧：按 ") +
        (isMac ? "⌘K" : "Ctrl K") +
        (EN ? " to open the quick menu." : " 開啟快速選單。"),
      "font: 700 16px Inter, sans-serif; color: #0f766e",
      "font: 13px Inter, sans-serif; color: inherit"
    );
  }
})();
