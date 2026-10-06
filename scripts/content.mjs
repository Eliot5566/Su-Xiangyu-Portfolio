// Case-study and résumé content. Every number here comes from the project's README or source code.
import { diagram, figure, decisions, features, table, gallery, tags, callout, list } from "./lib.mjs";

const HINT = { zh: "← 左右滑動查看完整架構 →", en: "← Scroll sideways to see the whole diagram →" };

/* ======================================================================
   Diagrams
   ====================================================================== */

const D = {};

D.paperRadar = (zh) =>
  diagram({
    id: "paper-radar",
    title: zh ? "Paper Radar 處理流程" : "Paper Radar pipeline",
    w: 1100,
    h: 320,
    nodes: [
      { id: "src", x: 20, y: 80, w: 170, h: 140, label: zh ? "資料來源" : "Sources", sub: ["arXiv · bioRxiv", "PubMed · RSS", "Reddit · Bluesky"] },
      { id: "dedupe", x: 235, y: 115, w: 140, h: 70, label: zh ? "去重" : "Dedupe", sub: zh ? "比對近 14 天" : "vs. last 14 days" },
      {
        id: "jev",
        x: 410,
        y: 75,
        w: 225,
        h: 150,
        kind: "accent",
        label: zh ? "Jev 判讀" : "Jev judges",
        sub: zh ? ["每篇論文一次呼叫", "每個興趣一個是非題", "論文類型 · 是否附程式碼"] : ["one call per paper", "a yes/no per interest", "paper type · code released?"],
      },
      { id: "decide", x: 675, y: 100, w: 175, h: 100, label: zh ? "程式決策" : "Code decides", sub: ["max / noisy-OR", zh ? "門檻 · 排除條件" : "thresholds · exclusions"] },
      { id: "o1", x: 880, y: 22, w: 210, h: 64, label: zh ? "網頁 + RSS" : "Web page + RSS", sub: "GitHub Pages" },
      { id: "o2", x: 880, y: 118, w: 210, h: 64, label: zh ? "通知" : "Digests", sub: "Slack · Discord · Telegram" },
      { id: "o3", x: 880, y: 214, w: 210, h: 64, label: zh ? "稽核紀錄" : "Audit trail", sub: zh ? "每個決策與機率" : "every decision + probability" },
      { id: "tldr", x: 410, y: 252, w: 225, h: 56, label: zh ? "可選：LLM 一句話摘要" : "Optional LLM TL;DR", sub: zh ? "只處理前 10 篇" : "top 10 only" },
    ],
    edges: [
      { from: "src", to: "dedupe" },
      { from: "dedupe", to: "jev" },
      { from: "jev", to: "decide", accent: true },
      { from: "decide", to: "o1" },
      { from: "decide", to: "o2" },
      { from: "decide", to: "o3" },
      { from: "decide", to: "tldr", fs: "b", ts: "r", dashed: true },
    ],
  });

D.jevArena = (zh) =>
  diagram({
    id: "jev-arena",
    title: zh ? "Jev Arena 單次決策迴圈" : "Jev Arena decision loop",
    w: 1100,
    h: 330,
    nodes: [
      { id: "g", x: 470, y: 50, w: 250, h: 220, kind: "group", label: zh ? "同一個請求，平行提問" : "ONE REQUEST, IN PARALLEL" },
      { id: "engine", x: 10, y: 95, w: 210, h: 130, label: zh ? "決定性引擎" : "Deterministic engine", sub: zh ? ["每秒 20 ticks", "種子亂數 · 精確重播"] : ["20 ticks / second", "seeded RNG · exact replays"] },
      { id: "facts", x: 250, y: 105, w: 180, h: 110, label: zh ? "狀態事實" : "Fight facts", sub: zh ? ["重擊 0.4 秒後發射", "距離 6.2 m · 護盾就緒"] : ["heavy shot in 0.4 s", "6.2 m · shield ready"] },
      { id: "q1", x: 490, y: 88, w: 210, h: 46, label: zh ? "移動 · Choice" : "Move · Choice" },
      { id: "q2", x: 490, y: 144, w: 210, h: 46, label: zh ? "動作 · Choice" : "Action · Choice" },
      { id: "q3", x: 490, y: 200, w: 210, h: 46, label: zh ? "反射 · 是非題 × N" : "Reflexes · yes/no × N" },
      { id: "brain", x: 760, y: 105, w: 150, h: 110, kind: "accent", label: zh ? "大腦" : "Brain", sub: ["Jev · System One", "LLM · mock"] },
      { id: "decide", x: 950, y: 95, w: 130, h: 130, label: zh ? "決策" : "Decision", sub: zh ? ["反射觸發優先", "其次看信心", "否則用備援"] : ["fired reflex wins", "then confidence", "else fallback"] },
    ],
    edges: [
      { from: "engine", to: "facts" },
      { from: "facts", to: "q2" },
      { from: "q2", to: "brain", accent: true },
      { from: "brain", to: "decide" },
      { from: "decide", to: "engine", fs: "b", ts: "b", via: [[1015, 300], [115, 300]], dashed: true, label: zh ? "套用到下一個 tick" : "applied on the next tick", lx: 565, ly: 292 },
    ],
  });

D.orderSystem = (zh) =>
  diagram({
    id: "order-system",
    title: zh ? "手機點餐系統架構" : "Mobile ordering system architecture",
    w: 1000,
    h: 380,
    nodes: [
      { id: "dc", x: 200, y: 20, w: 780, h: 340, kind: "group", label: "DOCKER COMPOSE" },
      { id: "c1", x: 20, y: 40, w: 160, h: 60, label: zh ? "顧客手機" : "Customer phone", sub: zh ? "掃碼點餐 · 追蹤進度" : "scan · order · track" },
      { id: "c2", x: 20, y: 120, w: 160, h: 60, label: zh ? "廚房看板" : "Kitchen board", sub: zh ? "每 5 秒輪詢" : "polls every 5 s" },
      { id: "c3", x: 20, y: 200, w: 160, h: 60, label: zh ? "管理後台" : "Admin console", sub: zh ? "菜單 · 報表" : "menu · reports" },
      { id: "nginx", x: 230, y: 120, w: 140, h: 60, label: "Nginx", sub: zh ? "反向代理" : "reverse proxy" },
      { id: "mw", x: 410, y: 105, w: 200, h: 90, kind: "accent", label: "Middleware", sub: zh ? ["JWT（jose）驗證", "RBAC 權限守衛"] : ["JWT (jose) auth", "RBAC guard"] },
      { id: "routes", x: 650, y: 105, w: 310, h: 90, label: "Next.js 14 App Router", sub: zh ? "頁面 + 16 個 API 路由" : "pages + 16 API routes" },
      { id: "svc", x: 650, y: 255, w: 310, h: 85, label: zh ? "Service 層 + Zod" : "Service layer + Zod", sub: zh ? ["伺服器端計價 · 加料規則", "訂單狀態機"] : ["server-side pricing · option rules", "order state machine"] },
      { id: "prisma", x: 410, y: 265, w: 200, h: 65, label: "Prisma ORM", sub: zh ? "11 個資料模型" : "11 data models" },
      { id: "pg", x: 230, y: 265, w: 140, h: 65, label: "PostgreSQL", sub: "16" },
    ],
    edges: [
      { from: "c1", to: "nginx" },
      { from: "c2", to: "nginx" },
      { from: "c3", to: "nginx" },
      { from: "nginx", to: "mw" },
      { from: "mw", to: "routes", accent: true },
      { from: "routes", to: "svc", fs: "b", ts: "t" },
      { from: "svc", to: "prisma", fs: "l", ts: "r" },
      { from: "prisma", to: "pg", fs: "l", ts: "r" },
    ],
  });

D.parking = (zh) =>
  diagram({
    id: "parking-helper",
    title: zh ? "停車神隊友架構" : "Parking Helper architecture",
    w: 1100,
    h: 390,
    nodes: [
      { id: "user", x: 20, y: 150, w: 140, h: 70, label: zh ? "LINE 使用者" : "LINE user", sub: zh ? "位置 / 地址" : "location / address" },
      { id: "line", x: 195, y: 150, w: 140, h: 70, label: "LINE Platform", sub: "Webhook" },
      { id: "express", x: 370, y: 130, w: 190, h: 110, kind: "accent", label: zh ? "Express 服務" : "Express service", sub: zh ? ["簽章驗證", "限流 10 次/分/IP"] : ["signature check", "10 req/min/IP limit"] },
      { id: "geo", x: 600, y: 30, w: 180, h: 64, label: "Google Geocoding", sub: zh ? "座標 → 縣市" : "coords → city" },
      { id: "tdx", x: 600, y: 125, w: 180, h: 80, label: zh ? "交通部 TDX" : "TDX (MOTC)", sub: zh ? ["停車場 4 端點", "路邊 4 端點"] : ["4 car-park endpoints", "4 on-street endpoints"] },
      { id: "places", x: 600, y: 225, w: 180, h: 64, label: "Google Places", sub: zh ? "補充停車場" : "extra car parks" },
      { id: "open", x: 600, y: 310, w: 180, h: 64, label: zh ? "臺北市開放資料" : "Taipei open data", sub: zh ? "備援" : "fallback" },
      { id: "merge", x: 812, y: 135, w: 160, h: 120, label: zh ? "合併 · 排序" : "Merge · rank", sub: zh ? ["約 20 m 內去重", "2.5 km 內", "依距離"] : ["dedupe within ~20 m", "within 2.5 km", "by distance"] },
      { id: "dm", x: 812, y: 30, w: 160, h: 64, label: "Distance Matrix", sub: zh ? "開車距離與時間" : "drive time" },
      { id: "reply", x: 992, y: 150, w: 100, h: 90, kind: "accent", label: zh ? "Flex 卡片" : "Flex cards", sub: zh ? ["前 5 筆", "一鍵導航"] : ["top 5", "1-tap nav"] },
    ],
    edges: [
      { from: "user", to: "line" },
      { from: "line", to: "express", accent: true },
      { from: "express", to: "geo" },
      { from: "express", to: "tdx" },
      { from: "express", to: "places" },
      { from: "express", to: "open", dashed: true },
      { from: "tdx", to: "merge" },
      { from: "places", to: "merge" },
      { from: "open", to: "merge", dashed: true },
      { from: "merge", to: "dm", fs: "t", ts: "b" },
      { from: "dm", to: "reply", fs: "r", ts: "t", accent: true },
    ],
  });

D.shiyueguo = (zh) =>
  diagram({
    id: "shiyueguo",
    title: zh ? "拾月菓架構" : "ShiYueGuo architecture",
    w: 1000,
    h: 320,
    nodes: [
      { id: "browser", x: 20, y: 105, w: 170, h: 80, label: zh ? "瀏覽器" : "Browser", sub: zh ? "手機 · 平板 · 桌機" : "phone · tablet · desktop" },
      { id: "react", x: 240, y: 90, w: 210, h: 110, kind: "accent", label: "React SPA", sub: ["React Router", "React-Bootstrap", zh ? "部署於 Render" : "on Render"] },
      { id: "api", x: 500, y: 90, w: 210, h: 110, label: "Express REST API", sub: ["bcrypt · JWT", zh ? "部署於 Render" : "on Render"] },
      { id: "db", x: 760, y: 105, w: 220, h: 80, label: "MySQL", sub: "Google Cloud SQL" },
      { id: "paypal", x: 240, y: 245, w: 210, h: 60, label: "PayPal", sub: "react-paypal-js" },
    ],
    edges: [
      { from: "browser", to: "react" },
      { from: "react", to: "api", accent: true },
      { from: "api", to: "db" },
      { from: "react", to: "paypal", fs: "b", ts: "t" },
    ],
  });

D.enterprise = (zh) =>
  diagram({
    id: "enterprise",
    title: zh ? "企業系統整合架構（簡化示意）" : "Enterprise integration (simplified)",
    w: 1160,
    h: 350,
    nodes: [
      { id: "web", x: 210, y: 20, w: 300, h: 310, kind: "group", label: zh ? "內部 WEB 系統" : "INTERNAL WEB SYSTEMS" },
      { id: "users", x: 10, y: 135, w: 170, h: 80, label: zh ? "使用部門" : "Business teams", sub: zh ? "現場作業 · 主管簽核" : "operations · approvers" },
      { id: "next", x: 230, y: 60, w: 260, h: 100, kind: "accent", label: zh ? "Next.js / React 系統" : "Next.js / React apps", sub: zh ? ["多層簽核 · 代理 · SLA", "Email 通知 · PDF · 歷程"] : ["multi-level approval · SLA", "email · PDF · audit trail"] },
      { id: "asp", x: 230, y: 195, w: 260, h: 100, label: "ASP.NET Web Forms", sub: zh ? ["VB.NET", "內部管理與報表"] : ["VB.NET", "internal tools & reports"] },
      { id: "sql", x: 565, y: 125, w: 190, h: 100, kind: "accent", label: "SQL Server", sub: ["OPENQUERY · CTE", zh ? "彙總與管理報表" : "reporting layer"] },
      { id: "erp", x: 900, y: 30, w: 250, h: 110, label: zh ? "鼎新 TIPTOP / TTOP ERP" : "Digiwin TIPTOP / TTOP ERP", sub: zh ? ["Oracle", "料件 · BOM · 工單 · 採購 · 庫存"] : ["Oracle", "items · BOM · work orders · stock"] },
      { id: "wms", x: 900, y: 210, w: 250, h: 110, label: zh ? "鼎新智能物流 WMS" : "Digiwin WMS", sub: zh ? ["MySQL · WMS API", "Java Adapter · JDBC"] : ["Smart Logistics · MySQL", "WMS API · Java adapter · JDBC"] },
    ],
    edges: [
      { from: "users", to: "next" },
      { from: "users", to: "asp" },
      { from: "next", to: "sql" },
      { from: "asp", to: "sql" },
      { from: "sql", to: "erp", accent: true, label: "Linked server", lx: 827, ly: 134 },
      { from: "sql", to: "wms", dashed: true, label: zh ? "跨庫比對" : "reconcile", lx: 827, ly: 226 },
      { from: "wms", to: "erp", fs: "t", ts: "b", dashed: true, label: zh ? "入庫 · 回寫" : "receipts · write-back", lx: 1025, ly: 180 },
    ],
  });

export const enterpriseFigure = (lang) =>
  figure(
    D.enterprise(lang === "zh"),
    lang === "zh" ? "依公開的職務內容繪製的簡化示意圖，不含公司內部細節。" : "Simplified from my public job description; no internal details.",
    HINT[lang]
  );

/* ======================================================================
   Case studies
   ====================================================================== */

export const CASES = [
  {
    slug: "paper-radar",
    cover: { src: "paper-radar-crop.jpg", w: 1200, h: 900 },
    repo: "https://github.com/Eliot5566/JEV-Paper-Radar",
    demo: "https://eliot5566.github.io/JEV-Paper-Radar/public/",
    zh: {
      title: "Paper Radar",
      tagline: "每天早上讀完 arXiv 上所有新論文，只把你該讀的那幾篇挑出來。",
      summary: "用判斷題取代生成摘要，讓模型讀完整個 arXiv 只要每天約 $0.06，並在真實的系統性回顧資料上驗證準確度。",
      coverAlt: "Paper Radar 每日頁面：讀了 50 篇論文，挑出 12 篇候選、4 篇必讀",
      demoLabel: "看今天的雷達",
      meta: [
        ["角色", "獨立開發：設計、實作、評測"],
        ["時間", "2026"],
        ["類型", "開源工具 · CLI + GitHub Actions"],
        ["授權", "MIT · GitHub 28★"],
      ],
      metrics: [
        ["$0.06", "每天讀完整個 arXiv（約 1,500 篇）"],
        ["96.9%", "4 份未看過的 Cochrane 回顧召回率"],
        ["78%", "文獻篩選工作量減少"],
        ["7", "每個工作日自動運行的公開雷達"],
      ],
      sections: [
        {
          id: "problem",
          title: "問題",
          html: `<p>arXiv 每月收到超過 30,000 篇論文（2026 年 6 月為 32,040 篇），每個工作日約 1,500 篇，已經沒有人讀得完整份清單。現有做法各有盲點：</p>
${list([
  "<strong>關鍵字通知</strong>會漏掉用詞不同的論文。",
  "<strong>Embedding 推薦</strong>會悄悄濾掉不像你過去閱讀的內容。",
  "<strong>用聊天型 LLM 每天跑過全部論文</strong>又慢又貴，所以多數工具只處理預先篩過的一小部分。",
])}`,
        },
        {
          id: "idea",
          title: "核心想法：判斷，而不是摘要",
          html: `<p>大多數 AI 工具讀完論文後寫一段摘要給你。Paper Radar 不寫任何東西：它對每個研究興趣問模型一個是非題，拿回一個校準過的機率，例如「提出了 agent 評測基準：0.97」，再由程式決定這代表什麼。</p>
<p>判斷比生成一句話便宜得多，也沒有需要解析的自由文字。成本低到可以讀完全部 1,500 篇，而不是預先篩過的少數，而那正是關鍵字通知和推薦系統弄丟你真正想讀那篇論文的地方。</p>`,
        },
        {
          id: "architecture",
          title: "架構",
          html: figure(D.paperRadar(true), "資料來源經去重後，每篇論文只呼叫模型一次；分數怎麼組合、門檻怎麼設，全部由程式決定。", HINT.zh),
        },
        {
          id: "decisions",
          title: "關鍵設計決策",
          html: decisions([
            ["原子化問題，在程式中組合", "每個興趣是一個獨立的是非題。相關度預設取 max(權重 × 機率)，也可改用 noisy-OR，讓同時符合多個興趣的論文排得更前面。"],
            ["一次請求問完所有問題", "同一篇論文的所有問題放進同一次呼叫，興趣變多只增加 token，幾乎不增加延遲。"],
            ["先檢索，再判斷", "模型只看標題、摘要與分類。作者與機構和主題無關，所以刻意不提供，避免影響判斷。"],
            ["級聯控制成本", "由判斷模型篩選數千篇；生成式模型（可選）只為最後入選的 10 篇各寫一句摘要。"],
            ["門檻可以自己驗證", "<code>calibrate</code> 指令用你自己的標註算出 Brier score、ECE 與精確率／召回率表，再回推最適合的門檻，不必只相信廠商數字。"],
            ["回饋只要一鍵", "每篇論文附 👍／👎 連結，點下去會開一個預填好的 GitHub Issue；下一次執行自動收進 <code>labels.jsonl</code> 並關閉 issue。"],
          ]),
        },
        {
          id: "screening",
          title: "延伸：系統性回顧篩選模式",
          html: `<p>文獻回顧的「標題與摘要篩選」形狀和每日雷達一樣，邏輯卻相反：所有納入條件都要成立，任何一個排除條件就淘汰。所以篩選模式用納入條件的幾何平均計分、保留每一筆被篩過的紀錄，並直接輸出 PRISMA 2020 需要的計數，以及領域常用的 WSS（work saved over sampling）。</p>
${callout("一個反直覺的發現", "<p>把複合條件拆成更多條，反而讓某個主題的工作量節省從 10.0% 掉到 0.1%。篩選是「且」的關係，多一條條件就多一次否決的機會，所以應該寫最少、最能從摘要判斷的條件。</p>")}`,
        },
        {
          id: "results",
          title: "成果與驗證",
          html: `<p>用 CLEF eHealth 2019 的 Cochrane 回顧資料驗證，比對的是審查者在「標題與摘要階段」的真實決定，篩選條件直接引用各回顧公開的選錄標準。下面 4 份在開發與修正期間完全沒有看過：</p>
${table(
  ["保留測試的回顧", "紀錄數", "應納入", "召回率", "節省工作量", "成本"],
  [
    ["降血壓藥：RAS 抑制劑 vs 其他類別", "12,319", "88", "95.5%", "68.1%", "$0.37"],
    ["血栓預防措施的落實", "3,574", "11", "100%", "95.1%", "$0.11"],
    ["青光眼睫狀體破壞手術", "2,456", "12", "100%", "95.8%", "$0.08"],
    ["COPD 患者憂鬱症的心理治療", "1,098", "16", "100%", "92.5%", "$0.03"],
  ],
  ["合計", "19,447", "127", "96.9%", "78.0%", "$0.60"]
)}
<p>開發期間用過的 8 份回顧表現差很多（合併只有 38–48%）。效能主要取決於回顧本身而不是工具：保留組是大型、低盛行率（0.3–1.5% 應納入）的搜尋，接近真實情境。三輪預先登記的預測，包含猜錯的，都公開在 repo 裡。</p>
<p>日常使用的實測：50 篇新論文 5 秒判讀完成，花費 $0.002（每篇約 932 個 input tokens）；501 篇 33 秒，花費 $0.02。</p>`,
        },
        {
          id: "limits",
          title: "誠實的限制",
          html: list([
            "只讀摘要，不讀全文。",
            "不是人工篩選者的替代品：適合當第二篩選者，或決定人工閱讀的順序。",
            "Jev 是 2026 年 9 月才推出的新模型，基準數字由廠商提供，所以要固定模型版本並自行校準。",
          ]),
        },
        {
          id: "stack",
          title: "技術",
          html: tags(["Python", "GitHub Actions", "GitHub Pages", "RSS / Atom", "TOML", "pytest", "TypeSafe Jev API", "OpenRouter", "NCBI E-utilities"]),
        },
      ],
    },
    en: {
      title: "Paper Radar",
      tagline: "Reads every new arXiv paper each morning and surfaces the few you should actually read.",
      summary: "Judgements instead of generated summaries make reading all of arXiv cost about $0.06 a day, validated against real systematic-review decisions.",
      coverAlt: "Paper Radar daily page: 50 papers read, 12 shortlisted, 4 must-read",
      demoLabel: "See today's radar",
      meta: [
        ["Role", "Solo: design, build, evaluation"],
        ["Year", "2026"],
        ["Type", "Open source · CLI + GitHub Actions"],
        ["License", "MIT · 28★ on GitHub"],
      ],
      metrics: [
        ["$0.06", "a day to read all of arXiv (~1,500 papers)"],
        ["96.9%", "recall on 4 unseen Cochrane reviews"],
        ["78%", "less screening work"],
        ["7", "public radars running every weekday"],
      ],
      sections: [
        {
          id: "problem",
          title: "The problem",
          html: `<p>arXiv now receives more than 30,000 papers a month (32,040 in June 2026), about 1,500 per weekday announcement. Nobody reads the listing any more, and the usual fixes each have a blind spot:</p>
${list([
  "<strong>Keyword alerts</strong> miss papers that use different words.",
  "<strong>Embedding recommenders</strong> quietly drop whatever doesn't look like your past reading.",
  "<strong>Running a chat LLM over the whole firehose</strong> every day is slow and expensive, so most tools only look at a pre-filtered sample.",
])}`,
        },
        {
          id: "idea",
          title: "The idea: judgements, not summaries",
          html: `<p>Most AI tools read a paper and write you a summary. Paper Radar writes nothing. It asks the model one yes/no question per interest and gets a calibrated probability back, such as <em>introduces an agent benchmark: 0.97</em>, and your code decides what that means.</p>
<p>A judgement costs a fraction of a generated sentence and leaves nothing to parse. That makes it cheap enough to read all 1,500 papers instead of a pre-filtered handful, which is exactly where keyword alerts and recommenders lose the paper you actually wanted.</p>`,
        },
        {
          id: "architecture",
          title: "Architecture",
          html: figure(D.paperRadar(false), "After de-duplication each paper costs one model call; how scores combine and where thresholds sit is decided in code.", HINT.en),
        },
        {
          id: "decisions",
          title: "Key design decisions",
          html: decisions([
            ["Atomic questions, composed in code", "Each interest is its own yes/no question. Relevance is max(weight × p) by default, or noisy-OR so papers matching several interests rank higher."],
            ["One request per paper", "Every question for a paper goes into a single call, so more interests add tokens but almost no latency."],
            ["Retrieve, then judge", "The model sees only the title, abstract and categories. Authors and affiliations don't bear on the topic, so they are deliberately left out."],
            ["A cost cascade", "The judging model filters thousands of papers; an optional generative model writes one sentence for only the ten that made the cut."],
            ["Thresholds you can verify", "<code>calibrate</code> computes the Brier score, ECE and a precision/recall table from your own labels and fits thresholds to them, instead of trusting vendor numbers."],
            ["One-click feedback", "Every paper carries 👍 / 👎 links that open a pre-filled GitHub issue; the next run folds them into <code>labels.jsonl</code> and closes the issues."],
          ]),
        },
        {
          id: "screening",
          title: "Extension: systematic-review screening",
          html: `<p>A review's title-and-abstract stage has the same shape as a daily radar but the opposite logic: a record is eligible only if every inclusion criterion holds, and one exclusion criterion disqualifies it. So screening mode scores with the geometric mean of the inclusion criteria, keeps every record it ever screened, and prints the PRISMA 2020 counts and WSS (work saved over sampling) the field uses.</p>
${callout("A counter-intuitive finding", "<p>Splitting compound criteria into more of them took one benchmark topic from 10.0% work saved to 0.1%. Screening is a conjunction, so each extra criterion is one more chance to veto a record. Write the fewest criteria an abstract can actually answer.</p>")}`,
        },
        {
          id: "results",
          title: "Results and validation",
          html: `<p>Validated on Cochrane reviews from CLEF eHealth 2019, against reviewers' real title-and-abstract decisions, with criteria quoted from each review's published selection criteria. These four were never looked at during development:</p>
${table(
  ["Held-out review", "Records", "Eligible", "Recall", "Work saved", "Cost"],
  [
    ["Antihypertensives: RAS inhibitors vs other classes", "12,319", "88", "95.5%", "68.1%", "$0.37"],
    ["Thromboprophylaxis implementation", "3,574", "11", "100%", "95.1%", "$0.11"],
    ["Cyclodestructive procedures for glaucoma", "2,456", "12", "100%", "95.8%", "$0.08"],
    ["Psychological therapies for depression in COPD", "1,098", "16", "100%", "92.5%", "$0.03"],
  ],
  ["Total", "19,447", "127", "96.9%", "78.0%", "$0.60"]
)}
<p>The eight reviews used during development did far worse (38–48% pooled). Performance is dominated by the review, not the tool: the held-out set is large and low in prevalence (0.3–1.5% eligible), which is what a real search looks like. All three rounds of pre-registered predictions, wrong ones included, are published in the repo.</p>
<p>Day to day: 50 new papers judged in 5 seconds for $0.002 (about 932 input tokens per paper); 501 papers in 33 seconds for $0.02.</p>`,
        },
        {
          id: "limits",
          title: "Honest limits",
          html: list([
            "Abstracts only, not full papers.",
            "Not a replacement for a human screener: use it as a second screener or to set the order a human reads in.",
            "Jev launched in September 2026 and its benchmark numbers are the vendor's own, so pin the model version and calibrate.",
          ]),
        },
        {
          id: "stack",
          title: "Stack",
          html: tags(["Python", "GitHub Actions", "GitHub Pages", "RSS / Atom", "TOML", "pytest", "TypeSafe Jev API", "OpenRouter", "NCBI E-utilities"]),
        },
      ],
    },
  },

  {
    slug: "jev-arena",
    cover: { src: "jev-arena.jpg", w: 1200, h: 750 },
    repo: "https://github.com/Eliot5566/jev-arena",
    demo: "https://eliot5566.github.io/jev-arena/",
    zh: {
      title: "Jev Arena",
      tagline: "用一段英文寫出你的戰士，讓模型在即時對戰中替它做反應。",
      summary: "一個比較「快思」與「慢想」的即時對戰平台：玩家寫策略，模型提供反射，天梯透過 Pull Request 自動運作。",
      coverAlt: "Jev Arena：兩個機器人即時對戰，旁邊顯示每個動作的機率",
      demoLabel: "觀看天梯",
      meta: [
        ["角色", "獨立開發：遊戲引擎、協定、介面、CI"],
        ["時間", "2026"],
        ["類型", "開源遊戲 · npm 套件"],
        ["授權", "MIT"],
      ],
      metrics: [
        ["230 ms", "決策延遲中位數"],
        ["≈3.7 次/秒", "每位戰士的決策頻率"],
        ["2–3¢", "一場 60 秒對戰的模型成本"],
        ["$0.49", "整個 30 場天梯的模型成本"],
      ],
      sections: [
        {
          id: "problem",
          title: "問題",
          html: `<p>LLM 想得好，但反應慢。等聊天模型寫完「我應該舉盾」，重擊早就打到了。</p>
<p>Jev 是另一種模型：它不寫文字，而是讀一個狀態、回傳帶校準機率的型別化決策，依廠商數據約 70 到 500 毫秒，快到可以當戰士的反射神經。Jev Arena 想回答的問題是：<strong>如果人負責策略、模型負責反射，一段話能寫出多強的戰士？</strong></p>`,
        },
        {
          id: "how",
          title: "一次決策怎麼運作",
          html: `<p>引擎先把幾何算好，轉成模型讀得懂的事實，例如「敵人正在蓄力重擊：是，0.4 秒後發射」。接著在同一個請求裡平行問三種問題：要怎麼移動、要用什麼動作，以及每個反射條件此刻是否成立。</p>
${figure(D.jevArena(true), "觸發的反射優先；沒有反射觸發時採用信心夠高的選項；都不夠有信心時，使用戰士設定的備援動作。", HINT.zh)}
<p>每個移動、動作與反射的機率都會即時顯示在戰士的「思考面板」上，看得出它為什麼這樣做。</p>`,
        },
        {
          id: "decisions",
          title: "關鍵設計決策",
          html: decisions([
            ["兩種對戰模式", "即時模式下世界不會等待，同時考驗速度與判斷；同步模式每 0.2 秒凍結、等兩邊都回答，只比較判斷。"],
            ["可完全重現的重播", "引擎只用一個有種子的亂數產生器與精確的浮點運算，一場對戰完全由種子加上每個決策落在哪個 tick 決定；<code>verify</code> 指令會重新模擬並核對結果。"],
            ["用 Pull Request 參加天梯", "CI 先用離線大腦跑冒煙測試，把結果表貼在 PR；合併後由工作流程用 Jev 重跑天梯、更新排行榜並重新發布網站。16 位以內打循環賽，更多時自動改用瑞士制。"],
            ["公平規則", "策略最多 700 字元、最多 4 個反射；每位戰士都用同一個天梯大腦與同樣的提示預算。"],
            ["大腦可以抽換", "任何支援 System One 協定的模型、透過 JSON 轉接的聊天 LLM，或給 CI 與沒有金鑰的人使用的離線 mock 大腦。"],
            ["可以直接直播", "1920×1080 的轉播畫面會依模型機率即時產生講評，可直接加進 OBS；介面支援繁體中文。"],
          ]),
        },
        {
          id: "results",
          title: "成果",
          html: `<p>第一季天梯的 30 場真實 Jev 對戰全部以 KO 結束：</p>
${table(
  ["名次", "戰士", "Elo", "勝-和-敗", "風格"],
  [
    ["1", "Trickster", "1063", "8-0-2", "繞圈、誘敵、閃開"],
    ["2", "<strong>Zen</strong>", "1062", "8-0-2", "一句話，零反射"],
    ["3", "Tortoise", "1039", "7-0-3", "躲在柱子後射擊"],
    ["4", "Berserker", "994", "5-0-5", "衝進去近戰"],
    ["5", "Glass Cannon", "938", "2-0-8", "重擊、薄甲"],
    ["6", "Sniper", "905", "0-0-10", "遠距離狙擊"],
  ]
)}
<p>最有意思的結果：只有一句話「贏得這場戰鬥，在每個當下做一個睿智冷靜的戰士會做的事」、沒有任何反射的 Zen 拿下第 2 名，只比第一名少 1 Elo；精心調校的 Sniper 則 0 勝 10 敗。</p>
<p>成本方面，一次決策約 1,400 個 input tokens，約 $0.00006；兩位戰士以 230 ms 的延遲中位數每秒各決策約 3.7 次。</p>`,
        },
        {
          id: "stack",
          title: "技術",
          html: tags(["JavaScript (ES Modules)", "Node.js", "Canvas 2D", "npm CLI", "GitHub Actions", "GitHub Pages", "YAML", "node:test", "System One API"]),
        },
      ],
    },
    en: {
      title: "Jev Arena",
      tagline: "Write a fighter in plain English and let a model pilot it in real time.",
      summary: "A real-time arena that pits fast judgement against slow thinking: players write the strategy, the model supplies the reflexes, and the ladder runs itself through pull requests.",
      coverAlt: "Jev Arena: two bots fighting in real time with each action's probability shown",
      demoLabel: "Watch the ladder",
      meta: [
        ["Role", "Solo: engine, protocol, UI, CI"],
        ["Year", "2026"],
        ["Type", "Open-source game · npm package"],
        ["License", "MIT"],
      ],
      metrics: [
        ["230 ms", "median decision latency"],
        ["≈3.7 / s", "decisions per fighter"],
        ["2–3¢", "model cost of a 60-second fight"],
        ["$0.49", "model cost of the whole 30-fight ladder"],
      ],
      sections: [
        {
          id: "problem",
          title: "The problem",
          html: `<p>LLMs think well and react slowly. By the time a chat model has written <em>"I should raise my shield"</em>, the heavy shot has already landed.</p>
<p>Jev is a different kind of model: it reads a state and returns typed decisions with calibrated probabilities in roughly 70 to 500 ms by its vendor's numbers, fast enough to be a fighter's reflexes. Jev Arena asks: <strong>if a person writes the strategy and the model supplies the reflexes, how strong a fighter can one paragraph make?</strong></p>`,
        },
        {
          id: "how",
          title: "How one decision works",
          html: `<p>The engine does the geometry and turns it into facts the model can read, such as <em>enemy charging heavy shot: YES, fires in 0.4 s</em>. Then one request asks three kinds of question in parallel: how to move, what to do with the weapons, and whether each reflex condition is true right now.</p>
${figure(D.jevArena(false), "A fired reflex wins its slot; otherwise the top choice is used if it is confident enough; otherwise the fighter's fallback.", HINT.en)}
<p>Every probability shows live in each fighter's "mind panel", so you can see why it did what it did.</p>`,
        },
        {
          id: "decisions",
          title: "Key design decisions",
          html: decisions([
            ["Two fight modes", "Real-time never waits, so it measures speed and judgement; lockstep freezes every 0.2 s until both brains answer, so it measures judgement only."],
            ["Exact replays", "One seeded RNG and only exact floating-point operations mean a fight is fully determined by its seed and the tick each decision landed on; <code>verify</code> re-simulates a replay and checks it."],
            ["A ladder you join with a pull request", "CI smoke-tests the fighter with an offline brain and posts a results table on the PR; on merge a workflow re-runs the ladder with Jev, updates the leaderboard and republishes the site. Round robin up to 16 fighters, Swiss above."],
            ["Fair-play limits", "Strategy up to 700 characters and at most 4 reflexes; every fighter gets the same ladder brain and prompt budget."],
            ["Swappable brains", "Any System One model, chat LLMs through a JSON adapter, or an offline mock brain for CI and for people without a key."],
            ["Built to be streamed", "A 1920×1080 broadcast view generates live commentary from the model's probabilities and drops straight into OBS; the UI also speaks Traditional Chinese."],
          ]),
        },
        {
          id: "results",
          title: "Results",
          html: `<p>Season one's 30 real Jev fights all ended in a KO:</p>
${table(
  ["#", "Fighter", "Elo", "W-D-L", "Style"],
  [
    ["1", "Trickster", "1063", "8-0-2", "circles, baits, dashes away"],
    ["2", "<strong>Zen</strong>", "1062", "8-0-2", "one sentence, zero reflexes"],
    ["3", "Tortoise", "1039", "7-0-3", "shoots from behind pillars"],
    ["4", "Berserker", "994", "5-0-5", "rushes in, punches"],
    ["5", "Glass Cannon", "938", "2-0-8", "heavy shots, paper armour"],
    ["6", "Sniper", "905", "0-0-10", "long range"],
  ]
)}
<p>The most interesting result: <em>Zen</em> is a single line, "Win the fight. Do whatever a wise, calm fighter would do in this exact moment.", with no reflexes at all. It finished 2nd, one Elo point behind the leader, while the carefully tuned Sniper went 0-10.</p>
<p>A decision is about 1,400 input tokens, roughly $0.00006; both fighters decide about 3.7 times a second at a 230 ms median latency.</p>`,
        },
        {
          id: "stack",
          title: "Stack",
          html: tags(["JavaScript (ES modules)", "Node.js", "Canvas 2D", "npm CLI", "GitHub Actions", "GitHub Pages", "YAML", "node:test", "System One API"]),
        },
      ],
    },
  },

  {
    slug: "order-system",
    cover: null,
    repo: "https://github.com/Eliot5566/orderSystem",
    zh: {
      title: "手機點餐系統",
      tagline: "從掃碼點餐、廚房出餐到後台報表，一套給餐廳用的完整流程。",
      summary: "顧客、廚房、管理者三種角色共用同一份資料：伺服器端計價、訂單狀態機與 RBAC 讓每個環節都可信。",
      meta: [
        ["角色", "獨立開發：資料模型、API、前端、部署"],
        ["時間", "2026"],
        ["類型", "全端 MVP"],
        ["部署", "Docker Compose：PostgreSQL + App + Nginx"],
      ],
      metrics: [
        ["3", "角色介面：顧客、廚房、後台"],
        ["11", "Prisma 資料模型"],
        ["16", "API 路由"],
        ["4", "Vitest 測試套件"],
      ],
      sections: [
        {
          id: "problem",
          title: "問題",
          html: `<p>小型餐廳的點餐同時牽涉三種人：顧客要能自己掃碼點餐並知道餐點進度，廚房要即時看到新訂單，店家要能管理菜單、桌位與員工權限，並看到營運數字。三方看的是同一批資料，金額與狀態必須一致，也不能讓任何一端竄改。</p>`,
        },
        {
          id: "features",
          title: "功能",
          html: features([
            ["顧客", "掃描桌上 QR Code 入桌（相機不可用時可手動輸入桌號），瀏覽菜單、選擇加料、購物車與結帳；「我的訂單」會自動更新狀態。"],
            ["廚房", "現場看板每 5 秒輪詢，依狀態列出訂單並推進製作進度。"],
            ["後台", "分類、商品、加料群組、桌位與使用者管理，加上營運 Dashboard 與報表圖表。"],
          ]),
        },
        {
          id: "architecture",
          title: "架構",
          html: figure(D.orderSystem(true), "所有請求先經過 Middleware 的身分與權限檢查；商業規則集中在 Service 層，由 Zod 驗證輸入。", HINT.zh),
        },
        {
          id: "decisions",
          title: "關鍵設計決策",
          html: decisions([
            ["金額只信任伺服器", "建立訂單時從資料庫重新讀取商品價格與加料選項計算金額，前端送來的金額一律不採用；商品必須屬於該店且仍在販售。"],
            ["加料規則在後端驗證", "每個加料群組都有最少／最多選擇數與是否必選，違反時回傳帶錯誤代碼的結構化錯誤，例如 <code>OPTION_RULE_VIOLATION</code>。"],
            ["訂單狀態機", "NEW → PREPARING → COMPLETED，完成前可取消；COMPLETED 與 CANCELLED 是終態，非法的狀態轉換會被擋下。"],
            ["RBAC 權限模型", "7 種權限、3 種預設角色：ADMIN 擁有全部；MANAGER 管理菜單、桌位、訂單與報表；STAFF 只能處理訂單。"],
            ["可重現的環境", "Docker Compose 等資料庫健康檢查通過才啟動 App，啟動時依序 generate → migrate deploy → seed；seed 每次重建示範資料，可重複執行。"],
            ["用真的手機測試", "Nginx 反向代理讓同一個 Wi-Fi 下的手機直接連線，實際走完掃碼點餐流程。"],
          ]),
        },
        {
          id: "quality",
          title: "品質",
          html: `<p>TypeScript 型別檢查、ESLint，以及 Vitest + Testing Library 的四組測試，涵蓋權限守衛、訂單服務、訂單 API 與報表服務。</p>`,
        },
        {
          id: "stack",
          title: "技術",
          html: tags(["Next.js 14", "React 18", "TypeScript", "Prisma 5", "PostgreSQL 16", "Zod", "jose (JWT)", "bcryptjs", "Tailwind CSS", "Recharts", "html5-qrcode", "Vitest", "Docker Compose", "Nginx"]),
        },
      ],
    },
    en: {
      title: "Mobile ordering system",
      tagline: "From QR ordering to the kitchen pass to admin reports: the full flow for a restaurant.",
      summary: "Customers, kitchen and managers share one source of truth; server-side pricing, an order state machine and RBAC keep every step trustworthy.",
      meta: [
        ["Role", "Solo: data model, API, front end, deployment"],
        ["Year", "2026"],
        ["Type", "Full-stack MVP"],
        ["Deploy", "Docker Compose: PostgreSQL + app + Nginx"],
      ],
      metrics: [
        ["3", "role-specific interfaces"],
        ["11", "Prisma data models"],
        ["16", "API routes"],
        ["4", "Vitest test suites"],
      ],
      sections: [
        {
          id: "problem",
          title: "The problem",
          html: `<p>Ordering in a small restaurant involves three groups at once: customers want to order from their table and see progress, the kitchen needs new orders immediately, and the owner manages menus, tables and staff permissions while watching the numbers. All three look at the same data, so totals and statuses must agree and no side should be able to tamper with them.</p>`,
        },
        {
          id: "features",
          title: "Features",
          html: features([
            ["Customers", "Scan the table's QR code (or type the table number if the camera is unavailable), browse the menu, pick options, check out, and watch \"My orders\" update on its own."],
            ["Kitchen", "A live board that polls every 5 seconds, lists orders by status and moves them along."],
            ["Admin", "Categories, products, option groups, tables and users, plus an operations dashboard and report charts."],
          ]),
        },
        {
          id: "architecture",
          title: "Architecture",
          html: figure(D.orderSystem(false), "Every request passes identity and permission checks in middleware; business rules live in the service layer behind Zod validation.", HINT.en),
        },
        {
          id: "decisions",
          title: "Key design decisions",
          html: decisions([
            ["Only the server sets prices", "Orders are priced from product and option prices read from the database at creation time; totals sent by the client are ignored, and products must belong to the store and be on sale."],
            ["Option rules enforced on the back end", "Each option group has min/max selections and a required flag; violations return structured errors with codes such as <code>OPTION_RULE_VIOLATION</code>."],
            ["An order state machine", "NEW → PREPARING → COMPLETED, cancellable before completion; COMPLETED and CANCELLED are terminal and illegal transitions are rejected."],
            ["RBAC", "7 permissions and 3 preset roles: ADMIN has everything; MANAGER runs menu, tables, orders and reports; STAFF handles orders only."],
            ["A reproducible environment", "Docker Compose waits for a healthy database, then runs generate → migrate deploy → seed → start; the seed rebuilds demo data and is safe to re-run."],
            ["Tested on real phones", "An Nginx reverse proxy lets phones on the same Wi-Fi connect directly and walk through the QR ordering flow."],
          ]),
        },
        {
          id: "quality",
          title: "Quality",
          html: `<p>TypeScript type checks, ESLint, and four Vitest + Testing Library suites covering the auth guard, order service, orders API and report service.</p>`,
        },
        {
          id: "stack",
          title: "Stack",
          html: tags(["Next.js 14", "React 18", "TypeScript", "Prisma 5", "PostgreSQL 16", "Zod", "jose (JWT)", "bcryptjs", "Tailwind CSS", "Recharts", "html5-qrcode", "Vitest", "Docker Compose", "Nginx"]),
        },
      ],
    },
  },

  {
    slug: "parking-helper",
    cover: { src: "parking-helper.jpg", w: 1200, h: 800 },
    repo: "https://github.com/Eliot5566/Parking-Helper",
    zh: {
      title: "停車神隊友",
      tagline: "在 LINE 傳出你的位置，馬上知道附近哪裡還有車位、怎麼收費、開車要多久。",
      summary: "把散落在政府開放資料與地圖服務裡的停車資訊，整合成 LINE 裡一個步驟就拿到的答案。",
      coverAlt: "停車神隊友：停車標誌與停在車格裡的汽車插畫",
      meta: [
        ["角色", "獨立開發"],
        ["時間", "2025"],
        ["類型", "LINE Bot · Node.js 服務"],
        ["資料", "交通部 TDX · Google Maps Platform · 臺北市開放資料"],
      ],
      metrics: [
        ["8", "依縣市平行查詢的 TDX 端點"],
        ["2.5 km", "搜尋半徑"],
        ["5", "每次回覆的結果卡片"],
        ["10 次/分", "每個 IP 的 webhook 限流"],
      ],
      sections: [
        {
          id: "problem",
          title: "問題",
          html: `<p>找車位時，常要在地圖 App、停車場 App 與政府資料之間來回切換，才能拼湊出「附近哪裡有位子、多少錢、怎麼去」。停車神隊友把這件事收進 LINE：傳一個位置，就拿到排好序的答案。</p>`,
        },
        {
          id: "flow",
          title: "使用流程",
          html: features([
            ["1. 選模式", "輸入「停車場」或「停車格」，Bot 會記住你要查的是哪一種。"],
            ["2. 給位置", "點快速回覆分享目前位置，或直接輸入地址、地標。"],
            ["3. 拿答案", "收到最近 5 個結果的卡片：名稱、地址、剩餘車位、收費說明、開車距離與時間，點一下就開啟 Google 地圖導航。"],
          ]),
        },
        {
          id: "architecture",
          title: "架構",
          html: figure(D.parking(true), "先用座標判斷縣市，再平行查詢 TDX 與 Google Places，合併去重後才計算開車距離。", HINT.zh),
        },
        {
          id: "decisions",
          title: "關鍵設計決策",
          html: decisions([
            ["依縣市平行查詢、容錯合併", "先用反向地理編碼判斷縣市，再用 <code>Promise.allSettled</code> 平行呼叫該縣市的 TDX 端點（停車場、設施、即時車位、費率；路邊則是路段、即時車位、費率、收費時段），任一端點失敗不影響其他結果。"],
            ["多來源去重", "TDX 與 Google Places 的結果合併後，座標相差約 20 公尺內視為同一處；只保留 2.5 公里內並依距離排序。"],
            ["Token 快取", "TDX 使用 OAuth client credentials，存取權杖快取到到期前 60 秒，不必每次查詢都重新換發。"],
            ["保護 API 額度", "webhook 每個 IP 每分鐘最多 10 次。每次查詢約 3 次 TDX 呼叫與 5 個 Distance Matrix elements，以 Google 免費額度估算可支撐每日上千名使用者。"],
            ["降級而不是失敗", "TDX 沒有資料時改用臺北市開放資料補上停車場清單；每次回覆都附純文字摘要，沒有卡片也能讀到結果。"],
          ]),
        },
        {
          id: "stack",
          title: "技術",
          html: tags(["Node.js", "Express 5", "LINE Messaging API", "LIFF", "axios", "express-rate-limit", "TDX API (OAuth 2.0)", "Google Geocoding", "Google Places", "Distance Matrix"]),
        },
      ],
    },
    en: {
      title: "Parking Helper",
      tagline: "Send your location on LINE and instantly see where there's a free space, what it costs and how long the drive is.",
      summary: "Parking data scattered across government open data and map services, turned into a single-step answer inside LINE.",
      coverAlt: "Parking Helper: illustration of a parking sign and a car in a bay",
      meta: [
        ["Role", "Solo"],
        ["Year", "2025"],
        ["Type", "LINE bot · Node.js service"],
        ["Data", "Taiwan MOTC TDX · Google Maps Platform · Taipei open data"],
      ],
      metrics: [
        ["8", "TDX endpoints queried in parallel per city"],
        ["2.5 km", "search radius"],
        ["5", "result cards per reply"],
        ["10 / min", "webhook rate limit per IP"],
      ],
      sections: [
        {
          id: "problem",
          title: "The problem",
          html: `<p>Finding parking usually means hopping between a map app, a car-park app and government data to piece together where there's space, what it costs and how to get there. Parking Helper puts that inside LINE: send one location, get a ranked answer.</p>`,
        },
        {
          id: "flow",
          title: "How it's used",
          html: features([
            ["1. Pick a mode", "Type \"car park\" or \"street parking\" and the bot remembers which you want."],
            ["2. Share a location", "Tap the quick reply to send your current location, or type an address or landmark."],
            ["3. Get the answer", "Cards for the nearest 5 results with name, address, free spaces, pricing, driving distance and time, and one-tap Google Maps navigation."],
          ]),
        },
        {
          id: "architecture",
          title: "Architecture",
          html: figure(D.parking(false), "Coordinates resolve to a city first; TDX and Google Places are queried in parallel, merged and de-duplicated before driving distances are computed.", HINT.en),
        },
        {
          id: "decisions",
          title: "Key design decisions",
          html: decisions([
            ["Parallel, fault-tolerant queries per city", "Reverse geocoding picks the city, then <code>Promise.allSettled</code> calls that city's TDX endpoints in parallel (car parks, facilities, live availability, rates; or road segments, availability, rates, charging hours) so one failing endpoint never sinks the rest."],
            ["De-duplicating across sources", "TDX and Google Places results are merged, points within about 20 m are treated as the same place, and only those within 2.5 km are kept, sorted by distance."],
            ["Token caching", "TDX uses OAuth client credentials; the access token is cached until 60 seconds before it expires."],
            ["Protecting API quotas", "The webhook allows 10 requests per minute per IP. A lookup costs about 3 TDX calls and 5 Distance Matrix elements, which Google's free tier covers for thousands of users a day."],
            ["Degrade, don't fail", "When TDX has no data the bot falls back to Taipei open data, and every reply carries a plain-text summary so results are readable even without cards."],
          ]),
        },
        {
          id: "stack",
          title: "Stack",
          html: tags(["Node.js", "Express 5", "LINE Messaging API", "LIFF", "axios", "express-rate-limit", "TDX API (OAuth 2.0)", "Google Geocoding", "Google Places", "Distance Matrix"]),
        },
      ],
    },
  },

  {
    slug: "shiyueguo",
    cover: { src: "shiyueguo.jpg", w: 1200, h: 674 },
    repo: "https://github.com/Eliot5566/E-Commerce-Website",
    demo: "https://last-frontendfinal.onrender.com/",
    zh: {
      title: "拾月菓｜日式和菓子電商",
      tagline: "從前端、後端到資料庫都自己打造，可以真的下單付款的電商網站。",
      summary: "資展國際結訓專題：為虛構和菓子品牌打造完整電商，包含會員、客製禮盒流程與 PayPal 金流，並部署上線。",
      coverAlt: "拾月菓首頁：富士山與櫻花插畫",
      demoLabel: "線上網站",
      demoNote: "首次開啟約需 45 秒喚醒伺服器並連線資料庫。",
      meta: [
        ["角色", "獨立設計與開發"],
        ["時間", "2023 · 資展國際結訓專題"],
        ["類型", "全端電商"],
        ["部署", "Render（前後端分開）+ Google Cloud SQL"],
      ],
      metrics: [
        ["4 步驟", "客製禮盒流程"],
        ["3 種", "禮盒尺寸"],
        ["PayPal", "線上金流"],
        ["RWD", "手機、平板、桌機"],
      ],
      sections: [
        {
          id: "background",
          title: "背景",
          html: `<p>這是資展國際前端工程師養成班的結訓專題：為虛構的日式和菓子品牌「拾月菓」打造完整電商，從視覺、前端、後端到資料庫都自己完成，並實際部署上線，可以註冊、下單並用 PayPal 付款。</p>`,
        },
        {
          id: "features",
          title: "功能",
          html: `${features([
            ["商品瀏覽", "從後端取得商品資料，以分類與卡片呈現，點擊進入詳細頁。"],
            ["會員", "登入與註冊合併在同一頁；用正規表達式即時驗證欄位，並依密碼複雜度提示強度。"],
            ["客製化禮盒", "四個步驟：選規格（三種尺寸）→ 把商品放進格子 → 挑選小卡與內容 → 確認。"],
            ["結帳與金流", "確認購物車、收件資訊與付款方式，串接 PayPal 完成付款，之後可查看訂單與歷史紀錄。"],
          ])}
${gallery(
  [
    ["shiyueguo-products.jpg", 1200, 939, "拾月菓所有商品頁：和菓子以卡片排列", "所有商品"],
    ["shiyueguo-giftbox.jpg", 1200, 589, "客製化禮盒：四步驟流程與禮盒格子", "客製化禮盒"],
    ["shiyueguo-signup.jpg", 1200, 702, "登入與註冊合併頁面", "登入／註冊"],
    ["shiyueguo-checkout.jpg", 1200, 465, "訂單頁面與 PayPal 付款按鈕", "結帳與 PayPal"],
  ],
  "../"
)}`,
        },
        {
          id: "architecture",
          title: "架構",
          html: figure(D.shiyueguo(true), "前端透過 REST API 並帶 JWT 與後端溝通；前端與 API 分別部署為兩個服務，資料庫放在 Google Cloud SQL。", HINT.zh),
        },
        {
          id: "decisions",
          title: "關鍵設計決策",
          html: decisions([
            ["密碼不以明文保存", "註冊時以 bcrypt 雜湊後才寫入資料庫，登入時比對雜湊值。"],
            ["以 JWT 維持登入", "登入成功後簽發 JWT，前端保存並在後續請求中帶上，由 API 驗證身分。"],
            ["前端先擋掉無效輸入", "欄位格式即時驗證並提示密碼強度，減少無效送出與來回。"],
            ["把複雜流程拆成步驟", "客製禮盒拆成四步，每一步只處理一件事，最後統一確認再加入購物車。"],
            ["誠實面對免費方案限制", "前後端拆成兩個服務部署，資料庫放在 Google Cloud SQL；冷啟動約 45 秒，在網站上明確告知使用者。"],
          ]),
        },
        {
          id: "stack",
          title: "技術",
          html: tags(["React", "React Router", "React-Bootstrap", "axios", "react-paypal-js", "Node.js", "Express", "MySQL (mysql2)", "bcryptjs", "JSON Web Token", "Render", "Google Cloud SQL"]),
        },
      ],
    },
    en: {
      title: "ShiYueGuo · Japanese sweets shop",
      tagline: "A complete e-commerce site, built from the front end to the database, where you can actually check out and pay.",
      summary: "Bootcamp capstone at iSpan: a full store for a fictional wagashi brand with accounts, a custom gift-box flow and PayPal checkout, deployed live.",
      coverAlt: "ShiYueGuo home page: illustration of Mount Fuji and cherry blossoms",
      demoLabel: "Live site",
      demoNote: "The live site takes about 45 seconds to wake up on first visit.",
      meta: [
        ["Role", "Solo design and development"],
        ["Year", "2023 · iSpan bootcamp capstone"],
        ["Type", "Full-stack e-commerce"],
        ["Deploy", "Render (two services) + Google Cloud SQL"],
      ],
      metrics: [
        ["4 steps", "custom gift-box flow"],
        ["3", "gift-box sizes"],
        ["PayPal", "online payments"],
        ["RWD", "phone, tablet, desktop"],
      ],
      sections: [
        {
          id: "background",
          title: "Background",
          html: `<p>My capstone for iSpan's front-end engineering bootcamp: a complete online store for ShiYueGuo, a fictional Japanese sweets brand. I handled the visual design, front end, back end and database myself and deployed it, so you can sign up, place an order and pay with PayPal.</p>`,
        },
        {
          id: "features",
          title: "Features",
          html: `${features([
            ["Catalogue", "Products load from the API and appear as category cards that open a detail page."],
            ["Accounts", "Sign-in and sign-up share one page, with regex validation as you type and a password-strength hint."],
            ["Custom gift box", "Four steps: choose one of three sizes → place sweets in the box → pick a card and message → confirm."],
            ["Checkout", "Review the cart, recipient and payment method, pay with PayPal, then see the order and order history."],
          ])}
${gallery(
  [
    ["shiyueguo-products.jpg", 1200, 939, "ShiYueGuo catalogue with sweets laid out as cards", "Catalogue"],
    ["shiyueguo-giftbox.jpg", 1200, 589, "Custom gift box: the four-step flow and the box grid", "Custom gift box"],
    ["shiyueguo-signup.jpg", 1200, 702, "Combined sign-in and sign-up page", "Sign in / sign up"],
    ["shiyueguo-checkout.jpg", 1200, 465, "Order page with PayPal buttons", "Checkout with PayPal"],
  ],
  "../../"
)}`,
        },
        {
          id: "architecture",
          title: "Architecture",
          html: figure(D.shiyueguo(false), "The front end talks to the REST API with a JWT; front end and API are deployed as two services, with the database on Google Cloud SQL.", HINT.en),
        },
        {
          id: "decisions",
          title: "Key design decisions",
          html: decisions([
            ["No plain-text passwords", "Passwords are hashed with bcrypt before they reach the database and compared by hash at sign-in."],
            ["Sessions with JWT", "A JWT is issued at sign-in, kept by the front end and sent with later requests for the API to verify."],
            ["Stop bad input early", "Fields are validated as you type with a password-strength hint, cutting failed submissions."],
            ["Break a complex flow into steps", "The gift box is four steps that each do one thing, confirmed together before going into the cart."],
            ["Be upfront about free-tier limits", "Front end and API run as separate services with the database on Google Cloud SQL; the ~45-second cold start is stated on the site."],
          ]),
        },
        {
          id: "stack",
          title: "Stack",
          html: tags(["React", "React Router", "React-Bootstrap", "axios", "react-paypal-js", "Node.js", "Express", "MySQL (mysql2)", "bcryptjs", "JSON Web Token", "Render", "Google Cloud SQL"]),
        },
      ],
    },
  },
];

/* ======================================================================
   Résumé
   ====================================================================== */

export const RESUME = {
  zh: {
    name: "蘇祥育",
    alt: "Eliot Su",
    role: "全端工程師",
    summary:
      "全端工程師，專注企業內部系統、流程數位化與跨系統整合。在金全益（MasterPiece）負責 Web 系統從需求分析、資料庫設計、前後端開發到正式環境排錯，串接鼎新 TIPTOP ERP 與智能物流 WMS。也持續開發 LINE Bot 與 LLM 應用，Paper Radar 在 Cochrane 系統性回顧資料上達到 96.9% 召回率。醫務管理與製造業背景讓我熟悉實際營運流程。",
    labels: {
      experience: "工作經歷",
      projects: "精選專案",
      skills: "技能",
      education: "學歷",
      certs: "證書與語言",
      present: "至今",
    },
    jobs: [
      {
        title: "全端工程師",
        org: "金全益股份有限公司（MasterPiece）",
        when: "2023.11 – 至今",
        bullets: [
          "負責企業內部 Web 系統的需求分析、資料庫設計、前後端開發、維護與正式環境問題排查。",
          "以 Next.js / React 開發多層簽核系統：權限控管、代理簽核、SLA、Email 通知、PDF 匯出與歷程追蹤。",
          "將品質異常處理、樣品開發、採購與工單整合等人工或 Excel 流程轉為 Web 系統，並依使用部門回饋持續優化。",
          "串接鼎新 TIPTOP / TTOP ERP（Oracle），以 SQL Server OPENQUERY、多表 JOIN、CTE 與暫存表建置採購交期、供應商達交率、設備產能、未交量與維護達成率等管理報表。",
          "以 ASP.NET Web Forms、VB.NET 開發內部管理與報表系統，整合採購、工單、收貨、退貨、交期與庫存資訊。",
          "參與鼎新智能物流 WMS 整合：串接 WMS API、追蹤工單入庫與 ERP 回寫，跨 Oracle、SQL Server、MySQL 比對數量差異、遺漏、重複轉入與同步失敗，並從 API、Log、Java Adapter / JDBC 連線池到資料庫逐層定位問題。",
        ],
      },
      {
        title: "前端工程師就業養成班",
        org: "資展國際股份有限公司",
        when: "2023.05 – 2023.10",
        bullets: ["獨立設計並實作全端電商「拾月菓」（React、Node.js、MySQL、PayPal），並帶領團隊完成全端專案。"],
      },
      {
        title: "助理",
        org: "立育實業有限公司",
        when: "2021.04 – 2023.05",
        bullets: ["協調印刷專案所需的原料、設備與人力，與供應商及團隊合作確保資源準時到位。"],
      },
      {
        title: "醫檢助理",
        org: "彰化基督教醫院",
        when: "2019.04 – 2020.01",
        bullets: ["管理院內外研究計畫與委外檢驗專案，籌辦會議並撰寫會議紀錄。"],
      },
    ],
    projects: [
      ["Paper Radar", "每天讀完 arXiv 新論文並挑出值得讀的幾篇；每天約 $0.06，4 份未看過的 Cochrane 回顧召回率 96.9%。Python · GitHub Actions"],
      ["Jev Arena", "用英文寫戰士、模型即時對戰的開源遊戲與 npm 套件；PR 驅動的 Elo 天梯、可重現重播。JavaScript · Node.js"],
      ["手機點餐系統", "顧客、廚房、後台三種介面；伺服器端計價、訂單狀態機、RBAC。Next.js · Prisma · PostgreSQL · Docker"],
      ["停車神隊友", "LINE Bot 即時查詢附近車位與收費；平行查詢 TDX 與 Google Maps 並去重排序。Node.js · Express · LINE API"],
      ["拾月菓", "全端電商，含會員、客製禮盒流程與 PayPal 金流。React · Express · MySQL"],
    ],
    skills: [
      ["語言", "TypeScript、JavaScript、Python、SQL、VB.NET、PHP"],
      ["前端", "React、Next.js、Tailwind CSS、Bootstrap、RWD"],
      ["後端", "Node.js、Express、ASP.NET Web Forms、REST API、Flask、Laravel"],
      ["資料庫", "SQL Server、Oracle、MySQL、PostgreSQL、Prisma"],
      ["企業系統", "鼎新 TIPTOP / TTOP ERP、鼎新智能物流 WMS、簽核流程設計、JDBC"],
      ["工具", "Git、GitHub Actions、Docker、Vitest、Render"],
    ],
    education: [["弘光科技大學 醫務管理系 學士", "2014 – 2018"]],
    certs:
      "Coursera：Meta Advanced React、React Basics、Programming with JavaScript、Introduction to Front-End Development；Johns Hopkins HTML, CSS, and JavaScript for Web Developers；University of Michigan Python Data Structures、Introduction to Data Science in Python 等 11 張。語言：中文（母語）、英文 CEFR B1（CSEPT 第一級）。",
  },
  en: {
    name: "Eliot Su",
    alt: "蘇祥育",
    role: "Full-stack Engineer",
    summary:
      "Full-stack engineer focused on internal enterprise systems, workflow digitization and cross-system integration. At MasterPiece I own web systems end to end and integrate Digiwin TIPTOP ERP and Smart Logistics WMS. I also build LINE bots and LLM applications; Paper Radar reached 96.9% recall on held-out Cochrane reviews. A background in healthcare administration and manufacturing gives me working knowledge of real operations.",
    labels: {
      experience: "Experience",
      projects: "Selected projects",
      skills: "Skills",
      education: "Education",
      certs: "Certificates &amp; languages",
      present: "Present",
    },
    jobs: [
      {
        title: "Full-stack Engineer",
        org: "MasterPiece (金全益股份有限公司)",
        when: "Nov 2023 – Present",
        bullets: [
          "Own internal web systems end to end: requirements, database design, development and production support.",
          "Built multi-level approval systems in Next.js / React: role-based access, delegation, SLAs, email notifications, PDF export, audit history.",
          "Replaced manual and Excel workflows (quality incidents, sample development, purchasing and work orders) with web systems, iterating with each department.",
          "Integrated Digiwin TIPTOP / TTOP ERP (Oracle) via SQL Server OPENQUERY, CTEs and temp tables; built reports on delivery dates, supplier on-time rate, capacity and maintenance.",
          "Built internal tools and reports in ASP.NET Web Forms / VB.NET for purchasing, work orders, receiving, returns and inventory.",
          "Supported the Digiwin WMS integration: traced work-order receipts and ERP write-backs, reconciled Oracle, SQL Server and MySQL, and debugged from API logs through the Java adapter and JDBC pool.",
        ],
      },
      {
        title: "Front-end Engineering Bootcamp",
        org: "iSpan International (資展國際)",
        when: "May 2023 – Oct 2023",
        bullets: ["Built the full-stack store ShiYueGuo (React, Node.js, MySQL, PayPal); led a team through a full-stack project."],
      },
      {
        title: "Assistant",
        org: "Lead Yu Industry Co., Ltd.",
        when: "Apr 2021 – May 2023",
        bullets: ["Coordinated materials, equipment and staffing for printing projects with suppliers and the team."],
      },
      {
        title: "Medical Laboratory Assistant",
        org: "Changhua Christian Hospital",
        when: "Apr 2019 – Jan 2020",
        bullets: ["Managed research projects and outsourced lab testing; organised meetings and wrote minutes."],
      },
    ],
    projects: [
      ["Paper Radar", "Reads all of arXiv daily for ~$0.06 and picks the few worth reading; 96.9% recall on unseen Cochrane reviews. Python"],
      ["Jev Arena", "Real-time arena where fighters are written in English; PR-driven Elo ladder, exact replays. JavaScript · Node.js"],
      ["Ordering system", "Customer, kitchen and admin views; server-side pricing, order state machine, RBAC. Next.js · Prisma · PostgreSQL"],
      ["Parking Helper", "LINE bot for nearby parking and prices from TDX and Google Maps. Node.js · Express · LINE API"],
      ["ShiYueGuo", "Full-stack store with accounts, a gift-box builder and PayPal checkout. React · Express · MySQL"],
    ],
    skills: [
      ["Languages", "TypeScript, JavaScript, Python, SQL, VB.NET, PHP"],
      ["Front end", "React, Next.js, Tailwind CSS, Bootstrap, responsive design"],
      ["Back end", "Node.js, Express, ASP.NET Web Forms, REST APIs, Flask, Laravel"],
      ["Databases", "SQL Server, Oracle, MySQL, PostgreSQL, Prisma"],
      ["Enterprise", "Digiwin TIPTOP / TTOP ERP, Digiwin Smart Logistics WMS, approval workflows, JDBC"],
      ["Tooling", "Git, GitHub Actions, Docker, Vitest, Render"],
    ],
    education: [["B.S. Healthcare Administration, Hungkuang University", "2014 – 2018"]],
    certs:
      "11 Coursera certificates, including Meta Advanced React and React Basics, Johns Hopkins HTML, CSS, and JavaScript for Web Developers, and University of Michigan Introduction to Data Science in Python. Languages: Mandarin (native), English CEFR B1 (CSEPT Level 1).",
  },
};
