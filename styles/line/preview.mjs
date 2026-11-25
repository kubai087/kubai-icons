#!/usr/bin/env node
// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// A look at icons in all four variants (GUIDE.md §4), for checking line-duo and solid-tint by eye:
// per icon, 48 px outline / line-duo / fill / solid-tint, then 24 and 16 px outline.
//   node preview.mjs --only a,b,c --out some/file.png
import path from 'node:path';
import { render } from './kit.mjs';
import { ALL } from './icons.mjs';
import { screenshot } from './chrome.mjs';

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : undefined; };
const names = (opt('--only') || '').split(',').filter(Boolean);
const out = path.resolve(opt('--out') || 'preview.png');
for (const n of names) if (!ALL[n]) throw new Error(`No icon named ${n}`);
let id = 0;
const V = ['outline', 'line-duo', 'fill', 'solid-tint'];
const cell = (n) => `<div class="c"><div class="r">${V.map((v) => render(ALL[n], { id: `p${id++}`, size: 48, variant: v, color: '#1E2235' })).join('')}
  ${render(ALL[n], { id: `p${id++}`, size: 24, color: '#1E2235' })}${render(ALL[n], { id: `p${id++}`, size: 16, color: '#1E2235' })}</div><span>${n} · ${ALL[n].label}</span></div>`;
const cols = 4;
screenshot(`<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:12px;display:grid;grid-template-columns:repeat(${cols},290px);gap:10px 14px;font:11px -apple-system,system-ui;background:#fff;color:#556}
.r{display:flex;align-items:center;gap:8px}.c{padding:4px 0;border-bottom:1px solid #eef}</style>${names.map(cell).join('')}`,
  out, { width: 24 + cols * 304, height: 30 + Math.ceil(names.length / cols) * 82, scale: 1 });
console.log(`${out}: ${names.length} icons`);
