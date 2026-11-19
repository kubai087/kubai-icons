#!/usr/bin/env node
// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Self-check for the two-tone solid style (GUIDE.md section 9). Renders in headless Chrome:
//   sheet.png       64px on a pixel grid (1 cell = 1px at 16px), then 48, 24 and 16px
//   keylines.png    every icon over the keylines, its own key shape in red
//   px16.png        real 16px at 1x, enlarged 4x with hard pixels
//   findings.md     what can be measured against the rules:
//                   keyline  the outline doesn't fill its key shape (off by more than 0.25)
//                   primary  the primary covers more than 60% of the icon's ink
//                   tones    an icon uses only one of the two tones
//                   spacing  two separate elements are not exactly 1 apart (touching counts)
//                   overlap  one element overlaps another without a knockout outline (gap)
//
//   node check.mjs [--only name,name] [--with name,name] [--icons file] [--out dir]
//
// --only checks some icons; --with adds others beside them for comparison; --icons points at
// another icons file in the same format (default icons.mjs next to this script); --out picks the
// output folder (default check-out next to this script). An icon can declare a finding it
// intends with allow: { rule: '理由' }; it is listed under Allowed instead of Findings.
// The run exits with status 1 while any finding is unresolved.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { render, keyBox, FIT, KEYLINES, TONES } from './kit.mjs';
import { screenshot, evaluate } from './chrome.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const list = (v) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : []);
const { ICONS } = await import(pathToFileURL(path.resolve(opt('--icons') || path.join(here, 'icons.mjs'))).href);
const out = path.resolve(opt('--out') || path.join(here, 'check-out'));
const only = list(opt('--only'));
const extra = list(opt('--with'));
for (const n of only) if (!ICONS[n]) throw new Error(`No icon named ${n}.`);
const missing = extra.filter((n) => !ICONS[n]);
if (missing.length) console.warn(`Skipped --with icons that aren't in this set: ${missing.join(', ')}`);
const names = only.length ? [...new Set([...only, ...extra.filter((n) => ICONS[n])])] : Object.keys(ICONS);
const checked = only.length ? only : names;
fs.mkdirSync(out, { recursive: true });

let uid = 0;
const svg = (n, size, tones) => render(ICONS[n], { size, id: `i${uid++}`, ...tones });

// --- Measurements ---------------------------------------------------------------------------
const GAP = 1, TOL = 0.15, KEY_TOL = 0.25, MAX_PRIMARY = 0.6;
const data = checked.map((n) => ({
  name: n,
  k: FIT[ICONS[n].key] || 1,
  svg: svg(n, 160),
  probe: 'data:image/svg+xml;base64,' + Buffer.from(svg(n, 160, { a: '#ff0000', b: '#0000ff' })).toString('base64'),
  els: ICONS[n].layers.flatMap((l, li) => l.d.split(/(?=M)/).filter((d) => d.trim()).map((d) => ({ d, li, sw: l.sw || 0, tone: l.tone || 'a', gap: l.gap || 0, part: l.part || null, clip: !!l.clip })))
}));
const measured = evaluate(`<!doctype html><body>${data.map((d, i) => `<div data-i="${i}">${d.svg}</div>`).join('')}
<svg id="geo" viewBox="0 0 16 16" width="160" height="160"></svg><pre id="out"></pre><script>
const data = ${JSON.stringify(data.map(({ svg, ...rest }) => rest))};
const NS = 'http://www.w3.org/2000/svg', geo = document.getElementById('geo'), res = data.map(() => ({}));
// Outer bounds, in 16-grid units, from what is actually drawn (group transforms included).
document.querySelectorAll('[data-i]').forEach((div) => {
  const s = div.querySelector('svg').getBoundingClientRect(), u = 16 / s.width;
  let b = [99, 99, -99, -99];
  for (const p of div.querySelectorAll('svg path')) {
    if (p.closest('defs')) continue;
    const r = p.getBoundingClientRect(), h = ((+p.getAttribute('stroke-width') || 0) / 2) * p.getScreenCTM().a * u;
    b = [Math.min(b[0], (r.left - s.left) * u - h), Math.min(b[1], (r.top - s.top) * u - h), Math.max(b[2], (r.right - s.left) * u + h), Math.max(b[3], (r.bottom - s.top) * u + h)];
  }
  res[+div.dataset.i].box = b.map((v) => +v.toFixed(2));
});
// Clear space between neighbouring elements (subpaths), skipping overlaps and blue-on-blue details.
data.forEach((icon, n) => {
  const els = icon.els.map((e) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', e.d);
    if (e.sw) { p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#000'); p.setAttribute('stroke-width', e.sw); }
    geo.appendChild(p); const L = p.getTotalLength(), pts = [];
    for (let i = 0; i < 200; i++) pts.push(p.getPointAtLength((L * i) / 200));
    return { ...e, p, pts }; });
  const inside = (a, pt) => { const q = geo.createSVGPoint(); q.x = pt.x; q.y = pt.y; return a.sw ? a.p.isPointInStroke(q) : a.p.isPointInFill(q); };
  // Per pair of layers (B drawn after A, so B is in front). Pieces of one layer, blue details
  // next to blue details, and layers of one part are left out.
  const pairs = {};
  for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) {
    const A = els[i], B = els[j];
    if (A.li === B.li || (A.tone === 'a' && B.tone === 'a') || (A.part && A.part === B.part) || B.clip) continue; // clip: a piece of the body itself
    const key = A.li + '-' + B.li, pair = (pairs[key] ||= { la: A.li, lb: B.li, gapB: B.gap, over: 'none', d: 1e9 });
    const bInA = B.pts.filter((pt) => inside(A, pt)).length, aInB = A.pts.filter((pt) => inside(B, pt)).length;
    if (bInA === B.pts.length || aInB === A.pts.length) { if (pair.over === 'none') pair.over = 'within'; continue; } // printed on, or fully behind
    if (bInA || aInB) { pair.over = 'partial'; continue; }
    let m = 1e9; for (const a of A.pts) for (const b of B.pts) m = Math.min(m, Math.hypot(a.x - b.x, a.y - b.y));
    pair.d = Math.min(pair.d, (m - A.sw / 2 - B.sw / 2) * icon.k);
  }
  const gaps = Object.values(pairs).filter((p) => p.over === 'partial' || (p.over === 'none' && p.d < 2))
    .map((p) => [p.la, p.lb, p.over === 'partial' ? (p.gapB ? 'masked' : 'overlap') : +p.d.toFixed(2)]);
  els.forEach((e) => e.p.remove());
  res[n].gaps = gaps;
});
// How much of the ink is primary (red in the probe) against secondary (blue).
let left = data.length;
data.forEach((icon, n) => {
  const im = new Image();
  im.onload = () => {
    const c = document.createElement('canvas'); c.width = c.height = 160; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
    const px = x.getImageData(0, 0, 160, 160).data; let a = 0, b = 0;
    for (let i = 0; i < px.length; i += 4) { const al = px[i + 3] / 255; a += (px[i] / 255) * al; b += (px[i + 2] / 255) * al; }
    res[n].a = a / 25600; res[n].b = b / 25600;
    if (--left === 0) document.getElementById('out').textContent = JSON.stringify(res);
  };
  im.src = icon.probe;
});
</script>`);

const findings = [], allowed = [];
checked.forEach((name, i) => {
  const icon = ICONS[name], m = measured[i], found = [];
  const box = keyBox(icon.key), off = m.box.map((v, j) => +(v - box[j]).toFixed(2));
  if (off.some((v) => Math.abs(v) > KEY_TOL)) found.push(['keyline', `outline ${m.box.join(', ')} against the ${icon.key} shape ${box.join(', ')} (off ${off.join(', ')})`]);
  const share = m.a / (m.a + m.b);
  if (m.a < 0.002 || m.b < 0.002) found.push(['tones', `uses only the ${m.a < 0.002 ? 'secondary' : 'primary'} tone`]);
  else if (share > MAX_PRIMARY) found.push(['primary', `primary is ${(share * 100).toFixed(0)}% of the ink (at most ${MAX_PRIMARY * 100}%)`]);
  for (const [la, lb, d] of m.gaps) {
    if (d === 'masked') continue;
    if (d === 'overlap') found.push(['overlap', `layer ${lb} overlaps layer ${la} with no knockout outline: give the front one gap: W`]);
    else if (Math.abs(d - GAP) > TOL) found.push(['spacing', `layers ${la} and ${lb} are ${d} apart: keep exactly ${GAP} (touching is not allowed either)`]);
  }
  for (const [rule, text] of found) (icon.allow?.[rule] ? allowed : findings).push(`- **${name}** (${rule}): ${text}${icon.allow?.[rule] ? ` — ${icon.allow[rule]}` : ''}`);
});
fs.writeFileSync(path.join(out, 'findings.md'), `# Findings\n\n${findings.length ? findings.join('\n') : 'None.'}\n\n## Allowed\n\n${allowed.length ? allowed.join('\n') : 'None.'}\n`);

// --- Sheets -----------------------------------------------------------------------------------
const cols = Math.min(8, names.length), rows = Math.ceil(names.length / cols);
const css = `html,body{margin:0;background:#fff;font:12px -apple-system,system-ui,sans-serif;color:#333}
  .wrap{padding:24px}h2{font-size:13px;font-weight:600;margin:0 0 12px;color:#555}
  .grid{display:grid;grid-template-columns:repeat(${cols},90px);row-gap:14px;margin-bottom:26px}
  .cell{display:flex;flex-direction:column;align-items:center;gap:6px}.cell span{color:#999;font-size:10px}
  svg{display:block}.big{position:relative}
  .big .g{position:absolute;inset:0;background-image:linear-gradient(#0001 1px,transparent 1px),linear-gradient(90deg,#0001 1px,transparent 1px);background-size:4px 4px}`;
const row = (title, size, grid) => `<h2>${title}</h2><div class="grid">${names.map((n) => `<div class="cell">${grid ? `<div class="big">${svg(n, size)}<div class="g"></div></div><span>${n}</span>` : svg(n, size)}</div>`).join('')}</div>`;
const W = 48 + cols * 90, H = 48 + rows * (64 + 14 + 22 + 48 + 14 + 24 + 14 + 16 + 14) + 4 * 51;
screenshot(`<!doctype html><meta charset="utf-8"><style>${css}</style><div class="wrap">${row('64px · 1 格 = 16px 下 1 像素', 64, true)}${row('48px', 48)}${row('24px', 24)}${row('16px', 16)}</div>`,
  path.join(out, 'sheet.png'), { width: W, height: H, scale: 2 });

const K = KEYLINES;
const keylines = (on) => {
  const line = (hl) => `fill="none" stroke="${hl ? '#F0457A' : '#3FA9F5'}" stroke-width="${hl ? 0.2 : 0.12}" ${hl ? '' : 'stroke-opacity=".55"'}`;
  const rect = (k) => `<rect x="${K[k][0]}" y="${K[k][1]}" width="${K[k][2]}" height="${K[k][3]}" ${line(on === k)}/>`;
  return `<svg viewBox="0 0 16 16" width="112" height="112" style="position:absolute;inset:0"><path d="M0 0L16 16M16 0L0 16M8 0V16M0 8H16" ${line(false)}/>
    ${['live', 'square', 'landscape', 'wide', 'portrait', 'tall', 'flat'].map(rect).join('')}<circle cx="8" cy="8" r="7" ${line(on === 'circle')}/><circle cx="8" cy="8" r="4" ${line(false)}/></svg>`;
};
screenshot(`<!doctype html><meta charset="utf-8"><style>${css}.stage{position:relative;width:112px;height:112px}.stage>svg:first-child{position:absolute;inset:0}.grid{grid-template-columns:repeat(6,140px)}</style>
  <div class="wrap"><div class="grid">${names.map((n) => `<div class="cell"><div class="stage">${svg(n, 112)}${keylines(ICONS[n].key)}</div><span>${n} · ${ICONS[n].key}</span></div>`).join('')}</div></div>`,
  path.join(out, 'keylines.png'), { width: 48 + 6 * 140, height: 60 + Math.ceil(names.length / 6) * 150, scale: 2 });

const raw = path.join(out, '.px16.png'), pw = cols * 24 + 16, ph = rows * 24 + 16;
screenshot(`<!doctype html><style>html,body{margin:0;background:#fff}.g{display:grid;grid-template-columns:repeat(${cols},24px);padding:8px}.g svg{margin:4px}</style><div class="g">${names.map((n) => svg(n, 16)).join('')}</div>`,
  raw, { width: pw, height: ph, scale: 1 });
screenshot(`<!doctype html><style>html,body{margin:0;background:#fff}img{display:block;width:${pw * 4}px;image-rendering:pixelated}</style><img src="data:image/png;base64,${fs.readFileSync(raw).toString('base64')}">`,
  path.join(out, 'px16.png'), { width: pw * 4, height: ph * 4, scale: 1 });
fs.rmSync(raw);

console.log(`Checked ${checked.length} icon(s) in ${TONES.a} / ${TONES.b}: ${findings.length} finding(s), ${allowed.length} allowed.`);
console.log(`Sheets and findings.md in ${path.relative(process.cwd(), out) || '.'}`);
// Unresolved findings fail the run, so CI catches them.
if (findings.length) process.exitCode = 1;
