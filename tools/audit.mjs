#!/usr/bin/env node
// Measures every base icon against the rules in PROMPT.md that can be measured, and scores it.
// What it cannot judge (does the object read as itself, is the motion what the object does)
// stays with the visual checklist in docs/review.md.
//
//   node tools/audit.mjs [--only a,b] [--category files] [--out check-out/audit] [--min 90] [--jobs 4]
//
// Writes report.json (every measure and finding per icon) and report.md (icons sorted from
// the lowest score), and prints a summary. --min lists only icons scoring below it.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { loadIcons, root } from './registry.mjs';
import { renderSVG, renderInner } from '../packages/core/src/render.js';
import { EASE } from '../packages/core/src/motion.js';
import { findChrome } from './chrome.mjs';
import vm from 'node:vm';

// The measures shared with the skill's own check (scripts/check.mjs): geometry runs in the
// page, motion here.
const MEASURE = fs.readFileSync(path.join(root, 'scripts', 'measure.js'), 'utf8');
const KubaiMeasure = vm.runInNewContext(`${MEASURE};KubaiMeasure`, {});

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const only = (opt('--only') || '').split(',').map((s) => s.trim()).filter(Boolean);
const category = opt('--category');
const out = path.resolve(opt('--out') || path.join(root, 'check-out', 'audit'));
const min = Number(opt('--min') || 100);
// Chrome processes run side by side; each takes one chunk of icons at a time.
const jobs = Math.max(1, Number(opt('--jobs')) || Math.min(6, Math.max(1, os.cpus().length - 2)));

// ---------- The rubric: KubaiMeasure.RULES, shared with scripts/check.mjs ----------
const RULES = KubaiMeasure.RULES;

// Base icons only: a badge is drawn once, apart, and composed onto a corner, so measuring
// it against the body's rules would only report the gap cut round it.
const { bases, failures } = await loadIcons({ composites: false, strict: false });
let set = bases;
if (only.length) set = set.filter((b) => only.some((p) => (p.endsWith('*') ? b.name.startsWith(p.slice(0, -1)) : b.name === p)));
if (category) set = set.filter((b) => b.category === category);
if (!set.length) { console.error('Nothing to audit.'); process.exit(1); }

// Time samples of the hover: the runtime eases real time, so equal steps here are equal time.
const T = 24;
const times = Array.from({ length: T + 1 }, (_, i) => i / T);

const VB = '0 -3 31 31';
// Moments during the hover (real time) where outlines are checked too.
const MIDS = [0.15, 0.35, 0.6];
function prepare(icon) {
  const item = { name: icon.name, cat: icon.category, allow: icon.allow || null, errors: [], frames: [], geo: [], steps: [] };
  const bad = (s) => /NaN|undefined|Infinity/.test(s);
  const markup = [];
  for (const t of times) {
    try {
      const svg = renderSVG(icon, { size: 94, pad: 8, progress: EASE(t), k: 'a' });
      if (bad(svg)) item.errors.push(`NaN/undefined at t=${t.toFixed(2)}`);
      item.frames.push('data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64'));
      markup.push(svg);
    } catch (e) { item.errors.push(`t=${t.toFixed(2)}: ${e.message}`); item.frames.push(null); markup.push(null); }
  }
  Object.assign(item, KubaiMeasure.motion(markup));
  // Rest and end are measured in full; the moments in between for outlines only.
  for (const [k, t] of [0, 1, ...MIDS].entries()) {
    try {
      const inner = renderInner(icon, { k: `g${k}`, progress: EASE(t), paint: 'template', names: false });
      item.geo.push({ svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB}" width="310" height="310">${inner}</svg>`, outlinesOnly: k > 1 });
    } catch (e) { item.errors.push(`t=${t}: ${e.message}`); item.geo.push(null); }
  }
  return item;
}

// Runs in the page: raster measures of the motion, and geometry of the rest and end poses.
function pageScript() {
  const W = 94, U = 94 / 47, OX = -8, OY = -11;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = W;
  const g = cv.getContext('2d', { willReadFrequently: true });
  const small = document.createElement('canvas'); small.width = 24; small.height = 24;
  const gs = small.getContext('2d', { willReadFrequently: true });
  const load = (src) => new Promise((r) => { const i = new Image(); i.onload = () => r(i); i.onerror = () => r(null); i.src = src; });
  const bbox = (a, thr = 160) => {
    let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    for (let y = 0; y < W; y++) for (let x = 0; x < W; x++) if (a[(y * W + x) * 4 + 3] > thr) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    return x1 < 0 ? null : [x0 / U + OX, y0 / U + OY, (x1 + 1) / U + OX, (y1 + 1) / U + OY].map((v) => Math.round(v * 10) / 10);
  };
  // Pixels (of the 94×94 frame) that visibly change: any channel moves by more than 48.
  // Anti-aliasing and filter noise move many pixels a little; real motion moves some a lot.
  const diff = (a, b) => { let s = 0; for (let i = 0; i < a.length; i += 4) if (Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2]), Math.abs(a[i + 3] - b[i + 3])) > 48) s++; return s; };

  return async (DATA) => {
    const res = [];
    for (const d of DATA) {
      const r = { name: d.name };
      const px = [];
      for (const src of d.frames) {
        if (!src) { px.push(null); continue; }
        const im = await load(src); g.clearRect(0, 0, W, W); if (im) g.drawImage(im, 0, 0, W, W);
        px.push(g.getImageData(0, 0, W, W).data.slice());
      }
      if (px.every(Boolean)) {
        r.boxes = px.map((p) => bbox(p));
        r.diffs = px.slice(1).map((p, i) => Math.round(diff(px[i], p)));
        r.restEnd = Math.round(diff(px[0], px[px.length - 1]));
        // How far the icon ever gets from its rest pose (a swing returns to it at the end).
        r.reach = Math.max(...px.map((p) => diff(px[0], p)));
        // Ink at 24px: the share of the 24×24 tile that is covered (alpha-weighted).
        const im = await load(d.frames[0]);
        gs.clearRect(0, 0, 24, 24);
        // The 94px frame spans 47 units; the 24px icon spans 31, so crop the middle.
        gs.drawImage(im, 8 * U, 8 * U, 31 * U, 31 * U, 0, 0, 24, 24);
        const a = gs.getImageData(0, 0, 24, 24).data; let s = 0; for (let i = 3; i < a.length; i += 4) s += a[i] / 255;
        r.ink = Math.round(s / 576 * 1000) / 1000;
      }
      r.geo = d.geo.map((g) => {
        if (!g) return null;
        const host = document.createElement('div');
        host.innerHTML = g.svg;
        document.body.appendChild(host);
        try { return KubaiMeasure.geometry(host.firstElementChild, { outlinesOnly: g.outlinesOnly }); } catch (e) { return { failed: e.message }; } finally { host.remove(); }
      });
      res.push(r);
    }
    return res;
  };
}

async function runChunk(items) {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'kubai-audit-'));
  try {
    const data = items.map(({ name, frames, geo }) => ({ name, frames, geo }));
    const html = `<!doctype html><meta charset="utf-8"><body><script>${MEASURE}</script><script>
      const run = (${pageScript.toString()})();
      run(${JSON.stringify(data)}).then((r) => { const p = document.createElement('pre'); p.id = 'out'; p.textContent = JSON.stringify(r); document.body.appendChild(p); })
        .catch((e) => { const p = document.createElement('pre'); p.id = 'out'; p.textContent = JSON.stringify({ fatal: String(e && e.stack || e) }); document.body.appendChild(p); });
    </script>`;
    const page = path.join(work, 'p.html');
    fs.writeFileSync(page, html);
    // Chrome can exit with an error while tearing down after it has printed the page; the
    // page is what counts, so a failed exit is only fatal when nothing came out.
    let dom;
    try {
      ({ stdout: dom } = await promisify(execFile)(findChrome(), ['--headless=new', '--disable-gpu', `--user-data-dir=${path.join(work, 'profile')}`,
        '--virtual-time-budget=900000', '--dump-dom', 'file://' + page], { maxBuffer: 1 << 30, timeout: 1800000 }));
    } catch (e) {
      if (!e.stdout) throw e;
      dom = e.stdout;
    }
    const m = /<pre id="out">([\s\S]*?)<\/pre>/.exec(dom);
    if (!m) throw new Error('the audit page returned nothing');
    const r = JSON.parse(m[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
    if (r.fatal) throw new Error(r.fatal);
    return r;
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
}

// ---------- Measure ----------
const CHUNK = 20;
const chunks = [];
for (let i = 0; i < set.length; i += CHUNK) chunks.push(set.slice(i, i + CHUNK));
const results = new Array(chunks.length);
let next = 0, done = 0;
await Promise.all(Array.from({ length: Math.min(jobs, chunks.length) }, async () => {
  while (next < chunks.length) {
    const c = next++;
    const items = chunks[c].map(prepare);
    const r = await runChunk(items);
    results[c] = items.map((it, j) => ({ name: it.name, cat: it.cat, allow: it.allow, errors: it.errors, steps: it.steps, speed: it.speed, ...r[j] }));
    done += items.length;
    process.stdout.write(`\r${done}/${set.length}`);
  }
}));
const measured = results.flat();
process.stdout.write('\n');

// ---------- Score ----------
const inks = measured.map((m) => m.ink).filter((v) => v > 0).sort((a, b) => a - b);
const q = (p) => inks[Math.floor(p * (inks.length - 1))];
const inkLo = q(0.05), inkHi = q(0.95);

const report = measured.map((m) => {
  const found = [];
  const add = (id, detail) => found.push({ id, detail });
  if (m.errors.length) add('error', m.errors.slice(0, 3).join('; '));
  if (m.diffs) {
    const total = m.diffs.reduce((a, b) => a + b, 0);
    if (m.speed.every((v) => v === 0)) add('still');
    else if (m.reach < 60) add('faint', `at most ${m.reach} px differ from the rest pose`);
    if (total > 0) {
      const d = m.diffs;
      // The first step is the fastest by design (strong ease-out), so it is not compared.
      for (let i = 1; i < d.length; i++) {
        const around = [d[i - 2], d[i - 1], d[i + 1], d[i + 2]].filter((v) => v !== undefined).sort((a, b) => b - a);
        const ref = Math.max(around[1] ?? 0, 4);
        const real = m.steps.some((k) => Math.abs(k - i) <= 1);
        if (d[i] > 40 && d[i] > ref * 4 && real) { add('jump', `t=${(i / T).toFixed(2)}–${((i + 1) / T).toFixed(2)}: ${d[i]} vs ~${ref}`); break; }
      }
      // Raster noise can differ between the last two frames (a filter drawn under a tiny
      // rotation and then under none), so the markup has to agree that it is still moving.
      const peak = Math.max(...d), last = d[d.length - 1];
      const sp = m.speed.filter((v) => v !== null), spLast = m.speed[m.speed.length - 1] ?? 0;
      const spPeak = Math.max(0, ...sp);
      if (peak > 20 && last > 12 && last > peak * 0.35 && spLast > 0.15 && spLast > spPeak * 0.3) add('abrupt', `last step ${last} px, peak ${peak} px; markup ${spLast} of ${spPeak}`);
    }
    const far = m.boxes.map((b, i) => [b, i]).filter(([b]) => b && (b[0] < -2 || b[1] < -5 || b[2] > 33 || b[3] > 30));
    if (far.length) add('leaves', `t=${(far[0][1] / T).toFixed(2)} box ${far[0][0].join(',')}`);
    const r = m.boxes[0], e = m.boxes[m.boxes.length - 1];
    if (r) {
      const w = r[2] - r[0], h = r[3] - r[1], mx = Math.max(w, h);
      // Outer size including the outline: keylines are 23 (circle), 20.6 (square), 23×18.4.
      // Thin or diagonal objects may run long; what counts is the space they take up.
      if (mx < 21.6 && w * h < 400) add('small', `${w.toFixed(1)}×${h.toFixed(1)}`);
      if (mx > 28.5 || (mx > 27.2 && w * h > 560) || Math.min(w, h) > 26) add('large', `${w.toFixed(1)}×${h.toFixed(1)}`);
      const cx = (r[0] + r[2]) / 2, cy = (r[1] + r[3]) / 2;
      if (Math.abs(cx - 15.5) > 1.3 || Math.abs(cy - 12.5) > 1.6) add('offCentre', `centre ${cx.toFixed(1)},${cy.toFixed(1)}`);
      if (e) {
        const ar = w * h, ae = (e[2] - e[0]) * (e[3] - e[1]);
        if (ae > ar * 1.6 || ae < ar * 0.6) add('endSize', `rest ${w.toFixed(1)}×${h.toFixed(1)}, end ${(e[2] - e[0]).toFixed(1)}×${(e[3] - e[1]).toFixed(1)}`);
      }
    }
    if (m.ink < inkLo) add('light', `ink ${m.ink} (set 5%: ${inkLo})`);
    if (m.ink > inkHi) add('heavy', `ink ${m.ink} (set 95%: ${inkHi})`);
  }
  found.push(...KubaiMeasure.shapeFindings(m.geo || [], MIDS));
  const gr = m.geo?.[0];
  const { found: open, allowed } = KubaiMeasure.split(found, m.allow);
  const score = KubaiMeasure.score(open);
  return { name: m.name, category: m.cat, score, findings: open, allowed, measures: { ink: m.ink, reach: m.reach, rest: m.boxes?.[0], end: m.boxes?.at(-1), diffs: m.diffs, layers: gr?.layers, widths: gr && !gr.failed ? [...new Set(gr.widths)] : [] } };
}).sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));

fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify({ rules: RULES, failures, icons: report }, null, 1));
const counts = Object.fromEntries(Object.keys(RULES).map((k) => [k, report.filter((r) => r.findings.some((x) => x.id === k)).length]));
const avg = report.reduce((a, r) => a + r.score, 0) / report.length;
const md = [`# Icon audit`, '', `${report.length} icons, average score ${avg.toFixed(1)}.`, '', '| Finding | Weight | Icons |', '| --- | --- | --- |',
  ...Object.entries(RULES).map(([k, r]) => `| ${k}: ${r.text} | ${r.w} | ${counts[k]} |`), '',
  ...report.filter((r) => r.score < min && r.findings.length).map((r) => `## ${r.name} (${r.category}) — ${r.score}\n\n${r.findings.map((x) => `- **${x.id}** ${x.detail || ''}`).join('\n')}\n`),
  '# Allowed', '', 'Findings an icon declares in `allow`, with its reason.', '',
  ...report.filter((r) => r.allowed.length).map((r) => `- **${r.name}**: ${r.allowed.map((x) => `${x.id} (${x.reason})`).join('; ')}`)].join('\n');
fs.writeFileSync(path.join(out, 'report.md'), md);
console.log(`Audited ${report.length} icons, average ${avg.toFixed(1)}.`);
for (const [k, n] of Object.entries(counts)) if (n) console.log(`  ${k.padEnd(12)} ${n}`);
console.log(`Report: ${path.relative(process.cwd(), path.join(out, 'report.md'))}`);
if (failures.length) { console.error(`Failed to load: ${failures.map((x) => x.name).join(', ')}`); process.exitCode = 1; }
