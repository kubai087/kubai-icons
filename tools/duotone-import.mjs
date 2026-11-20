#!/usr/bin/env node
// Imports two-tone icons drawn with the kubai-duotone skill into the library: each icon becomes
// icons-duotone/<name>.json, plain layer data plus its hover motion, which tools/build.mjs
// renders into the packages. The skill stays the place icons are drawn and checked; run its
// check.mjs first.
//
//   node tools/duotone-import.mjs [--from styles/duotone] [--only folder,mail] [--category id --tags a,b]
//   node tools/duotone-import.mjs --check     exit 1 if icons-duotone/ differs from the skill's examples
//
// --from is a folder holding the skill's icons.mjs and motions.mjs (the skill's own examples by
// default, or a copy where new icons were drawn). Names should match the layered library's
// where the object is the same, so the two styles switch by import path; the category and
// search words then come from the layered icon. An icon the library doesn't have keeps the
// category and tags already in its file, or takes --category and --tags.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { root, loadIcons } from './registry.mjs';

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const from = path.resolve(opt('--from') || path.join(root, 'styles/duotone'));
const only = (opt('--only') || '').split(',').map((s) => s.trim()).filter(Boolean);
const out = path.join(root, 'icons-duotone');
const check = args.includes('--check');
const stale = [];

const { ICONS } = await import(pathToFileURL(path.join(from, 'icons.mjs')).href);
const { MOTION } = await import(pathToFileURL(path.join(from, 'motions.mjs')).href);
const { withMotion } = await import(pathToFileURL(path.join(from, 'motion.mjs')).href);
const { icons: layered } = await loadIcons({ strict: false });
const known = new Set(layered.map((ic) => ic.name));

const names = only.length ? only : Object.keys(ICONS);
for (const n of names) if (!ICONS[n]) throw new Error(`No icon named ${n} in ${path.relative(root, from)}/icons.mjs.`);
if (!/^[a-z0-9-]+$/.test(names.join(''))) throw new Error('Icon names are kebab-case.');
fs.mkdirSync(out, { recursive: true });

const LAYER = ['n', 'd', 'tone', 'sw', 'gap', 'part', 'clip', 'cut'];
let fresh = 0;
for (const name of names) {
  const icon = withMotion(ICONS[name], MOTION[name]);
  // Parts are kept as withMotion names them, so a copy and its original never cut each other.
  const layers = icon.layers.map((l) => {
    const o = {};
    for (const k of LAYER) if (l[k] !== undefined && !(k === 'cut' && !l.cut.length)) o[k] = k === 'cut' ? l.cut.map((c) => (c.sw ? { d: c.d, sw: c.sw } : { d: c.d })) : l[k];
    return o;
  });
  const file = path.join(out, `${name}.json`);
  const before = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
  const def = { name, zh: icon.label, key: icon.key, layers, moves: MOTION[name]?.moves || {}, ...(MOTION[name]?.ms ? { ms: MOTION[name].ms } : {}) };
  if (!known.has(name)) {
    const category = opt('--category') || before.category, tags = opt('--tags')?.split(',') || before.tags;
    if (!category && !check) throw new Error(`${name} isn't in the layered library: give it --category (and --tags).`);
    Object.assign(def, { category, tags: tags || [] });
  }
  const text = JSON.stringify(def, null, 1) + '\n';
  if (check) { if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== text) stale.push(name); continue; }
  if (!before.name) fresh++;
  fs.writeFileSync(file, text);
}
if (check) {
  if (stale.length) { console.error(`icons-duotone/ is out of step with the skill for: ${stale.join(', ')}. Run node tools/duotone-import.mjs.`); process.exit(1); }
  console.log(`icons-duotone/ matches the skill's ${names.length} examples`);
} else console.log(`${names.length} two-tone icon(s) → icons-duotone/ (${fresh} new)`);
