#!/usr/bin/env node
// Contact sheets for the SF-style line set, rendered in headless Chrome.
//   node sheet.mjs [--only a,b] [--out dir]
// sheet.png     per icon: 96px over the canvas keylines, every weight at 32px (outline above,
//               fill below), the hierarchical and palette modes, and 24/16px at 1x
// keylines.png  every icon at 120px over the keylines, its own key shape drawn heavier, with
//               its parts coloured by role (primary ink, secondary blue, detail orange)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, WEIGHTS, PALETTES, keylineSvg } from './kit.mjs';
import { ALL } from './icons.mjs';
import { screenshot } from './chrome.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const only = (opt('--only') || '').split(',').filter(Boolean);
const out = path.resolve(opt('--out') || path.join(here, 'check-out'));
fs.mkdirSync(out, { recursive: true });
const names = only.length ? only : Object.keys(ALL);
let id = 0;
const r = (n, o) => render(ALL[n], { id: `s${id++}`, color: '#1E2235', ...o });
export const ROLE_INK = { primary: '#1E2235', secondary: '#3D6BFF', detail: '#F2853A' };

const over = (n, size, o = {}) => `<div class="big" style="width:${size}px;height:${size}px">${keylineSvg({ size, key: ALL[n].key })}${r(n, { size, ...o })}</div>`;
const W = Object.keys(WEIGHTS);
const row = (n) => `<div class="row"><div class="name">${n}<small>${ALL[n].label}</small></div>${over(n, 96)}
  <div class="col">${W.map((w) => r(n, { size: 32, weight: w })).join('')}<br>${W.map((w) => r(n, { size: 32, weight: w, variant: 'fill' })).join('')}</div>
  <div class="col">${r(n, { size: 32, mode: 'hierarchical' })}${r(n, { size: 32, mode: 'palette', colors: PALETTES.brand })}<br>${r(n, { size: 32, mode: 'hierarchical', variant: 'fill' })}${r(n, { size: 32, mode: 'palette', variant: 'fill', colors: PALETTES.brand })}</div>
  <div class="col small">${r(n, { size: 24 })}${r(n, { size: 16 })}<br>${r(n, { size: 24, variant: 'fill' })}${r(n, { size: 16, variant: 'fill' })}</div></div>`;
const css = `body{margin:0;padding:16px;font:12px -apple-system,system-ui;background:#fff;color:#1E2235}
.big{position:relative;flex:none}.big svg{position:absolute;left:0;top:0}.col svg{margin:2px 4px}`;
const html = `<!doctype html><meta charset="utf-8"><style>${css}
.wrap{display:grid;grid-template-columns:1fr 1fr;gap:6px 24px;width:1280px}
.row{display:flex;align-items:center;gap:14px;border-bottom:1px solid #eef;padding:4px 0}
.name{width:92px;font-weight:600}.name small{display:block;font-weight:400;color:#889}
</style><div class="wrap">${names.map(row).join('')}</div>`;
screenshot(html, path.join(out, 'sheet.png'), { width: 1312, height: 40 + Math.ceil(names.length / 2) * 112, scale: 1 });

const card = (n) => `<div class="card">${over(n, 120, { roleColors: ROLE_INK })}<b>${n}</b><small>${ALL[n].key}${ALL[n].fit ? ` · 贴合 ${ALL[n].fit}` : ''}</small></div>`;
const kl = `<!doctype html><meta charset="utf-8"><style>${css}
.grid{display:grid;grid-template-columns:repeat(8,140px);gap:10px;width:1190px}
.card{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 0}.card b{font-size:11px}.card small{color:#889;font-size:10px}
.legend{margin-bottom:10px}.legend i{display:inline-block;width:10px;height:10px;border-radius:2px;margin:0 4px 0 12px;vertical-align:-1px}
</style><div class="legend">角色：<i style="background:${ROLE_INK.primary}"></i>主体<i style="background:${ROLE_INK.secondary}"></i>辅助<i style="background:${ROLE_INK.detail}"></i>细节</div><div class="grid">${names.map(card).join('')}</div>`;
screenshot(kl, path.join(out, 'keylines.png'), { width: 1222, height: 60 + Math.ceil(names.length / 8) * 170, scale: 1 });
console.log(`sheet.png, keylines.png: ${names.length} icons`);
