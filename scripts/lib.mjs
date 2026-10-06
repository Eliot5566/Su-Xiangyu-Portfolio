// Small HTML helpers shared by the page generator and the content file.

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---------- Architecture diagrams ---------- */

function anchor(n, side, offset = 0) {
  switch (side) {
    case "l":
      return [n.x, n.y + n.h / 2 + offset];
    case "r":
      return [n.x + n.w, n.y + n.h / 2 + offset];
    case "t":
      return [n.x + n.w / 2 + offset, n.y];
    default:
      return [n.x + n.w / 2 + offset, n.y + n.h];
  }
}

function edgePath(p1, p2, fromSide, toSide, via) {
  if (via && via.length) return "M" + [p1, ...via, p2].map((p) => p.join(",")).join(" L");
  const horizontal = fromSide === "l" || fromSide === "r";
  if (horizontal && (toSide === "l" || toSide === "r")) {
    if (p1[1] === p2[1]) return `M${p1} L${p2}`;
    const mx = Math.round((p1[0] + p2[0]) / 2);
    return `M${p1} L${mx},${p1[1]} L${mx},${p2[1]} L${p2}`;
  }
  if (!horizontal && (toSide === "t" || toSide === "b")) {
    if (p1[0] === p2[0]) return `M${p1} L${p2}`;
    const my = Math.round((p1[1] + p2[1]) / 2);
    return `M${p1} L${p1[0]},${my} L${p2[0]},${my} L${p2}`;
  }
  return horizontal ? `M${p1} L${p2[0]},${p1[1]} L${p2}` : `M${p1} L${p1[0]},${p2[1]} L${p2}`;
}

/**
 * nodes: { id, x, y, w, h, label, sub?, kind?: "accent" | "ink" | "group" }
 * edges: { from, to, fs?, ts?, fo?, to_?, label?, lx?, ly?, dashed?, accent?, via? }
 */
export function diagram({ id, title, w, h, nodes, edges = [] }) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const marker = `dg-arrow-${id}`;
  const markerAccent = `dg-arrow-accent-${id}`;

  const groups = nodes
    .filter((n) => n.kind === "group")
    .map(
      (n) =>
        `<g class="dg-group"><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="16" /><text class="dg-group-label" x="${n.x + 16}" y="${n.y + 24}">${esc(n.label)}</text></g>`
    )
    .join("");

  const lines = edges
    .map((e) => {
      const a = byId[e.from];
      const b = byId[e.to];
      const fs = e.fs || "r";
      const ts = e.ts || "l";
      const p1 = anchor(a, fs, e.fo || 0);
      const p2 = anchor(b, ts, e.to_ || 0);
      const d = edgePath(p1, p2, fs, ts, e.via);
      const cls = ["dg-edge", e.dashed ? "dg-edge--dashed" : "", e.accent ? "dg-edge--accent" : ""].filter(Boolean).join(" ");
      const lx = e.lx ?? (p1[0] + p2[0]) / 2;
      const ly = e.ly ?? (p1[1] + p2[1]) / 2 - 8;
      const label = e.label ? `<text class="dg-edge-label" x="${lx}" y="${ly}" text-anchor="middle">${esc(e.label)}</text>` : "";
      return `<path class="${cls}" d="${d}" marker-end="url(#${e.accent ? markerAccent : marker})" />${label}`;
    })
    .join("");

  const boxes = nodes
    .filter((n) => n.kind !== "group")
    .map((n) => {
      const cx = n.x + n.w / 2;
      const subs = Array.isArray(n.sub) ? n.sub : n.sub ? [n.sub] : [];
      const total = 1 + subs.length;
      const lineH = 18;
      const top = n.y + n.h / 2 - ((total - 1) * lineH) / 2 + 5;
      const subText = subs.map((s, i) => `<text class="dg-sub" x="${cx}" y="${top + (i + 1) * lineH}" text-anchor="middle">${esc(s)}</text>`).join("");
      return `<g class="dg-box${n.kind ? " dg-box--" + n.kind : ""}"><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="12" /><text class="dg-label" x="${cx}" y="${top}" text-anchor="middle">${esc(n.label)}</text>${subText}</g>`;
    })
    .join("");

  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="dg-title-${id}" xmlns="http://www.w3.org/2000/svg">
<title id="dg-title-${id}">${esc(title)}</title>
<defs>
<marker id="${marker}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrowhead" d="M0,0 L10,5 L0,10 z" /></marker>
<marker id="${markerAccent}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-arrowhead dg-arrowhead--accent" d="M0,0 L10,5 L0,10 z" /></marker>
</defs>
${groups}${lines}${boxes}
</svg>`;
}

export const figure = (svg, caption, hint) =>
  `<figure class="diagram">${svg}${hint ? `<p class="diagram__hint" aria-hidden="true">${hint}</p>` : ""}<figcaption>${caption}</figcaption></figure>`;

/* ---------- Responsive images ---------- */

// Every project image ships as {name}.jpg/.webp (1200w) and {name}-640.jpg/.webp.
export const picture = ({ name, w, h, alt = "", sizes, prefix = "", lazy = true, priority = false }) =>
  `<picture><source type="image/webp" srcset="${prefix}images/projects/${name}-640.webp 640w, ${prefix}images/projects/${name}.webp 1200w" sizes="${sizes}" /><img src="${prefix}images/projects/${name}.jpg" srcset="${prefix}images/projects/${name}-640.jpg 640w, ${prefix}images/projects/${name}.jpg 1200w" sizes="${sizes}" width="${w}" height="${h}" alt="${esc(alt)}"${lazy ? ' loading="lazy"' : ""} decoding="async"${priority ? ' fetchpriority="high"' : ""} /></picture>`;

/* ---------- Content blocks ---------- */

export const decisions = (items) =>
  `<div class="decisions">${items
    .map(
      ([title, body], i) =>
        `<article class="decision"><span class="decision__num">${String(i + 1).padStart(2, "0")}</span><h3>${title}</h3><p>${body}</p></article>`
    )
    .join("")}</div>`;

export const features = (items) =>
  `<div class="feature-list">${items.map(([title, body]) => `<div class="feature-item"><h3>${title}</h3><p>${body}</p></div>`).join("")}</div>`;

export const table = (head, rows, foot) =>
  `<div class="table-wrap"><table class="data"><thead><tr>${head.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join("")}</tr>`)
    .join("")}</tbody>${foot ? `<tfoot><tr>${foot.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`)).join("")}</tr></tfoot>` : ""}</table></div>`;

export const gallery = (items, base) =>
  `<div class="gallery">${items
    .map(
      ([src, w, h, alt, caption]) =>
        `<figure><a href="${base}images/projects/${src}" target="_blank" rel="noopener">${picture({ name: src.replace(/\.jpg$/, ""), w, h, alt, sizes: "(max-width: 640px) calc(100vw - 32px), 440px", prefix: base })}</a><figcaption>${caption}</figcaption></figure>`
    )
    .join("")}</div>`;

export const tags = (items) => `<ul class="tags">${items.map((t) => `<li>${t}</li>`).join("")}</ul>`;

export const callout = (title, body) => `<div class="callout" role="note"><p class="callout__title">${title}</p>${body}</div>`;

export const list = (items) => `<ul class="prose-list">${items.map((t) => `<li>${t}</li>`).join("")}</ul>`;

export const code = (text) => `<pre class="code-block"><code>${esc(text)}</code></pre>`;
