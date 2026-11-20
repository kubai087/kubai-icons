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
//                   size     a small primary piece is too small to read (GUIDE.md 5.1): a lone
//                            mark under area 4, a lone line under 3 long, or a repeated piece
//                            (two or more alike) under area 1.25 or 2.25 long
//                   inset    a part inside another sits unevenly: its clearances to the nearby
//                            edges (under 2.6) differ by more than 0.15 (GUIDE.md 6)
//                   motion   an icon's entry in motions.mjs moves a layer it doesn't have
//                   reach    the hover motion carries something off the canvas (0–16) at some
//                            point (GUIDE.md 11)
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
// Hover motion is optional: a set without motions.mjs is checked as static.
const MOTION = fs.existsSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'motions.mjs'))
  ? (await import('./motions.mjs')).MOTION : {};

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
// Smallest primary pieces, in 16-grid units as drawn (GUIDE.md 5.1). Pieces of area 8 and up are
// parts, not details, and are not measured. The limits carry a small allowance for the raster.
const INSET = { near: 2.6, tol: 0.15 };
const SIZE = { lone: { area: 4, long: 3 }, group: { area: 1.25, long: 2.25 }, part: 8, slack: 0.95 };
const data = checked.map((n) => ({
  name: n,
  k: FIT[ICONS[n].key] || 1,
  svg: svg(n, 160),
  probe: 'data:image/svg+xml;base64,' + Buffer.from(svg(n, 160, { a: '#ff0000', b: '#0000ff' })).toString('base64'),
  els: ICONS[n].layers.flatMap((l, li) => l.d.split(/(?=M)/).filter((d) => d.trim()).map((d) => ({ d, li, sw: l.sw || 0, tone: l.tone || 'a', gap: l.gap || 0, part: l.part || null, clip: !!l.clip, cut: (l.cut || []).map((c) => ({ d: c.d, sw: c.sw || 0 })) })))
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
    let e = [(r.left - s.left) * u - h, (r.top - s.top) * u - h, (r.right - s.left) * u + h, (r.bottom - s.top) * u + h];
    // A clipped layer only shows inside its clip: measure the overlap of the two.
    const cg = p.closest('[clip-path]'), cp = cg && div.querySelector('clipPath[id="' + cg.getAttribute('clip-path').slice(5, -1) + '"] path');
    if (cp) {
      const bb = cp.getBBox(), m = cg.getScreenCTM(), k0 = m.a * u;
      const c = [(m.e - s.left) * u + bb.x * k0, (m.f - s.top) * u + bb.y * k0];
      e = [Math.max(e[0], c[0]), Math.max(e[1], c[1]), Math.min(e[2], c[0] + bb.width * k0), Math.min(e[3], c[1] + bb.height * k0)];
    }
    b = [Math.min(b[0], e[0]), Math.min(b[1], e[1]), Math.max(b[2], e[2]), Math.max(b[3], e[3])];
  }
  res[+div.dataset.i].box = b.map((v) => +v.toFixed(2));
});
// Clear space between neighbouring elements (subpaths), skipping overlaps and blue-on-blue details.
data.forEach((icon, n) => {
  const els = icon.els.map((e) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', e.d);
    if (e.sw) { p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#000'); p.setAttribute('stroke-width', e.sw); }
    geo.appendChild(p); const L = p.getTotalLength(), pts = [];
    for (let i = 0; i < 200; i++) pts.push(p.getPointAtLength((L * i) / 200));
    // Shapes knocked out of the layer (cut): what falls in them isn't drawn.
    const cuts = e.cut.map((c) => { const q = document.createElementNS(NS, 'path'); q.setAttribute('d', c.d);
      if (c.sw) { q.setAttribute('fill', 'none'); q.setAttribute('stroke', '#000'); q.setAttribute('stroke-width', c.sw); }
      geo.appendChild(q); return { p: q, sw: c.sw }; });
    return { ...e, p, pts, cuts }; });
  const hit = (a, q) => (a.sw ? a.p.isPointInStroke(q) : a.p.isPointInFill(q));
  const inside = (a, pt) => { const q = geo.createSVGPoint(); q.x = pt.x; q.y = pt.y; return hit(a, q) && !a.cuts.some((c) => hit(c, q)); };
  // Drop the outline that falls in a cut, and add the cut's own edge where it bites into the
  // layer (a badge's notch), so gaps are measured to what is drawn.
  for (const e of els) if (e.cuts.length) {
    const at = (x, y) => { const q = geo.createSVGPoint(); q.x = x; q.y = y; return q; };
    const edge = e.cuts.filter((c) => !c.sw).flatMap((c) => { const L = c.p.getTotalLength(); return Array.from({ length: 200 }, (_, i) => c.p.getPointAtLength((L * i) / 200)); })
      .filter((pt) => hit(e, at(pt.x, pt.y)));
    e.pts = [...e.pts.filter((pt) => !e.cuts.some((c) => hit(c, at(pt.x, pt.y)))), ...edge];
  }
  // Per pair of layers (B drawn after A, so B is in front). Pieces of one layer, blue details
  // next to blue details, and layers of one part are left out.
  const pairs = {};
  for (let i = 0; i < els.length; i++) for (let j = i + 1; j < els.length; j++) {
    const A = els[i], B = els[j];
    if (A.li === B.li || (A.tone === 'a' && B.tone === 'a') || (A.part && A.part === B.part) || B.clip) continue; // clip: a piece of the body itself
    const key = A.li + '-' + B.li, pair = (pairs[key] ||= { la: A.li, lb: B.li, gapB: B.gap, over: 'none', d: 1e9 });
    const bInA = B.pts.filter((pt) => inside(A, pt)).length, aInB = A.pts.filter((pt) => inside(B, pt)).length;
    if (bInA === B.pts.length && !A.sw) {
      // B sits inside A: measure its clearance to A's edge straight left, right, up and down
      // from B's outermost points.
      const h = B.sw / 2, ext = [
        B.pts.reduce((m, p) => (p.x < m.x ? p : m)), B.pts.reduce((m, p) => (p.x > m.x ? p : m)),
        B.pts.reduce((m, p) => (p.y < m.y ? p : m)), B.pts.reduce((m, p) => (p.y > m.y ? p : m))];
      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      const ins = dirs.map(([dx, dy], i) => {
        const x0 = ext[i].x + dx * h, y0 = ext[i].y + dy * h;
        for (let t = 0; t < 6; t += 0.02) if (!inside(A, { x: x0 + dx * t, y: y0 + dy * t })) return +(t * icon.k).toFixed(2);
        return 99;
      });
      (res[n].insets ||= []).push([A.li, B.li, [+((ext[0].x + ext[1].x) / 2).toFixed(1), +((ext[2].y + ext[3].y) / 2).toFixed(1)], ins]);
    }
    if (bInA === B.pts.length || aInB === A.pts.length) { if (pair.over === 'none') pair.over = 'within'; continue; } // printed on, or fully behind
    if (bInA || aInB) { pair.over = 'partial'; continue; }
    let m = 1e9; for (const a of A.pts) for (const b of B.pts) m = Math.min(m, Math.hypot(a.x - b.x, a.y - b.y));
    pair.d = Math.min(pair.d, (m - A.sw / 2 - B.sw / 2) * icon.k);
  }
  const gaps = Object.values(pairs).filter((p) => p.over === 'partial' || (p.over === 'none' && p.d < 2))
    .map((p) => [p.la, p.lb, p.over === 'partial' ? (p.gapB ? 'masked' : 'overlap') : +p.d.toFixed(2)]);
  els.forEach((e) => { e.p.remove(); e.cuts.forEach((c) => c.p.remove()); });
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
    // Separate primary pieces (red in the probe; 10px to a unit): area, sides, and whether it is
    // line-like (at least twice as long as wide).
    const on = new Uint8Array(25600), lab = new Int32Array(25600), pieces = [];
    for (let i = 0; i < 25600; i++) on[i] = px[i * 4 + 3] > 127 && px[i * 4] > px[i * 4 + 2] ? 1 : 0;
    for (let s0 = 0; s0 < 25600; s0++) {
      if (!on[s0] || lab[s0]) continue;
      lab[s0] = 1; const st = [s0]; let area = 0, x0 = 160, y0 = 160, x1 = 0, y1 = 0;
      while (st.length) { const i = st.pop(), xx = i % 160, yy = (i / 160) | 0; area++;
        x0 = Math.min(x0, xx); x1 = Math.max(x1, xx); y0 = Math.min(y0, yy); y1 = Math.max(y1, yy);
        for (const j of [i - 1, i + 1, i - 160, i + 160]) if (j >= 0 && j < 25600 && on[j] && !lab[j] && Math.abs((j % 160) - xx) <= 1) { lab[j] = 1; st.push(j); } }
      if (area < 4) continue;
      const w = (x1 - x0 + 1) / 10, h = (y1 - y0 + 1) / 10;
      pieces.push({ area: area / 100, long: Math.max(w, h), short: Math.min(w, h), at: [+((x0 + x1) / 20).toFixed(1), +((y0 + y1) / 20).toFixed(1)] });
    }
    res[n].pieces = pieces;
    if (--left === 0) document.getElementById('out').textContent = JSON.stringify(res);
  };
  im.src = icon.probe;
});
</script>`);

// How far each hover motion reaches past the canvas: 20 frames per icon, drawn on a canvas with
// a margin of 4 all round, 8px to a unit; any ink outside 0–16 counts.
const REACH = { tol: 0.2, px: 8, frames: 20 };
const reach = {};
const moving = checked.filter((n) => MOTION[n]);
if (moving.length) {
  const { withMotion, pose } = await import('./motion.mjs');
  const shots = [];
  for (const name of moving) for (let f = 1; f <= REACH.frames; f++) {
    const t = f / REACH.frames;
    let s = render(withMotion(ICONS[name], MOTION[name]), { size: 24 * REACH.px, motion: true, id: `r${uid++}` }).replace('viewBox="0 0 16 16"', 'viewBox="-4 -4 24 24"');
    for (const [k, p] of Object.entries(MOTION[name].moves)) {
      const { transform, opacity, dash, hide } = pose(p, t);
      s = s.replaceAll(`<g data-l="${k}">`, `<g data-l="${k}" transform="${transform}"${opacity === null ? '' : ` opacity="${opacity}"`}${dash === null ? '' : ` stroke-dasharray="${dash}"`}${hide ? ' stroke-opacity="0"' : ''}>`);
    }
    shots.push({ name, t, src: 'data:image/svg+xml;base64,' + Buffer.from(s).toString('base64') });
  }
  const over = evaluate(`<pre id="out"></pre><script>
const shots = ${JSON.stringify(shots)}, N = ${24 * REACH.px}, M = ${4 * REACH.px}, U = ${REACH.px};
const c = document.createElement('canvas'); c.width = c.height = N; const x = c.getContext('2d', { willReadFrequently: true });
const load = (src) => new Promise((ok) => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => ok(null); im.src = src; });
(async () => {
  const out = [];
  for (const s of shots) {
    const im = await load(s.src); if (!im) { out.push(0); continue; }
    x.clearRect(0, 0, N, N); x.drawImage(im, 0, 0); const d = x.getImageData(0, 0, N, N).data; let m = 0;
    for (let i = 0; i < N * N; i++) if (d[i * 4 + 3] > 64) { const px = i % N, py = (i / N) | 0;
      m = Math.max(m, M - px, px + 1 - (N - M), M - py, py + 1 - (N - M)); }
    out.push(+(m / U).toFixed(2));
  }
  // The frames are large; drop them before the page is read back.
  document.querySelectorAll('script').forEach((el) => el.remove());
  document.getElementById('out').textContent = JSON.stringify(out);
})();</script>`);
  shots.forEach((s, i) => { if (over[i] > (reach[s.name]?.by ?? 0)) reach[s.name] = { by: over[i], t: s.t }; });
}

const findings = [], allowed = [];
checked.forEach((name, i) => {
  const icon = ICONS[name], m = measured[i], found = [];
  const box = keyBox(icon.key), off = m.box.map((v, j) => +(v - box[j]).toFixed(2));
  if (off.some((v) => Math.abs(v) > KEY_TOL)) found.push(['keyline', `outline ${m.box.join(', ')} against the ${icon.key} shape ${box.join(', ')} (off ${off.join(', ')})`]);
  const share = m.a / (m.a + m.b);
  if (m.a < 0.002 || m.b < 0.002) found.push(['tones', `uses only the ${m.a < 0.002 ? 'secondary' : 'primary'} tone`]);
  else if (share > MAX_PRIMARY) found.push(['primary', `primary is ${(share * 100).toFixed(0)}% of the ink (at most ${MAX_PRIMARY * 100}%)`]);
  const like = (p, q) => Math.abs(p.long - q.long) <= 0.25 && Math.abs(p.short - q.short) <= 0.25;
  for (const p of m.pieces.filter((q) => q.area < SIZE.part)) {
    const group = m.pieces.some((q) => q !== p && like(p, q)), line = p.long >= 2 * p.short, lim = group ? SIZE.group : SIZE.lone;
    const what = `${group ? 'repeated' : 'lone'} ${line ? 'line' : 'mark'} at ${p.at.join(', ')}`;
    if (line && p.long < lim.long * SIZE.slack) found.push(['size', `${what} is ${p.long} long (at least ${lim.long})`]);
    else if (!line && p.area < lim.area * SIZE.slack) found.push(['size', `${what} has area ${p.area} (at least ${lim.area})`]);
  }
  for (const [la, lb, at, ins] of m.insets || []) {
    if (Math.min(...ins) < 0.1) continue; // hangs from or stands on an edge: part of the outline
    const near = ins.filter((v) => v < INSET.near);
    if (near.length >= 2 && Math.max(...near) - Math.min(...near) > INSET.tol)
      found.push(['inset', `layer ${lb} at ${at.join(', ')} sits unevenly in layer ${la}: clearances left ${ins[0]}, right ${ins[1]}, top ${ins[2]}, bottom ${ins[3]}; make the nearby ones equal`]);
  }
  for (const [la, lb, d] of m.gaps) {
    if (d === 'masked') continue;
    if (d === 'overlap') found.push(['overlap', `layer ${lb} overlaps layer ${la} with no knockout outline: give the front one gap: W`]);
    else if (Math.abs(d - GAP) > TOL) found.push(['spacing', `layers ${la} and ${lb} are ${d} apart: keep exactly ${GAP} (touching is not allowed either)`]);
  }
  const mo = MOTION[name];
  if (reach[name]?.by > REACH.tol) found.push(['reach', `the hover motion reaches ${reach[name].by} past the canvas (at ${Math.round(reach[name].t * 100)}% of it): keep every part inside 0–16`]);
  if (mo) {
    const copies = (mo.copy || []).flatMap((c) => c.of).length, adds = (mo.add || []).length;
    for (const k of Object.keys(mo.moves || {})) {
      const ok = k === 'all' || (/^\d+$/.test(k) && +k < icon.layers.length) || (/^c\d+$/.test(k) && +k.slice(1) < copies) || (/^a\d+$/.test(k) && +k.slice(1) < adds);
      if (!ok) found.push(['motion', `motions.mjs moves "${k}", but the icon has layers 0–${icon.layers.length - 1}${copies ? `, copies c0–c${copies - 1}` : ''}${adds ? `, added parts a0–a${adds - 1}` : ''}`]);
    }
    for (const c of mo.copy || []) for (const i of c.of) if (i >= icon.layers.length) found.push(['motion', `motions.mjs copies layer ${i}, which doesn't exist`]);
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
