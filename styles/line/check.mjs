#!/usr/bin/env node
// Self-check for the SF-style line set (GUIDE.md §6). Renders in headless Chrome and writes to
// check-out/:
//   sheet.png      every icon over the keylines, five weights, fill, modes, 24/16px
//   keylines.png   every icon over the keylines with its parts coloured by role
//   frames.png     every hover motion as ten frames (bold, the heaviest case); frames-1.png ...
//                  for more icons than fit one page
//   findings.md    what can be measured, then the planned and measured weights of every icon:
//     keyline  the outline (regular) misses its key shape by more than 0.4 on an axis it must
//              fill (fit: both, or only x / y for objects long in life), after taking off the
//              icon's declared optical shift (nudge)
//     canvas   ink outside 1..23 at any weight (the padding is 2; 1 is the hard stop)
//     clear    two separate parts closer than 1.5 without touching (they either join or keep
//              clear space)
//     weight   a role's share of ink differs from the icon's planned weights by more than 0.08
//     primary  no part is marked primary, or the primary takes under 15% of the ink
//     stroke   a line or outline drawn at another width than the icon's stroke
//     reach    a motion frame puts ink outside the canvas 0..24
//     pixel    at regular (stroke 2), a straight horizontal or vertical edge off the pixel grid
//     optical  the optical centre (halfway between the box centre and the centre of the filled
//              silhouette) more than 0.75 from the canvas centre; icons on a base (anchor:
//              'base') only across. Variants follow their base icon and are not measured.
//     sliver   in the fill variant, a knock-out leaves a rim or scrap of ink thinner than three
//              quarters of a stroke (at any checked stroke): it should stay inside with a rim of
//              one stroke, or run out through the edge (ends: 'in' / 'out', GUIDE.md §4.1)
//
//   node check.mjs [--only a,b]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { render, layersOf, WEIGHTS, STROKES, keyBox, clearOf, ROLE_NAME } from './kit.mjs';
import { ALL } from './icons.mjs';
import { audit } from './pixel.mjs';
import { measure } from './optical.mjs';
import { slivers } from './sliver.mjs';
import { screenshot, evaluate } from './chrome.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
// --out dir writes everything there instead of check-out/, so several checks can run at once
const out = args.includes('--out') ? path.resolve(args[args.indexOf('--out') + 1]) : path.join(here, 'check-out');
fs.mkdirSync(out, { recursive: true });
const onlyArg = args.includes('--only') ? args[args.indexOf('--only') + 1] : '';
const names = onlyArg ? onlyArg.split(',') : Object.keys(ALL);
for (const n of names) if (!ALL[n]) throw new Error(`No icon named ${n}`);
execFileSync('node', [path.join(here, 'build.mjs'), ...(args.includes('--out') ? ['--out', out] : [])], { stdio: 'inherit' });
execFileSync('node', [path.join(here, 'sheet.mjs'), '--out', out, ...(onlyArg ? ['--only', onlyArg] : [])], { stdio: 'inherit' });

const ROLE_RGB = { primary: [255, 0, 0], secondary: [0, 160, 0], detail: [0, 0, 255] };
const hex = ([r, g, b]) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
const jobs = [];
// every stroke in the allowed range, named by its weight where it has one
const STEP = STROKES.map((s) => [Object.keys(WEIGHTS).find((w) => WEIGHTS[w] === s) ?? `s${s}`, s]);
for (const n of names) for (const [w, s] of STEP) for (const v of ['outline', 'fill']) {
  const icon = ALL[n];
  jobs.push({
    n, w, v, s,
    svg: render(icon, { s, variant: v, size: 240, id: `c${jobs.length}` }),
    role: w === 'regular' && v === 'outline' && icon.weights ? render(icon, { s, size: 240, id: `r${jobs.length}`, roleColors: Object.fromEntries(Object.entries(ROLE_RGB).map(([k, c]) => [k, hex(c)])) }) : null,
    els: layersOf(icon, s, v).filter((l) => !l.ghost && !(v === 'fill' && l.on)).map((l) => ({ d: l.d, k: l.k, cap: l.cap ?? 'round', part: l.part ?? null, n: l.n ?? null, tf: l.tf ?? '', gap: !!(l.gap || l.occ || l.cutD) }))
  });
}
const res = evaluate(`<!doctype html><body>${jobs.map((j, i) => `<div data-i="${i}">${j.svg}</div>${j.role ? `<div data-r="${i}">${j.role}</div>` : ''}`).join('')}
<svg id="geo" viewBox="0 0 24 24" width="240" height="240"></svg><canvas id="cv" width="240" height="240"></canvas><pre id="out"></pre><script>
const jobs = ${JSON.stringify(jobs.map(({ svg, role, ...j }) => ({ ...j, role: !!role })))};
const ROLE = ${JSON.stringify(ROLE_RGB)};
const NS = 'http://www.w3.org/2000/svg', geo = document.getElementById('geo');
const res = jobs.map(() => ({}));
jobs.forEach((job, i) => {
  // outer bounds of what is drawn, and the stroke widths used
  const svg = document.querySelector('[data-i="' + i + '"] svg'), box = svg.getBoundingClientRect(), u = 24 / box.width;
  let b = [99, 99, -99, -99]; const widths = new Set();
  for (const p of svg.querySelectorAll('path')) {
    if (p.closest('defs')) continue;
    const M = p.getScreenCTM(), L = p.getTotalLength(), st = p.getAttribute('stroke') && p.getAttribute('stroke') !== 'none';
    const sc = Math.hypot(M.a, M.b) * u, half = st ? (+p.getAttribute('stroke-width') / 2) * sc : 0;
    if (st && p.getAttribute('fill') === 'none') widths.add(+(+p.getAttribute('stroke-width') * sc).toFixed(2));
    // a round cap or join reaches half the stroke every way; a butt cap only sideways
    const butt = p.getAttribute('stroke-linecap') === 'butt', at = (k) => { const q = p.getPointAtLength(Math.min(L, Math.max(0, L * k / 160))); return [(M.a * q.x + M.c * q.y + M.e - box.left) * u, (M.b * q.x + M.d * q.y + M.f - box.top) * u]; };
    for (let k = 0; k <= 160; k++) {
      const [x, y] = at(k);
      if (!butt || !half) { b = [Math.min(b[0], x - half), Math.min(b[1], y - half), Math.max(b[2], x + half), Math.max(b[3], y + half)]; continue; }
      const [x1, y1] = at(k + 0.5), [x0, y0] = at(k - 0.5), tl = Math.hypot(x1 - x0, y1 - y0) || 1, nx = -(y1 - y0) / tl * half, ny = (x1 - x0) / tl * half;
      for (const [px, py] of [[x + nx, y + ny], [x - nx, y - ny]]) b = [Math.min(b[0], px), Math.min(b[1], py), Math.max(b[2], px), Math.max(b[3], py)];
    }
  }
  res[i].box = b.map((v) => +v.toFixed(2)); res[i].widths = [...widths];
  // clear space between separate parts: centre lines sampled, minus the stroke halves
  const pts = job.els.map((e) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', e.d); geo.appendChild(p);
    const L = p.getTotalLength(), list = [], k = e.tf ? +((e.tf.match(/scale\\(([\\d.]+)\\)/) || [0, 1])[1]) : 1;
    const t = e.tf ? (e.tf.match(/^translate\\(([\\d.-]+) ([\\d.-]+)\\)$/) || null) : null;
    for (let j = 0; j <= 160; j++) { const q = p.getPointAtLength(L * j / 160);
      list.push(t ? [q.x + +t[1], q.y + +t[2]] : e.tf ? [12 + (q.x - 12) * k, 12 + (q.y - 12) * k] : [q.x, q.y]); }
    p.remove(); return { ...e, list, half: e.k === 'solid' ? 0 : job.s / 2 }; });
  // the reach of a stroke at a sample toward a point: a butt-capped line reaches only sideways
  const reachAt = (E, j, q) => {
    if (E.cap !== 'butt') return E.half;
    const p = E.list[j], a = E.list[Math.max(0, j - 1)], b = E.list[Math.min(E.list.length - 1, j + 1)];
    const tx = b[0] - a[0], ty = b[1] - a[1], tl = Math.hypot(tx, ty) || 1, ux = q[0] - p[0], uy = q[1] - p[1], ul = Math.hypot(ux, uy) || 1;
    return E.half * Math.abs((tx * uy - ty * ux) / (tl * ul));
  };
  // Every pair of parts: joined (they overlap), or apart with some clear space.
  const pairs = [], root = pts.map((_, k) => k), top = (k) => (root[k] === k ? k : (root[k] = top(root[k])));
  for (let a = 0; a < pts.length; a++) for (let c = a + 1; c < pts.length; c++) {
    const A = pts[a], C = pts[c];
    if ((A.part && A.part === C.part) || A.gap || C.gap) { root[top(a)] = top(c); continue; }
    let d = 1e9, clear = 1e9;
    A.list.forEach((p, ja) => C.list.forEach((q, jc) => { const dd = Math.hypot(p[0] - q[0], p[1] - q[1]); d = Math.min(d, dd); clear = Math.min(clear, dd - reachAt(A, ja, q) - reachAt(C, jc, p)); }));
    clear = Math.max(clear, d - A.half - C.half - (A.cap === 'butt' || C.cap === 'butt' ? 1e9 : 0));
    if (d <= 0.05 || clear <= -Math.min(A.half, C.half) * 0.9) root[top(a)] = top(c);
    else pairs.push({ a, c, clear });
  }
  // Two parts that are each joined to a third read as one connected piece (a headboard and the
  // legs of a bed): the space between them is the shape of that piece, not a near miss.
  let worst = null;
  for (const { a, c, clear } of pairs) {
    if (top(a) === top(c)) continue;
    if (!worst || clear < worst.clear) worst = { a: pts[a].n || a, b: pts[c].n || c, clear: +clear.toFixed(2) };
  }
  res[i].worst = worst;
});
// ink share by role, from the role-coloured render
const ctx = document.getElementById('cv').getContext('2d', { willReadFrequently: true });
let pending = jobs.filter((j) => j.role).length;
const finish = () => { document.getElementById('out').textContent = JSON.stringify(res); };
if (!pending) finish();
jobs.forEach((job, i) => {
  if (!job.role) return;
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, 240, 240); ctx.drawImage(img, 0, 0, 240, 240);
    const d = ctx.getImageData(0, 0, 240, 240).data, count = { primary: 0, secondary: 0, detail: 0 };
    for (let k = 0; k < d.length; k += 4) {
      const a = d[k + 3] / 255; if (a < 0.02) continue;
      let best = null, bd = 1e9;
      for (const [r, c] of Object.entries(ROLE)) { const dd = (d[k] - c[0]) ** 2 + (d[k + 1] - c[1]) ** 2 + (d[k + 2] - c[2]) ** 2; if (dd < bd) { bd = dd; best = r; } }
      count[best] += a;
    }
    const tot = count.primary + count.secondary + count.detail;
    res[i].share = Object.fromEntries(Object.entries(count).map(([k, v]) => [k, +(v / tot).toFixed(3)]));
    if (--pending <= 0) finish();
  };
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(document.querySelector('[data-r="' + i + '"]').innerHTML)));
});
</script>`);

const find = [], weightsTable = [];
jobs.forEach((j, i) => {
  const r = res[i], icon = ALL[j.n], allow = icon.allow || {};
  const add = (rule, text) => { if (!allow[rule]) find.push(`- \`${j.n}\` ${j.w}/${j.v} **${rule}**: ${text}`); };
  if (j.w === 'regular' && j.v === 'outline') {
    // an optical shift (nudge, GUIDE.md §1.5) is taken off before the box is compared
    const [dx, dy] = icon.nudge || [0, 0], bx = [r.box[0] - dx, r.box[1] - dy, r.box[2] - dx, r.box[3] - dy];
    const [x0, y0, x1, y1] = keyBox(icon.key), miss = [bx[0] - x0, bx[1] - y0, x1 - bx[2], y1 - bx[3]].map((v) => +v.toFixed(2));
    const axes = icon.fit === 'x' ? [0, 2] : icon.fit === 'y' ? [1, 3] : [0, 1, 2, 3];
    const px = audit(icon, j.s);
    if (px.length) add('pixel', `不在整像素上：${px.join('，')}`);
    if (axes.some((k) => Math.abs(miss[k]) > 0.4)) add('keyline', `离关键形状 左 ${miss[0]} 上 ${miss[1]} 右 ${miss[2]} 下 ${miss[3]}`);
    if (icon.weights && r.share) {
      const plan = { primary: 0, secondary: 0, detail: 0, ...icon.weights };
      const off = Object.keys(plan).filter((k) => Math.abs(plan[k] - r.share[k]) > 0.08);
      weightsTable.push(`| \`${j.n}\` | ${Object.keys(plan).map((k) => `${Math.round(plan[k] * 100)} / ${Math.round(r.share[k] * 100)}`).join(' | ')} |`);
      if (off.length) add('weight', off.map((k) => `${ROLE_NAME[k]} 预设 ${Math.round(plan[k] * 100)}% 实测 ${Math.round(r.share[k] * 100)}%`).join('，'));
      if (!plan.primary || r.share.primary < 0.15) add('primary', `主体只占 ${Math.round(r.share.primary * 100)}%`);
    }
  }
  if (r.box[0] < 1 || r.box[1] < 1 || r.box[2] > 23 || r.box[3] > 23) add('canvas', `范围 ${r.box.join(', ')}`);
  if (r.worst && r.worst.clear < clearOf(j.s) - 0.05) add('clear', `${r.worst.a} 与 ${r.worst.b} 只隔 ${r.worst.clear}`);
  const odd = r.widths.filter((w) => Math.abs(w - j.s) > 0.02);
  if (odd.length) add('stroke', `出现了 ${odd.join(', ')} 的线宽（应为 ${j.s}）`);
});

// optical centre (GUIDE.md §1.5)
const own = names.filter((n) => !ALL[n].kind);
const opt = measure(own);
for (const n of own) {
  const { box, mass } = opt[n], icon = ALL[n];
  const o = [0, 1].map((k) => +(((box[k] + box[k + 2]) / 2 + mass[k]) / 2 - 12).toFixed(2));
  const TOL = 0.75, off = icon.anchor === 'base' ? Math.abs(o[0]) > TOL : Math.abs(o[0]) > TOL || Math.abs(o[1]) > TOL;
  if (off && !(icon.allow || {}).optical) find.push(`- \`${n}\` **optical**: 光学中心偏离画布中心 ${o[0]}, ${o[1]}`);
}

// slivers left by knock-outs in the fill variant (GUIDE.md §4.1)
for (const f of slivers(names, STROKES)) {
  if ((ALL[f.n].allow || {}).sliver) continue;
  find.push(`- \`${f.n}\` s${f.s}/fill **sliver**: 镂空留下细边或残片，面积 ${f.area}，位置 ${f.at.join(', ')}`);
}

// motion: filmstrips and reach
// The filmstrip page measures only the icons asked for, at most FRAME_PAGE at a time: one page of
// a full set would be taller than Chrome can capture (frames-1.png, frames-2.png ... then).
const FRAME_PAGE = 240;
const moving = names.filter((n) => ALL[n].fx);
const framePages = Array.from({ length: Math.max(1, Math.ceil(moving.length / FRAME_PAGE)) }, (_, i) => moving.slice(i * FRAME_PAGE, (i + 1) * FRAME_PAGE));
const framesPage = fs.readFileSync(path.join(out, 'frames.html'), 'utf8');
framePages.forEach((list, i) => {
  const html = `<script>globalThis.FRAMES_ONLY = ${JSON.stringify(list.join(','))};</script>` + framesPage;
  for (const r of evaluate(html)) if (names.includes(r.name) && !(ALL[r.name].allow || {}).reach) find.push(`- \`${r.name}\` **reach**: 动效中超出画布 ${r.out}`);
  const file = framePages.length > 1 ? `frames-${i + 1}.png` : 'frames.png';
  screenshot(html, path.join(out, file), { width: 800, height: 24 + list.length * 55 * 1.4 });
});

fs.writeFileSync(path.join(out, 'findings.md'), `# Findings\n\n${find.length ? find.join('\n') : '无'}\n\n## 权重（预设 / 实测，%）\n\n| 图标 | 主体 | 辅助 | 细节 |\n| --- | --- | --- | --- |\n${weightsTable.join('\n')}\n`);
console.log(find.length ? find.join('\n') : 'Findings: 无');
// CI fails while any finding is left.
if (find.length) process.exitCode = 1;
