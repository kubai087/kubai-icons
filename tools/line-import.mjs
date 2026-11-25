#!/usr/bin/env node
// Imports line icons drawn with the kubai-line skill into the library: each icon becomes
// icons-line/<name>.json, its layers prepared at the strokes the packages draw from plus its
// hover motion, which tools/build.mjs renders into the packages. The skill stays the place icons
// are drawn and checked; run its check.mjs first.
//
//   node tools/line-import.mjs [--from styles/line] [--only lock,mail]
//   node tools/line-import.mjs --check     exit 1 if icons-line/ differs from the skill's icons
//
// A line icon's geometry depends on its stroke (outlines are placed by their outer edge, details
// move with the weight), so each file keeps the layers at three strokes (GEO); the runtime draws
// any stroke from 0.5 to 3 with the nearest of them (packages/core/src/line.js). For each stroke
// it keeps what the four variants need: the outline layers (marked lit: light in line-duo, and
// tint: filled in solid-tint), the fill layers, the extra closed shapes the tint uses, and the
// areas that only read as enclosed. Category and search words come from the layered icon of the
// same name, or from the skill's catalogue.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { root, loadIcons } from './registry.mjs';

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const from = path.resolve(opt('--from') || path.join(root, 'styles/line'));
const only = (opt('--only') || '').split(',').map((s) => s.trim()).filter(Boolean);
const out = path.join(root, 'icons-line');
const check = args.includes('--check');

/** The strokes whose geometry is kept: light, regular and bold. */
export const GEO = [1.5, 2, 2.5];

const kit = await import(pathToFileURL(path.join(from, 'kit.mjs')).href);
const { ICONS } = await import(pathToFileURL(path.join(from, 'icons.mjs')).href);
const { CATALOG } = await import(pathToFileURL(path.join(from, 'catalog.mjs')).href);
const { icons: layered } = await loadIcons({ strict: false });
const byLayered = Object.fromEntries(layered.filter((ic) => !ic.base).map((ic) => [ic.name, ic]));
const byCatalog = Object.fromEntries(CATALOG.map((e) => [e.name, e]));

const names = only.length ? only : Object.keys(ICONS);
for (const n of names) if (!ICONS[n]) throw new Error(`No icon named ${n} in ${path.relative(root, from)}/icons.mjs.`);
if (!/^[a-z0-9-]+$/.test(names.join(''))) throw new Error('Icon names are kebab-case.');
fs.mkdirSync(out, { recursive: true });

const FIELDS = ['d', 'k', 'key', 'part', 'on', 'gap', 'occ', 'cutD', 'cut', 'cap', 'ghost', 'tf', 'sc', 'vc', 'lit', 'tint'];
const keep = (l) => { const o = {}; for (const k of FIELDS) if (l[k] !== undefined && l[k] !== false && l[k] !== null) o[k] = l[k]; return o; };
const numbered = (L) => L.map((l, i) => ({ ...l, key: l.n ?? String(i), part: l.part ?? `#${i}` }));

function snapshot(icon, s) {
  const o = numbered(kit.layersOf(icon, s, 'outline'));
  const f = numbered(kit.layersOf(icon, s, 'fill'));
  const extra = kit.layersOf(icon, s, 'fill').filter((l) => l.only === 'fill' && l.k === 'shell').map((l) => ({ ...l, key: l.n ?? 'x' }));
  const lit = kit.lightOf(icon, o), tinted = kit.tintOf(icon, [...o, ...extra]);
  const areas = icon.area ? icon.area(kit.geo(s)).map((r) => ({ key: r.n, d: r.d, ...(o.find((l) => l.n === r.n)?.tf ? { tf: o.find((l) => l.n === r.n).tf } : {}) })) : [];
  return {
    o: o.map((l) => keep({ ...l, lit: lit.has(l), tint: tinted.has(l) })),
    f: f.map(keep),
    x: extra.filter((l) => tinted.has(l)).map((l) => keep({ d: l.d, k: 'shell', key: l.key, tf: l.tf })),
    a: areas
  };
}

const stale = [];
let fresh = 0;
for (const name of names) {
  const icon = ICONS[name], file = path.join(out, `${name}.json`);
  const before = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  const twin = byLayered[name], entry = byCatalog[name];
  const category = twin?.category ?? entry?.category ?? before.category;
  if (!category) throw new Error(`${name} has no category: add it to ${path.relative(root, from)}/catalog.mjs.`);
  const tags = twin?.tags ?? [entry?.sf].filter(Boolean);
  const def = {
    name, zh: icon.label, key: icon.key, category, tags,
    fx: icon.fx ?? null,
    ...(icon.enter ? { enter: icon.enter } : {}),
    w: Object.fromEntries(GEO.map((s) => [String(s), snapshot(icon, s)]))
  };
  const text = JSON.stringify(def) + '\n';
  if (check) { if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== text) stale.push(name); continue; }
  if (!before.name) fresh++;
  fs.writeFileSync(file, text);
}
if (!only.length && !check) {
  // an icon removed from the skill leaves the library too
  for (const f of fs.readdirSync(out)) if (f.endsWith('.json') && !ICONS[f.slice(0, -5)]) fs.rmSync(path.join(out, f));
}
if (check) {
  const extra = fs.readdirSync(out).filter((f) => f.endsWith('.json') && !ICONS[f.slice(0, -5)]);
  if (stale.length || extra.length) {
    console.error(`icons-line/ is out of step with the skill${stale.length ? ` for: ${stale.join(', ')}` : ''}${extra.length ? `; not in the skill: ${extra.join(', ')}` : ''}. Run node tools/line-import.mjs.`);
    process.exit(1);
  }
  console.log(`icons-line/ matches the skill's ${names.length} icons`);
} else console.log(`${names.length} line icon(s) → icons-line/ (${fresh} new)`);
