#!/usr/bin/env node
// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Exports line icons as self-contained SVG files, one <name>.svg per icon.
//
//   node export.mjs [--only name,name] [--stroke 2] [--variant outline] [--color #hex]
//                   [--light #hex] [--fill #hex] [--size 24] [--out dir]
//
// --stroke is the stroke width, 0.5 to 3 (GUIDE.md §1.3; 1.5 to 2.5 is the checked range).
// --variant is outline (线性), line-duo (线性双色), fill (面性) or solid-tint (面性填充).
// --color sets the dark tone; the light tone and the fill follow it over white unless --light
// and --fill set them. --size sets width and height in pixels (the viewBox stays 0 0 24 24).
// Files go to export/ next to this script unless --out says otherwise.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, STROKE, CHECKED } from './kit.mjs';
import { ALL } from './icons.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : fallback; };
const only = (opt('--only') || '').split(',').map((s) => s.trim()).filter(Boolean);
for (const n of only) if (!ALL[n]) throw new Error(`No icon named ${n}.`);
const s = Number(opt('--stroke', 2));
if (!(s >= STROKE.min && s <= STROKE.max)) throw new Error(`--stroke is ${STROKE.min} to ${STROKE.max}.`);
const variant = opt('--variant', 'outline');
if (!['outline', 'line-duo', 'fill', 'solid-tint'].includes(variant)) throw new Error('--variant is outline, line-duo, fill or solid-tint.');
const color = opt('--color', '#1E2235');
const tones = { dark: color, ...(opt('--light') ? { light: opt('--light') } : {}), ...(opt('--fill') ? { fill: opt('--fill') } : {}) };
const size = Number(opt('--size', 24));
const out = path.resolve(opt('--out', path.join(here, 'export')));
if (s < CHECKED.min || s > CHECKED.max) console.warn(`Stroke ${s} is outside the checked range ${CHECKED.min}–${CHECKED.max}: run check.mjs before shipping.`);

fs.mkdirSync(out, { recursive: true });
const names = only.length ? only : Object.keys(ALL);
for (const name of names) fs.writeFileSync(path.join(out, `${name}.svg`), render(ALL[name], { s, variant, color, tones, size, id: name }) + '\n');
console.log(`${names.length} icon(s), ${variant} at stroke ${s} in ${color} → ${path.relative(process.cwd(), out) || '.'}`);
