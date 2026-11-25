// Copyright (c) 2026 Kubai087. Licensed under the Kubai Icons License; see LICENSE.
// Pixel fit (GUIDE.md §1.4): at the regular weight (stroke 2) every straight horizontal or
// vertical edge sits on a whole pixel of the 24 grid. A stroke's edges are its centre line plus
// or minus half the stroke; a solid's edge is its path. Layers placed with a transform
// (enclosures) are left out.
import { layersOf } from './kit.mjs';

/** Straight horizontal and vertical segments of a path, as [x1, y1, x2, y2]. */
export function segments(d) {
  const t = d.match(/[MLHVACQSZmlhvacqsz]|-?\d*\.?\d+(?:e-?\d+)?/g); let i = 0, cmd = '', x = 0, y = 0, x0 = 0, y0 = 0; const out = [];
  const num = () => +t[i++];
  while (i < t.length) {
    if (/[A-Za-z]/.test(t[i])) cmd = t[i++];
    if (cmd === 'Z' || cmd === 'z') { if (Math.abs(x - x0) < 0.01 || Math.abs(y - y0) < 0.01) out.push([x, y, x0, y0]); x = x0; y = y0; continue; }
    let nx = x, ny = y;
    if (cmd === 'M') { x = x0 = num(); y = y0 = num(); cmd = 'L'; continue; }
    if (cmd === 'L') { nx = num(); ny = num(); }
    else if (cmd === 'H') nx = num(); else if (cmd === 'V') ny = num();
    else if (cmd === 'C') { for (let k = 0; k < 4; k++) num(); x = num(); y = num(); continue; }
    else if (cmd === 'Q' || cmd === 'S') { num(); num(); x = num(); y = num(); continue; }
    else if (cmd === 'A') { num(); num(); num(); num(); num(); nx = num(); ny = num(); x = nx; y = ny; continue; }
    else throw new Error('cmd ' + cmd);
    out.push([x, y, nx, ny]); x = nx; y = ny;
  }
  return out.filter(([a, b, c, e]) => (Math.abs(a - c) < 0.01 || Math.abs(b - e) < 0.01) && Math.hypot(c - a, e - b) > 0.8);
}
const on = (v) => Math.abs(v - Math.round(v)) < 0.02;
/** Edges of the icon at stroke s that miss the pixel grid, e.g. 'rim y=16.25'. */
export function audit(icon, s) {
  const h = s / 2, bad = [];
  for (const l of layersOf(icon, s, 'outline')) {
    if (l.tf) continue;
    for (const [a, b, c, e] of segments(l.d)) {
      const vert = Math.abs(a - c) < 0.01, v = vert ? a : b;
      const ok = l.k === 'solid' ? on(v) : on(v - h) || on(v + h);
      if (!ok) bad.push(`${l.n ?? '?'} ${vert ? 'x' : 'y'}=${+v.toFixed(3)}`);
    }
  }
  return [...new Set(bad)];
}
